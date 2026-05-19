import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Globe, MapPin, Navigation } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CraftsmanMapWrapper } from "@/components/CraftsmanMapWrapper";
import { getCategoryBySlug } from "@/lib/categories";
import { haversineKm } from "@/lib/geo";

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

const SCHEMA_DAY: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

function to24h(s: string): string | null {
  s = s.trim();
  const ampm = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = parseInt(ampm[1]);
    const m = ampm[2];
    if (ampm[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (ampm[3].toUpperCase() === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${m}`;
  }
  const h24 = s.match(/^(\d{1,2}):(\d{2})$/);
  if (h24) return `${String(parseInt(h24[1])).padStart(2, "0")}:${h24[2]}`;
  return null;
}

function buildOpeningHours(hours: Record<string, string>) {
  const specs = [];
  for (const [day, val] of Object.entries(hours)) {
    if (!SCHEMA_DAY[day] || !val) continue;
    if (["Closed", "Zatvoreno"].includes(val)) continue;
    if (/24\s*hour/i.test(val) || /24h/i.test(val)) {
      specs.push({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${SCHEMA_DAY[day]}`, opens: "00:00", closes: "23:59" });
      continue;
    }
    const parts = val.split(/[–—-]/);
    if (parts.length !== 2) continue;
    const opens = to24h(parts[0]);
    const closes = to24h(parts[1]);
    if (opens && closes) {
      specs.push({ "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${SCHEMA_DAY[day]}`, opens, closes });
    }
  }
  return specs;
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  const { data } = await supabase
    .from("craftsmen")
    .select("slug")
    .neq("status", "removed");
  return (data ?? []).map((c) => ({ slug: c.slug }));
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
    .select("business_name, category_name, category_slug, address")
    .eq("slug", slug)
    .single();
  if (!data) return {};
  const category = getCategoryBySlug(data.category_slug);
  const keywords = category?.metaDescription.split(" — ")[1]?.replace(/\.$/, "") ?? "";
  const title = `${data.business_name} — ${data.category_name} Novi Sad`;
  const description = [
    `${data.business_name}, ${data.category_name.toLowerCase()} u Novom Sadu`,
    keywords,
    data.address,
  ].filter(Boolean).join(". ") + ".";
  return {
    title,
    description,
    alternates: { canonical: `/majstor/${slug}` },
    openGraph: { title, description },
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
    .neq("status", "removed")
    .single();

  if (!c) notFound();

  const { data: slicniRaw } = await supabase
    .from("craftsmen_map_view")
    .select("slug, business_name, address, lat, lng, phone, rating, review_count")
    .eq("category_slug", c.category_slug)
    .neq("slug", slug)
    .neq("status", "removed")
    .limit(200);

  const slicni = (slicniRaw ?? [])
    .filter((m) => m.lat != null && m.lng != null)
    .map((m) => ({ ...m, dist: haversineKm(c.lat!, c.lng!, m.lat!, m.lng!) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 4);

  const category = getCategoryBySlug(c.category_slug);
  const baseDesc = category?.description?.split("\n\n")[0] ?? null;
  const categoryDesc = baseDesc
    ? `${baseDesc} ${c.business_name} prima pozive${c.address ? `, a na adresi je ${c.address}` : " u Novom Sadu"}.`
    : null;

  const todayKey = JS_TO_DAY[new Date().getDay()];
  const rawHours = c.working_hours as Record<string, unknown> | null;
  const hours = rawHours ? normalizeHours(rawHours) : null;

  const openingHoursSpecs = hours ? buildOpeningHours(hours) : [];

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
    ...(openingHoursSpecs.length > 0 && { openingHoursSpecification: openingHoursSpecs }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dark hero */}
      <div style={{ background: "#0f0f0f", padding: "1.25rem 1.5rem 1.75rem" }}>
        <Link
          href={`/${c.category_slug}`}
          style={{
            fontSize: "1.25rem", fontWeight: 300, color: "rgba(255,255,255,0.7)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", marginBottom: "0.875rem",
          }}
        >
          ←
        </Link>

        <div
          style={{
            display: "inline-flex", alignItems: "center", borderRadius: "999px",
            background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)",
            padding: "0.2rem 0.625rem", marginBottom: "0.625rem", marginLeft: "0.625rem",
          }}
        >
          <span style={{ fontSize: "0.625rem", color: "#f97316", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {c.category_name}
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "0.375rem" }}>
          {c.business_name}
        </h1>
        {c.rating && (() => {
          const heroStars = Math.min(5, Math.max(1, Math.round(c.rating)));
          return (
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "#f97316", fontSize: "0.9375rem", letterSpacing: "-0.02em" }}>
              {"★".repeat(heroStars)}{"☆".repeat(5 - heroStars)}
            </span>
            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.875rem" }}>{Number(c.rating).toFixed(1)}</span>
            {c.review_count && (
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8125rem" }}>({c.review_count} ocena)</span>
            )}
          </div>
          );
        })()}
        {c.address && (
          <p style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#ffffff", marginBottom: "1.25rem" }}>
            <MapPin size={14} strokeWidth={1.5} color="rgba(255,255,255,0.6)" style={{ flexShrink: 0 }} />
            {c.address}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {c.phone && (
            <a
              href={`tel:${c.phone}`}
              style={{ display: "inline-flex", alignItems: "center", borderRadius: "999px", background: "#f97316", padding: "0.625rem 1.375rem 0.625rem 1.125rem", fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff", textDecoration: "none", gap: "0.375rem" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#000000" stroke="none" style={{flexShrink:0}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg> {c.phone}
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.35)", padding: "0.625rem 1rem", fontSize: "0.8125rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}
          >
            <MapPin size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} /> Google Maps
          </a>
          <a
            href={`https://waze.com/ul?ll=${c.lat},${c.lng}&navigate=yes`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.35)", padding: "0.625rem 1rem", fontSize: "0.8125rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}
          >
            <Navigation size={13} strokeWidth={1.5} style={{ flexShrink: 0 }} /> Waze
          </a>
          {c.viber && (
            <a href={`viber://chat?number=${c.viber}`} style={{ display: "inline-flex", alignItems: "center", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.35)", padding: "0.625rem 1rem", fontSize: "0.8125rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>
              Viber
            </a>
          )}
          {c.whatsapp && (
            <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.35)", padding: "0.625rem 1rem", fontSize: "0.8125rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>
              WhatsApp
            </a>
          )}
          {c.website && c.website.startsWith("http") && (() => {
            const display = c.website
              .replace(/^https?:\/\/(www\.)?/, "")
              .replace(/\/$/, "");
            const label = display.length > 28 ? display.slice(0, 28) + "…" : display;
            return (
              <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.35)", padding: "0.625rem 1rem", fontSize: "0.8125rem", fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>
                <Globe size={14} strokeWidth={1.5} color="rgba(147,197,253,0.9)" />
                {label}
              </a>
            );
          })()}
        </div>
      </div>

      {/* Opis usluga */}
      {categoryDesc && (
        <div style={{ padding: "1.5rem", background: "#ffffff", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7, margin: 0 }}>
            {categoryDesc}
          </p>
        </div>
      )}

      {/* Mapa + radno vreme */}
      <div className="craftsman-map-section">
          <div className="map-pane">
            <CraftsmanMapWrapper lat={c.lat} lng={c.lng} name={c.business_name} />
          </div>

          {hours && (
            <div className="hours-pane">
              <h2 style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.875rem" }}>
                Radno vreme
              </h2>
              <div style={{ borderRadius: "0.875rem", border: "1px solid rgba(0,0,0,0.07)", background: "#ffffff", overflow: "hidden" }}>
                {DAY_ORDER.map((day) => {
                  const val = hours[day];
                  const isToday = day === todayKey;
                  const is24h = val ? /24\s*sat|24\s*hour|otvoreno 24|open 24/i.test(val) : false;
                  const label = val
                    ? val === "Closed" || val === "Zatvoreno"
                      ? "Zatvoreno"
                      : is24h ? "—" : val
                    : "—";
                  return (
                    <div
                      key={day}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                        padding: "0.5rem 0.875rem",
                        fontSize: "0.8125rem",
                        background: isToday ? "rgba(249,115,22,0.04)" : "transparent",
                      }}
                    >
                      <span style={{ fontWeight: isToday ? 600 : 400, color: isToday ? "#f97316" : "#6b7280" }}>
                        {DAYS_SR[day]}
                      </span>
                      <span style={{ fontWeight: isToday ? 600 : 500, color: isToday ? "#f97316" : "#111827" }}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </div>

      {/* Slični majstori */}
      {slicni.length > 0 && (
        <div style={{ padding: "2rem 1.5rem", borderTop: "1px solid rgba(0,0,0,0.06)", background: "#faf9f7" }}>
          <h2 style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem", paddingLeft: "0.75rem" }}>
            Slični majstori u komšiluku
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {slicni.map((m) => (
              <div
                key={m.slug}
                style={{
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(0,0,0,0.07)",
                  background: "#ffffff",
                  padding: "0.625rem 0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {m.business_name}
                      </span>
                      <span style={{ flexShrink: 0, borderRadius: "999px", background: "rgba(6,95,70,0.08)", padding: "0.1rem 0.45rem", fontSize: "0.625rem", color: "#065f46", fontWeight: 600 }}>
                        {m.dist < 1 ? `${Math.round(m.dist * 1000)} m` : `${m.dist.toFixed(1)} km`}
                      </span>
                      {m.rating != null && (() => {
                        const stars = Math.min(5, Math.max(1, Math.round(Number(m.rating))));
                        return (
                          <span style={{ flexShrink: 0, fontSize: "0.6875rem", fontWeight: 600, color: "#92400e" }}>
                            {"★".repeat(stars)}{"☆".repeat(5 - stars)} {Number(m.rating).toFixed(1)}{m.review_count ? ` (${m.review_count})` : ""}
                          </span>
                        );
                      })()}
                    </div>
                    {m.address && (
                      <p style={{ fontSize: "0.75rem", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "0.15rem 0 0" }}>
                        {m.address}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap" }}>
                  <Link
                    href={`/majstor/${m.slug}`}
                    style={{ borderRadius: "0.5rem", background: "#111827", padding: "0.3rem 0.625rem", fontSize: "0.6875rem", fontWeight: 600, color: "#ffffff", textDecoration: "none", flexShrink: 0 }}
                  >
                    Profil →
                  </Link>
                  {m.phone && (
                    <a
                      href={`tel:${m.phone}`}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.6875rem", fontWeight: 600, color: "#f97316", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      {m.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
