'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ─── Premium custom SVG icons ──────────────────────────────────────── */

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M3.5 10.5 L12 4 L20.5 10.5 V19 A1 1 0 0 1 19.5 20 H15 V14 H9 V20 H4.5 A1 1 0 0 1 3.5 19 Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.12 : 0}
      />
    </svg>
  );
}

function PricingIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4 6.5 V11 L11.5 18.5 A2 2 0 0 0 14.3 18.5 L18.5 14.3 A2 2 0 0 0 18.5 11.5 L11 4 H5.5 A1.5 1.5 0 0 0 4 5.5 Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.12 : 0}
      />
      <circle
        cx="8"
        cy="8"
        r="1.2"
        fill={active ? '#0a0a0a' : 'currentColor'}
      />
    </svg>
  );
}

function GuideIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
      />
      {/* Needle pointing NE */}
      <path
        d="M15.5 8.5 L10.5 10.5 L8.5 15.5 L13.5 13.5 Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.25 : 0}
      />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function FaqIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4.5 6.5 A1.5 1.5 0 0 1 6 5 H18 A1.5 1.5 0 0 1 19.5 6.5 V15 A1.5 1.5 0 0 1 18 16.5 H9 L5.5 19.5 V16.5 H6 A1.5 1.5 0 0 1 4.5 15 Z"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.12 : 0}
      />
      {/* Question mark */}
      <path
        d="M10 10 A2 2 0 1 1 12.4 11.6 C12 12 12 12.5 12 13"
        stroke={active ? '#0a0a0a' : 'currentColor'}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx="12"
        cy="14.8"
        r="0.9"
        fill={active ? '#0a0a0a' : 'currentColor'}
      />
    </svg>
  );
}

function SupportIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Headband arc */}
      <path
        d="M4 13 V11 A8 8 0 0 1 20 11 V13"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
        strokeLinecap="round"
      />
      {/* Left ear cup */}
      <rect
        x="2.5"
        y="12.5"
        width="4"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.25 : 0}
      />
      {/* Right ear cup */}
      <rect
        x="17.5"
        y="12.5"
        width="4"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.25 : 0}
      />
      {/* Mic stem */}
      <path
        d="M19.5 18.5 C19.5 20.5 17 21 15 21 H13"
        stroke="currentColor"
        strokeWidth={active ? 2.1 : 1.7}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12.5" cy="21" r="1" fill="currentColor" />
    </svg>
  );
}

/* ─── Nav items ─────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/pricing', label: 'Pricing', Icon: PricingIcon },
  { href: '/guide', label: 'Guide', Icon: GuideIcon },
  { href: '/faq', label: 'FAQ', Icon: FaqIcon },
  { href: '/support', label: 'Support', Icon: SupportIcon },
];

/* ─── Component ─────────────────────────────────────────────────────── */

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="stea-bottom-nav fixed left-1/2 -translate-x-1/2 z-50 sm:hidden"
      style={{
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        width: 'min(520px, calc(100vw - 24px))',
        padding: '6px',
        borderRadius: '22px',
        background:
          'linear-gradient(180deg, rgba(28,28,32,0.92) 0%, rgba(14,14,18,0.94) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 1px 0 0 rgba(255,255,255,0.06) inset, ' +
          '0 -1px 0 0 rgba(0,0,0,0.4) inset, ' +
          '0 12px 40px rgba(0,0,0,0.55), ' +
          '0 4px 12px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
      aria-label="Mobile navigation"
    >
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          width: '100%',
        }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active =
            pathname === href ||
            (href !== '/' && pathname.startsWith(href));
          return (
            <li key={href} style={{ flex: 1 }}>
              <Link
                href={href}
                aria-label={label}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  height: '56px',
                  width: '100%',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  color: active ? '#f59e0b' : 'rgba(255,255,255,0.55)',
                  background: active
                    ? 'radial-gradient(ellipse at center top, rgba(245,158,11,0.14) 0%, rgba(245,158,11,0.02) 70%)'
                    : 'transparent',
                  transition:
                    'color 180ms ease, background 180ms ease, transform 120ms ease',
                  WebkitTapHighlightColor: 'transparent',
                } as React.CSSProperties}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(0.94)';
                }}
                onTouchEnd={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    display: 'block',
                    width: 22,
                    height: 22,
                    transition: 'transform 180ms ease',
                    transform: active ? 'translateY(-1px)' : 'translateY(0)',
                  }}
                >
                  <Icon active={active} />
                </span>

                {/* Label */}
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: active ? 700 : 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    transition: 'opacity 180ms ease',
                  }}
                >
                  {label}
                </span>

                {/* Active indicator — small orange line above */}
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 22,
                      height: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
                      boxShadow: '0 0 8px rgba(245,158,11,0.7)',
                    }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <style>{`
        @keyframes navEnter {
          from {
            opacity: 0;
            transform: translate(-50%, 12px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .stea-bottom-nav {
          animation: navEnter 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }
      `}</style>
    </nav>
  );
}
