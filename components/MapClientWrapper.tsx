"use client";

import dynamic from "next/dynamic";

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

const MapView = dynamic(() => import("./MapView"), { ssr: false });

export function MapClientWrapper({
  craftsmen,
}: {
  craftsmen: MapCraftsman[];
}) {
  return <MapView craftsmen={craftsmen} />;
}
