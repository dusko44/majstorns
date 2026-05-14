"use client";

import dynamic from "next/dynamic";

const CraftsmanMapSingle = dynamic(() => import("./CraftsmanMapSingle"), {
  ssr: false,
});

export function CraftsmanMapWrapper({
  lat,
  lng,
  name,
}: {
  lat: number;
  lng: number;
  name: string;
}) {
  return <CraftsmanMapSingle lat={lat} lng={lng} name={name} />;
}
