'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { SidebarProvider, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar.client';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/research')) return 'Research Hub';
  if (pathname.startsWith('/emails')) return 'Emails';
  if (pathname.startsWith('/settings')) return 'Settings';
  return '';
}

function getIsSubpage(pathname: string): boolean {
  return /^\/research\/[^/]+/.test(pathname);
}

function CollapsedTrigger() {
  const { state, isMobile } = useSidebar();

  if (isMobile || state === 'expanded') return null;

  return (
    <SidebarTrigger className="bg-sidebar hover:bg-sidebar-accent text-sidebar-foreground border-sidebar-border fixed top-4 left-16 z-50 size-8 rounded-md border shadow-sm" />
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const isSubpage = getIsSubpage(pathname);
  const { isMobile } = useSidebar();

  return (
    <SidebarInset className="min-w-0 overflow-x-hidden">
      {isMobile && (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              {isSubpage ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/research">Research</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Session</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
      )}
      <div className="relative min-w-0 flex-1">
        <CollapsedTrigger />
        {children}
      </div>
    </SidebarInset>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AppContent>{children}</AppContent>
    </SidebarProvider>
  );
}
