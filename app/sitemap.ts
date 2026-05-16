import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { CATEGORIES } from "@/lib/categories";

const BASE_URL = "https://majstorins.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const { data: craftsmen } = await supabase
    .from("craftsmen")
    .select("slug, updated_at")
    .in("status", ["pending", "paid"])
    .limit(100000);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${BASE_URL}/kategorije`, changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: `${BASE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.4, lastModified: now },
    { url: `${BASE_URL}/o-nama`, changeFrequency: "monthly", priority: 0.3, lastModified: now },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
    lastModified: now,
  }));

  const craftsmanPages: MetadataRoute.Sitemap = (craftsmen ?? []).map((c) => ({
    url: `${BASE_URL}/majstor/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    lastModified: c.updated_at ? new Date(c.updated_at) : now,
  }));

  return [...staticPages, ...categoryPages, ...craftsmanPages];
}
