"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

export type CategoryCraftsman = {
  id: string;
  slug: string;
  business_name: string;
  address: string;
  phone: string | null;
  lat: number;
  lng: number;
  category_name: string;
  rating?: number | null;
  review_count?: number | null;
};

const NS_CENTER: [number, number] = [45.2671, 19.8335];

function MapFlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, { duration: 0.6 });
    }
  }, [center, map]);
  return null;
}

export default function CategoryMapView({
  craftsmen,
  flyTo,
}: {
  craftsmen: CategoryCraftsman[];
  flyTo: [number, number] | null;
}) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      center={NS_CENTER}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFlyTo center={flyTo} />
      {craftsmen.map((c) => (
        <Marker key={c.id} position={[c.lat, c.lng]}>
          <Popup>
            <div className="text-sm" style={{ minWidth: 180 }}>
              <div className="font-semibold">{c.business_name}</div>
              <div className="mt-0.5 text-zinc-500">{c.address}</div>
              {c.phone && (
                <a
                  href={`tel:${c.phone}`}
                  className="mt-1 block text-zinc-700 hover:text-zinc-900"
                >
                  {c.phone}
                </a>
              )}
              <div className="mt-2 flex gap-2">
                <Link
                  href={`/majstor/${c.slug}`}
                  className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-medium text-white"
                >
                  Pogledaj profil
                </Link>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700"
                >
                  Navigiraj
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
