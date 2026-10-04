import type { D1Database, KVNamespace } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  ADMIN_ORIGIN: string;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const COOKIE_NAME = 'steavpn_session';

// ─── Crypto helpers ────────────────────────────────────────────────────────

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

function generateSessionToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── Utility functions ─────────────────────────────────────────────────────

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

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// ─── Main fetch handler ───────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = env.ADMIN_ORIGIN || 'https://steavpn.stea.africa';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return json({ ok: true, service: 'steavpn-api', time: new Date().toISOString() }, 200, cors(origin));
    }

    // ─── Admin auth endpoints ───────────────────────────────────────────

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

    // ─── Protected admin endpoints ──────────────────────────────────────

    const admin = await getAdminFromSession(request, env);
    if (!admin && url.pathname.startsWith('/api/admin/')) {
      return json({ error: 'Not authenticated' }, 401, cors(origin));
    }

    // Dashboard summary
    if (url.pathname === '/api/admin/dashboard' && request.method === 'GET') {
      const totalCustomers = await env.DB
        .prepare("SELECT COUNT(*) as count FROM customers WHERE status = 'active'")
        .first<{ count: number }>();

      const activeSubs = await env.DB
        .prepare("SELECT COUNT(*) as count FROM subscriptions WHERE payment_status = 'paid' AND expiry_date > datetime('now')")
        .first<{ count: number }>();

      const expiringSoon = await env.DB
        .prepare("SELECT COUNT(*) as count FROM subscriptions WHERE payment_status = 'paid' AND expiry_date BETWEEN datetime('now') AND datetime('now', '+7 days')")
        .first<{ count: number }>();

      const expired = await env.DB
        .prepare("SELECT COUNT(*) as count FROM subscriptions WHERE expiry_date < datetime('now')")
        .first<{ count: number }>();

      const recentCustomers = await env.DB
        .prepare('SELECT id, name, phone, status, created_at FROM customers ORDER BY created_at DESC LIMIT 10')
        .all<{ id: number; name: string; phone: string | null; status: string; created_at: string }>();

      return json({
        ok: true,
        stats: {
          totalCustomers: totalCustomers?.count ?? 0,
          activeSubs: activeSubs?.count ?? 0,
          expiringSoon: expiringSoon?.count ?? 0,
          expired: expired?.count ?? 0,
        },
        recentCustomers: recentCustomers.results,
      }, 200, cors(origin));
    }

    // ─── Customers ──────────────────────────────────────────────────────

    if (url.pathname === '/api/admin/customers' && request.method === 'GET') {
      const { results } = await env.DB
        .prepare(`
          SELECT c.*,
            (SELECT MAX(expiry_date) FROM subscriptions s WHERE s.customer_id = c.id) as latest_expiry
          FROM customers c
          ORDER BY c.created_at DESC
        `)
        .all();
      return json({ ok: true, customers: results }, 200, cors(origin));
    }

    if (url.pathname === '/api/admin/customers' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!body?.name || typeof body.name !== 'string') {
        return json({ error: 'Name is required' }, 400, cors(origin));
      }
      if (body.email && typeof body.email === 'string' && !isValidEmail(body.email)) {
        return json({ error: 'Invalid email format' }, 400, cors(origin));
      }

      const result = await env.DB
        .prepare('INSERT INTO customers (name, phone, email, notes) VALUES (?, ?, ?, ?)')
        .bind(body.name, body.phone ?? null, body.email ?? null, body.notes ?? null)
        .run();

      const customer = await env.DB
        .prepare('SELECT * FROM customers WHERE id = ?')
        .bind(result.meta.last_row_id)
        .first();

      return json({ ok: true, customer }, 201, cors(origin));
    }

    // Customer detail routes
    const customerMatch = url.pathname.match(/^\/api\/admin\/customers\/(\d+)$/);
    if (customerMatch) {
      const id = parseInt(customerMatch[1], 10);

      if (request.method === 'GET') {
        const customer = await env.DB
          .prepare('SELECT * FROM customers WHERE id = ?')
          .bind(id)
          .first();
        if (!customer) return json({ error: 'Customer not found' }, 404, cors(origin));

        const subscriptions = await env.DB
          .prepare(`
            SELECT s.*, ul.label as link_label
            FROM subscriptions s
            LEFT JOIN upstream_links ul ON ul.id = s.upstream_link_id
            WHERE s.customer_id = ?
            ORDER BY s.created_at DESC
          `)
          .bind(id)
          .all();

        return json({ ok: true, customer, subscriptions: subscriptions.results }, 200, cors(origin));
      }

      if (request.method === 'PUT') {
        const body = await request.json().catch(() => null) as Record<string, unknown> | null;
        if (!body) return json({ error: 'Invalid body' }, 400, cors(origin));
        if (body.email && typeof body.email === 'string' && !isValidEmail(body.email)) {
          return json({ error: 'Invalid email format' }, 400, cors(origin));
        }

        await env.DB
          .prepare('UPDATE customers SET name = ?, phone = ?, email = ?, notes = ?, status = ?, updated_at = datetime(\'now\') WHERE id = ?')
          .bind(
            body.name ?? null,
            body.phone ?? null,
            body.email ?? null,
            body.notes ?? null,
            body.status ?? 'active',
            id
          )
          .run();

        const customer = await env.DB
          .prepare('SELECT * FROM customers WHERE id = ?')
          .bind(id)
          .first();

        return json({ ok: true, customer }, 200, cors(origin));
      }

      if (request.method === 'DELETE') {
        await env.DB
          .prepare("UPDATE customers SET status = 'disabled', updated_at = datetime('now') WHERE id = ?")
          .bind(id)
          .run();
        return json({ ok: true }, 200, cors(origin));
      }
    }

    // ─── Upstream Links ─────────────────────────────────────────────────

    if (url.pathname === '/api/admin/links' && request.method === 'GET') {
      const { results } = await env.DB
        .prepare('SELECT * FROM upstream_links ORDER BY created_at DESC')
        .all();
      return json({ ok: true, links: results }, 200, cors(origin));
    }

    if (url.pathname === '/api/admin/links' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!body?.label || !body?.subscription_url) {
        return json({ error: 'Label and subscription URL are required' }, 400, cors(origin));
      }

      const result = await env.DB
        .prepare('INSERT INTO upstream_links (label, provider, subscription_url, capacity_notes, internal_notes) VALUES (?, ?, ?, ?, ?)')
        .bind(body.label, body.provider ?? null, body.subscription_url, body.capacity_notes ?? null, body.internal_notes ?? null)
        .run();

      const link = await env.DB
        .prepare('SELECT * FROM upstream_links WHERE id = ?')
        .bind(result.meta.last_row_id)
        .first();

      return json({ ok: true, link }, 201, cors(origin));
    }

    const linkMatch = url.pathname.match(/^\/api\/admin\/links\/(\d+)$/);
    if (linkMatch) {
      const id = parseInt(linkMatch[1], 10);

      if (request.method === 'PUT') {
        const body = await request.json().catch(() => null) as Record<string, unknown> | null;
        if (!body) return json({ error: 'Invalid body' }, 400, cors(origin));

        await env.DB
          .prepare('UPDATE upstream_links SET label = ?, provider = ?, subscription_url = ?, capacity_notes = ?, internal_notes = ?, status = ?, updated_at = datetime(\'now\') WHERE id = ?')
          .bind(
            body.label ?? null,
            body.provider ?? null,
            body.subscription_url ?? null,
            body.capacity_notes ?? null,
            body.internal_notes ?? null,
            body.status ?? 'active',
            id
          )
          .run();

        const link = await env.DB
          .prepare('SELECT * FROM upstream_links WHERE id = ?')
          .bind(id)
          .first();

        return json({ ok: true, link }, 200, cors(origin));
      }

      if (request.method === 'DELETE') {
        await env.DB.prepare('DELETE FROM upstream_links WHERE id = ?').bind(id).run();
        return json({ ok: true }, 200, cors(origin));
      }
    }

    // ─── Subscriptions ──────────────────────────────────────────────────

    if (url.pathname === '/api/admin/subscriptions' && request.method === 'GET') {
      const { results } = await env.DB
        .prepare(`
          SELECT s.*, c.name as customer_name, ul.label as link_label
          FROM subscriptions s
          LEFT JOIN customers c ON c.id = s.customer_id
          LEFT JOIN upstream_links ul ON ul.id = s.upstream_link_id
          ORDER BY s.created_at DESC
        `)
        .all();
      return json({ ok: true, subscriptions: results }, 200, cors(origin));
    }

    if (url.pathname === '/api/admin/subscriptions' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!body?.customer_id) {
        return json({ error: 'Customer ID is required' }, 400, cors(origin));
      }

      const result = await env.DB
        .prepare(`
          INSERT INTO subscriptions
            (customer_id, upstream_link_id, plan_name, start_date, expiry_date,
             payment_status, payment_amount, payment_currency, payment_method, payment_reference, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          body.customer_id,
          body.upstream_link_id ?? null,
          body.plan_name ?? null,
          body.start_date ?? null,
          body.expiry_date ?? null,
          body.payment_status ?? 'unpaid',
          body.payment_amount ?? null,
          body.payment_currency ?? null,
          body.payment_method ?? null,
          body.payment_reference ?? null,
          body.notes ?? null
        )
        .run();

      const sub = await env.DB
        .prepare('SELECT * FROM subscriptions WHERE id = ?')
        .bind(result.meta.last_row_id)
        .first();

      return json({ ok: true, subscription: sub }, 201, cors(origin));
    }

    const subMatch = url.pathname.match(/^\/api\/admin\/subscriptions\/(\d+)$/);
    if (subMatch) {
      const id = parseInt(subMatch[1], 10);

      if (request.method === 'PUT') {
        const body = await request.json().catch(() => null) as Record<string, unknown> | null;
        if (!body) return json({ error: 'Invalid body' }, 400, cors(origin));

        await env.DB
          .prepare(`
            UPDATE subscriptions SET
              upstream_link_id = ?, plan_name = ?, start_date = ?, expiry_date = ?,
              payment_status = ?, payment_amount = ?, payment_currency = ?,
              payment_method = ?, payment_reference = ?, notes = ?,
              updated_at = datetime('now')
            WHERE id = ?
          `)
          .bind(
            body.upstream_link_id ?? null,
            body.plan_name ?? null,
            body.start_date ?? null,
            body.expiry_date ?? null,
            body.payment_status ?? 'unpaid',
            body.payment_amount ?? null,
            body.payment_currency ?? null,
            body.payment_method ?? null,
            body.payment_reference ?? null,
            body.notes ?? null,
            id
          )
          .run();

        const sub = await env.DB
          .prepare('SELECT * FROM subscriptions WHERE id = ?')
          .bind(id)
          .first();

        return json({ ok: true, subscription: sub }, 200, cors(origin));
      }
    }

    // Expiring subscriptions
    if (url.pathname === '/api/admin/expiring' && request.method === 'GET') {
      const { results } = await env.DB
        .prepare(`
          SELECT s.*, c.name as customer_name, ul.label as link_label
          FROM subscriptions s
          LEFT JOIN customers c ON c.id = s.customer_id
          LEFT JOIN upstream_links ul ON ul.id = s.upstream_link_id
          WHERE s.payment_status = 'paid'
            AND s.expiry_date BETWEEN datetime('now') AND datetime('now', '+7 days')
          ORDER BY s.expiry_date ASC
        `)
        .all();
      return json({ ok: true, subscriptions: results }, 200, cors(origin));
    }

    return json({ error: 'Not found' }, 404, cors(origin));
  },
};
