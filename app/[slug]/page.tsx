import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  return {
    title: category.plural,
    description: category.metaDescription,
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

  if (!craftsmen || craftsmen.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          {category.plural} u Novom Sadu
        </h1>
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-200 py-20 text-center text-zinc-500">
          Još uvek nema upisanih majstora u ovoj kategoriji.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "1rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
          {category.plural} u Novom Sadu
        </h1>
        <p style={{ fontSize: "0.8125rem", color: "#6b7280", marginTop: "0.125rem" }}>
          {craftsmen.length} majstora pronađeno
        </p>
      </div>
      <CategoryView craftsmen={craftsmen} />
    </div>
  );
}
