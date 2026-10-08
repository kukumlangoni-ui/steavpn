"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import PlanCard from "@/components/PlanCard";
import { PLANS, CONTACT, BANK, SITE } from "@/lib/config";

interface PaymentSettings {
  wechat_id: string;
  whatsapp: string;
  email: string;
  alipay_id: string | null;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  wechat_qr_url: string | null;
  alipay_qr_url: string | null;
}

export default function PricingPage() {
  const [payment, setPayment] = useState<PaymentSettings | null>(null);

  useEffect(() => {
    fetch(`${SITE.apiBase}/api/payment-settings`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setPayment(d.settings))
      .catch(() => {});
  }, []);

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
          marginBottom: "3rem",
        }}
      >
        <p className="muted" style={{ fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
          Payment is manual — we send your link after confirming receipt.
          <br />
          Questions? Add us on WeChat: <span style={{ color: "var(--text)" }}>{CONTACT.wechat.id}</span>
        </p>
      </div>

      {/* ===== How to pay section ===== */}
      <section
        style={{
          padding: "2.5rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
        }}
      >
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
          How to pay
        </h2>
        <p className="muted" style={{ margin: "0 0 2rem" }}>
          After paying, screenshot your confirmation and send it to us on WeChat or WhatsApp.
          We&apos;ll reply with your subscription link within 30 minutes.
        </p>

        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {/* WeChat */}
          <div className="pay-card">
            <h3>WeChat Pay (recommended)</h3>
            {payment?.wechat_qr_url ? (
              <img
                src={`${SITE.apiBase}${payment.wechat_qr_url}`}
                alt="WeChat Pay QR"
                width={220}
                height={220}
                loading="eager"
                fetchPriority="high"
                style={{
                  display: "block",
                  width: 220,
                  height: 220,
                  maxWidth: "100%",
                  background: "#fff",
                  borderRadius: 12,
                  margin: "1rem auto",
                }}
              />
            ) : (
              <div
                style={{
                  width: 220,
                  height: 220,
                  maxWidth: "100%",
                  background: "var(--surface-2)",
                  borderRadius: 12,
                  margin: "1rem auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                Loading QR…
              </div>
            )}
            <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0" }}>
              Or add us directly:{" "}
              <strong>{payment?.wechat_id || CONTACT.wechat.id}</strong>
            </p>
          </div>

          {/* Bank Transfer */}
          <div className="pay-card">
            <h3>Bank Transfer (Tanzania)</h3>
            <dl style={{ marginTop: "1rem" }}>
              <dt>Bank</dt>
              <dd>{payment?.bank_name || BANK.bankName}</dd>
              <dt>Account name</dt>
              <dd>{payment?.bank_account_name || BANK.accountName}</dd>
              <dt>Account number</dt>
              <dd style={{ fontFamily: "monospace" }}>
                {payment?.bank_account_number || BANK.accountNumber}
              </dd>
            </dl>
          </div>

          {/* Alipay */}
          {payment?.alipay_qr_url ? (
            <div className="pay-card">
              <h3>Alipay</h3>
              <img
                src={`${SITE.apiBase}${payment.alipay_qr_url}`}
                alt="Alipay QR"
                width={220}
                height={220}
                loading="eager"
                fetchPriority="high"
                style={{
                  display: "block",
                  width: 220,
                  height: 220,
                  maxWidth: "100%",
                  background: "#fff",
                  borderRadius: 12,
                  margin: "1rem auto",
                }}
              />
              {payment.alipay_id && (
                <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0" }}>
                  Alipay ID: <strong>{payment.alipay_id}</strong>
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Send screenshot CTAs */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href={CONTACT.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Send screenshot on WhatsApp
          </a>
          <a
            href={CONTACT.wechat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            Send screenshot on WeChat
          </a>
        </div>
      </section>

      <style jsx>{`
        .pay-card {
          padding: 1.5rem;
          background: var(--surface-2, #171717);
          border: 1px solid var(--border, #1f1f1f);
          border-radius: 12px;
          text-align: center;
        }
        .pay-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 0.75rem;
        }
        .pay-card dl {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.5rem 1rem;
          font-size: 0.9rem;
          text-align: left;
          margin: 0;
        }
        .pay-card dt {
          color: var(--text-muted, #a1a1aa);
        }
        .pay-card dd {
          margin: 0;
          font-weight: 600;
          word-break: break-all;
        }
      `}</style>
    </PageShell>
  );
}
