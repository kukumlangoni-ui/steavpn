'use client';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';

type FilterType = 'all' | 'active' | 'expiring' | 'expired' | 'unpaid';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    expiry_date: '',
    payment_status: 'paid',
    notes: '',
  });

  function load() {
    setLoading(true);
    adminApi.getSubscriptions()
      .then((data) => setSubs(data.subscriptions))
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const now = new Date();
  const filtered = subs.filter((s) => {
    const expiry = s.expiry_date ? new Date(s.expiry_date) : null;
    switch (filter) {
      case 'active':
        return s.payment_status === 'paid' && expiry && expiry > now;
      case 'expiring':
        if (!expiry || s.payment_status !== 'paid') return false;
        const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      case 'expired':
        return expiry && expiry < now;
      case 'unpaid':
        return s.payment_status === 'unpaid';
      default:
        return true;
    }
  });

  function startEdit(sub: any) {
    setEditingId(sub.id);
    setEditData({
      expiry_date: sub.expiry_date ? sub.expiry_date.slice(0, 10) : '',
      payment_status: sub.payment_status || 'paid',
      notes: sub.notes || '',
    });
  }

  async function saveEdit(id: number) {
    try {
      await adminApi.updateSubscription(id, editData);
      setEditingId(null);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'expiring', label: 'Expiring soon' },
    { key: 'expired', label: 'Expired' },
    { key: 'unpaid', label: 'Unpaid' },
  ];

  return (
    <div style={{ maxWidth: 1200 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Subscriptions</h1>

      {error && <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: 999,
              border: '1px solid var(--border-active)',
              background: filter === f.key ? 'var(--surface-2)' : 'transparent',
              color: filter === f.key ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: filter === f.key ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">No subscriptions found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Customer</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Plan</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Link</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Expiry</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Payment</th>
                <th style={{ textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const isEditing = editingId === s.id;
                const expiry = s.expiry_date ? new Date(s.expiry_date) : null;
                const isExpired = expiry && expiry < now;
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500 }}>
                      {s.customer_name || `#${s.customer_id}`}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>{s.plan_name || '—'}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }} className="muted">{s.link_label || '—'}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                      {isEditing ? (
                        <input type="date" value={editData.expiry_date} onChange={(e) => setEditData({ ...editData, expiry_date: e.target.value })}
                          style={{ padding: '0.4rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
                      ) : (
                        <span style={{ color: isExpired ? '#ef4444' : 'inherit' }}>
                          {expiry ? expiry.toLocaleDateString() : '—'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                      {isEditing ? (
                        <select value={editData.payment_status} onChange={(e) => setEditData({ ...editData, payment_status: e.target.value })}
                          style={{ padding: '0.4rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}>
                          <option value="unpaid">Unpaid</option>
                          <option value="partial">Partial</option>
                          <option value="paid">Paid</option>
                        </select>
                      ) : (
                        <span style={{
                          color: s.payment_status === 'paid' ? '#22c55e' : s.payment_status === 'partial' ? '#f59e0b' : '#ef4444',
                        }}>
                          ● {s.payment_status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(s.id)}
                            style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer', padding: '0.25rem 0.5rem', fontWeight: 500 }}>
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(s)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-1)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
