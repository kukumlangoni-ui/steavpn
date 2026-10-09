'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function FlagImage({ code }: { code: string }) {
  if (code === 'earth') {
    return (
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        style={{
          display: 'inline-block',
          verticalAlign: '-0.1em',
          marginRight: '0.05em',
        }}
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" fill="#1e40af" />
        <path
          d="M4 9 Q8 7 12 9 Q16 11 20 9 M3 12 Q8 11 12 13 Q16 15 20 12 M5 16 Q9 15 12 16 Q15 17 19 15"
          stroke="#22c55e"
          strokeWidth="1.2"
          fill="none"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="10"
          fill="none"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.5"
        />
      </svg>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt=""
      width={40}
      height={30}
      loading="eager"
      decoding="async"
      onError={(e) => {
        const img = e.currentTarget;
        img.style.display = 'none';
        const fallback = document.createElement('span');
        fallback.textContent = code.toUpperCase();
        fallback.style.fontSize = '0.72em';
        fallback.style.color = 'rgba(255,255,255,0.6)';
        if (img.parentElement) img.parentElement.appendChild(fallback);
      }}
      style={{
        display: 'inline-block',
        verticalAlign: '-0.1em',
        width: '1em',
        height: 'auto',
        aspectRatio: '4 / 3',
        objectFit: 'cover',
        borderRadius: '0.08em',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
        marginRight: '0.05em',
      }}
    />
  );
}

const countries = [
  { code: 'cn', name: 'China' },
  { code: 'ae', name: 'Dubai' },
  { code: 'jp', name: 'Japan' },
  { code: 'eu', name: 'Europe' },
  { code: 'earth', name: 'Anywhere' },
];

