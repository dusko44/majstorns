import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

// ── Types ──────────────────────────────────────────────────────────────────

interface SerpResult {
  title: string;
  place_id?: string;
  address?: string;
  phone?: string;
  gps_coordinates?: { latitude: number; longitude: number };
}

interface SerpResponse {
  local_results?: SerpResult[];
  serpapi_pagination?: { next_page_token?: string };
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

const NS_BOUNDS = { latMin: 45.19, latMax: 45.34, lngMin: 19.69, lngMax: 19.93 };

// ── Helpers ────────────────────────────────────────────────────────────────

function isInNS(lat: number, lng: number): boolean {
  return (
    lat >= NS_BOUNDS.latMin && lat <= NS_BOUNDS.latMax &&
    lng >= NS_BOUNDS.lngMin && lng <= NS_BOUNDS.lngMax
  );
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function makeUniqueSlug(base: string, usedSlugs: Set<string>): string {
  if (!usedSlugs.has(base)) {
    usedSlugs.add(base);
    return base;
  }
  let i = 2;
  while (usedSlugs.has(`${base}-${i}`)) i++;
  const unique = `${base}-${i}`;
  usedSlugs.add(unique);
  return unique;
}

async function fetchSerp(query: string, pageToken?: string): Promise<SerpResponse> {
  const params = new URLSearchParams({
    engine: "google_maps",
    q: query,
    hl: "sr",
    gl: "rs",
    type: "search",
    api_key: SERPAPI_KEY!,
  });
  if (pageToken) params.set("next_page_token", pageToken);

  const res = await fetch(`https://serpapi.com/search?${params}`);
  if (!res.ok) throw new Error(`SerpApi HTTP ${res.status}: ${await res.text()}`);
  return res.json() as Promise<SerpResponse>;
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  // Load categories
  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("id, slug, name_sr")
    .order("display_order");

  if (catErr || !categories?.length) {
    console.error("Failed to load categories:", catErr);
    process.exit(1);
  }

  // Load existing place IDs to skip duplicates
  const { data: existing } = await supabase
    .from("craftsmen")
    .select("slug, google_place_id")
    .limit(100000);

  const existingPlaceIds = new Set(
    existing?.map((c) => c.google_place_id).filter(Boolean) ?? []
  );
  const usedSlugs = new Set(existing?.map((c) => c.slug) ?? []);

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let totalApiCalls = 0;

  for (const cat of categories) {
    console.log(`\n📂 ${cat.name_sr}`);

    let pageToken: string | undefined;

    for (let page = 0; page < 3; page++) {
      try {
        const query = `${cat.name_sr} Novi Sad`;
        const data = await fetchSerp(query, pageToken);
        totalApiCalls++;

        const results = data.local_results ?? [];

        for (const r of results) {
          const lat = r.gps_coordinates?.latitude;
          const lng = r.gps_coordinates?.longitude;

          if (lat == null || lng == null || !isInNS(lat, lng) || !r.place_id) {
            totalSkipped++;
            continue;
          }

          if (existingPlaceIds.has(r.place_id)) {
            totalSkipped++;
            continue;
          }

          const slug = makeUniqueSlug(slugify(r.title), usedSlugs);

          const { error: insertErr } = await supabase.from("craftsmen").insert({
            slug,
            business_name: r.title,
            category_id: cat.id,
            address: r.address ?? "Novi Sad",
            location: `SRID=4326;POINT(${lng} ${lat})`,
            phone: r.phone ?? null,
            google_place_id: r.place_id,
            status: "pending",
            source: "scraped",
          });

          if (insertErr) {
            console.error(`  ✗ ${r.title}: ${insertErr.message}`);
            totalErrors++;
          } else {
            existingPlaceIds.add(r.place_id);
            totalInserted++;
            console.log(`  ✓ ${r.title}`);
          }
        }

        pageToken = data.serpapi_pagination?.next_page_token;
        if (!pageToken) break;

        await new Promise((r) => setTimeout(r, 300));
      } catch (err) {
        console.error(`  Error on page ${page + 1}:`, err);
        break;
      }
    }
  }

  console.log("\n═══════════════════════════");
  console.log(`API pozivi:  ${totalApiCalls}`);
  console.log(`Upisano:     ${totalInserted}`);
  console.log(`Preskočeno:  ${totalSkipped}`);
  console.log(`Greške:      ${totalErrors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
