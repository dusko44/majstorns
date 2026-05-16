import { CATEGORIES } from "@/lib/categories";
import { CategoryCard } from "@/components/CategoryCard";
import { HeroIllustration } from "@/components/HeroIllustration";
import { SearchBox } from "@/components/SearchBox";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "#0f0f0f", minHeight: "88vh", display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "6rem 1.5rem", width: "100%" }}>
        <div>
          {/* Eyebrow pill */}
          <div
            className="inline-flex items-center rounded-full"
            style={{
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.2)",
              padding: "0.3rem 0.875rem",
              marginBottom: "2rem",
            }}
          >
            <span style={{ color: "#f97316", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              500+ majstora u Novom Sadu
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              color: "#ffffff",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: "14ch",
              marginBottom: "1.5rem",
            }}
          >
            Pronađi pravog majstora
            <span style={{ color: "#f97316" }}>.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "1.125rem",
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: "30rem",
              marginBottom: "3rem",
            }}
          >
            Najveća baza majstora i zanata za Novi Sad i okolinu
          </p>

          {/* Search CTA */}
          <SearchBox />
        </div>
        </div>
        <HeroIllustration />
      </section>

      {/* Kategorije */}
      <section style={{ background: "#faf9f7", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ color: "#111827", fontSize: "1.25rem", fontWeight: 400, lineHeight: 1.5 }}>
              Odaberi zanate i vidi najbliže majstore na mapi
            </p>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((category, i) => (
              <CategoryCard key={category.slug} category={category} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Kako funkcioniše */}
      <section style={{ background: "#ffffff", padding: "6rem 1.5rem", borderTop: "1px solid #f3f4f6" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          {/* Eyebrow */}
          <div
            className="inline-flex items-center rounded-full"
            style={{ background: "#f3f4f6", padding: "0.3rem 0.875rem", marginBottom: "3.5rem" }}
          >
            <span style={{ color: "#6b7280", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Kako funkcioniše
            </span>
          </div>
          <div style={{ display: "grid", gap: "3.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))" }}>
            {[
              { n: "01", title: "Odaberi zanat", body: "Izaberi od 18 kategorija: limar, električar, vodoinstalater i ostali." },
              { n: "02", title: "Vidi ko je najbliži", body: "Mapa prikazuje sve majstore sortirane po udaljenosti od tebe." },
              { n: "03", title: "Pozovi direktno", body: "Proveri radno vreme i pozovi. Bez posrednika, bez registracije." },
            ].map(({ n, title, body }) => (
              <div key={n}>
                <span style={{ fontSize: "4.5rem", fontWeight: 800, color: "#f3f4f6", lineHeight: 1, display: "block" }}>
                  {n}
                </span>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", marginTop: "1rem" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA za majstore */}
      <section style={{ background: "#0f0f0f", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div
            className="inline-flex items-center rounded-full"
            style={{
              background: "rgba(249,115,22,0.1)",
              border: "1px solid rgba(249,115,22,0.2)",
              padding: "0.3rem 0.875rem",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ color: "#f97316", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Za majstore
            </span>
          </div>
          <h2
            style={{
              color: "#ffffff",
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Jesi li majstor?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: "28rem", marginBottom: "2.5rem", fontSize: "1rem", lineHeight: 1.7 }}>
            Dodaj svoju firmu na MajstoriNS i pojavi se na mapi.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center rounded-full font-semibold"
            style={{
              background: "#f97316",
              color: "#ffffff",
              padding: "0.875rem 0.875rem 0.875rem 1.75rem",
              gap: "0.75rem",
              fontSize: "0.9375rem",
            }}
          >
            Prijavi se kao majstor
            <span
              className="flex items-center justify-center rounded-full"
              style={{ width: "2.25rem", height: "2.25rem", background: "rgba(0,0,0,0.18)", flexShrink: 0 }}
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
