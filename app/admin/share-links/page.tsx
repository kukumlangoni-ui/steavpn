'use client';

import { useState } from 'react';

const GUIDE_LINKS = [
  { device: 'iPhone / iPad', url: 'https://steavpn.stea.africa/guide/#ios' },
  { device: 'Android',       url: 'https://steavpn.stea.africa/guide/#android' },
  { device: 'macOS',         url: 'https://steavpn.stea.africa/guide/#macos' },
  { device: 'Windows',       url: 'https://steavpn.stea.africa/guide/#windows' },
  { device: 'Linux',         url: 'https://steavpn.stea.africa/guide/#linux' },
];

const PLAN_LINKS = [
  { plan: '1 Month — ¥10',  url: 'https://steavpn.stea.africa/pricing/?plan=1month#how-to-pay' },
  { plan: '3 Months — ¥28', url: 'https://steavpn.stea.africa/pricing/?plan=3months#how-to-pay' },
  { plan: '1 Year — ¥100',  url: 'https://steavpn.stea.africa/pricing/?plan=1year#how-to-pay' },
];

function LinkRow({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1rem',
        marginBottom: '0.5rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: '0.15rem' }}>{label}</div>
        <code style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', wordBreak: 'break-all' }}>{url}</code>
      </div>
      <button
        onClick={async () => {
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
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="btn-secondary"
        style={{ minWidth: 80, flexShrink: 0 }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function ShareLinksPage() {
  return (
    <div style={{ padding: '2rem 1.25rem', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Share Links</h1>
      <p className="muted" style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        Copy any link below and send it to a customer. Each link opens
        directly on the right section.
      </p>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>
        Guide — by device
      </h2>
      {GUIDE_LINKS.map(({ device, url }) => (
        <LinkRow key={url} label={device} url={url} />
      ))}

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>
        Checkout — by plan
      </h2>
      {PLAN_LINKS.map(({ plan, url }) => (
        <LinkRow key={url} label={plan} url={url} />
      ))}
    </div>
  );
}
