export default function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container" style={{ padding: "4rem 1.25rem 6rem", maxWidth: 960 }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
