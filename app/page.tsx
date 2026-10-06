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
            width={1600}
            height={300}
            priority
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
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
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 4rem;
          align-items: center;
          padding: 5rem 0 3rem;
          min-height: 600px;
        }

        /* LEFT COLUMN */
        .hero-left {
          display: flex;
          flex-direction: column;
        }

        .hero-title {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.02;
          margin: 0 0 1.5rem 0;
          max-width: 620px;
          text-transform: none;
        }

        .hero-sub {
          font-size: clamp(1.05rem, 1.5vw, 1.35rem);
          line-height: 1.55;
          color: var(--text-muted, #a1a1aa);
          margin: 0 0 2.5rem 0;
          max-width: 480px;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 0;
        }

        .hero-ctas .btn-primary,
        .hero-ctas .btn-secondary {
          padding: 1rem 1.75rem;
          font-size: 1rem;
        }

        /* BRANDS — FULL WIDTH */
        .brands-section {
          padding: 0 0 4rem 0;
          margin-top: -2rem;
        }

        .brands-label {
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-muted, #a1a1aa);
          margin: 0 0 1.25rem 0;
          font-weight: 600;
        }

        .brands-image-wrap {
          max-width: 100%;
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
          max-width: 100%;
          aspect-ratio: 1 / 1;
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
            gap: 3rem;
            padding: 4rem 0 2rem;
            min-height: auto;
          }
          .hero-title {
            font-size: clamp(2.25rem, 9vw, 3.5rem);
            letter-spacing: -0.035em;
            max-width: 100%;
          }
          .hero-sub {
            max-width: 100%;
          }
          .earth-wrap {
            max-width: 340px;
            margin: 1rem auto 0;
          }
          .brands-section {
            margin-top: 0;
            padding: 0 0 3rem 0;
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
