import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { rateLimiters, rateLimitResponse } from '@/lib/rate-limit';

/** Routes that consume expensive resources, keyed by limiter tier */
const RATE_LIMITED_ROUTES: Record<string, keyof typeof rateLimiters> = {
  '/api/research': 'ai',
  '/api/icps/parse': 'ai',
  '/api/emails/generate': 'ai',
  '/api/strategy': 'ai',
  '/api/people/search': 'api',
  '/api/people/enrich': 'api',
  '/api/emails/send': 'email'
};

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect app routes and /api/* (except auth callbacks)
  const isProtected =
    pathname.startsWith('/research') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/emails') ||
    (pathname.startsWith('/api/') &&
      !pathname.startsWith('/api/auth') &&
      !pathname.startsWith('/api/gmail/callback'));

  if (!user && isProtected) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('login', 'true');
    return NextResponse.redirect(url);
  }

  // Rate limit expensive API routes (user is authenticated at this point)
  if (user) {
    const tier = RATE_LIMITED_ROUTES[pathname];
    if (tier) {
      const result = rateLimiters[tier].check(user.id);
      if (!result.success) return rateLimitResponse(result);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
