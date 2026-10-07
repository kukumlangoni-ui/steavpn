'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Globe,
  Gauge,
  Infinity as InfinityIcon,
  Zap,
  Wifi,
  MapPin,
  Sparkles,
} from 'lucide-react';
import '@/app/hero.css';

const heroVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

/* ---------------- Small helpers ---------------- */

function useCountUp(target: number, durationMs = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return val;
}

/* ---------------- Hero slideshow ---------------- */

const SLIDE_INTERVAL_MS = 4500;
const CROSSFADE_S = 0.9;

const slides = [
  {
    src: '/images/hero/slide-1.jpg',
    alt: 'Secure remote workspace protected by STEA VPN',
    badgeLabel: 'PROTECTED',
    badgeAccent: 'connected',
    width: 1376,
    height: 768,
  },
  {
    src: '/images/hero/slide-2.jpg',
    alt: 'Global VPN network shield and secure access',
    badgeLabel: 'GLOBAL REGIONS',
    badgeAccent: 'primary',
    width: 1376,
    height: 768,
  },
  {
    src: '/images/hero/slide-3.jpg',
    alt: 'Mobile VPN protection on every device',
    badgeLabel: 'MULTI-DEVICE PLANS',
    badgeAccent: 'warning',
    width: 1376,
    height: 768,
  },
  {
    src: '/images/hero/slide-4.jpg',
    alt: 'Encrypted cloud connection and privacy shield',
    badgeLabel: 'AES-256',
    badgeAccent: 'secure',
    width: 1376,
    height: 768,
  },
  {
    src: '/images/hero/slide-5.jpg',
    alt: 'Verified digital identity and secure profile',
    badgeLabel: '4K READY',
    badgeAccent: 'primary',
    width: 1376,
    height: 768,
  },
];

