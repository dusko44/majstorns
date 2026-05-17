"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Result = {
  slug: string;
  business_name: string;
  category_name: string;
  address: string | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  rating?: number | null;
  review_count?: number | null;
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function Kartica({ r, userPos }: { r: Result; userPos: { lat: number; lng: number } | null }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const dist =
    userPos && r.lat != null && r.lng != null
      ? haversineKm(userPos.lat, userPos.lng, r.lat, r.lng)
      : null;

  return (
    <div
      onClick={() => router.push(`/majstor/${r.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="search-card"
      style={{
        cursor: "pointer",
        background: "#ffffff",
        borderRadius: "1rem",
        border: "1px solid rgba(0,0,0,0.07)",
        padding: "1rem 1.25rem",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.2s",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {r.category_name}
          </span>
          {dist !== null && (
            <span style={{ flexShrink: 0, borderRadius: "999px", background: "rgba(6,95,70,0.08)", padding: "0.1rem 0.45rem", fontSize: "0.625rem", color: "#065f46", fontWeight: 600 }}>
              {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
            </span>
          )}
          {r.rating != null && (
            <span style={{ flexShrink: 0, fontSize: "0.6875rem", fontWeight: 600, color: "#92400e" }}>
              {"★".repeat(Math.round(Number(r.rating)))}{"☆".repeat(5 - Math.round(Number(r.rating)))} {Number(r.rating).toFixed(1)}{r.review_count ? ` (${r.review_count})` : ""}
            </span>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginTop: "0.125rem" }}>
          {r.business_name}
        </div>
        {r.address && (
          <div style={{ fontSize: "0.8125rem", color: "#9ca3af", marginTop: "0.125rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {r.address}
          </div>
        )}
      </div>
      <div className="search-card-actions" style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
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
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const sorted = userPos
    ? [...results].sort((a, b) => {
        const da = a.lat != null && a.lng != null ? haversineKm(userPos.lat, userPos.lng, a.lat, a.lng) : Infinity;
        const db = b.lat != null && b.lng != null ? haversineKm(userPos.lat, userPos.lng, b.lat, b.lng) : Infinity;
        return da - db;
      })
    : results;

  return (
    <div>
      {userPos !== null && (
        <div style={{ marginBottom: "0.75rem", fontSize: "0.6875rem", fontWeight: 600, color: "#065f46", letterSpacing: "0.05em" }}>
          ✓ Sortirano po udaljenosti
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {sorted.map(r => (
          <Kartica key={r.slug} r={r} userPos={userPos} />
        ))}
      </div>
    </div>
  );
}
