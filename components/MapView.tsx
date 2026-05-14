"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type MapCraftsman = {
  id: string;
  slug: string;
  business_name: string;
  address: string;
  phone: string | null;
  lat: number;
  lng: number;
  category_name: string;
};

const NS_CENTER: [number, number] = [45.2671, 19.8335];

export default function MapView({ craftsmen }: { craftsmen: MapCraftsman[] }) {
  useEffect(() => {
    // Fix Leaflet default marker icons in Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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
      {craftsmen.map((c) => (
        <Marker key={c.id} position={[c.lat, c.lng]}>
          <Popup>
            <div className="text-sm">
              <div className="font-semibold">{c.business_name}</div>
              <div className="text-zinc-500">{c.category_name}</div>
              <div className="mt-1 text-zinc-500">{c.address}</div>
              {c.phone && (
                <a
                  href={`tel:${c.phone}`}
                  className="mt-1 block font-medium text-zinc-900"
                >
                  {c.phone}
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
