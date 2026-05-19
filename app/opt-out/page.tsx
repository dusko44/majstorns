import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

export const metadata: Metadata = {
  title: "Ukloni me iz direktorijuma",
  alternates: { canonical: "/opt-out" },
};

async function submitOptOut(formData: FormData) {
  "use server";

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = checkRateLimit(`opt-out:${ip}`, 5, 60);
  if (!allowed) redirect("/opt-out?error=rate-limit");

  const businessName = (formData.get("business_name") as string)?.trim();
  const contactEmail = (formData.get("contact_email") as string)?.trim();
  const reason = (formData.get("reason") as string)?.trim();

  if (!businessName) redirect("/opt-out?error=missing");

  const supabase = await createSupabaseServerClient();

  const { data: craftsmen } = await supabase
    .from("craftsmen")
    .select("id")
    .ilike("business_name", `%${businessName}%`)
    .limit(1);

  if (!craftsmen?.length) redirect("/opt-out?error=not-found");

  await supabase.from("opt_out_requests").insert({
    craftsman_id: craftsmen[0].id,
    contact_email: contactEmail || null,
    reason: reason || null,
  });

  redirect("/opt-out?success=1");
}

export default async function OptOutPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  if (success) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="text-4xl">✓</div>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
          Zahtev je primljen
        </h1>
        <p className="mt-3 text-zinc-500">
          Obradićemo ga u roku od 7 radnih dana i obrisati vaše podatke.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Ukloni moju radionicu
      </h1>
      <p className="mt-3 text-zinc-500">
        Ako su tvoji podaci na sajtu bez tvoje saglasnosti, popuni formu i
        brišemo ih u roku od 7 radnih dana.
      </p>

      {error === "rate-limit" && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Previše zahteva. Pokušaj ponovo za minut.
        </div>
      )}
      {error === "not-found" && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Nismo pronašli radionicu sa tim imenom. Proveri naziv ili nas kontaktiraj direktno.
        </div>
      )}
      {error === "missing" && (
        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Upiši naziv radionice.
        </div>
      )}

      <form action={submitOptOut} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Naziv radionice *
          </label>
          <input
            type="text"
            name="business_name"
            required
            placeholder="npr. Auto servis Petrović"
            className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Vaš email (opciono)
          </label>
          <input
            type="email"
            name="contact_email"
            placeholder="radi potvrde zahteva"
            className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Razlog (opciono)
          </label>
          <textarea
            name="reason"
            rows={3}
            placeholder="Zašto želiš da budeš uklonjen?"
            className="mt-1.5 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Pošalji zahtev
        </button>
      </form>
    </div>
  );
}
