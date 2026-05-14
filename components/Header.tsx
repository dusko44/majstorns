import Link from "next/link";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ padding: "1rem 1.5rem", background: "rgba(250,250,250,0.7)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
    >
      <div
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 24px rgba(0,0,0,0.06)",
          padding: "0.625rem 1.5rem",
        }}
      >
        <Link
          href="/"
          className="font-extrabold"
          style={{ fontSize: "1.1rem", letterSpacing: "-0.01em", color: "#111827" }}
        >
          Majstori<span style={{ color: "#f97316" }}>NS</span>
        </Link>
        <nav
          className="flex items-center text-sm font-medium"
          style={{ gap: "2rem", color: "#9ca3af" }}
        >
          <Link href="/kategorije" className="transition hover:text-zinc-900">Kategorije</Link>
          <Link href="/o-nama" className="transition hover:text-zinc-900">Kako funkcioniše</Link>
          <Link href="/o-nama" className="transition hover:text-zinc-900">O nama</Link>
        </nav>
      </div>
    </header>
  );
}
