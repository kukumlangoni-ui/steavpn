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
        <div className="hero-inner">
          <h1 className="hero-title">
            VPN <span className="accent">without borders.</span>
          </h1>

          <p className="hero-sub">
            Works in every country. On every device.
            One link, set up in minutes.
          </p>

          <div className="hero-ctas">
            <Link href="/pricing" className="btn-primary">Choose a plan</Link>
            <Link href="/guide" className="btn-secondary">How to set up</Link>
          </div>
        </div>
      </section>

      <section className="brands-section">
        <p className="brands-label">WORKS WITH</p>
        <div className="brands-image-wrap">
          <picture>
            <source srcSet="/hero/social.webp" type="image/webp" />
            <img
              src="/hero/social.png"
              alt="Supported services"
              width={1440}
              height={320}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
            />
          </picture>
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
        /* HERO — CENTERED */
        .hero {
          padding: 5rem 0 2rem;
          text-align: center;
        }

        .hero-inner {
          max-width: 780px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5.5vw, 4.75rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.02;
          margin: 0 0 1.5rem 0;
          text-transform: none;
        }

        .hero-sub {
          font-size: clamp(1.05rem, 1.4vw, 1.3rem);
          line-height: 1.55;
          color: var(--text-muted, #a1a1aa);
          margin: 0 0 2.5rem 0;
          max-width: 560px;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-ctas .btn-primary,
        .hero-ctas .btn-secondary {
          padding: 1rem 1.75rem;
          font-size: 1rem;
        }

        /* BRANDS — CENTERED */
        .brands-section {
          padding: 1rem 0 3rem 0;
          margin-top: 0;
          text-align: center;
        }

        .brands-label {
          font-size: 0.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--text-muted, #a1a1aa);
          margin: 0 0 1.5rem 0;
          font-weight: 600;
        }

        .brands-image-wrap {
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          opacity: 0.95;
        }

        /* Mobile */
        @media (max-width: 900px) {
          .hero {
            padding: 3rem 0 1.5rem;
          }
          .hero-title {
            font-size: clamp(2rem, 9vw, 3rem);
            letter-spacing: -0.03em;
          }
          .hero-sub {
            font-size: 1rem;
            margin-bottom: 2rem;
          }
          .hero-ctas {
            width: 100%;
            flex-direction: column;
            gap: 0.75rem;
          }
          .hero-ctas .btn-primary,
          .hero-ctas .btn-secondary {
            width: 100%;
            justify-content: center;
          }
          .brands-image-wrap {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
