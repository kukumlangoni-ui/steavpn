'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';

export default function DashboardPage() {
  const [stats, setStats] = useState<{ totalCustomers: number; activeSubs: number; expiringSoon: number; expired: number } | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then((data) => {
        setStats(data.stats);
        setRecent(data.recentCustomers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Customers', value: stats?.totalCustomers ?? 0, color: 'var(--accent-1)' },
    { label: 'Active Subscriptions', value: stats?.activeSubs ?? 0, color: '#22c55e' },
    { label: 'Expiring Soon', value: stats?.expiringSoon ?? 0, color: '#f59e0b' },
    { label: 'Expired', value: stats?.expired ?? 0, color: '#ef4444' },
  ];

  return (
    <div style={{ maxWidth: 1000 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Dashboard</h1>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        {statCards.map((s) => (
          <div key={s.label} className="card" style={{ padding: '1.25rem' }}>
            <div className="muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>
              {loading ? '—' : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Quick actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/admin/customers" className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            Manage customers
          </Link>
          <Link href="/admin/links" className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            Manage links
          </Link>
          <Link href="/admin/subscriptions" className="btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            Subscriptions
          </Link>
        </div>
      </div>

      {/* Recent customers */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Recent customers</h2>
        </div>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">Loading…</div>
        ) : recent.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">No customers yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 1.25rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1.25rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Phone</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1.25rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1.25rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Created</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}>
                    <Link href={`/admin/customers/detail?id=${c.id}`} style={{ color: 'var(--accent-1)' }}>{c.name}</Link>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }} className="muted">{c.phone || '—'}</td>
                  <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}>
                    <span style={{ color: c.status === 'active' ? '#22c55e' : '#ef4444' }}>● {c.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }} className="muted">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
