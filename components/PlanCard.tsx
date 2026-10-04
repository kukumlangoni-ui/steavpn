import Link from "next/link";
import { Plan, formatCNY, formatTZS } from "@/lib/config";

export default function PlanCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect?: () => void;
}) {
  const borderStyle = plan.popular
    ? { borderColor: "var(--accent-1)", boxShadow: "0 0 0 1px var(--accent-1)" }
    : {};

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        ...borderStyle,
      }}
    >
      {plan.popular && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span className="badge-popular">Most Popular</span>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem" }}>
          {plan.name}
        </div>
        <div className="muted" style={{ fontSize: "0.9rem" }}>
          {plan.duration}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {formatCNY(plan.cny)}
        </div>
        <div className="muted" style={{ fontSize: "0.95rem", marginTop: "0.375rem" }}>
          {formatTZS(plan.tzs)}
          <span style={{ fontSize: "0.85rem" }}> / plan</span>
        </div>
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "0 0 1.5rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          flex: 1,
        }}
      >
        {plan.perks.map((perk, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              fontSize: "0.92rem",
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                color: "var(--accent-1)",
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              ✓
            </span>
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/pay?plan=${plan.id}`}
        className={plan.popular ? "btn-primary" : "btn-secondary"}
        onClick={onSelect}
        style={{ width: "100%" }}
      >
        Choose this plan
      </Link>
    </div>
  );
}
