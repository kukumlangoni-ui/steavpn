export const metadata = { title: "Redirecting to pricing…" };

export default function PayRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/pricing/#how-to-pay" />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ margin: "0 0 1rem", fontSize: "1.1rem" }}>
            Redirecting to pricing…
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            <a href="/pricing/#how-to-pay" style={{ color: "#f59e0b" }}>
              Click here if you are not redirected.
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
