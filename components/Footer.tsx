import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
        <span>© {new Date().getFullYear()} MajstoriNS. Sva prava zadržana.</span>
        <div className="flex gap-4">
          <Link href="/uslovi" className="hover:text-zinc-900 transition-colors">Uslovi korišćenja</Link>
          <Link href="/privatnost" className="hover:text-zinc-900 transition-colors">Politika privatnosti</Link>
          <Link href="/opt-out" className="hover:text-zinc-900 transition-colors">Ukloni me</Link>
        </div>
      </div>
    </footer>
  );
}
