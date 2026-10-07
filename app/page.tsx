import Link from "next/link";
import HomeHero from "@/components/HomeHero";

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
    <>
      <HomeHero />

      <div className="container">
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
      </div>
    </>
  );
}
