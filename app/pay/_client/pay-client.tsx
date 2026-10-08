"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import {
  getPlan,
  formatCNY,
  formatTZS,
  SITE,
  CONTACT,
  BANK,
} from "@/lib/config";

type PaymentSettings = {
  wechat_id: string;
  whatsapp: string;
  email: string;
  alipay_id: string | null;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  wechat_qr_url: string | null;
  alipay_qr_url: string | null;
};

function QrImage({
  src,
  alt,
  fallbackText,
}: {
  src: string | null;
  alt: string;
  fallbackText: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        style={{
          width: 220,
          height: 220,
          maxWidth: "100%",
          background: "var(--surface-2)",
          borderRadius: 12,
          border: "1px dashed var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <p className="muted" style={{ fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>
          {fallbackText}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      fetchPriority="high"
      width={220}
      height={220}
      onError={() => setError(true)}
      style={{
        display: "block",
        width: 220,
        height: 220,
        maxWidth: "100%",
        borderRadius: 12,
        background: "#fff",
        objectFit: "contain",
        margin: "0 auto",
      }}
    />
  );
}

interface Props {
  planId: "1month" | "3months" | "1year";
}

export default function PayPage({ planId }: Props) {
  const plan = getPlan(planId)!;
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [qrLoaded, setQrLoaded] = useState(false);

  // Fetch payment settings with 8s timeout
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(`${SITE.apiBase}/api/payment-settings?_t=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {
        // Silent fail — static fallbacks from CONTACT/BANK are always shown
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setQrLoaded(true);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Use API values if available, otherwise fall back to static config
  const wechatId = settings?.wechat_id || CONTACT.wechat.id;
  const alipayId = settings?.alipay_id || "";
  const whatsapp = settings?.whatsapp || CONTACT.whatsapp.id;
  const email = settings?.email || CONTACT.email;

  const qrVersion = new Date().toISOString().slice(0, 10);
  const wechatQrUrl = settings?.wechat_qr_url
    ? `${SITE.apiBase}${settings.wechat_qr_url}?v=${qrVersion}`
    : null;
  const alipayQrUrl = settings?.alipay_qr_url
    ? `${SITE.apiBase}${settings.alipay_qr_url}?v=${qrVersion}`
    : null;

  const bankName = settings?.bank_name || BANK.bankName;
  const bankAccountName = settings?.bank_account_name || BANK.accountName;
  const bankAccountNumber = settings?.bank_account_number || BANK.accountNumber;

  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[+\s-]/g, "")}`;

  return (
    <div className="container" style={{ padding: "3rem 1.25rem 5rem", maxWidth: 1000 }}>
      {/* Back link */}
      <Link
        href="/pricing/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "var(--text-muted)",
          fontSize: "0.9rem",
          marginBottom: "1.5rem",
          textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--accent-1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        ← Back to pricing
      </Link>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          Complete your payment
        </h1>
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            padding: "1.25rem 1.5rem",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>{plan.name} plan</div>
            <div className="muted" style={{ fontSize: "0.9rem" }}>
              {plan.duration} · Unlimited bandwidth
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {formatCNY(plan.cny)}
            </div>
            <div className="muted" style={{ fontSize: "0.9rem" }}>{formatTZS(plan.tzs)}</div>
          </div>
        </div>
      </div>

      {/* Three payment methods — side by side */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* WeChat Pay */}
        <div
          className="card"
          style={{
            padding: "2rem 1.5rem",
            textAlign: "center",
            borderColor: "rgba(245, 158, 11, 0.3)",
            background: "linear-gradient(180deg, rgba(245, 158, 11, 0.05), var(--surface))",
          }}
        >
          <span className="badge-popular" style={{ marginBottom: "0.75rem" }}>
            Recommended
          </span>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 1.25rem" }}>
            WeChat Pay
          </h2>
          <QrImage
            src={wechatQrUrl}
            alt="WeChat Pay QR code"
            fallbackText="Scan with WeChat"
          />
          <p style={{ fontSize: "0.95rem", margin: "1rem 0 0.5rem" }}>
            Scan with WeChat to pay
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.65rem 0.9rem",
              background: "var(--surface-2)",
              borderRadius: 8,
              border: "1px solid var(--border)",
              marginTop: "0.5rem",
            }}
          >
            <code style={{ fontSize: "0.9rem", fontWeight: 600, flex: 1, textAlign: "left" }}>
              {wechatId}
            </code>
            <CopyButton text={wechatId} />
          </div>
        </div>

        {/* Bank Transfer */}
        <div className="card" style={{ padding: "2rem 1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 1.25rem" }}>
            Bank Transfer
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                padding: "0.85rem 1rem",
                background: "var(--surface-2)",
                borderRadius: 8,
                border: "1px solid var(--border)",
              }}
            >
              <div className="muted" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                Bank
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{bankName}</div>
            </div>
            <div
              style={{
                padding: "0.85rem 1rem",
                background: "var(--surface-2)",
                borderRadius: 8,
                border: "1px solid var(--border)",
              }}
            >
              <div className="muted" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                Account name
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{bankAccountName}</div>
            </div>
            <div
              style={{
                padding: "0.85rem 1rem",
                background: "var(--surface-2)",
                borderRadius: 8,
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div>
                <div className="muted" style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                  Account number
                </div>
                <code style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  {bankAccountNumber}
                </code>
              </div>
              <CopyButton text={bankAccountNumber} />
            </div>
          </div>
          <p className="muted" style={{ fontSize: "0.8rem", marginTop: "1rem", marginBottom: 0, lineHeight: 1.5 }}>
            Tanzania · Same-day confirmation
          </p>
        </div>

        {/* Alipay */}
        <div className="card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 1.25rem" }}>
            Alipay
          </h2>
          <QrImage
            src={alipayQrUrl}
            alt="Alipay QR code"
            fallbackText="Scan with Alipay"
          />
          <p style={{ fontSize: "0.95rem", margin: "1rem 0 0.5rem" }}>
            Scan with Alipay to pay
          </p>
          {alipayId && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.65rem 0.9rem",
                background: "var(--surface-2)",
                borderRadius: 8,
                border: "1px solid var(--border)",
                marginTop: "0.5rem",
              }}
            >
              <code style={{ fontSize: "0.9rem", fontWeight: 600, flex: 1, textAlign: "left" }}>
                {alipayId}
              </code>
              <CopyButton text={alipayId} />
            </div>
          )}
        </div>
      </div>

      {/* Send screenshot CTA */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(232, 138, 30, 0.04))",
          borderColor: "rgba(245, 158, 11, 0.2)",
          textAlign: "center",
          padding: "2.5rem 1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.75rem" }}>
          Send your screenshot
        </h2>
        <p
          className="muted"
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.6,
            margin: "0 auto 1.5rem",
            maxWidth: 520,
          }}
        >
          Once you&apos;ve paid, send the screenshot to us and we&apos;ll reply
          with your private VPN link within 30 minutes.
        </p>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href={CONTACT.wechat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: "none", minWidth: 180 }}
          >
            Message on WeChat
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: "none", minWidth: 180 }}
          >
            Message on WhatsApp
          </a>
        </div>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1rem", marginBottom: 0 }}>
          Or email:{" "}
          <a href={`mailto:${email}`} style={{ color: "var(--accent-1)" }}>
            {email}
          </a>
        </p>
      </div>
    </div>
  );
}
