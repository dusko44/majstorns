import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/categories";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryView } from "@/components/CategoryView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  const title = category.plural;
  const description = category.metaDescription;
  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const supabase = await createSupabaseServerClient();

  const { data: craftsmen } = await supabase
    .from("craftsmen_map_view")
    .select("id, slug, business_name, address, phone, lat, lng, category_name")
    .eq("category_slug", slug)
    .in("status", ["pending", "paid"]);

  const header = (
    <div style={{ background: "#0f0f0f", padding: "0.75rem 1.5rem 1rem" }}>
      <Link href="/kategorije" style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#ffffff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.75rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "999px", padding: "0.3rem 0.75rem 0.3rem 0.5rem" }}>
        ← Kategorije
      </Link>
      <h1 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        {category.plural}
        <span style={{ color: "#f97316" }}> u Novom Sadu</span>
      </h1>
      {craftsmen && craftsmen.length > 0 && (
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", marginTop: "0.2rem" }}>
          {craftsmen.length} majstora pronađeno
        </p>
      )}
    </div>
  );

  const jsonLd = craftsmen && craftsmen.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.plural} u Novom Sadu`,
    description: category.metaDescription,
    url: `https://majstorins.com/${slug}`,
    numberOfItems: craftsmen.length,
    itemListElement: craftsmen.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://majstorins.com/majstor/${c.slug}`,
      name: c.business_name,
    })),
  } : null;

  if (!craftsmen || craftsmen.length === 0) {
    return (
      <div>
        {header}
        <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center", color: "#9ca3af" }}>
          Još uvek nema upisanih majstora u ovoj kategoriji.
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
