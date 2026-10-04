'use client';
import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';

export default function CustomerDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get('id');
  const id = idParam ? parseInt(idParam, 10) : 0;

  const [customer, setCustomer] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '', status: 'active' });
  const [links, setLinks] = useState<any[]>([]);
  const [showSubForm, setShowSubForm] = useState(false);
  const [subForm, setSubForm] = useState({
    upstream_link_id: '',
    plan_name: '',
    start_date: '',
    expiry_date: '',
    payment_status: 'paid',
    payment_amount: '',
    payment_currency: 'CNY',
    payment_method: '',
    notes: '',
  });
  const [error, setError] = useState('');

  function load() {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      adminApi.getCustomer(id),
      adminApi.getLinks(),
    ])
      .then(([data, linksData]) => {
        setCustomer(data.customer);
        setSubscriptions(data.subscriptions);
        setLinks(linksData.links);
        setFormData({
          name: data.customer.name || '',
          phone: data.customer.phone || '',
          email: data.customer.email || '',
          notes: data.customer.notes || '',
          status: data.customer.status || 'active',
        });
      })
      .catch(() => setError('Failed to load customer'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await adminApi.updateCustomer(id, formData);
      setEditing(false);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed to update');
    }
  }

  async function handleDeactivate() {
    if (!confirm('Deactivate this customer?')) return;
    try {
      await adminApi.updateCustomer(id, { ...formData, status: formData.status === 'active' ? 'disabled' : 'active' });
      load();
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
  }

  async function handleAddSub(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const payload: Record<string, unknown> = {
        customer_id: id,
        plan_name: subForm.plan_name || null,
        start_date: subForm.start_date || null,
        expiry_date: subForm.expiry_date || null,
        payment_status: subForm.payment_status,
        payment_method: subForm.payment_method || null,
        notes: subForm.notes || null,
      };
      if (subForm.upstream_link_id) payload.upstream_link_id = parseInt(subForm.upstream_link_id, 10);
      if (subForm.payment_amount) payload.payment_amount = parseFloat(subForm.payment_amount);
      if (subForm.payment_currency) payload.payment_currency = subForm.payment_currency;
      await adminApi.createSubscription(payload);
      setShowSubForm(false);
      setSubForm({
        upstream_link_id: '',
        plan_name: '',
        start_date: '',
        expiry_date: '',
        payment_status: 'paid',
        payment_amount: '',
        payment_currency: 'CNY',
        payment_method: '',
        notes: '',
      });
      load();
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
  }

  if (!id) return <div className="muted">No customer ID specified.</div>;
  if (loading) return <div className="muted">Loading…</div>;
  if (!customer) return <div className="muted">Customer not found.</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      <button onClick={() => router.push('/admin/customers')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>
        ← Back to customers
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{customer.name}</h1>
          <span style={{ color: customer.status === 'active' ? '#22c55e' : '#ef4444', fontSize: '0.9rem' }}>● {customer.status}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleDeactivate} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            {customer.status === 'active' ? 'Deactivate' : 'Reactivate'}
          </button>
          <button onClick={() => setEditing(!editing)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {error && <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      {/* Customer info */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        {editing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <span className="muted" style={{ fontSize: '0.8rem' }}>Name</span>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Save</button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Phone</div>
              <div style={{ fontSize: '0.95rem' }}>{customer.phone || '—'}</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Email</div>
              <div style={{ fontSize: '0.95rem' }}>{customer.email || '—'}</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Created</div>
              <div style={{ fontSize: '0.95rem' }}>{new Date(customer.created_at).toLocaleDateString()}</div>
            </div>
            {customer.notes && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Notes</div>
                <div style={{ fontSize: '0.95rem' }}>{customer.notes}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subscriptions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Subscriptions</h2>
        <button onClick={() => setShowSubForm(!showSubForm)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          + Add subscription
        </button>
      </div>

      {showSubForm && (
        <form onSubmit={handleAddSub} className="card" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>New subscription</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Upstream link</span>
              <select value={subForm.upstream_link_id} onChange={(e) => setSubForm({ ...subForm, upstream_link_id: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                <option value="">— Select —</option>
                {links.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Plan name</span>
              <input value={subForm.plan_name} onChange={(e) => setSubForm({ ...subForm, plan_name: e.target.value })} placeholder="e.g. 3 Months"
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Start date</span>
              <input type="date" value={subForm.start_date} onChange={(e) => setSubForm({ ...subForm, start_date: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Expiry date</span>
              <input type="date" value={subForm.expiry_date} onChange={(e) => setSubForm({ ...subForm, expiry_date: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Payment status</span>
              <select value={subForm.payment_status} onChange={(e) => setSubForm({ ...subForm, payment_status: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Amount</span>
              <input type="number" value={subForm.payment_amount} onChange={(e) => setSubForm({ ...subForm, payment_amount: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Currency</span>
              <select value={subForm.payment_currency} onChange={(e) => setSubForm({ ...subForm, payment_currency: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                <option value="CNY">CNY</option>
                <option value="TZS">TZS</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Payment method</span>
              <input value={subForm.payment_method} onChange={(e) => setSubForm({ ...subForm, payment_method: e.target.value })} placeholder="WeChat / Bank / Alipay"
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span className="muted" style={{ fontSize: '0.8rem' }}>Notes</span>
            <textarea value={subForm.notes} onChange={(e) => setSubForm({ ...subForm, notes: e.target.value })} rows={2}
              style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowSubForm(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Add</button>
          </div>
        </form>
      )}

      {subscriptions.length === 0 ? (
        <div className="card muted" style={{ textAlign: 'center' }}>
          No subscriptions yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {subscriptions.map((s) => (
            <div key={s.id} className="card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                    {s.plan_name || 'Subscription'}
                    {s.link_label && <span className="muted" style={{ fontWeight: 400, fontSize: '0.85rem' }}> — {s.link_label}</span>}
                  </div>
                  <div className="muted" style={{ fontSize: '0.85rem' }}>
                    {s.start_date ? new Date(s.start_date).toLocaleDateString() : '—'} → {s.expiry_date ? new Date(s.expiry_date).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    color: s.payment_status === 'paid' ? '#22c55e' : s.payment_status === 'partial' ? '#f59e0b' : '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}>
                    ● {s.payment_status}
                  </span>
                  {s.payment_amount && (
                    <div className="muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      {s.payment_currency || ''} {s.payment_amount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
