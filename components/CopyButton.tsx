'use client';

import { useState } from 'react';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '0.4rem 0.9rem',
        borderRadius: 6,
        background: 'transparent',
        border: '1px solid var(--border-active)',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
        minHeight: 36,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-1)';
        e.currentTarget.style.color = 'var(--accent-1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-active)';
        e.currentTarget.style.color = 'var(--text-muted)';
      }}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}
