import Image from "next/image";
import Link from "next/link";
import HeroVisual from "@/components/HeroVisual";

const BRANDS = [
  { name: "Netflix",      src: "/brands/netflix.svg" },
  { name: "Disney+",      src: "/brands/disneyplus.svg" },
  { name: "Hulu",         src: "/brands/hulu.svg" },
  { name: "Max",          src: "/brands/max.svg" },
  { name: "Prime Video",  src: "/brands/primevideo.svg" },
  { name: "TikTok",       src: "/brands/tiktok.svg" },
  { name: "ChatGPT",      src: "/brands/chatgpt.svg" },
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
      {/* HERO */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
          gap: "3rem",
          alignItems: "center",
          padding: "5rem 0 4rem",
        }}
        className="hero-grid"
      >
        {/* LEFT: copy */}
        <div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "1.25rem",
            }}
          >
            Your <span className="accent">private VPN</span> — set up in minutes
          </h1>
          <p
            className="muted"
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
              maxWidth: 520,
            }}
          >
            Buy a plan, pay via WeChat or bank, receive your link and
            connect on any device.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "3rem" }}>
            <Link href="/pricing" className="btn-primary">
              Choose a plan
            </Link>
            <Link href="/guide" className="btn-secondary">
              How to set up
            </Link>
          </div>

          {/* Works with row */}
          <div>
            <p
              className="muted"
              style={{
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.9rem",
              }}
            >
              Works with
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem 1.75rem",
                alignItems: "center",
              }}
            >
              {BRANDS.map((b) => (
                <div
                  key={b.name}
                  className="brand-logo"
                  style={{
                    height: 22,
                    width: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title={b.name}
                >
                  <Image
                    src={b.src}
                    alt={b.name}
                    width={70}
                    height={22}
                    style={{ height: 22, width: "auto", filter: "brightness(0) invert(1)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: rotating card stack */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1 / 1",
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
          }}
          className="hero-visual"
        >
          <HeroVisual />
        </div>
      </section>

      {/* HOW IT WORKS */}
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
          style={{
            textAlign: "center",
            fontSize: "1rem",
            marginBottom: "3rem",
          }}
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
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {s.title}
              </h3>
              <p
                className="muted"
                style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}
              >
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section
        style={{
          padding: "3rem 0 5rem",
          textAlign: "center",
        }}
      >
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
        <Link href="/pricing" className="btn-primary">
          Choose a plan
        </Link>
      </section>

      {/* Responsive: stack hero columns on mobile */}
      <style>{`
        .brand-logo {
          opacity: 0.55;
          transition: opacity 0.2s;
        }
        .brand-logo:hover {
          opacity: 1;
        }
        @media (max-width: 820px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding-top: 3rem !important;
          }
          .hero-visual {
            max-width: 360px !important;
          }
        }
      `}</style>
    </div>
  );
}
