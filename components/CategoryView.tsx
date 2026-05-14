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
          <div className="border-b border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-500">
            Sortirano po udaljenosti od vas
          </div>
        ) : (
          <div className="border-b border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-400">
            Dozvolite lokaciju za sortiranje po udaljenosti
          </div>
        )}

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
          {sorted.map((c) => {
            const dist = userPos
              ? haversineKm(userPos.lat, userPos.lng, c.lat, c.lng)
              : null;
            const isSelected = c.slug === selectedSlug;

            return (
              <div
                key={c.id}
                className={`cursor-pointer px-4 py-4 transition-colors hover:bg-zinc-50 ${
                  isSelected ? "bg-orange-50" : "bg-white"
                }`}
                onClick={() => handleSelect(c)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 truncate">
                        {c.business_name}
                      </span>
                      {dist !== null && (
                        <span className="flex-shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                          {dist < 1
                            ? `${Math.round(dist * 1000)} m`
                            : `${dist.toFixed(1)} km`}
                        </span>
                      )}
                    </div>
                    {c.address && (
                      <p className="mt-0.5 text-sm text-zinc-500 truncate">
                        {c.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/majstor/${c.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
                  >
                    Pogledaj profil
                  </Link>
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      Pozovi
                    </a>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
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
