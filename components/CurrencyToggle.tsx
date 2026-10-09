'use client';

import { CurrencyCode, CURRENCIES } from '@/lib/config';

interface Props {
  value: CurrencyCode;
  onChange: (c: CurrencyCode) => void;
}

export default function CurrencyToggle({ value, onChange }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
      }}
    >
      <div
        className="currency-toggle"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: 4,
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {CURRENCIES.map((c) => {
          const active = c.code === value;
          const label =
            c.code === 'cny' ? 'CNY ¥' :
            c.code === 'usd' ? 'USD $' :
            c.code === 'aed' ? 'AED' :
            'TZS';
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onChange(c.code)}
              className="currency-pill"
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: 'none',
                background: active
                  ? 'linear-gradient(135deg, #f59e0b, #e88a1e)'
                  : 'transparent',
                color: active ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      <style>{`
        .currency-toggle {
          overflow-x: auto;
          max-width: 100%;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .currency-toggle::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
