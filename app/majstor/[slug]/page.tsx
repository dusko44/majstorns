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
  const hours = c.working_hours as Record<string, string[]> | null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 text-sm text-zinc-500">
        <Link href={`/${c.category_slug}`} className="hover:text-zinc-900">
          {c.category_name}
        </Link>
        <span className="mx-2">›</span>
        <span>{c.business_name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Mapa */}
        <div
          className="overflow-hidden rounded-2xl border border-zinc-200"
          style={{ height: 380 }}
        >
          <CraftsmanMapWrapper lat={c.lat} lng={c.lng} name={c.business_name} />
        </div>

        {/* Detalji */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-sm font-medium text-orange-500">
              {c.category_name}
            </span>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
              {c.business_name}
            </h1>
            {c.address && (
              <p className="mt-2 text-zinc-500">{c.address}</p>
            )}
          </div>

          {/* Kontakt dugmad */}
          <div className="flex flex-wrap gap-2">
            {c.phone && (
              <a
                href={`tel:${c.phone}`}
                className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Pozovi
              </a>
            )}
            {c.viber && (
              <a
                href={`viber://chat?number=${c.viber}`}
                className="inline-flex items-center rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
              >
                Viber
              </a>
            )}
            {c.whatsapp && (
              <a
                href={`https://wa.me/${c.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
              >
                WhatsApp
              </a>
            )}
            {c.website && (
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Sajt
              </a>
            )}
          </div>

          {/* Navigacija */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              <span>📍</span> Google Maps
            </a>
            <a
              href={`https://waze.com/ul?ll=${c.lat},${c.lng}&navigate=yes`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              <span>🗺</span> Waze
            </a>
          </div>

          {/* Radno vreme */}
          {hours && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Radno vreme
              </h2>
              <div className="overflow-hidden rounded-xl border border-zinc-200">
                {DAY_ORDER.map((day) => {
                  const val = hours[day];
                  const isToday = day === todayKey;
                  const label = val
                    ? val[0] === "Closed"
                      ? "Zatvoreno"
                      : val[0]
                    : "—";
                  return (
                    <div
                      key={day}
                      className={`flex justify-between border-b border-zinc-100 px-4 py-2.5 text-sm last:border-0 ${
                        isToday ? "bg-orange-50" : ""
                      }`}
                    >
                      <span
                        className={
                          isToday
                            ? "font-semibold text-orange-600"
                            : "text-zinc-600"
                        }
                      >
                        {DAYS_SR[day]}
                      </span>
                      <span
                        className={
                          isToday ? "font-semibold text-orange-600" : "text-zinc-900"
                        }
                      >
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
  );
}
