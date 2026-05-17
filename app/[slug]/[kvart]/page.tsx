import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { getNeighborhoodBySlug, NEIGHBORHOODS } from "@/lib/neighborhoods";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryView } from "@/components/CategoryView";

const RADIUS_KM = 3;

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

export async function generateStaticParams() {
  return CATEGORIES.flatMap((cat) =>
    NEIGHBORHOODS.map((n) => ({ slug: cat.slug, kvart: n.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; kvart: string }>;
}): Promise<Metadata> {
  const { slug, kvart } = await params;
  const category = getCategoryBySlug(slug);
  const neighborhood = getNeighborhoodBySlug(kvart);
  if (!category || !neighborhood) return {};

  const title = `${category.plural} — ${neighborhood.name}`;
  const description = `${category.plural} u ${neighborhood.name}, Novi Sad. Pronađi proverenog majstora u svom kraju — broj telefona, adresa, radno vreme.`;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}/${kvart}` },
    openGraph: { title, description },
  };
}

export default async function NeighborhoodPage({
  params,
}: {
  params: Promise<{ slug: string; kvart: string }>;
}) {
  const { slug, kvart } = await params;
  const category = getCategoryBySlug(slug);
  const neighborhood = getNeighborhoodBySlug(kvart);

  if (!category || !neighborhood) notFound();

  const supabase = await createSupabaseServerClient();

  const { data: allCraftsmen } = await supabase
    .from("craftsmen_map_view")
    .select("id, slug, business_name, address, phone, lat, lng, category_name")
    .eq("category_slug", slug)
    .in("status", ["pending", "paid"]);

  const craftsmen = (allCraftsmen ?? []).filter(
    (c) =>
      c.lat != null &&
      c.lng != null &&
      haversineKm(neighborhood.centerLat, neighborhood.centerLng, c.lat, c.lng) <= RADIUS_KM
  );

  const header = (
    <div style={{ background: "#0f0f0f", padding: "0.75rem 1.5rem 1rem" }}>
      <Link href={`/${slug}`} style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#d1d5db", textDecoration: "none", display: "inline-block", marginBottom: "0.5rem" }}>
        ← {category.plural} u Novom Sadu
      </Link>
      <h1 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        {category.plural}
        <span style={{ color: "#f97316" }}> — {neighborhood.name}</span>
      </h1>
      {craftsmen.length > 0 && (
        <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.2rem" }}>
          {craftsmen.length} majstora u radijusu {RADIUS_KM} km
        </p>
      )}
    </div>
  );

  const jsonLd =
    craftsmen.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${category.plural} — ${neighborhood.name}`,
          description: `${category.plural} u ${neighborhood.name}, Novi Sad`,
          url: `https://majstorins.com/${slug}/${kvart}`,
          numberOfItems: craftsmen.length,
          itemListElement: craftsmen.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://majstorins.com/majstor/${c.slug}`,
            name: c.business_name,
          })),
        }
      : null;

  if (craftsmen.length === 0) {
    return (
      <div>
        {header}
        <div
          style={{
            maxWidth: "48rem",
            margin: "0 auto",
            padding: "4rem 1.5rem",
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          Nema upisanih majstora u ovom kvartu.{" "}
          <Link href={`/${slug}`} style={{ color: "#f97316", textDecoration: "none" }}>
            Pogledaj sve {category.plural.toLowerCase()} u Novom Sadu →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {header}
      <CategoryView craftsmen={craftsmen} />
    </div>
  );
}
