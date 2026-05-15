"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Result = {
  slug: string;
  business_name: string;
  category_name: string;
  address: string | null;
  phone: string | null;
};

function Kartica({ r }: { r: Result }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/majstor/${r.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: "#ffffff",
        borderRadius: "1rem",
        border: "1px solid rgba(0,0,0,0.07)",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {r.category_name}
        </span>
        <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginTop: "0.125rem" }}>
          {r.business_name}
        </div>
        {r.address && (
          <div style={{ fontSize: "0.8125rem", color: "#9ca3af", marginTop: "0.125rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {r.address}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        {r.phone && (
          <a
            href={`tel:${r.phone}`}
            onClick={e => e.stopPropagation()}
            style={{ borderRadius: "0.625rem", background: "#f97316", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, color: "#ffffff", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            📞 {r.phone}
          </a>
        )}
        <span style={{ borderRadius: "0.625rem", background: "#111827", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "#ffffff" }}>
          Profil →
        </span>
      </div>
    </div>
  );
}

export function PretragaResultati({ results }: { results: Result[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {results.map(r => (
        <Kartica key={r.slug} r={r} />
      ))}
    </div>
  );
}
