import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";
import { CategoryCard } from "@/components/CategoryCard";

export const metadata: Metadata = {
  title: "Sve kategorije",
  description:
    "Pregled svih kategorija majstora u Novom Sadu — limari, stolari, vodoinstalateri, električari i još 15 zanata.",
};

export default function KategorijeePage() {
  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
      <div style={{ marginBottom: "3rem" }}>
        <div
          className="inline-flex items-center rounded-full"
          style={{ background: "#f3f4f6", padding: "0.3rem 0.875rem", marginBottom: "1.25rem" }}
        >
          <span style={{ color: "#6b7280", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
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
          18 zanata
        </h1>
        <p style={{ color: "#9ca3af", marginTop: "0.75rem", fontSize: "1rem" }}>
          Odaberi zanat i pronađi najbliže majstore u Novom Sadu.
        </p>
      </div>
      <div className="category-grid">
        {CATEGORIES.map((category, i) => (
          <CategoryCard key={category.slug} category={category} index={i} />
        ))}
      </div>
    </div>
  );
}
