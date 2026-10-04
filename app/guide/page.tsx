"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";

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

function StepSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "var(--surface-2)",
          flexShrink: 0,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div
          style={{
            height: 16,
            width: "60%",
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
    <div className="container" style={{ padding: "4rem 1.25rem 6rem", maxWidth: 860 }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
          Setup Guide
        </h1>
        <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
          Pick your device. Follow the steps. Connect in minutes.
        </p>
      </div>

      {/* Device picker */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          gap: "0.5rem",
          marginBottom: "2rem",
          padding: "0.375rem",
          background: "var(--surface)",
          borderRadius: 999,
          border: "1px solid var(--border)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: 120,
                  height: 36,
                  borderRadius: 999,
                  background: "var(--surface-2)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))
          : devices.map((d) => {
              const isActive = d.slug === activeSlug;
              return (
                <button
                  key={d.slug}
                  onClick={() => setActiveSlug(d.slug)}
                  style={{
                    flexShrink: 0,
                    padding: "0.6rem 1.25rem",
                    borderRadius: 999,
                    border: "none",
                    background: isActive
                      ? "linear-gradient(135deg, var(--accent-1), var(--accent-2))"
                      : "transparent",
                    color: isActive ? "#0a0a0a" : "var(--text-muted)",
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <StepSkeleton />
          <StepSkeleton />
          <StepSkeleton />
          <StepSkeleton />
          <StepSkeleton />
        </div>
      ) : activeDevice ? (
        <>
          {/* Device info */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {activeDevice.name}
                </div>
                <div className="muted" style={{ fontSize: "0.9rem" }}>
                  {activeDevice.app_name}
                </div>
              </div>
              <a
                href={activeDevice.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}
              >
                Download {activeDevice.download_label}
              </a>
            </div>
            {activeDevice.intro && (
              <p className="muted" style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
                {activeDevice.intro}
              </p>
            )}
          </div>

          {/* Steps */}
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1.25rem" }}>
              Setup steps
            </h2>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.875rem",
              }}
            >
              {activeDevice.steps.map((step, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                    padding: "1rem 1.25rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderLeft: "3px solid var(--accent-1)",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                      color: "#0a0a0a",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        margin: "0 0 0.375rem",
                      }}
                    >
                      {step.title}
                    </h3>
                    {step.body && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                          color: "var(--text-muted)",
                        }}
                      >
                        {step.body}
                      </p>
                    )}
                    {step.image_url ? (
                      <div style={{ marginTop: "0.75rem" }}>
                        <img
                          src={`${SITE.apiBase}${step.image_url}`}
                          alt={step.image_alt || step.title}
                          style={{
                            width: "100%",
                            maxWidth: 480,
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            display: "block",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          marginTop: "0.75rem",
                          padding: "1.25rem",
                          textAlign: "center",
                          background: "var(--surface-2)",
                          borderRadius: 8,
                          border: "1px dashed var(--border)",
                        }}
                      >
                        <p className="muted" style={{ fontSize: "0.85rem", margin: 0 }}>
                          Screenshot coming soon
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : null}

      {/* Help note */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem 1.25rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          textAlign: "center",
        }}
      >
        <p className="muted" style={{ fontSize: "0.85rem", margin: 0 }}>
          Need help?{" "}
          <a href="/support" style={{ color: "var(--accent-1)" }}>
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
