import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";

config({ path: resolve(process.cwd(), ".env.local") });

const DESKTOP = "C:/Users/klara/Desktop";
const CSV_PATH = `${DESKTOP}/results.csv`;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Google Maps kategorije (ćirilica, lowercase) → naš slug
const GM_TO_SLUG: Record<string, string> = {
  // Elektricar
  "електричар": "elektricar",
  "електричарска радња": "elektricar",
  "електрична инсталација": "elektricar",
  "електро сервис": "elektricar",
  // Vodoinstalater
  "водоинсталатер": "vodoinstalater",
  "водоинсталатерска радња": "vodoinstalater",
  "инсталатер": "vodoinstalater",
  "водовод": "vodoinstalater",
  // Moler
  "молер": "moler",
  "молерско-фарбарски радови": "moler",
  "молерска радња": "moler",
  "фарбар": "moler",
  // Stolar
  "столар": "stolar",
  "столарска радња": "stolar",
  "столарска производња": "stolar",
  // Bravar
  "бравар": "bravar",
  "браварска радња": "bravar",
  "браварски": "bravar",
  // Keramicar
  "керамичар": "keramicar",
  "керамичарска радња": "keramicar",
  "поплочавање": "keramicar",
  // Parketar
  "паркетар": "parketar",
  "паркетарска радња": "parketar",
  "постављање паркета": "parketar",
  // Gradjevinar
  "грађевинска компанија": "gradjevinar",
  "грађевинска фирма": "gradjevinar",
  "грађевинар": "gradjevinar",
  "грађевинска предузећа": "gradjevinar",
  "грађевинска предузеће": "gradjevinar",
  "извођач грађевинских радова": "gradjevinar",
  "грађевинска радња": "gradjevinar",
  // Krovopokrivac
  "кровопокривач": "krovopokrivac",
  "кровопокривачка радња": "krovopokrivac",
  "поправка крова": "krovopokrivac",
  // Limar
  "лимарска радња": "limar",
  "лимар": "limar",
  "лимарство": "limar",
  // Klima-servis
  "сервис клима-уређаја": "klima-servis",
  "предузеће за клима-уређаје": "klima-servis",
  "климатизација": "klima-servis",
  "продавница клима-уређаја": "klima-servis",
  "инсталација клима-уређаја": "klima-servis",
  // Servis bele tehnike
  "сервис беле технике": "servis-bele-tehnike",
  "сервис кућних апарата": "servis-bele-tehnike",
  "поправка апарата": "servis-bele-tehnike",
  // Staklorezac
  "стаклорезац": "staklorezac",
  "стакларска радња": "staklorezac",
  "стакло": "staklorezac",
  // Tapetar
  "тапетар": "tapetar",
  "тапетарска радња": "tapetar",
  // Roletar
  "ролетар": "roletar",
  "ролетарска радња": "roletar",
  "жалузине": "roletar",
  // Vulkanizer
  "вулканизерска радња": "vulkanizer",
  "поправка и замена гума": "vulkanizer",
  "вулканизер": "vulkanizer",
  "гуме": "vulkanizer",
  // Automehanicar
  "механичар": "automehanicar",
  "ауто сервис": "automehanicar",
  "аутомеханичар": "automehanicar",
  "аутосервис": "automehanicar",
  "сервис аутомобила": "automehanicar",
  "ауто-механичар": "automehanicar",
  // Auto-elektricar
  "аутоелектричарска радња": "auto-elektricar",
  "ауто-електричар": "auto-elektricar",
  "аутоелектричар": "auto-elektricar",
  // Dodatni servisi
  "аутостаклар": "staklorezac",
  "услуге сечења стакла": "staklorezac",
  "брушење и полирање подова": "parketar",
  "постављање подних облога": "parketar",
  "извођач кровних радова": "krovopokrivac",
  "изградња кућа": "gradjevinar",
  "поправка и одржавање аутомобила": "automehanicar",
  "услуге редовног сервиса аутомобила": "automehanicar",
  "сервис малих кућних апарата": "servis-bele-tehnike",
  "сервис машина за прање и сушење веша": "servis-bele-tehnike",
  "корисничка подршка за кућне апарате": "servis-bele-tehnike",
  "снабдевач деловима за кућне апарате": "servis-bele-tehnike",
  "услуга електричних инсталација": "elektricar",
  "услуге електронског инжењеринга": "elektricar",
  "велепродавац електричних производа": "elektricar",
  "услуга умножавања кључева": "bravar",
  "израда металних производа": "bravar",
  "компанија за металне конструкције": "bravar",
  "извођач гипсаних радова": "moler",
  "услуге скидања боја": "moler",
  "услуга постављања прозора": "roletar",
  "извођач унутрашњих радова": "gradjevinar",
  "одржавање некретнина": "gradjevinar",
};

function categoryToSlug(category: string | undefined): string | null {
  if (!category) return null;
  const lower = category.toLowerCase().trim();
  if (GM_TO_SLUG[lower]) return GM_TO_SLUG[lower];
  // Parcijalno poklapanje — "Бравар за хитне интервенције" → "бравар"
  for (const [key, slug] of Object.entries(GM_TO_SLUG)) {
    if (lower.includes(key)) return slug;
  }
  return null;
}

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

  // ── Import ───────────────────────────────────────────────────────────────
  let inserted = 0, updated = 0, skipped = 0;
  const unmappedCategories = new Set<string>();

  for (const r of records) {
    const lat = parseFloat(r.latitude);
    const lng = parseFloat(r.longitude);
    if (isNaN(lat) || isNaN(lng) || !inNS(lat, lng)) { skipped++; continue; }

    const placeId = r.place_id || null;

    const categorySlug = categoryToSlug(r.category);
    if (!categorySlug || !slugToId[categorySlug]) {
      if (r.category) unmappedCategories.add(r.category);
      skipped++;
      continue;
    }

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
  if (unmappedCategories.size > 0) {
    console.log(`\nNepoznate kategorije (${unmappedCategories.size}):`);
    for (const cat of [...unmappedCategories].sort()) console.log(`  "${cat}"`);
  }
}

main();
