import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-600">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-base font-semibold" style={{ color: "#18181b" }}>
              Majstori<span style={{ color: "#f97316" }}>NS</span>
            </div>
            <p className="mt-2 text-zinc-500">
              Direktorijum zanatlija u Novom Sadu i okolini. Pronađi majstora u par klikova — bez logovanja, besplatno.
            </p>
          </div>
          <div>
            <div className="font-medium text-zinc-900">Stranice</div>
            <ul className="mt-2 space-y-1">
              <li><Link href="/kategorije" className="hover:text-zinc-900">Sve kategorije</Link></li>
              <li><Link href="/mapa" className="hover:text-zinc-900">Mapa majstora</Link></li>
              <li><Link href="/o-nama" className="hover:text-zinc-900">O nama</Link></li>
              <li><Link href="/kontakt" className="hover:text-zinc-900">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-zinc-900">Za majstore</div>
            <ul className="mt-2 space-y-1">
              <li><Link href="/kontakt" className="hover:text-zinc-900">Postani deo direktorijuma</Link></li>
              <li><Link href="/opt-out" className="hover:text-zinc-900">Ovo je moja radionica — ukloni me</Link></li>
              <li><Link href="/uslovi" className="hover:text-zinc-900">Uslovi korišćenja</Link></li>
              <li><Link href="/privatnost" className="hover:text-zinc-900">Politika privatnosti</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} MajstoriNS. Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}
