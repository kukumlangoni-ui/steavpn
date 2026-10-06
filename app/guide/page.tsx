"use client";

import { useEffect, useState } from "react";
import { SITE, CONTACT } from "@/lib/config";

interface Step {
  step_number: number;
  title: string;
  body: string | null;
  image_url: string | null;
  image_alt: string | null;
}

interface Device {
  id: number;
  slug: string;
  name: string;
  app_name: string;
  download_label: string;
  download_url: string;
  intro: string | null;
  steps: Step[];
}

function DeviceIcon({ slug, appName }: { slug: string; appName: string }) {
  const [error, setError] = useState(false);
  const initial = appName.charAt(0).toUpperCase();

  if (error) {
    return (
      <div className="device-icon" style={{ color: "var(--text-muted)", fontWeight: 700, fontSize: "1.5rem" }}>
        {initial}
      </div>
    );
  }

  return (
    <div className="device-icon">
      <img
        src={`/clients/${slug}.png`}
        alt={`${appName} icon`}
        onError={() => setError(true)}
      />
    </div>
  );
}

function CopyRow({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="copy-row">
      <label>Can&apos;t open on this device? Copy the link:</label>
      <code>{url}</code>
      <button
        onClick={handleCopy}
        style={{
          padding: "0.4rem 0.9rem",
          borderRadius: 6,
          background: "var(--surface-2)",
          border: "1px solid var(--border-active)",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-1)";
          e.currentTarget.style.color = "var(--accent-1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-active)";
          e.currentTarget.style.color = "var(--text-muted)";
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

function StepSkeleton() {
  return (
    <div
      style={{
        position: "relative",
        padding: "1.25rem 1.25rem 1.25rem 3.75rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "1rem",
          top: "1.25rem",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "var(--surface-2)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div
          style={{
            height: 16,
            width: "40%",
            background: "var(--surface-2)",
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 12,
            width: "90%",
            background: "var(--surface-2)",
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
            animationDelay: "0.1s",
          }}
        />
        <div
          style={{
            height: 12,
            width: "70%",
            background: "var(--surface-2)",
            borderRadius: 4,
            animation: "pulse 1.5s ease-in-out infinite",
            animationDelay: "0.2s",
          }}
        />
      </div>
    </div>
  );
}

export default function GuidePage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${SITE.apiBase}/api/guide`)
      .then((r) => r.json())
      .then((data) => {
        setDevices(data.devices || []);
        if (data.devices?.length && !activeSlug) {
          setActiveSlug(data.devices[0].slug);
        }
      })
      .catch(() => setError("Failed to load guide"))
      .finally(() => setLoading(false));
  }, []);

  const activeDevice = devices.find((d) => d.slug === activeSlug) || null;

  return (
    <div className="guide-wrap">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .guide-wrap { max-width: 900px; margin: 0 auto; padding: 4rem 1.25rem 6rem; }

        .guide-header { margin-bottom: 1rem; }
        .guide-header h1 {
          font-size: 2.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 0.75rem;
        }
        .guide-header p {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-muted, #a1a1aa);
          margin: 0;
        }

        .device-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin: 2rem 0 2.5rem;
        }
        .device-tab {
          padding: 0.6rem 1.1rem;
          border-radius: 999px;
          border: 1px solid var(--border, #1f1f1f);
          background: transparent;
          color: var(--text-muted, #a1a1aa);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .device-tab.active {
          background: linear-gradient(135deg, #f59e0b, #e88a1e);
          color: #0a0a0a;
          border-color: transparent;
          font-weight: 600;
        }

        .device-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: var(--surface, #111);
          border: 1px solid var(--border, #1f1f1f);
          border-radius: 14px;
          margin-bottom: 1rem;
        }
        .device-icon {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .device-icon img { width: 100%; height: 100%; object-fit: cover; }
        .device-info { flex: 1; min-width: 0; }
        .device-app { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.25rem; }
        .device-name { color: var(--text-muted, #a1a1aa); font-size: 0.9rem; margin: 0; }

        .copy-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border, #1f1f1f);
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }
        .copy-row label {
          font-size: 0.85rem;
          color: var(--text-muted, #a1a1aa);
          flex-shrink: 0;
        }
        .copy-row code {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.85rem;
          font-family: ui-monospace, Menlo, monospace;
        }

        .prereq {
          padding: 1.25rem 1.5rem;
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 12px;
          margin-bottom: 2rem;
        }
        .prereq p { margin: 0 0 0.5rem; line-height: 1.55; }
        .prereq p:last-child { margin-bottom: 0; }
        .prereq strong { color: #f59e0b; }

        .steps-title {
          font-size: 1.35rem;
          font-weight: 700;
          margin: 2.5rem 0 1.25rem;
          letter-spacing: -0.01em;
        }

        .step-card {
          position: relative;
          padding: 1.5rem 1.5rem 1.5rem 4.5rem;
          background: var(--surface, #111);
          border: 1px solid var(--border, #1f1f1f);
          border-left: 3px solid #f59e0b;
          border-radius: 12px;
          margin-bottom: 1rem;
        }
        .step-num {
          position: absolute;
          left: 1.25rem;
          top: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #e88a1e);
          color: #0a0a0a;
          font-weight: 800;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-title { font-size: 1.05rem; font-weight: 700; margin: 0 0 0.5rem; }
        .step-body {
          color: var(--text-muted, #a1a1aa);
          line-height: 1.6;
          margin: 0;
          font-size: 0.95rem;
        }
        .step-img {
          width: 100%;
          border-radius: 10px;
          margin-top: 1rem;
          border: 1px solid var(--border, #1f1f1f);
        }

        .done-card {
          margin-top: 3rem;
          padding: 2rem;
          background: rgba(86,194,138,0.06);
          border: 1px solid rgba(86,194,138,0.25);
          border-radius: 14px;
          text-align: center;
        }
        .done-card h3 { margin: 0 0 0.75rem; font-size: 1.15rem; }
        .done-card p {
          color: var(--text-muted, #a1a1aa);
          margin: 0 0 1.5rem;
          line-height: 1.55;
        }
        .done-ctas {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .guide-wrap { padding: 2.5rem 1rem 4rem; }
          .device-card { flex-wrap: wrap; }
          .device-icon { width: 56px; height: 56px; border-radius: 12px; }
          .device-app { font-size: 1.1rem; }
          .step-card { padding: 1.25rem 1.25rem 1.25rem 3.75rem; }
          .step-num { width: 32px; height: 32px; font-size: 0.9rem; left: 1rem; top: 1.25rem; }
          .copy-row { flex-wrap: wrap; }
          .copy-row code { width: 100%; }
        }
      `}</style>

      <div className="guide-header">
        <h1>Setup Guide</h1>
        <p>Pick your device. Follow the steps. Connect in minutes.</p>
      </div>

      {/* Device picker */}
      <div className="device-tabs">
        {loading
          ? [1, 2, 3].map((i) => (
              <button key={i} className="device-tab" disabled style={{ opacity: 0.5 }}>
                Loading…
              </button>
            ))
          : devices.map((d) => {
              const isActive = d.slug === activeSlug;
              return (
                <button
                  key={d.slug}
                  onClick={() => setActiveSlug(d.slug)}
                  className={`device-tab${isActive ? " active" : ""}`}
                >
                  {d.name}
                </button>
              );
            })}
      </div>

      {error && (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid #ef4444",
            borderRadius: 8,
            color: "#ef4444",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Device info + steps */}
      {loading ? (
        <div>
          <StepSkeleton />
          <StepSkeleton />
          <StepSkeleton />
          <StepSkeleton />
          <StepSkeleton />
        </div>
      ) : activeDevice ? (
        <>
          {/* Device card */}
          <div className="device-card">
            <DeviceIcon slug={activeDevice.slug} appName={activeDevice.app_name} />
            <div className="device-info">
              <h2 className="device-app">{activeDevice.app_name}</h2>
              <p className="device-name">{activeDevice.name}</p>
            </div>
            <a
              href={activeDevice.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ flexShrink: 0 }}
            >
              Download app
            </a>
          </div>

          {/* Copy link row */}
          <CopyRow url={activeDevice.download_url} />

          {/* Prerequisite alert */}
          <div className="prereq">
            <p>
              <strong>⚠ Before you continue</strong>, install the {activeDevice.app_name} app
              on your {activeDevice.name}.
            </p>
            <p style={{ color: "var(--text-muted, #a1a1aa)" }}>
              Tap the orange &ldquo;Download app&rdquo; button above. After installing,
              come back and follow the steps below.
            </p>
          </div>

          {/* Steps */}
          <h2 className="steps-title">Setup steps</h2>
          <div>
            {activeDevice.steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-num">{i + 1}</div>
                <h3 className="step-title">{step.title}</h3>
                {step.body && <p className="step-body">{step.body}</p>}
                {step.image_url && (
                  <img
                    src={`${SITE.apiBase}${step.image_url}`}
                    alt={step.image_alt || step.title}
                    className="step-img"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Done card */}
          <div className="done-card">
            <h3>✅ You should now be connected.</h3>
            <p>
              If something didn&apos;t work, message us on WeChat or
              WhatsApp and we&apos;ll help you.
            </p>
            <div className="done-ctas">
              <a
                href={CONTACT.wechat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Message us on WeChat
              </a>
              <a
                href={CONTACT.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
