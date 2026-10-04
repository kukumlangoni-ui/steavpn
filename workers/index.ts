import type { D1Database, KVNamespace } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  ADMIN_ORIGIN: string;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const COOKIE_NAME = 'steavpn_session';

async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(bits));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSessionToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );
}

function json(data: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}

function cors(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function getAdminFromSession(request: Request, env: Env) {
  const cookies = parseCookies(request.headers.get('Cookie'));
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const raw = await env.SESSIONS.get(`session:${token}`);
  if (!raw) return null;
  return JSON.parse(raw) as { adminId: number; email: string };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = env.ADMIN_ORIGIN || 'https://steavpn.stea.africa';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (url.pathname === '/api/health') {
      return json({ ok: true, service: 'steavpn-api', time: new Date().toISOString() }, 200, cors(origin));
    }

    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as { email?: string; password?: string } | null;
      if (!body?.email || !body?.password) {
        return json({ error: 'Email and password required' }, 400, cors(origin));
      }

      const row = await env.DB
        .prepare('SELECT id, email, password_hash FROM admins WHERE email = ?')
        .bind(body.email.toLowerCase())
        .first<{ id: number; email: string; password_hash: string }>();

      if (!row) return json({ error: 'Invalid credentials' }, 401, cors(origin));

      // password_hash format: "salt:hash"
      const [salt, storedHash] = row.password_hash.split(':');
      const attempt = await hashPassword(body.password, salt);
      if (attempt !== storedHash) {
        return json({ error: 'Invalid credentials' }, 401, cors(origin));
      }

      const token = generateSessionToken();
      await env.SESSIONS.put(
        `session:${token}`,
        JSON.stringify({ adminId: row.id, email: row.email }),
        { expirationTtl: SESSION_TTL_SECONDS }
      );

      const cookie = [
        `${COOKIE_NAME}=${token}`,
        'HttpOnly',
        'Secure',
        'SameSite=Lax',
        'Path=/',
        `Max-Age=${SESSION_TTL_SECONDS}`,
      ].join('; ');

      return json({ ok: true, email: row.email }, 200, {
        ...cors(origin),
        'Set-Cookie': cookie,
      });
    }

    if (url.pathname === '/api/admin/logout' && request.method === 'POST') {
      const cookies = parseCookies(request.headers.get('Cookie'));
      const token = cookies[COOKIE_NAME];
      if (token) await env.SESSIONS.delete(`session:${token}`);
      return json({ ok: true }, 200, {
        ...cors(origin),
        'Set-Cookie': `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
      });
    }

    if (url.pathname === '/api/admin/me' && request.method === 'GET') {
      const admin = await getAdminFromSession(request, env);
      if (!admin) return json({ error: 'Not authenticated' }, 401, cors(origin));
      return json({ ok: true, admin }, 200, cors(origin));
    }

    return json({ error: 'Not found' }, 404, cors(origin));
  },
};
