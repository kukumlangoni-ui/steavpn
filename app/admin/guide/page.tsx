'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';

export default function AdminGuidePage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getGuide()
      .then((data) => setDevices(data.devices))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Guide Editor</h1>

      {loading ? (
        <div className="muted">Loading…</div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {devices.map((d) => (
            <div key={d.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{d.name}</div>
                <div className="muted" style={{ fontSize: '0.9rem' }}>{d.app_name}</div>
              </div>
              <div className="muted" style={{ fontSize: '0.85rem' }}>
                {d.steps?.length || 0} steps
              </div>
              <Link
                href={`/admin/guide/edit?slug=${d.slug}`}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', justifyContent: 'center', marginTop: 'auto' }}
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
