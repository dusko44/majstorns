import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

config({ path: resolve(process.cwd(), ".env.local") });

const DESKTOP = "C:/Users/klara/Desktop";
const CSV_PATH = `${DESKTOP}/results.csv`;
const QUERIES_PATH = `${DESKTOP}/queries.txt`;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mapiranje Google Maps kategorija → naš slug (nije se koristio, ostaje za referencu)
const GM_TO_SLUG: Record<string, string> = {
  "електричар": "elektricar",
  "електро": "elektricar",
  "вodoinstalater": "vodoinstalater",
  "водоинсталатер": "vodoinstalater",
  "молер": "moler",
  "молер-фарбар": "moler",
  "столар": "stolar",
  "браварска": "bravar",
  "браварски": "bravar",
  "брavar": "bravar",
  "кераmičar": "keramicar",
  "керамичар": "keramicar",
  "паркетар": "parketar",
  "грађевинска": "gradjevinar",
  "грађевинар": "gradjevinar",
  "кровопокривач": "krovopokrivac",
  "лимар": "limar",
  "лимарска": "limar",
  "servis klima": "klima-servis",
  "климатизација": "klima-servis",
  "servis bele tehnike": "servis-bele-tehnike",
  "стакло": "staklorezac",
  "тапетар": "tapetar",
  "ролетар": "roletar",
  "вулканизер": "vulkanizer",
  "аутомеханичар": "automehanicar",
  "ауто-електричар": "auto-elektricar",
  "ауto-elektricar": "auto-elektricar",
};

// Slug kategorije iz query input_id-a
const INPUT_TO_SLUG: Record<string, string> = {
  "elektricar": "elektricar",
  "vodoinstalater": "vodoinstalater",
  "moler": "moler",
  "stolar": "stolar",
  "bravar": "bravar",
  "keramicar": "keramicar",
  "parketar": "parketar",
  "gradjevinar": "gradjevinar",
  "krovopokrivac": "krovopokrivac",
  "limar": "limar",
  "klima": "klima-servis",
  "servis bele tehnike": "servis-bele-tehnike",
  "staklorezac": "staklorezac",
  "tapetar": "tapetar",
  "roletar": "roletar",
  "vulkanizer": "vulkanizer",
  "automehaničar": "automehanicar",
  "auto elektricar": "auto-elektricar",
};

// ── Transliteracija ────────────────────────────────────────────────────────

const CYR: Record<string, string> = {
  А:"A",Б:"B",В:"V",Г:"G",Д:"D",Ђ:"Đ",Е:"E",Ж:"Ž",З:"Z",И:"I",Ј:"J",
  К:"K",Л:"L",Љ:"Lj",М:"M",Н:"N",Њ:"Nj",О:"O",П:"P",Р:"R",С:"S",Т:"T",
  Ћ:"Ć",У:"U",Ф:"F",Х:"H",Ц:"C",Ч:"Č",Џ:"Dž",Ш:"Š",
  а:"a",б:"b",в:"v",г:"g",д:"d",ђ:"đ",е:"e",ж:"ž",з:"z",и:"i",ј:"j",
  к:"k",л:"l",љ:"lj",м:"m",н:"n",њ:"nj",о:"o",п:"p",р:"r",с:"s",т:"t",
  ћ:"ć",у:"u",ф:"f",х:"h",ц:"c",ч:"č",џ:"dž",ш:"š",
};

function transliterate(s: string): string {
  return s.split("").map(c => CYR[c] ?? c).join("");
}

