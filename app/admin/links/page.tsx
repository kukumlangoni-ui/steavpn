'use client';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';

export default function LinksPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    provider: '',
    subscription_url: '',
    capacity_notes: '',
    internal_notes: '',
  });
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    adminApi.getLinks()
      .then((data) => setLinks(data.links))
      .catch(() => setError('Failed to load links'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setFormData({ label: '', provider: '', subscription_url: '', capacity_notes: '', internal_notes: '' });
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await adminApi.updateLink(editingId, formData);
      } else {
        await adminApi.createLink(formData);
      }
      resetForm();
      load();
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
  }

  function startEdit(link: any) {
    setFormData({
      label: link.label || '',
      provider: link.provider || '',
      subscription_url: link.subscription_url || '',
      capacity_notes: link.capacity_notes || '',
      internal_notes: link.internal_notes || '',
    });
    setEditingId(link.id);
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this link? This cannot be undone.')) return;
    try {
      await adminApi.deleteLink(id);
      load();
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  function maskUrl(url: string): string {
    if (url.length <= 20) return url;
    return url.slice(0, 15) + '…' + url.slice(-10);
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Upstream Links</h1>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
          + Add link
        </button>
      </div>

      {error && <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{editingId ? 'Edit link' : 'New link'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Label *</span>
              <input value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} required
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Provider</span>
              <input value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <span className="muted" style={{ fontSize: '0.8rem' }}>Subscription URL *</span>
            <input value={formData.subscription_url} onChange={(e) => setFormData({ ...formData, subscription_url: e.target.value })} required
              style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.85rem' }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Capacity notes</span>
              <input value={formData.capacity_notes} onChange={(e) => setFormData({ ...formData, capacity_notes: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem' }}>Internal notes</span>
              <input value={formData.internal_notes} onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={resetForm} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              {editingId ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      )}

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">Loading…</div>
        ) : links.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }} className="muted">No links yet. Add your first upstream VPN link.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Label</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Provider</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">URL</th>
                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Status</th>
                <th style={{ textAlign: 'right', padding: '0.75rem 1rem', fontSize: '0.8rem', fontWeight: 500 }} className="muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 500 }}>{l.label}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }} className="muted">{l.provider || '—'}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', fontFamily: 'monospace' }} className="muted">
                    {revealed[l.id] ? l.subscription_url : maskUrl(l.subscription_url)}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                    <span style={{ color: l.status === 'active' ? '#22c55e' : '#ef4444' }}>● {l.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', textAlign: 'right' }}>
                    <button onClick={() => setRevealed({ ...revealed, [l.id]: !revealed[l.id] })}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-1)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                      {revealed[l.id] ? 'Hide' : 'Reveal'}
                    </button>
                    <button onClick={() => copyUrl(l.subscription_url)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                      Copy
                    </button>
                    <button onClick={() => startEdit(l)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(l.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem 0.5rem' }}>
                      Delete
                    </button>
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
