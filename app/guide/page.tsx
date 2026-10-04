"use client";

import { useState } from "react";
import { DEVICES } from "@/lib/config";

type DeviceId = typeof DEVICES[number]["id"];

const STEPS: Record<DeviceId, { title: string; steps: string[] }> = {
  ios: {
    title: "iPhone / iPad — Clash Lite",
    steps: [
      "Open the App Store and search \"Clash Lite\" or tap the download button below.",
      "Install the app.",
      "Open the app. Tap the \"+\" icon at the top right.",
      "Choose \"Add from URL\".",
      "Paste the subscription link we sent you.",
      "Tap \"Save\". The profile appears in the list.",
      "Tap the profile to connect.",
      "The first time, iOS will ask permission to add a VPN configuration — tap \"Allow\".",
      "A VPN icon appears at the top of the screen. You are connected.",
    ],
  },
  android: {
    title: "Android — FlClash",
    steps: [
      "Download the FlClash APK from the link below.",
      "Open the APK and allow installation from this source when prompted.",
      "Install and open FlClash.",
      "Tap the \"+\" icon in the bottom right.",
      "Choose \"Add from URL\".",
      "Paste the subscription link we sent you.",
      "Tap \"Confirm\". The profile appears.",
      "Tap the profile, then tap the power button to connect.",
      "Android will ask to allow VPN — tap \"OK\".",
    ],
  },
  macos: {
    title: "macOS — Clash Verge Rev",
    steps: [
      "Download the correct DMG: Apple Silicon (M-series) → aarch64 DMG, Intel Mac → x64 DMG.",
      "Open the DMG and drag Clash Verge Rev into Applications.",
      "Open the app. macOS may warn — right-click → Open to allow.",
      "In the app, go to \"Profiles\" (left sidebar).",
      "Click \"New\" → \"Import from URL\".",
      "Paste the subscription link we sent you.",
      "Click \"Import\". The profile appears.",
      "Click the profile to activate it.",
      "Toggle \"Tun Mode\" ON (top-right) if you want system-wide VPN.",
      "You are connected.",
    ],
  },
  windows: {
    title: "Windows — Clash Verge Rev",
    steps: [
      "Download the Windows installer (x64 or ARM64).",
      "Run the EXE. Windows may warn — click \"More info\" → \"Run anyway\".",
      "Install and open Clash Verge Rev.",
      "Go to \"Profiles\".",
      "Click \"New\" → \"Import from URL\".",
      "Paste the subscription link we sent you.",
      "Click \"Import\". The profile appears.",
      "Click the profile to activate it.",
      "Toggle \"Tun Mode\" ON for system-wide VPN.",
      "You are connected.",
    ],
  },
  linux: {
    title: "Linux — Clash Verge Rev",
    steps: [
      "Choose the package for your distro: Ubuntu/Debian → DEB, Fedora/RHEL → RPM, Any → AppImage.",
      "Install the package.",
      "Open Clash Verge Rev.",
      "Go to \"Profiles\".",
      "Click \"New\" → \"Import from URL\".",
      "Paste the subscription link we sent you.",
      "Click \"Import\".",
      "Click the profile to activate.",
      "Toggle \"Tun Mode\" for system-wide VPN.",
      "You are connected.",
    ],
  },
};

function StepScreenshot({ deviceId, stepIndex }: { deviceId: string; stepIndex: number }) {
  const [error, setError] = useState(false);
  const src = `/guides/${deviceId}/step-${stepIndex + 1}.png`;

  if (error) {
    return (
      <div
        style={{
          marginTop: "0.75rem",
          padding: "1.5rem",
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
    );
  }

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <img
        src={src}
        alt={`Step ${stepIndex + 1} screenshot`}
        onError={() => setError(true)}
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 8,
          border: "1px solid var(--border)",
          display: "block",
        }}
      />
    </div>
  );
}

export default function GuidePage() {
  const [activeDevice, setActiveDevice] = useState<DeviceId>("ios");
  const device = DEVICES.find((d) => d.id === activeDevice)!;
  const guide = STEPS[activeDevice];

  return (
    <div className="container" style={{ padding: "4rem 1.25rem 6rem", maxWidth: 860 }}>
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
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "2rem",
          padding: "0.375rem",
          background: "var(--surface)",
          borderRadius: 12,
          border: "1px solid var(--border)",
        }}
      >
        {DEVICES.map((d) => {
          const isActive = d.id === activeDevice;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDevice(d.id)}
              style={{
                flex: "1 1 auto",
                minWidth: 100,
                padding: "0.6rem 1rem",
                borderRadius: 8,
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
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.background = "var(--surface-2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {d.name}
            </button>
          );
        })}
      </div>

      {/* Device info */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              {device.app}
            </div>
            <div className="muted" style={{ fontSize: "0.9rem" }}>
              for {device.name}
            </div>
          </div>
          <a
            href={device.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Download {device.appStore}
          </a>
        </div>
      </div>

      {/* Steps */}
      <div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: "1.25rem" }}>
          {guide.title}
        </h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {guide.steps.map((step, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                padding: "1rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
                  color: "#0a0a0a",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6, paddingTop: 2 }}>
                  {step}
                </p>
                <StepScreenshot deviceId={activeDevice} stepIndex={i} />
              </div>
            </li>
          ))}
        </ol>
      </div>

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
          <a href="/support" style={{ color: "var(--accent-1)" }}>Contact support</a>
        </p>
      </div>
    </div>
  );
}
