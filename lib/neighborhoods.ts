import type { Neighborhood } from "./types";

export const NEIGHBORHOODS: Neighborhood[] = [
  { slug: "centar", name: "Centar", city: "Novi Sad", centerLat: 45.2671, centerLng: 19.8335 },
  { slug: "liman", name: "Liman", city: "Novi Sad", centerLat: 45.2453, centerLng: 19.8408 },
  { slug: "detelinara", name: "Detelinara", city: "Novi Sad", centerLat: 45.2624, centerLng: 19.8079 },
  { slug: "telep", name: "Telep", city: "Novi Sad", centerLat: 45.2374, centerLng: 19.8169 },
  { slug: "novo-naselje", name: "Novo naselje", city: "Novi Sad", centerLat: 45.2616, centerLng: 19.7902 },
  { slug: "podbara", name: "Podbara", city: "Novi Sad", centerLat: 45.2780, centerLng: 19.8482 },
  { slug: "salajka", name: "Salajka", city: "Novi Sad", centerLat: 45.2722, centerLng: 19.8528 },
  { slug: "klisa", name: "Klisa", city: "Novi Sad", centerLat: 45.2912, centerLng: 19.8350 },
  { slug: "petrovaradin", name: "Petrovaradin", city: "Petrovaradin", centerLat: 45.2510, centerLng: 19.8638 },
  { slug: "sremska-kamenica", name: "Sremska Kamenica", city: "Sremska Kamenica", centerLat: 45.2226, centerLng: 19.8431 },
  { slug: "veternik", name: "Veternik", city: "Veternik", centerLat: 45.2487, centerLng: 19.7625 },
  { slug: "futog", name: "Futog", city: "Futog", centerLat: 45.2447, centerLng: 19.7106 },
];

export const NS_CENTER = { lat: 45.2671, lng: 19.8335 };

export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.slug === slug);
}
