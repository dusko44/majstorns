import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

// ── Types ──────────────────────────────────────────────────────────────────

interface SerpResult {
  title: string;
  place_id?: string;
  data_id?: string;
  address?: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  gps_coordinates?: { latitude: number; longitude: number };
  operating_hours?: Record<string, string[]>;
}

interface SerpPlaceResponse {
  place_results?: { website?: string; email?: string };
}

interface PlaceData {
  website: string | null;
  email: string | null;
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

// Za slugove (ASCII only)
const CYRILLIC_LATIN: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",ђ:"dj",е:"e",ж:"z",з:"z",и:"i",ј:"j",
  к:"k",л:"l",љ:"lj",м:"m",н:"n",њ:"nj",о:"o",п:"p",р:"r",с:"s",т:"t",
  ћ:"c",у:"u",ф:"f",х:"h",ц:"c",ч:"c",џ:"dz",ш:"s",
};

// Za display (čuva dijakritike: š, ž, č, ć, đ)
const CYRILLIC_DISPLAY: Record<string, string> = {
  А:"A",а:"a",Б:"B",б:"b",В:"V",в:"v",Г:"G",г:"g",Д:"D",д:"d",
  Ђ:"Đ",ђ:"đ",Е:"E",е:"e",Ж:"Ž",ж:"ž",З:"Z",з:"z",И:"I",и:"i",
  Ј:"J",ј:"j",К:"K",к:"k",Л:"L",л:"l",Љ:"Lj",љ:"lj",М:"M",м:"m",
  Н:"N",н:"n",Њ:"Nj",њ:"nj",О:"O",о:"o",П:"P",п:"p",Р:"R",р:"r",
  С:"S",с:"s",Т:"T",т:"t",Ћ:"Ć",ћ:"ć",У:"U",у:"u",Ф:"F",ф:"f",
  Х:"H",х:"h",Ц:"C",ц:"c",Ч:"Č",ч:"č",Џ:"Dž",џ:"dž",Ш:"Š",ш:"š",
};

function cyrillicToLatin(str: string): string {
  return str.split("").map(c => CYRILLIC_DISPLAY[c] ?? c).join("");
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .split("").map(c => CYRILLIC_LATIN[c] ?? c).join("")
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

async function fetchPlaceDetails(dataId: string): Promise<PlaceData> {
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

// ── Extra queries per category slug ───────────────────────────────────────

const EXTRA_QUERIES: Record<string, string[]> = {
  limar: ["limarske usluge Novi Sad", "krovni lim Novi Sad", "lim majstor Novi Sad"],
  stolar: ["stolarske usluge Novi Sad", "stolar majstor Novi Sad", "nameštaj po meri Novi Sad"],
  vodoinstalater: ["vodoinstalaterske usluge Novi Sad", "instalacije vode Novi Sad", "vodoinstalater majstor Novi Sad"],
  elektricar: ["elektricar majstor Novi Sad", "elektroinstalacije Novi Sad", "elektricarske usluge Novi Sad"],
  automehanicar: ["auto servis Novi Sad", "servis automobila Novi Sad", "mehaničar Novi Sad"],
  moler: ["molerske usluge Novi Sad", "moler farbara Novi Sad", "molerski radovi Novi Sad"],
  "klima-servis": ["servis klime Novi Sad", "montaža klime Novi Sad", "klima uređaj servis Novi Sad"],
  bravar: ["bravar majstor Novi Sad", "bravarija Novi Sad", "ključar Novi Sad"],
  keramicar: ["postavljanje keramike Novi Sad", "keramicar majstor Novi Sad", "pločice Novi Sad"],
  parketar: ["parketarske usluge Novi Sad", "postavljanje parketa Novi Sad", "parketar majstor Novi Sad"],
  tapetar: ["tapetar majstor Novi Sad", "presvlačenje nameštaja Novi Sad", "tapetarske usluge Novi Sad"],
  krovopokrivac: ["krovni radovi Novi Sad", "krovopokrivač Novi Sad", "popravka krova Novi Sad"],
  staklorezac: ["staklara Novi Sad", "staklorezac majstor Novi Sad", "staklo servis Novi Sad"],
  roletar: ["montaža roletni Novi Sad", "roletne Novi Sad", "tende i roletne Novi Sad"],
  "auto-elektricar": ["auto elektrika Novi Sad", "servis auto elektrike Novi Sad", "auto elektricar majstor Novi Sad"],
  vulkanizer: ["vulkanizerska radnja Novi Sad", "servis guma Novi Sad", "menjanje guma Novi Sad"],
  "servis-bele-tehnike": ["popravka bele tehnike Novi Sad", "servis kućnih aparata Novi Sad", "popravka veš mašine Novi Sad"],
  gradjevinar: ["građevinski radovi Novi Sad", "građevinska firma Novi Sad", "gradjevinar majstor Novi Sad"],
};

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
  let totalPlaceDetailsCalls = 0;
  let totalWebsitesFound = 0;

  for (const cat of categories) {
    console.log(`\n📂 ${cat.name_sr}`);

    const queries = [
      `${cat.name_sr} Novi Sad`,
      ...(EXTRA_QUERIES[cat.slug] ?? []),
    ];

    for (const query of queries) {
      let pageToken: string | undefined;

      for (let page = 0; page < 3; page++) {
        try {
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
              business_name: cyrillicToLatin(r.title),
              category_id: cat.id,
              address: cyrillicToLatin(r.address ?? "Novi Sad"),
              location: `SRID=4326;POINT(${lng} ${lat})`,
              phone: r.phone ?? null,
              rating: r.rating ?? null,
              review_count: r.reviews ?? null,
              google_place_id: r.place_id,
              google_data_id: r.data_id ?? null,
              working_hours: r.operating_hours ?? null,
              status: "pending",
              source: "scraped",
            });

            if (insertErr) {
              console.error(`  ✗ ${r.title}: ${insertErr.message}`);
              totalErrors++;
            } else {
              existingPlaceIds.add(r.place_id);
              totalInserted++;

              if (r.data_id) {
                try {
                  await new Promise((res) => setTimeout(res, 200));
                  const { website, email } = await fetchPlaceDetails(r.data_id);
                  totalPlaceDetailsCalls++;
                  if (website || email) {
                    await supabase
                      .from("craftsmen")
                      .update({ website, email })
                      .eq("google_place_id", r.place_id!);
                    if (website) totalWebsitesFound++;
                    const info = [website, email].filter(Boolean).join(", ");
                    console.log(`  ✓ ${r.title} [${info}]`);
                  } else {
                    console.log(`  ✓ ${r.title}`);
                  }
                } catch {
                  console.log(`  ✓ ${r.title} [place details nije uspeo]`);
                }
              } else {
                console.log(`  ✓ ${r.title}`);
              }
            }
          }

          pageToken = data.serpapi_pagination?.next_page_token;
          if (!pageToken) break;

          await new Promise((r) => setTimeout(r, 300));
        } catch (err) {
          console.error(`  Error on page ${page + 1} [${query}]:`, err);
          break;
        }
      }

      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log("\n═══════════════════════════");
  console.log(`Search pozivi:         ${totalApiCalls}`);
  console.log(`Place details pozivi:  ${totalPlaceDetailsCalls}`);
  console.log(`Ukupno kredita (est.): ${totalApiCalls + totalPlaceDetailsCalls}`);
  console.log(`Upisano:               ${totalInserted}`);
  console.log(`  od toga sa sajtom:   ${totalWebsitesFound}`);
  console.log(`Preskočeno:            ${totalSkipped}`);
  console.log(`Greške:                ${totalErrors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
