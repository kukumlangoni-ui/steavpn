'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Links', href: '/admin/links' },
  { label: 'Subscriptions', href: '/admin/subscriptions' },
  { label: 'Guide', href: '/admin/guide' },
  { label: 'Payment settings', href: '/admin/payment-settings' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await adminApi.logout();
    } catch {
      // ignore
    }
    router.push('/admin/login');
  }

  return (
    <nav
      style={{
        width: 220,
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}
    >
      <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
        <Link href="/admin/dashboard" style={{ fontWeight: 700, fontSize: '1rem' }}>
          STEA <span className="accent">Admin</span>
        </Link>
      </div>

      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '0.6rem 1rem',
              fontSize: '0.9rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              background: isActive ? 'var(--surface-2)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent-1)' : '2px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            {item.label}
          </Link>
        );
      })}

      <div style={{ flex: 1 }} />

      <button
        onClick={handleLogout}
        style={{
          margin: '0.5rem 1rem 0',
          padding: '0.6rem 1rem',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: 6,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ef4444';
          e.currentTarget.style.background = 'var(--surface-2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        Log out
      </button>
    </nav>
  );
}
