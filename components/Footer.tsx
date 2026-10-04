import Link from "next/link";
import { CONTACT, NAV, SITE } from "@/lib/config";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "5rem", padding: "3rem 0 2rem" }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              STEA <span className="accent">VPN</span>
            </div>
            <p className="muted" style={{ fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
              {SITE.tagline}
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.9rem" }}>Site</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="muted" style={{ fontSize: "0.9rem" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.9rem" }}>Contact</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.9rem" }}>
              <li className="muted">WeChat: {CONTACT.wechat.id}</li>
              <li className="muted">WhatsApp: {CONTACT.whatsapp.id}</li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="muted">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
          }}
          className="muted"
        >
          <span>© {SITE.year} {SITE.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
