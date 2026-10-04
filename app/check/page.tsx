'use client';
import { useState } from 'react';
import { SITE, CONTACT } from '@/lib/config';

interface CheckResult {
  found: boolean;
  customer?: { name: string };
  subscription?: {
    plan_name: string | null;
    expiry_date: string | null;
    status: string;
  } | null;
}

export default function CheckPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`${SITE.apiBase}/api/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1.25rem 6rem', maxWidth: 520 }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Check Your Subscription
        </h1>
        <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
          Enter your phone number to see your subscription status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span className="muted" style={{ fontSize: '0.9rem' }}>Phone number</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +255..."
            required
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 8,
              border: '1px solid var(--border-active)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '1rem',
            }}
          />
        </label>
        {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Checking…' : 'Check status'}
        </button>
      </form>

      {result && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          {result.found && result.subscription ? (
            <>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }} className="muted">
                Hello, {result.customer?.name}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {result.subscription.plan_name || 'Subscription'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background:
                      result.subscription.status === 'paid' && result.subscription.expiry_date
                        ? new Date(result.subscription.expiry_date) > new Date()
                          ? '#22c55e'
                          : '#ef4444'
                        : result.subscription.status === 'paid'
                        ? '#22c55e'
                        : '#f59e0b',
                    display: 'inline-block',
                  }}
                />
                <span style={{ fontSize: '0.95rem', textTransform: 'capitalize' }}>
                  {result.subscription.status}
                </span>
              </div>
              {result.subscription.expiry_date && (
                <p className="muted" style={{ fontSize: '0.95rem', margin: 0 }}>
                  Active until <strong style={{ color: 'var(--text)' }}>
                    {new Date(result.subscription.expiry_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                </p>
              )}
            </>
          ) : (
            <>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                No subscription found
              </div>
              <p className="muted" style={{ fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                We couldn&apos;t find an active subscription for this phone number.
              </p>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Contact us on WeChat to get started:{' '}
                <a
                  href={CONTACT.wechat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-1)', fontWeight: 500 }}
                >
                  {CONTACT.wechat.id}
                </a>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
