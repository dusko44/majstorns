import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

// ── Types ──────────────────────────────────────────────────────────────────

interface SerpPlaceResponse {
  place_results?: { website?: string; email?: string };
}

// ── Config ─────────────────────────────────────────────────────────────────

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERPAPI_KEY || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing env vars: SERPAPI_KEY, NEXT_PUBLIC_SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── CLI args — npx tsx scripts/enrich-websites.ts --limit 50 ───────────────

const args = process.argv.slice(2);
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 && args[limitIdx + 1]
  ? parseInt(args[limitIdx + 1], 10)
  : 30;

// ── Helpers ────────────────────────────────────────────────────────────────

async function fetchPlaceData(dataId: string): Promise<{ website: string | null; email: string | null }> {
  const params = new URLSearchParams({
    engine: "google_maps",
    type: "place",
    data_id: dataId,
    api_key: SERPAPI_KEY!,
  });
  const res = await fetch(`https://serpapi.com/search?${params}`);
  if (!res.ok) return { website: null, email: null };
  const data = (await res.json()) as SerpPlaceResponse;
  return {
    website: data.place_results?.website ?? null,
    email: data.place_results?.email ?? null,
  };
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Enrich websites — limit: ${LIMIT}\n`);

  const { data: craftsmen, error } = await supabase
    .from("craftsmen")
    .select("id, business_name, google_data_id")
    .not("google_data_id", "is", null)
    .is("website", null)
    .limit(LIMIT);

  if (error) {
    console.error("DB error:", error);
    process.exit(1);
  }

  if (!craftsmen?.length) {
    console.log("Nema majstora za enrichment (svi već imaju sajt ili nemaju google_data_id).");
    return;
  }

  console.log(`Pronađeno ${craftsmen.length} majstora bez sajta.\n`);

  let updated = 0;
  let noWebsite = 0;
  let errors = 0;

  for (const craftsman of craftsmen) {
    try {
      await new Promise((r) => setTimeout(r, 300));

      const { website, email } = await fetchPlaceData(craftsman.google_data_id!);

      if (website || email) {
        const { error: updateErr } = await supabase
          .from("craftsmen")
          .update({ website, email })
          .eq("id", craftsman.id);

        if (updateErr) {
          console.error(`  ✗ ${craftsman.business_name}: ${updateErr.message}`);
          errors++;
        } else {
          const info = [website, email].filter(Boolean).join(", ");
          console.log(`  ✓ ${craftsman.business_name} → ${info}`);
          updated++;
        }
      } else {
        console.log(`  – ${craftsman.business_name}: bez podataka`);
        noWebsite++;
      }
    } catch (err) {
      console.error(`  ✗ ${craftsman.business_name}:`, err);
      errors++;
    }
  }

  console.log("\n═══════════════════════════");
  console.log(`SerpAPI pozivi:  ${craftsmen.length}`);
  console.log(`Sajt pronađen:   ${updated}`);
  console.log(`Bez sajta:       ${noWebsite}`);
  console.log(`Greške:          ${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
