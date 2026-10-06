import Image from "next/image";
import Link from "next/link";

const BRANDS = [
  { name: "Netflix",     src: "/brands/netflix.svg" },
  { name: "Disney+",     src: "/brands/disneyplus.svg" },
  { name: "Hulu",        src: "/brands/hulu.svg" },
  { name: "Max",         src: "/brands/max.svg" },
  { name: "Prime Video", src: "/brands/primevideo.svg" },
  { name: "TikTok",      src: "/brands/tiktok.svg" },
  { name: "ChatGPT",     src: "/brands/chatgpt.svg" },
];

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
            Your <span className="accent">private VPN</span> — set up in minutes
          </h1>
          <p className="hero-sub">
            Buy a plan, pay via WeChat or bank, receive your link and connect on any device.
          </p>
          <div className="hero-ctas">
            <Link href="/pricing" className="btn-primary">Choose a plan</Link>
            <Link href="/guide" className="btn-secondary">How to set up</Link>
          </div>

          <div className="brands">
            <p className="brands-label">WORKS WITH</p>
            <div className="brands-row">
              {BRANDS.map((b) => (
                <div key={b.name} className="brand-item" title={b.name}>
                  <Image
                    src={b.src}
                    alt={b.name}
                    width={90}
                    height={28}
                    style={{ height: 28, width: "auto" }}
                  />
                </div>
              ))}
            </div>
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
        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: 3rem;
          align-items: center;
          padding: 5rem 0 4rem;
        }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin: 0 0 1.25rem 0;
        }
        .hero-sub {
          font-size: 1.1rem;
          line-height: 1.6;
          margin: 0 0 2rem 0;
          max-width: 520px;
          color: var(--text-muted, #a1a1aa);
        }
        .hero-ctas {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        .brands-label {
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted, #a1a1aa);
          margin: 0 0 1rem 0;
        }
        .brands-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem 2rem;
          align-items: center;
        }
        .brand-item {
          display: flex;
          align-items: center;
          opacity: 0.85;
          transition: opacity 0.2s;
        }
        .brand-item:hover {
          opacity: 1;
        }
        .hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .earth-wrap {
          position: relative;
          width: 100%;
          max-width: 480px;
          aspect-ratio: 1 / 1;
        }
        .earth-wrap::before {
          content: "";
          position: absolute;
          inset: 5%;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(245,158,11,0.18) 0%,
            rgba(245,158,11,0) 70%);
          pointer-events: none;
        }
        .earth-wrap img {
          animation: earth-spin 60s linear infinite;
        }
        @keyframes earth-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .earth-wrap img { animation: none; }
        }
        @media (max-width: 820px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 3rem 0 2rem;
          }
          .earth-wrap {
            max-width: 320px;
            margin: 2rem auto 0;
          }
        }
      `}</style>
    </div>
  );
}
