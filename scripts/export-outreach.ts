import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  const { data, error } = await supabase
    .from("craftsmen")
    .select("business_name, category_id, phone, address, website, status, slug")
    .neq("status", "removed")
    .not("phone", "is", null)
    .order("business_name")
    .limit(100000);

  if (error) {
    console.error("Greška:", error.message);
    process.exit(1);
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name");

  const categoryMap = Object.fromEntries(
    (categories ?? []).map((c: { id: string; name: string }) => [c.id, c.name])
  );

  const rows = (data ?? []).map((c) => ({
    ime: c.business_name,
    kategorija: categoryMap[c.category_id] ?? "",
    telefon: c.phone,
    adresa: c.address ?? "",
    website: c.website ?? "",
    status: c.status,
    profil: `https://majstorins.com/majstor/${c.slug}`,
  }));

  const header = "ime,kategorija,telefon,adresa,website,status,profil";
  const csvRows = rows.map((r) =>
    [r.ime, r.kategorija, r.telefon, r.adresa, r.website, r.status, r.profil]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header, ...csvRows].join("\n");

  const outPath = resolve(process.cwd(), "outreach.csv");
  writeFileSync(outPath, csv, "utf-8");

  console.log(`✓ ${rows.length} majstora → outreach.csv`);
}

main();
