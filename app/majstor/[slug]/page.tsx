import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CraftsmanMapWrapper } from "@/components/CraftsmanMapWrapper";

const DAYS_SR: Record<string, string> = {
  monday: "Ponedeljak",
  tuesday: "Utorak",
  wednesday: "Sreda",
  thursday: "Četvrtak",
  friday: "Petak",
  saturday: "Subota",
  sunday: "Nedelja",
};
const DAY_ORDER = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const JS_TO_DAY = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// SerpApi vraća ključeve na srpskom ćirilicom kada je hl=sr
const CYRILLIC_TO_EN: Record<string, string> = {
  понедељак: "monday",
  уторак: "tuesday",
  среда: "wednesday",
  четвртак: "thursday",
  петак: "friday",
  субота: "saturday",
  недеља: "sunday",
};

function normalizeHours(raw: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw)) {
    const en = CYRILLIC_TO_EN[key.toLowerCase()] ?? key;
    result[en] = Array.isArray(val) ? String(val[0]) : String(val);
  }
  return result;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("craftsmen_map_view")
    .select("business_name, category_name, address")
    .eq("slug", slug)
    .single();
  if (!data) return {};
  return {
    title: `${data.business_name} — ${data.category_name} Novi Sad`,
    description: `${data.business_name}, ${data.category_name.toLowerCase()} u Novom Sadu. Adresa: ${data.address}`,
  };
}

export default async function CraftsmanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: c } = await supabase
    .from("craftsmen_map_view")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!c) notFound();

  const todayKey = JS_TO_DAY[new Date().getDay()];
  const rawHours = c.working_hours as Record<string, unknown> | null;
  const hours = rawHours ? normalizeHours(rawHours) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: c.business_name,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.address,
      addressLocality: "Novi Sad",
      addressCountry: "RS",
    },
    ...(c.phone && { telephone: c.phone }),
    ...(c.website && { url: c.website }),
    geo: {
      "@type": "GeoCoordinates",
      latitude: c.lat,
      longitude: c.lng,
    },
    sameAs: `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div style={{ background: "#faf9f7", minHeight: "100vh" }}>
    <div style={{ maxWidth: "64rem", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "#9ca3af", marginBottom: "2rem" }}>
        <Link href={`/${c.category_slug}`} style={{ color: "#6b7280", fontWeight: 500 }}>
          {c.category_name}
        </Link>
        <span>›</span>
        <span style={{ color: "#111827" }}>{c.business_name}</span>
      </div>

      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 26rem), 1fr))" }}>
        {/* Mapa */}
        <div style={{ overflow: "hidden", borderRadius: "1.25rem", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", height: 380 }}>
          <CraftsmanMapWrapper lat={c.lat} lng={c.lng} name={c.business_name} />
        </div>

        {/* Detalji */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

          {/* Naziv */}
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#065f46", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {c.category_name}
            </span>
            <h1 style={{ marginTop: "0.375rem", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              {c.business_name}
            </h1>
            {c.address && (
              <p style={{ marginTop: "0.5rem", color: "#6b7280", fontSize: "0.9375rem" }}>{c.address}</p>
            )}
          </div>

          {/* Telefon */}
          {c.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.8125rem", color: "#9ca3af" }}>Telefon:</span>
              <a href={`tel:${c.phone}`} style={{ fontWeight: 700, color: "#111827", fontSize: "1.0625rem" }}>
                {c.phone}
              </a>
            </div>
          )}

          {/* Kontakt dugmad */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {c.phone && (
              <a href={`tel:${c.phone}`} style={{ display: "inline-flex", alignItems: "center", borderRadius: "0.75rem", background: "#111827", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>
                Pozovi
              </a>
            )}
            {c.viber && (
              <a href={`viber://chat?number=${c.viber}`} style={{ display: "inline-flex", alignItems: "center", borderRadius: "0.75rem", background: "#7c3aed", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>
                Viber
              </a>
            )}
            {c.whatsapp && (
              <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", borderRadius: "0.75rem", background: "#16a34a", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>
                WhatsApp
              </a>
            )}
            {c.website && (
              <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", borderRadius: "0.75rem", border: "1px solid rgba(0,0,0,0.1)", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
                Sajt
              </a>
            )}
          </div>

          {/* Navigacija */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", borderRadius: "0.75rem", border: "1px solid rgba(0,0,0,0.1)", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
              📍 Google Maps
            </a>
            <a href={`https://waze.com/ul?ll=${c.lat},${c.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", borderRadius: "0.75rem", border: "1px solid rgba(0,0,0,0.1)", padding: "0.625rem 1.25rem", fontSize: "0.875rem", fontWeight: 500, color: "#111827" }}>
              🗺 Waze
            </a>
          </div>

          {/* Radno vreme */}
          {hours && (
            <div>
              <h2 style={{ marginBottom: "0.75rem", fontSize: "0.6875rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Radno vreme
              </h2>
              <div style={{ overflow: "hidden", borderRadius: "1rem", border: "1px solid rgba(0,0,0,0.07)", background: "#ffffff" }}>
                {DAY_ORDER.map((day) => {
                  const val = hours[day];
                  const isToday = day === todayKey;
                  const label = val
                    ? val === "Closed" || val === "Zatvoreno" || val === "Затворено"
                      ? "Zatvoreno"
                      : val
                    : "—";
                  return (
                    <div
                      key={day}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                        padding: "0.625rem 1rem",
                        fontSize: "0.875rem",
                        background: isToday ? "rgba(6,95,70,0.04)" : "transparent",
                      }}
                    >
                      <span style={{ fontWeight: isToday ? 600 : 400, color: isToday ? "#065f46" : "#6b7280" }}>
                        {DAYS_SR[day]}
                      </span>
                      <span style={{ fontWeight: isToday ? 600 : 500, color: isToday ? "#065f46" : "#111827" }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </>
  );
}
