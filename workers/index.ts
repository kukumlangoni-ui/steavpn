import type { D1Database, KVNamespace, R2Bucket } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  GUIDE_IMAGES: R2Bucket;
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

    // Public subscription check by phone
    if (url.pathname === '/api/check' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as { phone?: string } | null;
      const phone = body?.phone?.trim();
      if (!phone) {
        return json({ error: 'Phone number required' }, 400, cors(origin));
      }

      const customer = await env.DB
        .prepare("SELECT id, name FROM customers WHERE phone = ? AND status = 'active' LIMIT 1")
        .bind(phone)
        .first<{ id: number; name: string }>();

      if (!customer) {
        return json({ found: false }, 200, cors(origin));
      }

      const subscription = await env.DB
        .prepare(`
          SELECT plan_name, expiry_date, payment_status
          FROM subscriptions
          WHERE customer_id = ?
          ORDER BY expiry_date DESC
          LIMIT 1
        `)
        .bind(customer.id)
        .first<{ plan_name: string | null; expiry_date: string | null; payment_status: string }>();

      if (!subscription) {
        return json({ found: true, customer: { name: customer.name }, subscription: null }, 200, cors(origin));
      }

      return json({
        found: true,
        customer: { name: customer.name },
        subscription: {
          plan_name: subscription.plan_name,
          expiry_date: subscription.expiry_date,
          status: subscription.payment_status,
        },
      }, 200, cors(origin));
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

    // ─── Payment settings: public endpoints ───────────────────────────

    if (url.pathname === '/api/payment-settings' && request.method === 'GET') {
      const row = await env.DB
        .prepare('SELECT * FROM payment_settings WHERE id = 1')
        .first();

      if (!row) {
        return json({ error: 'Payment settings not found' }, 404, cors(origin));
      }

      const settings = {
        wechat_id: row.wechat_id,
        whatsapp: row.whatsapp,
        email: row.email,
        alipay_id: row.alipay_id,
        bank_name: row.bank_name,
        bank_account_name: row.bank_account_name,
        bank_account_number: row.bank_account_number,
        wechat_qr_url: row.wechat_qr_key ? '/api/payment-qr/wechat' : null,
        alipay_qr_url: row.alipay_qr_key ? '/api/payment-qr/alipay' : null,
      };

      return json({ ok: true, settings }, 200, cors(origin));
    }

    const qrMatch = url.pathname.match(/^\/api\/payment-qr\/(wechat|alipay)$/);
    if (qrMatch && request.method === 'GET') {
      const slot = qrMatch[1];
      const col = slot === 'wechat' ? 'wechat_qr_key' : 'alipay_qr_key';
      const row = await env.DB
        .prepare(`SELECT ${col} as qr_key FROM payment_settings WHERE id = 1`)
        .first<{ qr_key: string | null }>();

      if (!row?.qr_key) {
        return new Response('Not found', { status: 404, headers: cors(origin) });
      }

      const obj = await env.GUIDE_IMAGES.get(row.qr_key);
      if (!obj) return new Response('Not found', { status: 404, headers: cors(origin) });

      const headers = new Headers();
      headers.set('Content-Type', obj.httpMetadata?.contentType || 'image/png');
      headers.set('Cache-Control', 'public, max-age=300');
      Object.entries(cors(origin)).forEach(([k, v]) => headers.set(k, v));
      return new Response(obj.body as unknown as BodyInit, { status: 200, headers });
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

    // ─── Guide: public endpoints ────────────────────────────────────────

    if (url.pathname === '/api/guide' && request.method === 'GET') {
      const devices = await env.DB
        .prepare('SELECT * FROM guide_devices WHERE published = 1 ORDER BY sort_order, id')
        .all<{ id: number; slug: string; name: string; app_name: string; download_label: string; download_url: string; intro: string | null }>();

      const result = [];
      for (const device of devices.results) {
        const steps = await env.DB
          .prepare('SELECT id, step_number, title, body, image_key, image_alt FROM guide_steps WHERE device_id = ? ORDER BY step_number')
          .bind(device.id)
          .all<{ id: number; step_number: number; title: string; body: string | null; image_key: string | null; image_alt: string | null }>();

        // Fetch all images for these steps from guide_step_images
        let stepImages: Array<{ id: number; step_id: number; image_key: string; image_alt: string | null; sort_order: number }> = [];
        if (steps.results.length > 0) {
          const placeholders = steps.results.map(() => '?').join(',');
          const imageRes = await env.DB
            .prepare(`SELECT id, step_id, image_key, image_alt, sort_order FROM guide_step_images WHERE step_id IN (${placeholders}) ORDER BY step_id, sort_order, id`)
            .bind(...steps.results.map((s) => s.id))
            .all<{ id: number; step_id: number; image_key: string; image_alt: string | null; sort_order: number }>();
          stepImages = imageRes.results;
        }

        // Group images by step_id
        const grouped: Record<number, typeof stepImages> = {};
        for (const img of stepImages) {
          if (!grouped[img.step_id]) grouped[img.step_id] = [];
          grouped[img.step_id].push(img);
        }

        result.push({
          id: device.id,
          slug: device.slug,
          name: device.name,
          app_name: device.app_name,
          download_label: device.download_label,
          download_url: device.download_url,
          intro: device.intro,
          steps: steps.results.map((s) => {
            const imgs = grouped[s.id] || [];
            return {
              id: s.id,
              step_number: s.step_number,
              title: s.title,
              body: s.body,
              image_url: imgs.length > 0 ? `/api/guide/images/id/${imgs[0].id}` : (s.image_key ? `/api/guide/images/${device.slug}/${s.image_key.split('/').pop()}` : null),
              image_alt: s.image_alt,
              images: imgs.map((img) => ({
                id: img.id,
                url: `/api/guide/images/id/${img.id}`,
                alt: img.image_alt || s.title,
              })),
            };
          }),
        });
      }

      return json({ devices: result }, 200, cors(origin));
    }

    // Serve guide images from R2 (by slug/filename — legacy path)
    const imageMatch = url.pathname.match(/^\/api\/guide\/images\/([^/]+)\/(.+)$/);
    if (imageMatch && request.method === 'GET') {
      const slug = imageMatch[1];
      const filename = imageMatch[2];
      const key = `${slug}/${filename}`;
      const obj = await env.GUIDE_IMAGES.get(key);
      if (!obj) return new Response('Not found', { status: 404, headers: cors(origin) });

      const headers = new Headers();
      headers.set('Content-Type', obj.httpMetadata?.contentType || 'image/png');
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      Object.entries(cors(origin)).forEach(([k, v]) => headers.set(k, v));
      return new Response(obj.body as unknown as BodyInit, { status: 200, headers });
    }

    // Serve guide images from R2 (by image id — new path)
    const imageByIdMatch = url.pathname.match(/^\/api\/guide\/images\/id\/(\d+)$/);
    if (imageByIdMatch && request.method === 'GET') {
      const id = parseInt(imageByIdMatch[1], 10);
      const row = await env.DB
        .prepare('SELECT image_key FROM guide_step_images WHERE id = ?')
        .bind(id)
        .first<{ image_key: string }>();
      if (!row) return new Response('Not found', { status: 404, headers: cors(origin) });

      const obj = await env.GUIDE_IMAGES.get(row.image_key);
      if (!obj) return new Response('Not found', { status: 404, headers: cors(origin) });

      const headers = new Headers();
      headers.set('Content-Type', obj.httpMetadata?.contentType || 'image/png');
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      Object.entries(cors(origin)).forEach(([k, v]) => headers.set(k, v));
      return new Response(obj.body as unknown as BodyInit, { status: 200, headers });
    }

    // ─── Guide: admin endpoints ────────────────────────────────────────

    if (url.pathname === '/api/admin/guide/devices' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!body) return json({ error: 'Invalid body' }, 400, cors(origin));

      if (body.id) {
        await env.DB
          .prepare(`UPDATE guide_devices SET
            slug = ?, name = ?, app_name = ?, download_label = ?, download_url = ?,
            intro = ?, sort_order = ?, published = ?, updated_at = datetime('now')
            WHERE id = ?`)
          .bind(
            body.slug, body.name, body.app_name, body.download_label, body.download_url,
            body.intro ?? null, body.sort_order ?? 0, body.published ?? 1,
            body.id
          )
          .run();
        const device = await env.DB.prepare('SELECT * FROM guide_devices WHERE id = ?').bind(body.id).first();
        return json({ ok: true, device }, 200, cors(origin));
      } else {
        const result = await env.DB
          .prepare(`INSERT INTO guide_devices
            (slug, name, app_name, download_label, download_url, intro, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
          .bind(
            body.slug, body.name, body.app_name, body.download_label, body.download_url,
            body.intro ?? null, body.sort_order ?? 0, body.published ?? 1
          )
          .run();
        const device = await env.DB.prepare('SELECT * FROM guide_devices WHERE id = ?').bind(result.meta.last_row_id).first();
        return json({ ok: true, device }, 201, cors(origin));
      }
    }

    if (url.pathname === '/api/admin/guide/steps' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!body?.device_id || !body?.title) {
        return json({ error: 'device_id and title required' }, 400, cors(origin));
      }

      if (body.id) {
        await env.DB
          .prepare(`UPDATE guide_steps SET
            step_number = ?, title = ?, body = ?, image_alt = ?, updated_at = datetime('now')
            WHERE id = ?`)
          .bind(body.step_number ?? 1, body.title, body.body ?? null, body.image_alt ?? null, body.id)
          .run();
        const step = await env.DB.prepare('SELECT * FROM guide_steps WHERE id = ?').bind(body.id).first();
        return json({ ok: true, step }, 200, cors(origin));
      } else {
        const result = await env.DB
          .prepare(`INSERT INTO guide_steps
            (device_id, step_number, title, body, image_alt)
            VALUES (?, ?, ?, ?, ?)`)
          .bind(body.device_id, body.step_number ?? 1, body.title, body.body ?? null, body.image_alt ?? null)
          .run();
        const step = await env.DB.prepare('SELECT * FROM guide_steps WHERE id = ?').bind(result.meta.last_row_id).first();
        return json({ ok: true, step }, 201, cors(origin));
      }
    }

    const stepDeleteMatch = url.pathname.match(/^\/api\/admin\/guide\/steps\/(\d+)$/);
    if (stepDeleteMatch && request.method === 'DELETE') {
      const id = parseInt(stepDeleteMatch[1], 10);
      const step = await env.DB.prepare('SELECT image_key FROM guide_steps WHERE id = ?').bind(id).first<{ image_key: string | null }>();
      if (step?.image_key) {
        await env.GUIDE_IMAGES.delete(step.image_key);
      }
      await env.DB.prepare('DELETE FROM guide_steps WHERE id = ?').bind(id).run();
      return json({ ok: true }, 200, cors(origin));
    }

    if (url.pathname === '/api/admin/guide/upload' && request.method === 'POST') {
      const formData = await request.formData();
      const slug = formData.get('slug') as string | null;
      const file = formData.get('file') as File | null;
      const stepIdStr = formData.get('step_id') as string | null;

      if (!slug || !file || !stepIdStr) {
        return json({ error: 'slug, file, and step_id are required' }, 400, cors(origin));
      }

      const stepId = parseInt(stepIdStr, 10);

      // Validate file type and size
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return json({ error: 'Only PNG, JPEG, and WebP images are allowed' }, 400, cors(origin));
      }

      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        return json({ error: 'Image must be under 5 MB' }, 400, cors(origin));
      }

      // Get step info to determine step_number
      const step = await env.DB
        .prepare('SELECT step_number, device_id FROM guide_steps WHERE id = ?')
        .bind(stepId)
        .first<{ step_number: number; device_id: number }>();
      if (!step) return json({ error: 'Step not found' }, 404, cors(origin));

      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp';
      const timestamp = Date.now();
      const key = `${slug}/step-${step.step_number}-${timestamp}.${ext}`;

      // Determine sort order: current max + 1
      const maxRow = await env.DB
        .prepare('SELECT COALESCE(MAX(sort_order), -1) as max_sort FROM guide_step_images WHERE step_id = ?')
        .bind(stepId)
        .first<{ max_sort: number }>();
      const sortOrder = (maxRow?.max_sort ?? -1) + 1;

      // Upload to R2
      const arrayBuffer = await file.arrayBuffer();
      await env.GUIDE_IMAGES.put(key, arrayBuffer, {
        httpMetadata: { contentType: file.type },
      });

      // Insert new row in guide_step_images
      const result = await env.DB
        .prepare('INSERT INTO guide_step_images (step_id, image_key, image_alt, sort_order) VALUES (?, ?, ?, ?)')
        .bind(stepId, key, null, sortOrder)
        .run();

      const imageId = result.meta.last_row_id;

      return json({
        ok: true,
        image: {
          id: imageId,
          url: `/api/guide/images/id/${imageId}`,
          alt: '',
        },
      }, 200, cors(origin));
    }

    // Delete a single step image
    const deleteImageMatch = url.pathname.match(/^\/api\/admin\/guide\/images\/(\d+)$/);
    if (deleteImageMatch && request.method === 'DELETE') {
      const imageId = parseInt(deleteImageMatch[1], 10);

      const row = await env.DB
        .prepare('SELECT id, step_id, image_key FROM guide_step_images WHERE id = ?')
        .bind(imageId)
        .first<{ id: number; step_id: number; image_key: string }>();

      if (!row) {
        return json({ error: 'Image not found' }, 404, cors(origin));
      }

      // Delete from R2
      await env.GUIDE_IMAGES.delete(row.image_key);

      // Delete from DB
      await env.DB.prepare('DELETE FROM guide_step_images WHERE id = ?').bind(imageId).run();

      // If this was the only image and guide_steps.image_key still references it, null it out
      const remaining = await env.DB
        .prepare('SELECT COUNT(*) as count FROM guide_step_images WHERE step_id = ?')
        .bind(row.step_id)
        .first<{ count: number }>();

      if ((remaining?.count ?? 0) === 0) {
        await env.DB
          .prepare("UPDATE guide_steps SET image_key = NULL, updated_at = datetime('now') WHERE id = ?")
          .bind(row.step_id)
          .run();
      }

      return json({ ok: true }, 200, cors(origin));
    }

    if (url.pathname === '/api/admin/guide/reorder' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as { device_id?: number; order?: number[] } | null;
      if (!body?.device_id || !Array.isArray(body.order)) {
        return json({ error: 'device_id and order array required' }, 400, cors(origin));
      }

      const stmt = env.DB.prepare(
        "UPDATE guide_steps SET step_number = ?, updated_at = datetime('now') WHERE id = ?"
      );
      for (let i = 0; i < body.order.length; i++) {
        await stmt.bind(i + 1, body.order[i]).run();
      }

      return json({ ok: true }, 200, cors(origin));
    }

    // ─── Payment settings: admin endpoints ────────────────────────────

    if (url.pathname === '/api/admin/payment-settings' && request.method === 'POST') {
      const body = await request.json().catch(() => null) as Record<string, unknown> | null;
      if (!body) return json({ error: 'Invalid body' }, 400, cors(origin));

      const allowedFields = [
        'wechat_id', 'whatsapp', 'email', 'alipay_id',
        'bank_name', 'bank_account_name', 'bank_account_number',
      ];

      const sets: string[] = [];
      const vals: unknown[] = [];

      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          sets.push(`${field} = ?`);
          vals.push(body[field]);
        }
      }

      if (sets.length > 0) {
        vals.push(1); // id = 1
        await env.DB
          .prepare(`UPDATE payment_settings SET ${sets.join(', ')}, updated_at = datetime('now') WHERE id = ?`)
          .bind(...vals)
          .run();
      }

      const row = await env.DB
        .prepare('SELECT * FROM payment_settings WHERE id = 1')
        .first();

      const settings = {
        wechat_id: row?.wechat_id,
        whatsapp: row?.whatsapp,
        email: row?.email,
        alipay_id: row?.alipay_id,
        bank_name: row?.bank_name,
        bank_account_name: row?.bank_account_name,
        bank_account_number: row?.bank_account_number,
        wechat_qr_url: row?.wechat_qr_key ? '/api/payment-qr/wechat' : null,
        alipay_qr_url: row?.alipay_qr_key ? '/api/payment-qr/alipay' : null,
      };

      return json({ ok: true, settings }, 200, cors(origin));
    }

    if (url.pathname === '/api/admin/payment-qr/upload' && request.method === 'POST') {
      const formData = await request.formData();
      const slot = formData.get('slot') as string | null;
      const file = formData.get('file') as File | null;

      if (!slot || (slot !== 'wechat' && slot !== 'alipay')) {
        return json({ error: 'slot must be "wechat" or "alipay"' }, 400, cors(origin));
      }
      if (!file) return json({ error: 'file is required' }, 400, cors(origin));

      // Validate file type and size
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return json({ error: 'Only PNG, JPEG, and WebP images are allowed' }, 400, cors(origin));
      }
      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSize) {
        return json({ error: 'Image must be under 2 MB' }, 400, cors(origin));
      }

      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp';
      const key = `payment/${slot}-qr.${ext}`;
      const col = slot === 'wechat' ? 'wechat_qr_key' : 'alipay_qr_key';

      // Delete old image if present
      const oldRow = await env.DB
        .prepare(`SELECT ${col} as old_key FROM payment_settings WHERE id = 1`)
        .first<{ old_key: string | null }>();
      if (oldRow?.old_key && oldRow.old_key !== key) {
        await env.GUIDE_IMAGES.delete(oldRow.old_key);
      }

      // Upload to R2
      const arrayBuffer = await file.arrayBuffer();
      await env.GUIDE_IMAGES.put(key, arrayBuffer, {
        httpMetadata: { contentType: file.type },
      });

      // Update settings
      await env.DB
        .prepare(`UPDATE payment_settings SET ${col} = ?, updated_at = datetime('now') WHERE id = 1`)
        .bind(key)
        .run();

      return json({
        ok: true,
        url: `/api/payment-qr/${slot}`,
      }, 200, cors(origin));
    }

    const qrDeleteMatch = url.pathname.match(/^\/api\/admin\/payment-qr\/(wechat|alipay)$/);
    if (qrDeleteMatch && request.method === 'DELETE') {
      const slot = qrDeleteMatch[1];
      const col = slot === 'wechat' ? 'wechat_qr_key' : 'alipay_qr_key';

      const row = await env.DB
        .prepare(`SELECT ${col} as qr_key FROM payment_settings WHERE id = 1`)
        .first<{ qr_key: string | null }>();

      if (row?.qr_key) {
        await env.GUIDE_IMAGES.delete(row.qr_key);
      }

      await env.DB
        .prepare(`UPDATE payment_settings SET ${col} = NULL, updated_at = datetime('now') WHERE id = 1`)
        .run();

      return json({ ok: true }, 200, cors(origin));
    }

    return json({ error: 'Not found' }, 404, cors(origin));
  },
};
