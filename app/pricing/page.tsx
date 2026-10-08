import PageShell from "@/components/PageShell";
import PlanCard from "@/components/PlanCard";
import { PLANS } from "@/lib/config";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <PageShell
      title="Choose Your Plan"
      subtitle="Pay once. Connect for the full period."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          padding: "1.5rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
        }}
      >
        <p className="muted" style={{ fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
          Pay after selecting a plan — we accept WeChat, Alipay, and bank transfer.
          <br />
          Manual payment · We send your link within 30 minutes.
        </p>
      </div>
    </PageShell>
  );
}
