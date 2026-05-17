import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 130px)",
        background: "#0f0f0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "#f97316",
          marginBottom: "1.25rem",
          textTransform: "uppercase",
        }}
      >
        Greška 404
      </p>

      <h1
        style={{
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          marginBottom: "1rem",
          maxWidth: "20ch",
        }}
      >
        Ova stranica ne postoji.
      </h1>

      <p
        style={{
          fontSize: "1rem",
          color: "rgba(255,255,255,0.45)",
          marginBottom: "2.5rem",
          maxWidth: "36ch",
          lineHeight: 1.6,
        }}
      >
        Možda je link pogrešan, ili je stranica uklonjena.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/"
          style={{
            background: "#f97316",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "0.875rem",
            padding: "0.7rem 1.5rem",
            borderRadius: "999px",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Početna
        </Link>
        <Link
          href="/kategorije"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.875rem",
            padding: "0.7rem 1.5rem",
            borderRadius: "999px",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Sve kategorije
        </Link>
      </div>
    </div>
  );
}
