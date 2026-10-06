'use client';
import Image from 'next/image';

export default function HeroVisual() {
  return (
    <div className="hero-visual-stack">
      <div className="hero-visual-face hero-visual-face-1">
        <Image
          src="/hero/social.png"
          alt="Streaming apps"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <div className="hero-visual-face hero-visual-face-2">
        <Image
          src="/hero/earth.png"
          alt="Global network"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <div className="hero-visual-face hero-visual-face-3">
        <Image
          src="/hero/social.png"
          alt="Streaming apps"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="hero-visual-face hero-visual-face-4">
        <Image
          src="/hero/earth.png"
          alt="Global network"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      <style>{`
        .hero-visual-stack {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          perspective: 1200px;
          animation: rot-spin 24s linear infinite;
        }
        .hero-visual-face {
          position: absolute;
          inset: 15%;
          border-radius: 20px;
          overflow: hidden;
          background: radial-gradient(circle at 30% 30%, #1a1a1a 0%, #0a0a0a 100%);
          border: 1px solid rgba(245, 158, 11, 0.15);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
                      inset 0 0 40px rgba(245, 158, 11, 0.05);
          padding: 1rem;
        }
        .hero-visual-face-1 { transform: rotateY(0deg) translateZ(160px); }
        .hero-visual-face-2 { transform: rotateY(90deg) translateZ(160px); }
        .hero-visual-face-3 { transform: rotateY(180deg) translateZ(160px); }
        .hero-visual-face-4 { transform: rotateY(270deg) translateZ(160px); }

        @keyframes rot-spin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-visual-stack { animation: none; }
        }
      `}</style>
    </div>
  );
}
