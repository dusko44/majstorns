import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";
import { CategoryCard } from "@/components/CategoryCard";

export const metadata: Metadata = {
  title: "Odaberi zanat",
  description:
    "Odaberi zanat i pronađi najbliže majstore u Novom Sadu — limari, stolari, vodoinstalateri, električari i još 15 zanata.",
  alternates: { canonical: "/kategorije" },
};

export default function KategorijeePage() {
  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
    <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
      <div style={{ marginBottom: "3rem" }}>
        <div
          className="inline-flex items-center rounded-full"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.18)",
            padding: "0.45rem 1.1rem",
            marginBottom: "1.25rem",
          }}
        >
          <span style={{ color: "#111827", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Sve kategorije
          </span>
        </div>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Reši problem brzo
        </h1>
        <p style={{ color: "#111827", marginTop: "0.75rem", fontSize: "1.125rem" }}>
          Pronađi najbliže majstore na mapi.
        </p>
      </div>
      <div className="category-grid">
        {CATEGORIES.map((category, i) => (
          <CategoryCard key={category.slug} category={category} index={i} />
        ))}
      </div>
    </div>
    </div>
  );
}
