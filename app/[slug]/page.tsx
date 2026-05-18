import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, CATEGORIES } from "@/lib/categories";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CategoryView } from "@/components/CategoryView";

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

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
    .select("id, slug, business_name, address, phone, lat, lng, category_name, rating, review_count")
    .eq("category_slug", slug)
    .in("status", ["pending", "contacted", "paid"]);

  const header = (
    <div style={{ background: "#0f0f0f", padding: "0.75rem 1.5rem 1rem" }}>
      <Link href="/kategorije" style={{ fontSize: "1.25rem", fontWeight: 300, color: "rgba(255,255,255,0.7)", textDecoration: "none", display: "inline-flex", alignItems: "center", marginBottom: "0.875rem" }}>
        ←
      </Link>
      <h1 style={{ fontSize: "1.6875rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
        {category.plural}
        <span style={{ color: "#f97316" }}> u Novom Sadu</span>
      </h1>
      {craftsmen && craftsmen.length > 0 && (
        <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.2rem" }}>
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
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div>
        {header}
        <CategoryView craftsmen={craftsmen} />
        <section style={{ background: "#faf9f7", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "4rem 1.5rem 2rem" }}>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "#4b5563", margin: 0, whiteSpace: "pre-line" }}>
              {category.description}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
