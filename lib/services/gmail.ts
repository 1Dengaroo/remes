import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';
import { getGmailConnection, refreshGmailToken } from '@/lib/supabase/queries';

const SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'email'];

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );
}

/** Build Google OAuth consent URL with gmail.send scope */
export function getGoogleAuthUrl(userId: string): string {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: userId
  });
}

/** Exchange authorization code for tokens and extract user email from ID token */
export async function exchangeCodeForTokens(code: string) {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);

  // Extract email from the ID token (granted by the 'email' scope)
  let email = '';
  if (tokens.id_token) {
    const raw = Buffer.from(tokens.id_token.split('.')[1], 'base64').toString();
    const payload: Record<string, unknown> = JSON.parse(raw);
    if (typeof payload.email === 'string') {
      email = payload.email;
    }
  }

  return {
    accessToken: tokens.access_token ?? '',
    refreshToken: tokens.refresh_token ?? '',
    tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
    email
  };
}

/** Refresh an expired access token */
async function refreshAccessToken(refreshToken: string) {
  const client = getOAuth2Client();
  client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await client.refreshAccessToken();
  return {
    accessToken: credentials.access_token ?? '',
    tokenExpiry: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : null
  };
}

/** Load tokens from Supabase, refresh if expired, return authenticated Gmail client */
export async function getGmailClient(userId: string) {
  const supabase = await createClient();

  const { data: connection, error } = await getGmailConnection(supabase, userId);

  if (error || !connection) {
    throw new Error('Gmail not connected');
  }

  const isExpired = connection.token_expiry && new Date(connection.token_expiry) < new Date();

  let accessToken = connection.access_token;

  if (isExpired) {
    const refreshed = await refreshAccessToken(connection.refresh_token);
    accessToken = refreshed.accessToken;

    await refreshGmailToken(supabase, userId, refreshed.accessToken, refreshed.tokenExpiry);
  }

  const client = getOAuth2Client();
  client.setCredentials({ access_token: accessToken });

  return {
    gmail: google.gmail({ version: 'v1', auth: client }),
    fromEmail: connection.gmail_email
  };
}

/** Construct RFC 2822 MIME message, base64url encode, and send via Gmail API */
export async function sendEmail(
  gmail: ReturnType<typeof google.gmail>,
  to: string,
  subject: string,
  body: string,
  fromEmail: string
): Promise<string> {
  const messageParts = [
    'MIME-Version: 1.0',
    `From: ${fromEmail}`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(body).toString('base64')
  ];
  const rawMessage = messageParts.join('\r\n');

  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage }
  });

  return result.data.id ?? '';
}