export default function EarthHero() {
  const [activeCountry, setActiveCountry] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);
  const active = countries[activeCountry % countries.length] ?? countries[0];
  const longActiveName = (active?.name?.length ?? 0) >= 8;

  useEffect(() => {
    setHasHydrated(true);
    setActiveCountry(0);

    const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const intervalMs = rmQuery.matches ? 6000 : 3000;

    let interval: ReturnType<typeof setInterval> | undefined;

    const first = window.setTimeout(() => {
      setActiveCountry((i) => (i + 1) % countries.length);
      interval = setInterval(() => {
        setActiveCountry((i) => (i + 1) % countries.length);
      }, intervalMs);
    }, 1500);

    return () => {
      window.clearTimeout(first);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#050713] text-white"
      style={{ minHeight: 'calc(100svh - 56px)' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(760px 520px at 72% 46%, rgba(232,138,30,0.16), transparent 64%), radial-gradient(580px 420px at 10% 12%, rgba(239,68,68,0.09), transparent 62%), linear-gradient(180deg, #070916 0%, #050713 56%, #070914 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      {/* Globe gradient mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'linear-gradient(100deg, #050713 0%, #050713 28%, rgba(5,7,19,0.72) 50%, rgba(5,7,19,0.28) 72%, rgba(5,7,19,0.05) 100%)',
          WebkitMaskImage:
            'radial-gradient(80% 100% at 10% 30%, black 35%, rgba(0,0,0,0.45) 65%, transparent 85%)',
          maskImage:
            'radial-gradient(80% 100% at 10% 30%, black 35%, rgba(0,0,0,0.45) 65%, transparent 85%)',
        }}
      />

      <div
        className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-2 px-3 pb-3 pt-4 sm:gap-6 sm:px-6 sm:py-8 md:py-10 lg:grid-cols-[42%_14%_44%] lg:gap-4 lg:px-8 lg:py-14"
        style={{ minHeight: 'calc(100svh - 56px)' }}
      >
        {/* Copy + primary CTA */}
        <div className="relative z-20 mx-auto w-full max-w-[620px] text-center lg:mx-0 lg:text-left">
          <h1 className="font-extrabold tracking-normal text-white">
            <span className="block whitespace-nowrap text-[clamp(24px,7vw,36px)] leading-none sm:text-7xl sm:leading-[0.92] lg:text-[82px] xl:text-[88px]">
              <span className="sm:block">The VPN</span>{' '}
              <span className="sm:block">built for</span>
            </span>
            <span className="relative mt-1 inline-block w-full max-w-full overflow-visible align-top sm:mt-4 md:mt-5 md:min-w-full md:justify-start h-[40px] sm:h-[56px] md:h-[72px] md:w-[560px] lg:h-[88px] lg:w-[660px] xl:h-[96px] xl:w-[720px]">
              <span
                key={active.name}
                className={`country-word inline-flex w-full min-w-0 items-center justify-center gap-2 overflow-visible whitespace-nowrap bg-gradient-to-r from-[#ff4d2e] via-[#ff7a1a] to-[#ffc247] bg-clip-text text-[clamp(28px,8vw,46px)] font-extrabold leading-none tracking-normal text-transparent sm:text-[48px] md:w-max md:min-w-full md:justify-start md:gap-3 md:text-[60px] lg:text-[74px] xl:text-[82px] 2xl:text-[88px] ${longActiveName ? 'text-[clamp(25px,7vw,42px)] sm:text-[44px] md:text-[56px] lg:text-[68px] xl:text-[76px] 2xl:text-[82px]' : ''}`}
              >
                <span className="shrink-0 text-[0.72em] text-white md:text-[0.62em]" aria-hidden>
                  <FlagImage code={active.code} />
                </span>
                <span className="shrink-0">{active.name}</span>
              </span>
            </span>
          </h1>

          <p className="mt-2 text-sm font-semibold text-white sm:mt-6 sm:text-xl">
            Fast. Private. Secure.
          </p>
          <p className="mt-1 text-xs leading-5 text-white/72 sm:mt-2 sm:text-base sm:leading-7">
            Works where other VPNs may fail.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 min-[340px]:flex min-[340px]:justify-center sm:mt-8 lg:justify-start">
            <Link
              href="/pricing"
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-stea-primary/30 bg-stea-primary/10 px-3 py-2 text-sm font-bold text-stea-primary transition hover:bg-stea-primary/15 sm:min-h-12 sm:px-5 sm:py-3"
            >
              VPN for China
            </Link>

            <Link
              href="/pricing"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-stea-primary px-3 py-2 text-sm font-bold text-white shadow-[0_18px_40px_rgba(232,138,30,0.25)] transition hover:bg-stea-primary-hover sm:min-h-12 sm:px-6 sm:py-3"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/pricing"
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.045] px-3 py-2 text-sm font-bold text-white transition hover:border-white/28 hover:bg-white/[0.08] sm:min-h-12 sm:px-6 sm:py-3"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* Location chips column */}
        <div className="relative z-20 flex items-center justify-center lg:justify-self-center">
          <div className="grid w-full max-w-[360px] grid-cols-3 gap-1.5 sm:max-w-none sm:grid-cols-5 sm:gap-2 lg:w-[142px] lg:grid-cols-1 lg:space-y-0">
            {countries.map((location, index) => {
              const isActive = activeCountry === index;
              return (
                <div
                  key={location.name}
                  className={`chip-transition flex min-w-0 items-center gap-1.5 rounded-lg border-l px-2 py-1.5 text-[11px] font-semibold min-[375px]:gap-2 min-[375px]:px-2.5 min-[375px]:text-xs sm:rounded-none sm:px-3 sm:py-2 sm:text-sm ${
                    isActive
                      ? 'chip-active border-stea-primary bg-white/[0.055] text-white sm:bg-transparent'
                      : 'border-white/10 text-white/55'
                  }`}
                >
                  <span className="shrink-0" aria-hidden><FlagImage code={location.code} /></span>
                  <span className="min-w-0 truncate lg:overflow-visible">{location.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Globe + services stack */}
        <div className="relative z-0 mx-auto flex w-full max-w-[620px] flex-col items-center justify-center lg:max-w-none pointer-events-none select-none">
          <img
            src="/earth-optimized.webp"
            alt="STEA VPN global access globe"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            aria-hidden="true"
            className="pointer-events-none select-none earth-float relative h-auto max-w-none
              order-2 sm:order-1
              mt-4 sm:mt-0
              w-[150px]
              min-[340px]:w-[170px]
              min-[375px]:w-[190px]
              min-[390px]:w-[210px]
              min-[430px]:w-[240px]
              sm:w-[360px]
              md:w-[440px]
              lg:w-[520px]
              xl:w-[560px]
              object-contain
              opacity-[0.92]
              max-[430px]:opacity-[0.88]"
          />
          <img
            src="/social-optimized.webp"
            alt="Supported streaming and social services"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="pointer-events-none select-none order-1 sm:order-2 h-auto w-[min(80vw,280px)] object-contain sm:mt-3 sm:w-[520px] sm:max-w-[520px] lg:mt-4 lg:w-[560px] lg:max-w-[600px] xl:w-[600px] social-icons-img"
            style={{
              filter: 'brightness(1.15) contrast(1.05)',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes countryIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .country-word {
          animation: countryIn 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          background-image: linear-gradient(to right, #ff4d2e, #ff7a1a, #ffc247);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        @keyframes earthFloat {
          0%   { transform: translateY(0)    scale(1); }
          50%  { transform: translateY(-10px) scale(1.018); }
          100% { transform: translateY(0)    scale(1); }
        }
        .earth-float {
          animation: earthFloat 7s ease-in-out infinite;
        }

        /* Chip transitions — CSS only */
        .chip-transition {
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .chip-active {
          opacity: 1;
          transform: translateX(0);
        }
        .chip-transition:not(.chip-active) {
          opacity: 0.42;
          transform: translateX(-4px);
        }

        @media (prefers-reduced-motion: reduce) {
          .earth-float { animation: none; }
          .country-word { animation: none; }
          .chip-transition { transition: none; }
        }

        @media (max-width: 640px) {
          .social-icons-img {
            filter: brightness(1.18) contrast(1.06) !important;
          }
        }
      `}</style>
    </section>
  );
}
