import Image from "next/image";
import Link from "next/link";
import { NAV, SITE } from "@/lib/config";

export default function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "saturate(180%) blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Image src="/logo.png" alt={SITE.name} width={32} height={32} priority />
          <span style={{ fontWeight: 700, fontSize: "1.05rem", letterSpacing: "-0.01em" }}>
            STEA <span className="accent">VPN</span>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: "0.25rem" }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "0.5rem 0.9rem",
                borderRadius: 8,
                fontSize: "0.92rem",
                fontWeight: 500,
                color: "var(--text-muted)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
