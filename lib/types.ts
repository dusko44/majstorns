export type CraftsmanStatus = "pending" | "contacted" | "paid" | "removed";

export type Category = {
  slug: string;
  name: string;
  plural: string;
  iconKey: string;
  metaDescription: string;
  description: string;
};

export type Neighborhood = {
  slug: string;
  name: string;
  city: "Novi Sad" | "Petrovaradin" | "Sremska Kamenica" | "Veternik" | "Futog";
  centerLat: number;
  centerLng: number;
};

export type Craftsman = {
  id: string;
  slug: string;
  businessName: string;
  categorySlug: string;
  neighborhoodSlug: string | null;
  description: string | null;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  website: string | null;
  viber: string | null;
  whatsapp: string | null;
  email: string | null;
  workingHours: Record<string, string> | null;
  imageUrls: string[];
  status: CraftsmanStatus;
};
