import Image from "next/image";
import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Choose a plan",
    body: "Pick 1 month, 3 months, or 1 year. Pay ¥10, ¥28, or ¥100.",
  },
  {
    n: "02",
    title: "Pay via WeChat or bank",
    body: "Send payment through WeChat, Alipay, or the Tanzanian bank account shown on the pay page.",
  },
  {
    n: "03",
    title: "Receive your link and connect",
    body: "We send your private subscription link. Open the app on your device and paste it. You're connected.",
  },
];

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">
            VPN <span className="accent">without borders.</span>
          </h1>

          <p className="hero-sub">
            Works in every country. On every device. One link, set up in minutes.
          </p>
          <div className="hero-ctas">
            <Link href="/pricing" className="btn-primary">Choose a plan</Link>
            <Link href="/guide" className="btn-secondary">How to set up</Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="earth-wrap">
            <Image
              src="/hero/earth.png"
              alt="Global network"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </section>

      <section className="brands-section">
        <p className="brands-label">WORKS WITH</p>
        <div className="brands-image-wrap">
          <Image
            src="/hero/social.png"
            alt="Supported services"
            width={1440}
            height={320}
            priority
            style={{ maxWidth: "720px", width: "100%", height: "auto", objectFit: "contain" }}
          />
        </div>
      </section>

      <section style={{ padding: "4rem 0 5rem" }}>
        <h2
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
            marginBottom: "0.75rem",
          }}
        >
          How it works
        </h2>
        <p
          className="muted"
          style={{ textAlign: "center", fontSize: "1rem", marginBottom: "3rem" }}
        >
          Three simple steps to get connected
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {STEPS.map((s) => (
            <div key={s.n} className="card">
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--accent-1)",
                  marginBottom: "1rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                {s.title}
              </h3>
              <p className="muted" style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "3rem 0 5rem", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}
        >
          Ready to connect?
        </h2>
        <Link href="/pricing" className="btn-primary">Choose a plan</Link>
      </section>

      <style>{`
        /* HERO SECTION */
        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
          gap: 2rem;
          align-items: start;
          padding: 1.25rem 0 0;
          min-height: auto;
        }

        /* LEFT COLUMN */
        .hero-left {
          display: flex;
          flex-direction: column;
        }

        .hero-title {
          font-size: clamp(1.75rem, 3.4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.04;
          margin: 0 0 0.75rem 0;
          max-width: 500px;
          text-transform: none;
        }

        .hero-sub {
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          line-height: 1.45;
          color: var(--text-muted, #a1a1aa);
          margin: 0 0 1rem 0;
          max-width: 440px;
        }

        .hero-ctas {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 0;
        }

        .hero-ctas .btn-primary,
        .hero-ctas .btn-secondary {
          padding: 0.7rem 1.25rem;
          font-size: 0.9rem;
        }

        /* BRANDS — FULL WIDTH */
        .brands-section {
          padding: 0.25rem 0 2rem 0;
          margin-top: 0;
        }

        .brands-label {
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted, #a1a1aa);
          margin: 0 0 0.75rem 0;
          font-weight: 600;
        }

        .brands-image-wrap {
          max-width: 1000px;
          width: 100%;
          opacity: 0.95;
        }

        /* RIGHT COLUMN — EARTH */
        .hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }

        .earth-wrap {
          position: relative;
          width: 100%;
          max-width: 320px;
          aspect-ratio: 1 / 1;
          margin: 0 auto;
          margin-top: 4rem;
        }

        .earth-wrap::before {
          content: "";
          position: absolute;
          inset: 3%;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(245,158,11,0.25) 0%,
            rgba(245,158,11,0) 68%);
          pointer-events: none;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem 0 0.5rem;
          }
          .hero-title {
            font-size: clamp(1.75rem, 7vw, 2.5rem);
          }
          .hero-sub {
            max-width: 100%;
          }
          .earth-wrap {
            max-width: 220px;
            margin: 0.75rem auto 0;
          }
          .brands-section {
            padding: 0.25rem 0 1.5rem 0;
          }
          .brands-image-wrap {
            max-width: 100%;
          }
        }

        /* Motion safety */
        @media (prefers-reduced-motion: reduce) {
          .earth-wrap img { animation: none; }
        }
      `}</style>
    </div>
  );
}
