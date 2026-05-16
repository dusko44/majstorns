import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktiraj MajstorNS tim — za grešku u podacima, pitanje ili saradnju.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Kontakt
      </h1>
      <p className="mt-4 text-zinc-600">
        Piši nam za sve — grešku u podacima, pitanje ili poslovnu saradnju.
      </p>

      <div className="mt-10 space-y-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-base font-semibold text-zinc-900">
            Majstor koji želi da se pridruži
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Ako si zanatlija iz Novog Sada i želiš da budeš u direktorijumu,
            pošalji nam svoje podatke (ime radionice, adresa, telefon,
            kategorija) na email ispod.
          </p>
          <a
            href="mailto:duskovujovic44@gmail.com?subject=Upis u direktorijum"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Pošalji zahtev →
          </a>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-base font-semibold text-zinc-900">
            Greška u podacima
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Ako su podaci o nekoj radionici netačni, javi nam i ispravićemo ih
            u najkraćem mogućem roku.
          </p>
          <a
            href="mailto:duskovujovic44@gmail.com?subject=Greška u podacima"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Prijavi grešku →
          </a>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-base font-semibold text-zinc-900">
            Uklanjanje iz direktorijuma
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Ako si zanatlija i ne želiš da tvoji podaci budu na sajtu, podnesi
            zahtev za uklanjanje.
          </p>
          <Link
            href="/opt-out"
            className="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Zahtev za uklanjanje →
          </Link>
        </div>
      </div>
    </div>
  );
}
