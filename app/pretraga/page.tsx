import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Pretraga: ${q}` : "Pretraga majstora" };
}

async function search(term: string) {
  const supabase = await createSupabaseServerClient();
  const words = term.trim().split(/\s+/).filter(Boolean);

  // Jedna query: svaka riječ mora matchovati u bar jednom polju (chained AND)
  let q = supabase
    .from("craftsmen_map_view")
    .select("slug, business_name, category_name, address, phone");

  for (const word of words) {
    q = (q as typeof q).or(
      `business_name.ilike.%${word}%,category_name.ilike.%${word}%`
    );
  }

  const { data, error } = await q.limit(200);
  if (error) console.error("Search error:", error);
  return data ?? [];
}

export default async function PretragaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = q?.trim() ?? "";
  const results = term.length >= 2 ? await search(term) : [];

  return (
    <div style={{ background: "#faf9f7", minHeight: "100vh" }}>
      <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Rezultati pretrage
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            {term ? `„${term}"` : "Unesite pojam za pretragu"}
          </h1>
          {term && (
            <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "#6b7280" }}>
              {results.length} {results.length === 1 ? "rezultat" : results.length < 5 ? "rezultata" : "rezultata"}
            </p>
          )}
        </div>

        {results.length === 0 && term ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af", fontSize: "0.9375rem" }}>
            Nema rezultata za „{term}"
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {results.map(r => (
              <Link
                key={r.slug}
                href={`/majstor/${r.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "1rem",
                    border: "1px solid rgba(0,0,0,0.07)",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                >
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {r.category_name}
                    </span>
                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "#111827", marginTop: "0.125rem" }}>
                      {r.business_name}
                    </div>
                    {r.address && (
                      <div style={{ fontSize: "0.8125rem", color: "#9ca3af", marginTop: "0.125rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.address}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    {r.phone && (
                      <a
                        href={`tel:${r.phone}`}
                        onClick={e => e.stopPropagation()}
                        style={{ borderRadius: "0.625rem", border: "1px solid rgba(0,0,0,0.1)", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 500, color: "#374151" }}
                      >
                        Pozovi
                      </a>
                    )}
                    <span style={{ borderRadius: "0.625rem", background: "#111827", padding: "0.375rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "#ffffff" }}>
                      Profil →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
