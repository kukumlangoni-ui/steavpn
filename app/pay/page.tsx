export const metadata = { title: "Redirecting…" };

export default function PayRedirect() {
  return (
    <>
      {/* Meta refresh — works even without JavaScript */}
      <meta httpEquiv="refresh" content="0; url=/pay/1month/" />

      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ margin: "0 0 1rem", fontSize: "1.1rem" }}>
            Redirecting to payment…
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            <a href="/pay/1month/" style={{ color: "#f59e0b" }}>
              Click here if you are not redirected.
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
