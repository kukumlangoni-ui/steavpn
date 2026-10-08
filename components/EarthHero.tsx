'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const countries = [
  { flag: '🇨🇳', name: 'China' },
  { flag: '🇦🇪', name: 'Dubai' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇪🇺', name: 'Europe' },
  { flag: '🌍', name: 'Anywhere' },
];

export default function EarthHero() {
  const [activeCountry, setActiveCountry] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const active = countries[activeCountry % countries.length] ?? countries[0];
  const longActiveName = (active?.name?.length ?? 0) >= 8;

  useEffect(() => {
    setHasHydrated(true);
    setActiveCountry(0);

    const rmQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(rmQuery.matches);
    if (rmQuery.matches) return;

    let interval: number | undefined;
    const firstTransition = window.setTimeout(() => {
      setActiveCountry((index) => (index + 1) % countries.length);
      interval = window.setInterval(() => {
        setActiveCountry((index) => (index + 1) % countries.length);
      }, 3000);
    }, 1500);

    return () => {
      window.clearTimeout(firstTransition);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  // Animated globe transition props respecting prefers-reduced-motion.
  const earthFloat = reducedMotion
    ? {}
    : {
        y: [0, -10, 0],
        scale: [1, 1.018, 1],
      };

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

      {/* Globe gradient mask: fades decorative globe AWAY from hero copy
          so it visually bleeds into the right/bottom, never INTO text. */}
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
        {/* Copy + primary CTA. Always the top layer. */}
        <div className="relative z-20 mx-auto w-full max-w-[620px] text-center lg:mx-0 lg:text-left">
          <h1 className="font-extrabold tracking-normal text-white">
            <span className="block whitespace-nowrap text-[clamp(24px,7vw,36px)] leading-none sm:text-7xl sm:leading-[0.92] lg:text-[82px] xl:text-[88px]">
              <span className="sm:block">The VPN</span>{' '}
              <span className="sm:block">built for</span>
            </span>
            <span className="relative mt-1 inline-block w-full max-w-full overflow-visible align-top sm:mt-4 md:mt-5 md:min-w-full md:justify-start h-[40px] sm:h-[56px] md:h-[72px] md:w-[560px] lg:h-[88px] lg:w-[660px] xl:h-[96px] xl:w-[720px]">
              <motion.span
                key={active.name}
                initial={hasHydrated && !reducedMotion ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className={`inline-flex w-full min-w-0 items-center justify-center gap-2 overflow-visible whitespace-nowrap bg-gradient-to-r from-[#ff4d2e] via-[#ff7a1a] to-[#ffc247] bg-clip-text text-[clamp(28px,8vw,46px)] font-extrabold leading-none tracking-normal text-transparent sm:text-[48px] md:w-max md:min-w-full md:justify-start md:gap-3 md:text-[60px] lg:text-[74px] xl:text-[82px] 2xl:text-[88px] ${longActiveName ? 'text-[clamp(25px,7vw,42px)] sm:text-[44px] md:text-[56px] lg:text-[68px] xl:text-[76px] 2xl:text-[82px]' : ''}`}
              >
                <span className="shrink-0 text-[0.72em] text-white md:text-[0.62em]" aria-hidden>
                  {active.flag}
                </span>
                <span className="shrink-0">{active.name}</span>
              </motion.span>
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
                <motion.div
                  key={location.name}
                  animate={{
                    opacity: isActive ? 1 : 0.42,
                    x: isActive ? 0 : -4,
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.35 }}
                  className={`flex min-w-0 items-center gap-1.5 rounded-lg border-l px-2 py-1.5 text-[11px] font-semibold min-[375px]:gap-2 min-[375px]:px-2.5 min-[375px]:text-xs sm:rounded-none sm:px-3 sm:py-2 sm:text-sm ${
                    isActive
                      ? 'border-stea-primary bg-white/[0.055] text-white sm:bg-transparent'
                      : 'border-white/10 text-white/55'
                  }`}
                >
                  <span className="shrink-0" aria-hidden>{location.flag}</span>
                  <span className="min-w-0 truncate lg:overflow-visible">{location.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Globe + services stack. Decorative → pointer events disabled. */}
        <div className="relative z-0 mx-auto flex w-full max-w-[620px] flex-col items-center justify-center lg:max-w-none pointer-events-none select-none">
          <motion.img
            src="/earth-optimized.webp"
            alt="STEA VPN global access globe"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            aria-hidden="true"
            className="pointer-events-none select-none relative h-auto max-w-none
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
            animate={earthFloat}
            transition={{
              duration: 7,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />
          <img
            src="/social-optimized.webp"
            alt="Supported social and streaming services"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            aria-hidden="true"
            className="pointer-events-none select-none order-1 sm:order-2 h-auto w-[min(80vw,280px)] object-contain sm:mt-3 sm:w-[520px] sm:max-w-[520px] lg:mt-4 lg:w-[560px] lg:max-w-[600px] xl:w-[600px]"
          />
        </div>
      </div>
    </section>
  );
}
