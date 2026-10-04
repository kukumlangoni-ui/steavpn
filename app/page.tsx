import Link from "next/link";
import { SITE } from "@/lib/config";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section style={{ padding: "6rem 0 5rem" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 760 }}>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
            }}
          >
            Your <span className="gradient-text">private VPN</span> — set up in minutes
          </h1>
          <p
            className="muted"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Buy a plan, pay via WeChat or bank, receive your link and connect
            on any device.
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.875rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/pricing" className="btn-primary">
              Choose a plan
            </Link>
            <Link href="/guide" className="btn-secondary">
              How to set up
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
              }}
            >
              How it works
            </h2>
            <p className="muted" style={{ fontSize: "1.05rem" }}>
              Three simple steps to get connected
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
              maxWidth: 960,
              margin: "0 auto",
            }}
          >
            {[
              {
                step: "01",
                title: "Choose a plan",
                desc: "Pick the plan that fits your needs — 1 month, 3 months, or 1 year.",
              },
              {
                step: "02",
                title: "Pay via WeChat, Alipay, or bank",
                desc: "Send payment through your preferred method and take a screenshot.",
              },
              {
                step: "03",
                title: "Receive your private link and connect",
                desc: "We send your link within 30 minutes. Paste it in your app and connect.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                  className="gradient-text"
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="muted"
                  style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <div
            style={{
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              padding: "2rem 0",
              textAlign: "center",
            }}
          >
            <p
              className="muted"
              style={{
                fontSize: "0.95rem",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Works on{" "}
              <span style={{ color: "var(--text)" }}>iPhone</span> ·{" "}
              <span style={{ color: "var(--text)" }}>Android</span> ·{" "}
              <span style={{ color: "var(--text)" }}>Windows</span> ·{" "}
              <span style={{ color: "var(--text)" }}>Mac</span> ·{" "}
              <span style={{ color: "var(--text)" }}>Linux</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 0 6rem" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 600 }}>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            Ready to connect?
          </h2>
          <p
            className="muted"
            style={{ fontSize: "1.05rem", marginBottom: "2rem", lineHeight: 1.6 }}
          >
            {SITE.tagline}. Plans start at just ¥10.
          </p>
          <Link href="/pricing" className="btn-primary">
            Choose a plan
          </Link>
        </div>
      </section>
    </>
  );
}
