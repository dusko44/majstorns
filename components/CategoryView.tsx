"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { CategoryCraftsman } from "./CategoryMapView";

const CategoryMapView = dynamic(() => import("./CategoryMapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-zinc-100 text-zinc-400 text-sm">
      Učitavanje mape…
    </div>
  ),
});

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function CategoryView({
  craftsmen,
}: {
  craftsmen: CategoryCraftsman[];
}) {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
  }, []);

  const sorted = userPos
    ? [...craftsmen].sort(
        (a, b) =>
          haversineKm(userPos.lat, userPos.lng, a.lat, a.lng) -
          haversineKm(userPos.lat, userPos.lng, b.lat, b.lng)
      )
    : craftsmen;

  const handleSelect = useCallback((c: CategoryCraftsman) => {
    setSelectedSlug(c.slug);
    setFlyTo([c.lat, c.lng]);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: "calc(100vh - 65px)" }}>
      {/* Mapa */}
      <div className="h-64 flex-shrink-0 lg:h-full lg:w-3/5">
        <CategoryMapView craftsmen={craftsmen} flyTo={flyTo} />
      </div>

      {/* Lista */}
      <div className="flex flex-1 flex-col overflow-hidden lg:w-2/5">
        {userPos ? (
          <div style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#fff", padding: "0.5rem 1rem", fontSize: "0.75rem", color: "#065f46", fontWeight: 500 }}>
            Sortirano po udaljenosti od vas
          </div>
        ) : (
          <div style={{ borderBottom: "1px solid rgba(0,0,0,0.07)", background: "#fff", padding: "0.5rem 1rem", fontSize: "0.75rem", color: "#9ca3af" }}>
            Dozvolite lokaciju za sortiranje po udaljenosti
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto" }}>
          {sorted.map((c) => {
            const dist = userPos
              ? haversineKm(userPos.lat, userPos.lng, c.lat, c.lng)
              : null;
            const isSelected = c.slug === selectedSlug;

            return (
              <div
                key={c.id}
                onClick={() => handleSelect(c)}
                style={{
                  cursor: "pointer",
                  padding: "1rem",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  background: isSelected ? "#fff8f5" : "#ffffff",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 600, color: "#111827", fontSize: "0.9375rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.business_name}
                      </span>
                      {dist !== null && (
                        <span style={{ flexShrink: 0, borderRadius: "999px", background: "rgba(6,95,70,0.08)", padding: "0.125rem 0.5rem", fontSize: "0.6875rem", color: "#065f46", fontWeight: 500 }}>
                          {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                        </span>
                      )}
                    </div>
                    {c.address && (
                      <p style={{ marginTop: "0.25rem", fontSize: "0.8125rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {c.address}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  <Link
                    href={`/majstor/${c.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ borderRadius: "0.5rem", background: "#111827", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "#ffffff" }}
                  >
                    Pogledaj profil
                  </Link>
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ borderRadius: "0.5rem", border: "1px solid rgba(0,0,0,0.1)", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 500, color: "#374151" }}
                    >
                      Pozovi
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ borderRadius: "0.5rem", border: "1px solid rgba(0,0,0,0.1)", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 500, color: "#374151" }}
                  >
                    Navigiraj
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
