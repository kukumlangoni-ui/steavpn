"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import {
  getPlan,
  formatCNY,
  formatTZS,
  SITE,
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
          padding: "2rem",
          textAlign: "center",
          background: "var(--surface-2)",
          borderRadius: 8,
          border: "1px dashed var(--border)",
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p className="muted" style={{ fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
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
      width={200}
      height={200}
      onError={() => setError(true)}
      style={{
        width: 180,
        height: 180,
        borderRadius: 8,
        background: "#fff",
        objectFit: "contain",
      }}
    />
  );
}

function PaySkeleton() {
  return (
    <div className="container" style={{ padding: "4rem 1.25rem 6rem", maxWidth: 720 }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.75; }
        }
        .skel { background: var(--surface-2); border-radius: 4px; animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* Header + plan summary card */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="skel" style={{ height: 36, width: "60%", marginBottom: "1rem" }} />
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <div className="skel" style={{ height: 20, width: "50%", marginBottom: "0.5rem" }} />
            <div className="skel" style={{ height: 14, width: "70%" }} />
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="skel" style={{ height: 32, width: 80 }} />
          </div>
        </div>
      </div>

      {/* WeChat section skeleton */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="skel" style={{ height: 24, width: "35%", marginBottom: "1rem" }} />
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div className="skel" style={{ width: 180, height: 180, borderRadius: 8 }} />
          <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div className="skel" style={{ height: 14, width: "80%" }} />
            <div className="skel" style={{ height: 40, width: "100%", borderRadius: 8 }} />
            <div className="skel" style={{ height: 12, width: "60%" }} />
          </div>
        </div>
      </div>

      {/* Bank section skeleton */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="skel" style={{ height: 24, width: "45%", marginBottom: "1rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div style={{ padding: "0.75rem 1rem", background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div className="skel" style={{ height: 12, width: "30%", marginBottom: "0.4rem" }} />
            <div className="skel" style={{ height: 16, width: "60%" }} />
          </div>
          <div style={{ padding: "0.75rem 1rem", background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
            <div className="skel" style={{ height: 12, width: "40%", marginBottom: "0.4rem" }} />
            <div className="skel" style={{ height: 16, width: "70%" }} />
          </div>
          <div style={{ padding: "0.75rem 1rem", background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
            <div>
              <div className="skel" style={{ height: 12, width: 50, marginBottom: "0.4rem" }} />
              <div className="skel" style={{ height: 16, width: 100 }} />
            </div>
            <div className="skel" style={{ width: 50, height: 28, borderRadius: 6 }} />
          </div>
        </div>
      </div>

      {/* Alipay section skeleton */}
      <div className="card" style={{ marginBottom: "2.5rem" }}>
        <div className="skel" style={{ height: 24, width: "30%", marginBottom: "1rem" }} />
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div className="skel" style={{ width: 180, height: 180, borderRadius: 8 }} />
          <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div className="skel" style={{ height: 14, width: "70%" }} />
            <div className="skel" style={{ height: 12, width: "50%" }} />
          </div>
        </div>
      </div>

      {/* Send screenshot CTA skeleton */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.04), rgba(232, 138, 30, 0.02))",
          textAlign: "center",
          padding: "2rem 1.5rem",
        }}
      >
        <div className="skel" style={{ height: 28, width: "40%", margin: "0 auto 0.75rem", borderRadius: 4 }} />
        <div className="skel" style={{ height: 14, width: "70%", margin: "0 auto 1.5rem", borderRadius: 4 }} />
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <div className="skel" style={{ width: 160, height: 40, borderRadius: 8 }} />
          <div className="skel" style={{ width: 160, height: 40, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

export default function PayPage() {
  const [planId, setPlanId] = useState<string | null>(null);
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPlanId(params.get("plan"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    const MAX_ATTEMPTS = 3;

    async function load() {
      attempt++;
      try {
        const res = await fetch(
          `${SITE.apiBase}/api/payment-settings?_t=${Date.now()}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.ok) {
          setSettings(data.settings);
          setLoadState("ready");
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        if (cancelled) return;
        if (attempt < MAX_ATTEMPTS) {
          setTimeout(load, 500 * attempt);
        } else {
          setLoadError("Couldn't reach the server. Check your connection and try again.");
          setLoadState("error");
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const plan = planId ? getPlan(planId) : undefined;

  if (planId === null || loadState === "loading") {
    return <PaySkeleton />;
  }

  if (loadState === "error") {
    return (
      <div className="container" style={{ padding: "4rem 1.25rem 6rem", maxWidth: 560, textAlign: "center" }}>
        <div style={{
          padding: "2rem",
          border: "1px solid rgba(229,101,101,0.3)",
          borderRadius: 12,
          background: "rgba(229,101,101,0.05)",
        }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            Connection error
          </h1>
          <p className="muted" style={{ marginBottom: "1.5rem", lineHeight: 1.6 }}>
            {loadError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container" style={{ padding: "4rem 1.25rem 6rem", maxWidth: 560, textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
          Invalid plan
        </h1>
        <p className="muted" style={{ marginBottom: "2rem", lineHeight: 1.6 }}>
          The plan you selected is not valid. Please choose a plan from our pricing page.
        </p>
        <Link href="/pricing" className="btn-primary">
          View pricing
        </Link>
      </div>
    );
  }

  const qrVersion = new Date().toISOString().slice(0, 10);
  const wechatQrUrl = settings?.wechat_qr_url
    ? `${SITE.apiBase}${settings.wechat_qr_url}?v=${qrVersion}`
    : null;
  const alipayQrUrl = settings?.alipay_qr_url
    ? `${SITE.apiBase}${settings.alipay_qr_url}?v=${qrVersion}`
    : null;

  // Preload QR images as soon as settings are available
  useEffect(() => {
    if (loadState !== "ready") return;
    const preloads: HTMLLinkElement[] = [];
    [wechatQrUrl, alipayQrUrl].forEach((url) => {
      if (!url) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      document.head.appendChild(link);
      preloads.push(link);
    });
    return () => {
      preloads.forEach((el) => el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadState, settings?.wechat_qr_url, settings?.alipay_qr_url]);

  const wechatId = settings?.wechat_id || '';
  const alipayId = settings?.alipay_id || '';
  const whatsapp = settings?.whatsapp || '';
  const email = settings?.email || '';

  const wechatHasQr = !!wechatQrUrl;
  const wechatHasId = !!(wechatId && wechatId.trim());
  const alipayHasQr = !!alipayQrUrl;
  const alipayHasId = !!(alipayId && alipayId.trim());

  const bankName = settings?.bank_name || '';
  const bankAccountName = settings?.bank_account_name || '';
  const bankAccountNumber = settings?.bank_account_number || '';

  const wechatUrl = `https://u.wechat.com/`;
  const whatsappUrl = `https://wa.me/${whatsapp.replace(/[+\s-]/g, '')}`;

  return (
    <div className="container" style={{ padding: "4rem 1.25rem 6rem", maxWidth: 720 }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
          Complete your payment
        </h1>
        <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>{plan.name} plan</div>
            <div className="muted" style={{ fontSize: "0.9rem" }}>{plan.duration} · Unlimited bandwidth</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>{formatCNY(plan.cny)}</div>
            <div className="muted" style={{ fontSize: "0.9rem" }}>{formatTZS(plan.tzs)}</div>
          </div>
        </div>
      </div>

      {/* WeChat */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <span className="badge-popular">Recommended</span>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>Pay via WeChat</h2>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          {wechatHasQr ? (
            <QrImage
              src={wechatQrUrl}
              alt="WeChat QR code"
              fallbackText=""
            />
          ) : null}
          <div style={{ flex: 1, minWidth: 200 }}>
            {wechatHasQr && wechatHasId ? (
              <>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  Scan the QR with WeChat, or add our ID:
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "var(--surface-2)",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    marginBottom: "0.75rem",
                  }}
                >
                  <code style={{ fontSize: "1rem", fontWeight: 600, flex: 1 }}>
                    {wechatId}
                  </code>
                  <CopyButton text={wechatId} />
                </div>
              </>
            ) : wechatHasQr ? (
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                Scan this QR code with WeChat to pay.
              </p>
            ) : wechatHasId ? (
              <>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  Open WeChat, add our ID to send payment:
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: "var(--surface-2)",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    marginBottom: "0.75rem",
                  }}
                >
                  <code style={{ fontSize: "1rem", fontWeight: 600, flex: 1 }}>
                    {wechatId}
                  </code>
                  <CopyButton text={wechatId} />
                </div>
              </>
            ) : (
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                WeChat not set up yet. Please use bank transfer.
              </p>
            )}
            <p className="muted" style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
              After paying, screenshot the payment confirmation and send it to us.
            </p>
          </div>
        </div>
      </div>

      {/* Bank */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 1rem" }}>
          Pay via bank transfer (Tanzania)
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--surface-2)",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            <div className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>Bank</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{bankName}</div>
          </div>
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "var(--surface-2)",
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            <div className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>Account name</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{bankAccountName}</div>
          </div>
          <div
            style={{
              padding: "0.75rem 1rem",
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
              <div className="muted" style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>Account number</div>
              <code style={{ fontSize: "0.95rem", fontWeight: 600 }}>{bankAccountNumber}</code>
            </div>
            <CopyButton text={bankAccountNumber} />
          </div>
        </div>
        <p className="muted" style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
          After paying, screenshot the payment confirmation and send it to us.
        </p>
      </div>

      {/* Alipay */}
      <div className="card" style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 1rem" }}>
          Pay via Alipay
        </h2>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          {alipayHasQr ? (
            <QrImage
              src={alipayQrUrl}
              alt="Alipay QR code"
              fallbackText=""
            />
          ) : null}
          <div style={{ flex: 1, minWidth: 200 }}>
            {alipayHasQr && alipayHasId ? (
              <>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  Scan the QR with Alipay, or add ID: {alipayId}
                </p>
              </>
            ) : alipayHasQr ? (
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                Scan this QR code with Alipay to make payment.
              </p>
            ) : alipayHasId ? (
              <>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                  Open Alipay and send payment to ID: {alipayId}
                </p>
              </>
            ) : (
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}>
                Alipay not set up yet. Please use WeChat or bank transfer.
              </p>
            )}
            <p className="muted" style={{ fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
              After paying, screenshot the payment confirmation and send it to us.
            </p>
          </div>
        </div>
      </div>

      {/* Send screenshot */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(232, 138, 30, 0.04))",
          borderColor: "var(--border-active)",
          textAlign: "center",
          padding: "2rem 1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 0.75rem" }}>
          Send your screenshot
        </h2>
        <p className="muted" style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1.5rem", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Once you&apos;ve paid, send the screenshot to us and we&apos;ll reply
          with your private link within 30 minutes.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={wechatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Message on WeChat
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Message on WhatsApp
          </a>
        </div>
        <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1rem", marginBottom: 0 }}>
          Or email us at{" "}
          <a href={`mailto:${email}`} style={{ color: "var(--accent-1)" }}>
            {email}
          </a>
        </p>
      </div>
    </div>
  );
}