function slugify(s: string): string {
  return transliterate(s)
    .toLowerCase()
    .replace(/[đ]/g, "dj")
    .replace(/[šžčćdž]/g, c => ({ š:"s", ž:"z", č:"c", ć:"c", dž:"dz" }[c] ?? c))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── NS bounding box ────────────────────────────────────────────────────────

const NS = { latMin: 45.15, latMax: 45.38, lngMin: 19.60, lngMax: 19.98 };

function inNS(lat: number, lng: number): boolean {
  return lat >= NS.latMin && lat <= NS.latMax && lng >= NS.lngMin && lng <= NS.lngMax;
}

async function main() {
  // ── Dohvati kategorije ───────────────────────────────────────────────────
  const { data: catsAll } = await supabase.from("categories").select("id, slug");
  const slugToId: Record<string, string> = {};
  for (const c of catsAll ?? []) slugToId[c.slug] = c.id;

  // ── Parsing queries.txt ──────────────────────────────────────────────────
  const queries = readFileSync(QUERIES_PATH, "utf-8")
    .split("\n").map(l => l.trim()).filter(Boolean);

  const querySlugList = queries.map(q => {
    const lower = q.toLowerCase();
    for (const [key, slug] of Object.entries(INPUT_TO_SLUG)) {
      if (lower.startsWith(key)) return slug;
    }
    return null;
  });

  // ── Učitaj CSV ───────────────────────────────────────────────────────────
  const raw = readFileSync(CSV_PATH, "utf-8");
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[];
  console.log(`Učitano ${records.length} redova iz CSV`);

  // ── Dohvati postojeće ────────────────────────────────────────────────────
  const { data: existing } = await supabase
    .from("craftsmen").select("google_place_id, slug").limit(100000);
  const existingPlaceIds = new Set((existing ?? []).map(e => e.google_place_id).filter(Boolean));
  const existingSlugs = new Set((existing ?? []).map(e => e.slug));

  // ── input_id → kategorija ────────────────────────────────────────────────
  const inputIdOrder: string[] = [];
  const inputIdSet = new Set<string>();
  for (const r of records) {
    const id = r.input_id;
    if (id && !inputIdSet.has(id)) { inputIdOrder.push(id); inputIdSet.add(id); }
  }
  const inputIdToSlug: Record<string, string | null> = {};
  inputIdOrder.forEach((id, i) => { inputIdToSlug[id] = querySlugList[i] ?? null; });

  // ── Import ───────────────────────────────────────────────────────────────
  let inserted = 0, updated = 0, skipped = 0;

  for (const r of records) {
    const lat = parseFloat(r.latitude);
    const lng = parseFloat(r.longitude);
    if (isNaN(lat) || isNaN(lng) || !inNS(lat, lng)) { skipped++; continue; }

    const placeId = r.place_id || null;
    const categorySlug = inputIdToSlug[r.input_id] ?? null;
    if (!categorySlug || !slugToId[categorySlug]) { skipped++; continue; }

    const categoryId = slugToId[categorySlug];
    const businessName = r.title ? transliterate(r.title) : null;
    if (!businessName) { skipped++; continue; }

    const address = r.address ? transliterate(r.address) : null;
    const phone = r.phone || null;
    const website = r.website || null;
    const rating = r.review_rating ? parseFloat(r.review_rating) : null;
    const reviewCount = r.review_count ? parseInt(r.review_count) : null;
    const workingHours = r.open_hours && r.open_hours !== "{}" ? (() => {
      try { return JSON.parse(r.open_hours); } catch { return null; }
    })() : null;

    let baseSlug = slugify(businessName);
    if (!baseSlug) baseSlug = `majstor-${categorySlug}`;
    let finalSlug = baseSlug;
    let counter = 2;
    while (existingSlugs.has(finalSlug) && !existingPlaceIds.has(placeId ?? "")) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const payload = {
      business_name: businessName,
      category_id: categoryId,
      address,
      phone,
      website,
      rating: rating ? Math.round(rating * 10) / 10 : null,
      review_count: reviewCount,
      working_hours: workingHours,
      google_place_id: placeId,
      source: "scraped",
      status: "pending",
      location: `POINT(${lng} ${lat})`,
    };

    if (placeId && existingPlaceIds.has(placeId)) {
      const { error } = await supabase
        .from("craftsmen")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("google_place_id", placeId);
      if (!error) updated++;
      else console.error("Update error:", error.message, businessName);
    } else {
      existingSlugs.add(finalSlug);
      if (placeId) existingPlaceIds.add(placeId);
      const { error } = await supabase
        .from("craftsmen")
        .insert({ ...payload, slug: finalSlug });
      if (!error) inserted++;
      else console.error("Insert error:", error.message, businessName);
    }
  }

  console.log(`✓ Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
}

main();
