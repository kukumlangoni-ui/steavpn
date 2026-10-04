'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    adminApi.getCustomers()
      .then((data) => setCustomers(data.customers))
      .catch(() => setError('Failed to load customers'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await adminApi.createCustomer(formData);
      setFormData({ name: '', phone: '', email: '', notes: '' });
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    }
  }

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Customers</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
          + Add customer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>New customer</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Name *</span>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Phone</span>
              <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Email</span>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span className="muted" style={{ fontSize: '0.8rem' }}>Notes</span>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2}
              style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', resize: 'vertical' }} />
          </label>
          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Create
            </button>
          </div>
        </form>
      )}

      <input
        type="text"
        placeholder="Search by name, phone, or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '0.6rem 0.9rem',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text)',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}
      />

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">
            {customers.length === 0 ? 'No customers yet.' : 'No matching customers.'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Name</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Phone</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Status</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Latest expiry</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                    <Link href={`/admin/customers/detail?id=${c.id}`} style={{ color: 'var(--accent-1)', fontWeight: 500 }}>{c.name}</Link>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }} className="muted">{c.phone || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                    <span style={{ color: c.status === 'active' ? '#22c55e' : '#ef4444' }}>● {c.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }} className="muted">
                    {c.latest_expiry ? new Date(c.latest_expiry).toLocaleDateString() : '—'}
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
