'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ─── Custom SVG icons ──────────────────────────────────────────────── */

function HomeIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Roof */}
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      {/* House body */}
      <path d="M5.5 9.5V19a1 1 0 0 0 1 1h4v-5h3v5h4a1 1 0 0 0 1-1V9.5" />
      {/* STEA orange accent dot */}
      <circle cx="12" cy="13" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PricingIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Price tag body (rotated look via diamond shape) */}
      <path d="M14.5 3.5h5v5L8.5 19.5 4.5 15.5 14.5 3.5z" />
      {/* Tag hole */}
      <circle cx="16.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
      {/* Curved notch at bottom */}
      <path d="M5.5 17 3 19.5" />
    </svg>
  );
}

function GuideIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="12" cy="12" r="8.5" />
      {/* Diamond / compass rose */}
      <path d="M12 4.5 15.5 12 12 19.5 8.5 12 12 4.5z" />
      {/* Cardinal tick marks */}
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      {/* Needle pointing NE */}
      <path d="m12 12 3.5-3.5" strokeWidth={2.25} />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FaqIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Chat bubble with wavy top */}
      <path d="M5 7.5c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3v-3H7a2 2 0 0 1-2-2v-6z" />
      {/* Question mark */}
      <path d="M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5c0 1.2-1 1.7-1.8 2.3-.6.5-1.2 1.1-1.2 2.2" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SupportIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Headband */}
      <path d="M4 13.5V10a8 8 0 0 1 16 0v3.5" />
      {/* Left ear cup */}
      <path d="M4 12h2.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H4v-6z" />
      {/* Right ear cup */}
      <path d="M20 12h-2.5a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5H20v-6z" />
      {/* Curved cable with mic dot */}
      <path d="M17.5 18c0 2-2 2.5-3.5 2.5S11 20 11 18" />
      <circle cx="11" cy="18" r="1.1" fill="currentColor" stroke="none" />
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
      className="sm:hidden fixed bottom-4 left-4 right-4 z-50 rounded-full border border-white/[0.08] bg-[#0a0a0f]/85 backdrop-blur-xl"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-5 h-16">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active =
            pathname === href ||
            (href !== '/' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 h-full w-full text-[10px] font-semibold tracking-wide uppercase transition-colors ${
                  active ? 'text-[#f59e0b]' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Icon className="w-[22px] h-[22px]" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
