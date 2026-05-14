import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nama",
  description:
    "Saznaj više o MajstorNS projektu — zašto smo ga napravili i kako funkcioniše.",
};

export default function ONamaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        O projektu
      </h1>

      <div className="prose mt-8 text-zinc-600">
        <p>
          <strong className="text-zinc-900">MajstorNS</strong> je lokalni
          direktorijum zanatlija i servisera u Novom Sadu i okolini. Napravili
          smo ga jer pronalaženje pouzdanog majstora u gradu ne bi trebalo da
          bude komplikovano.
        </p>

        <p className="mt-4">
          Na jednom mestu ćeš naći limara, stolara, vodoinstalatera,
          električara i još 15 zanata — bez registracije, bez ankete, bez
          provizije. Samo otvoriš, pronađeš i pozivaš.
        </p>

        <p className="mt-4">
          Majstori su upisani na osnovu javno dostupnih informacija. Ako
          primеtiš grešku u podacima ili žliš da ukloniš svoju radionicu,
          javi nam se.
        </p>
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          href="/kontakt"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Kontaktiraj nas
        </Link>
        <Link
          href="/opt-out"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:border-zinc-400"
        >
          Ukloni moju radionicu
        </Link>
      </div>
    </div>
  );
}
