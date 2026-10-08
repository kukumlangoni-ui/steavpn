import { notFound } from "next/navigation";
import PayPage from "../_client/pay-client";

const VALID_PLANS = ["1month", "3months", "1year"] as const;

export function generateStaticParams() {
  return VALID_PLANS.map((plan) => ({ plan }));
}

export const metadata = { title: "Complete your payment" };

export default function PayPlanPage({ params }: { params: { plan: string } }) {
  if (!VALID_PLANS.includes(params.plan as any)) {
    notFound();
  }
  return <PayPage planId={params.plan as (typeof VALID_PLANS)[number]} />;
}
