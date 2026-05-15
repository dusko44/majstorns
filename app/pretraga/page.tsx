import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PretragaResultati } from "./PretragaResultati";
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
  const { data, error } = await supabase.rpc("search_craftsmen", { term: term.trim() });
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
              {results.length} {results.length === 1 ? "rezultat" : "rezultata"}
            </p>
          )}
        </div>

        {results.length === 0 && term ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af", fontSize: "0.9375rem" }}>
            Nema rezultata za „{term}"
          </div>
        ) : (
          <PretragaResultati results={results} />
        )}
      </div>
    </div>
  );
}