function ImageSlideshow() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pausedRef.current) setI((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const goTo = (n: number) => setI(n);
  const active = slides[i];
  const badgeColor =
    active.badgeAccent === 'connected'
      ? 'text-stea-connected'
      : active.badgeAccent === 'secure'
        ? 'text-stea-secure'
        : active.badgeAccent === 'warning'
          ? 'text-stea-warning'
          : 'text-stea-primary';
  const badgeBgClass =
    active.badgeAccent === 'connected'
      ? 'bg-stea-connected/10 border-stea-connected/25'
      : active.badgeAccent === 'secure'
        ? 'bg-stea-secure/10 border-stea-secure/25'
        : active.badgeAccent === 'warning'
          ? 'bg-stea-warning/10 border-stea-warning/25'
          : 'bg-stea-primary/10 border-stea-primary/25';

  return (
    <div
      style={{ position: 'relative', width: '100%' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => window.setTimeout(() => setPaused(false), 1500)}
    >
      {/* Orange glow behind image */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-1.5rem -2rem',
          borderRadius: '3rem',
          background: 'rgba(232,138,30,0.10)',
          filter: 'blur(60px)',
          opacity: 0.8,
          transform: 'scale(1.1)',
          pointerEvents: 'none',
        }}
      />

      {/* Image frame */}
      <div
        className="hero-slideshow-frame"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          border: '1px solid var(--stea-border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          background: 'var(--stea-bg-secondary)',
        }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: CROSSFADE_S, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.375rem 0.75rem',
            }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
              className="crisp-image"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
              priority
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft top/bottom gradient */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(250,250,250,0.35) 0%, transparent 18%, transparent 75%, rgba(250,250,250,0.35) 100%)',
          }}
        />

        {/* Top-left status badge */}
        <motion.div
          key={`badge-${i}`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className={`hero-slide-badge ${badgeBgClass}`}
          style={{
            position: 'absolute',
            top: '0.75rem 1.25rem',
            left: '0.75rem 1.25rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem 0.5rem 0.875rem',
            borderRadius: '0.75rem',
            backdropFilter: 'blur(12px)',
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid var(--stea-border-subtle)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <span style={{ position: 'relative', display: 'flex', width: 10, height: 10, flexShrink: 0 }}>
            <span
              className={`animate-ping-dot ${badgeColor}`}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '9999px',
                opacity: 0.6,
              }}
            />
            <span
              className={`${badgeColor}`}
              style={{
                position: 'relative',
                width: 10,
                height: 10,
                borderRadius: '9999px',
                background: 'currentColor',
              }}
            />
          </span>
          <span
            className={`${badgeColor}`}
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            {active.badgeLabel}
          </span>
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div
        className="hero-slide-dots"
        style={{
          position: 'absolute',
          bottom: '-0.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--stea-border-subtle)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {slides.map((_, n) => (
          <button
            key={n}
            type="button"
            aria-label={`Go to slide ${n + 1}`}
            onClick={() => goTo(n)}
            style={{
              borderRadius: '9999px',
              transition: 'all 0.3s',
              width: n === i ? 28 : 10,
              height: 10,
              background: n === i ? 'var(--stea-primary)' : 'var(--stea-border)',
              cursor: 'pointer',
              border: 'none',
              padding: 0,
              boxShadow: n === i ? '0 0 0 3px rgba(232,138,30,0.12)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Rotating location word ---------------- */

const rotatingLocations = ['China', 'Dubai', 'Japan', 'Europe', 'Anywhere'];

function RotatingLocationWord() {
  return (
    <span className="hero-location-rotator" aria-label={rotatingLocations.join(', ')}>
      {rotatingLocations.map((location, index) => (
        <span
          key={location}
          className="hero-location-word stea-hero-location-gradient"
          style={{ animationDelay: `${index * 2.2}s` }}
          aria-hidden="true"
        >
          {location}
        </span>
      ))}
    </span>
  );
}

/* ---------------- Floating network nodes ---------------- */

function FloatingNodes() {
  const nodes = useMemo(() => {
    const arr: { left: number; top: number; size: number; delay: number; dur: number }[] = [];
    let seed = 1776;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let n = 0; n < 30; n++)
      arr.push({
        left: rand() * 100,
        top: rand() * 100,
        size: 2 + Math.floor(rand() * 4),
        delay: rand() * 4,
        dur: 6 + rand() * 6,
      });
    return arr;
  }, []);

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (dx * dx + dy * dy < 70) {
        lines.push({ x1: a.left, y1: a.top, x2: b.left, y2: b.top });
      }
    }
  }

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {lines.map((l, idx) => (
          <line
            key={idx}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(232,138,30,0.18)"
            strokeWidth={0.08}
            strokeDasharray="0.6 0.8"
          />
        ))}
      </svg>
      {nodes.map((n, idx) => (
        <motion.span
          key={idx}
          style={{
            position: 'absolute',
            left: `${n.left}%`,
            top: `${n.top}%`,
            width: n.size,
            height: n.size,
            borderRadius: '9999px',
            background: 'rgba(232,138,30,0.4)',
          }}
          animate={{
            x: [0, -14, 6, 10, -4, 0],
            y: [0, 10, -8, 4, 12, 0],
            opacity: [0.28, 0.55, 0.35, 0.6, 0.3, 0.28],
          }}
          transition={{
            duration: n.dur,
            delay: n.delay,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- Main hero component ---------------- */

export default function HomeHero() {
  const [startCount, setStartCount] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setStartCount(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const serversCount = useCountUp(12, 1400, startCount);

  const stats = [
    {
      icon: Globe,
      value: '12+',
      countTo: 12,
      suffix: '',
      label: 'Global servers',
      accent: 'stea-connected',
    },
    {
      icon: InfinityIcon,
      value: '∞',
      countTo: 0,
      suffix: '',
      label: 'Devices',
      accent: 'stea-primary',
    },
    {
      icon: Zap,
      value: '∞',
      countTo: 0,
      suffix: '',
      label: 'Speed',
      accent: 'stea-secure',
    },
  ];

  return (
    <motion.section
      id="home"
      variants={heroVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="stea-vpn-dark-hero"
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        minHeight: 'calc(100svh - 64px)',
      }}
    >
      {/* Animated gradient mesh background */}
      <div aria-hidden className="stea-gradient-mesh" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(900px 560px at 12% 8%, rgba(232,138,30,0.10) 0%, transparent 55%), radial-gradient(700px 520px at 95% 100%, rgba(59,130,246,0.08) 0%, transparent 55%), radial-gradient(600px 420px at 55% 40%, rgba(99,102,241,0.05) 0%, transparent 60%)',
        }}
      />

      <FloatingNodes />

      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '1.25rem 2.5rem',
          paddingBottom: '1.5rem 2rem',
          paddingLeft: '1rem 1.5rem 2rem',
          paddingRight: '1rem 1.5rem 2rem',
          padding: '1rem 1rem 1.5rem 1rem',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '0.75rem 1rem',
              alignItems: 'center',
            }}
            className="hero-grid"
          >
            {/* LEFT: Text / stats / CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative', zIndex: 10 }}
            >
              {/* Top "PROTECTED" pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="glass-card"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid var(--stea-border-subtle)',
                  marginBottom: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ position: 'relative', display: 'flex', width: 8, height: 8, flexShrink: 0 }}>
                  <span
                    className="animate-ping-dot text-stea-connected"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '9999px',
                      background: 'var(--stea-connected)',
                      opacity: 0.7,
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      width: 8,
                      height: 8,
                      borderRadius: '9999px',
                      background: 'var(--stea-connected)',
                    }}
                  />
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--stea-connected)',
                    lineHeight: 1,
                  }}
                >
                  Protected
                </span>
                <span style={{ width: 1, height: 12, background: 'var(--stea-border-subtle)', margin: '0 0.125rem' }} />
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--stea-text-secondary)',
                    lineHeight: 1,
                  }}
                >
                  AES-256
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontSize: 'clamp(42px, 8vw, 96px)',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                  color: 'var(--stea-text-primary)',
                }}
              >
                The VPN built for
                <br />
                <RotatingLocationWord />
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                style={{
                  fontSize: 'clamp(14px, 2vw, 17px)',
                  color: 'var(--stea-text-secondary)',
                  lineHeight: 1.6,
                  maxWidth: 420,
                  marginBottom: '1.25rem',
                }}
              >
                Fast. Private. Secure. Works where other VPNs may fail.
              </motion.p>

              {/* 3 Stat cards */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.35 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem 0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                {stats.map((s) => {
                  const Icon = s.icon;
                  const display =
                    s.countTo > 0 && startCount ? (
                      <>
                        {serversCount}
                        {s.value === '12+' ? '+' : s.suffix}
                      </>
                    ) : (
                      s.value
                    );
                  return (
                    <div
                      key={s.label}
                      className="glass-card"
                      style={{
                        borderRadius: '0.75rem 1rem',
                        padding: '0.625rem 1rem',
                        border: '1px solid var(--stea-border-subtle)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s',
                        minWidth: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                      }}
                    >
                      <div
                        className={`bg-${s.accent}/10 text-${s.accent}`}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '0.75rem',
                          background: `var(--${s.accent === 'stea-connected' ? 'stea-connected' : s.accent === 'stea-secure' ? 'stea-secure' : s.accent === 'stea-warning' ? 'stea-warning' : 'stea-primary'}, 0.1)`,
                          color: `var(--${s.accent === 'stea-connected' ? 'stea-connected' : s.accent === 'stea-secure' ? 'stea-secure' : s.accent === 'stea-warning' ? 'stea-warning' : 'stea-primary'})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '0.625rem',
                        }}
                      >
                        <Icon size={16} strokeWidth={2} />
                      </div>
                      <div
                        style={{
                          fontSize: 'clamp(15px, 2.5vw, 22px)',
                          fontWeight: 800,
                          letterSpacing: '-0.02em',
                          color: 'var(--stea-text-primary)',
                          lineHeight: 1,
                          marginBottom: '0.25rem',
                          fontVariantNumeric: 'tabular-nums',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {display}
                      </div>
                      <div
                        style={{
                          fontSize: 'clamp(10px, 1.5vw, 12px)',
                          color: 'var(--stea-text-secondary)',
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <Link
                  href="/pricing"
                  className="btn-stea stea-primary-gradient hero-btn-primary"
                  style={{
                    minHeight: 44,
                    height: 56,
                    padding: '0 2rem',
                    borderRadius: 16,
                    color: 'white',
                    fontSize: 'clamp(13px, 1.5vw, 15px)',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                >
                  Get started
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/pricing"
                  className="btn-stea hero-btn-secondary"
                  style={{
                    minHeight: 44,
                    height: 56,
                    padding: '0 1.75rem',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.055)',
                    color: 'white',
                    fontSize: 'clamp(13px, 1.5vw, 15px)',
                    fontWeight: 600,
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  See pricing
                </Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: 'clamp(10px, 1.5vw, 13px)',
                }}
              >
                <span className="hero-trust-chip" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--stea-border-subtle)',
                  color: 'var(--stea-text-secondary)',
                  fontWeight: 500,
                }}>
                  <Sparkles size={12} style={{ color: 'var(--stea-primary)', flexShrink: 0 }} />
                  Trusted by users worldwide
                </span>
                <span style={{ color: 'rgba(138,138,154,0.8)', display: 'none' }} className="trust-sep">·</span>
                <span className="hero-trust-chip" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--stea-border-subtle)',
                  color: 'var(--stea-text-secondary)',
                  fontWeight: 500,
                }}>
                  <Gauge size={12} style={{ color: 'var(--stea-connected)', flexShrink: 0 }} />
                  99.9% uptime
                </span>
                <span style={{ color: 'rgba(138,138,154,0.8)', display: 'none' }} className="trust-sep">·</span>
                <span className="hero-trust-chip" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--stea-border-subtle)',
                  color: 'var(--stea-text-secondary)',
                  fontWeight: 500,
                }}>
                  <Wifi size={12} style={{ color: 'var(--stea-secure)', flexShrink: 0 }} />
                  No activity logs
                </span>
              </motion.div>
            </motion.div>

            {/* RIGHT: Slideshow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ position: 'relative', zIndex: 10, margin: '0.25rem 0' }}
            >
              <div style={{ position: 'relative', width: '100%' }}>
                <ImageSlideshow />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating ConnectionStatus glass card — bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 40, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{
          duration: 0.6,
          delay: 1.0,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="hero-connection-card"
        style={{
          display: 'none',
          position: 'absolute',
          bottom: '3rem 4rem',
          right: '1rem 1.5rem 2.5rem',
          zIndex: 20,
          width: 290,
        }}
      >
        <div
          className="glass-card"
          style={{
            borderRadius: '1rem',
            padding: '0.875rem',
            border: '1px solid var(--stea-border-subtle)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ position: 'relative', display: 'flex', width: 12, height: 12, flexShrink: 0 }}>
              <span
                className="animate-ping-slow"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9999px',
                  background: 'var(--stea-connected)',
                  opacity: 0.6,
                }}
              />
              <span
                style={{
                  position: 'relative',
                  width: 12,
                  height: 12,
                  borderRadius: '9999px',
                  background: 'var(--stea-connected)',
                }}
              />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.125rem' }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: 'var(--stea-connected)',
                    lineHeight: 1,
                  }}
                >
                  Connected
                </span>
                <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden>
                  🇸🇬
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '11.5px', color: 'var(--stea-text-secondary)' }}>
                <MapPin size={11} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
                  Singapore Central
                </span>
                <span style={{ margin: '0 0.125rem', width: 1, height: 10, background: 'var(--stea-border)', display: 'inline-block' }} />
                <span style={{ fontWeight: 700, color: 'var(--stea-connected)' }}>No logs</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--stea-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--stea-text-primary)' }}>AES-256</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--stea-text-primary)' }}>Unlimited</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="hero-bottom-fade"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3.5rem 4rem',
          pointerEvents: 'none',
        }}
      />

      <style jsx>{`
        @media (min-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 3rem !important;
          }
          .trust-sep { display: inline !important; }
        }
        @media (min-width: 768px) {
          :global(.stea-vpn-dark-hero) .hero-connection-card {
            display: block !important;
          }
        }
      `}</style>
    </motion.section>
  );
}
