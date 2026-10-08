import Link from "next/link";
import { CONTACT, NAV, SITE } from "@/lib/config";

export default function Footer() {
  const siteLinks = NAV.filter((item) =>
    ["/", "/pricing", "/guide"].includes(item.href)
  );
  const moreLinks = NAV.filter((item) =>
    ["/faq", "/support"].includes(item.href)
  );

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: "5rem",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Logo + tagline */}
        <div className="mb-8 text-center sm:text-left">
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            STEA <span className="accent">VPN</span>
          </div>
          <p
            className="muted"
            style={{ fontSize: "0.9rem", lineHeight: 1.6, marginTop: "0.25rem" }}
          >
            Your private VPN — set up in minutes
          </p>
        </div>

        {/* Two-column compact layout on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 mb-8">
          {/* Column: Site */}
          <div>
            <div
              className="muted"
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              Site
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {siteLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="muted" style={{ fontSize: "0.875rem" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: More */}
          <div>
            <div
              className="muted"
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              More
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {moreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="muted" style={{ fontSize: "0.875rem" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/check" className="muted" style={{ fontSize: "0.875rem" }}>
                  Check subscription
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Contact (spans 2 on mobile) */}
          <div className="col-span-2 sm:col-span-2">
            <div
              className="muted"
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              Contact
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
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

        {/* Bottom row */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.75rem",
          }}
          className="muted"
        >
          © {SITE.year} {SITE.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
