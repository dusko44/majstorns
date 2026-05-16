"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

export function CategoryCard({
  category,
  index,
}: {
  category: Category;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
      }}
    >
      <Link
        href={`/${category.slug}`}
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "1.25rem",
          padding: "1.375rem",
          minHeight: "8.5rem",
          background: "linear-gradient(145deg, #ffffff 0%, #fdfcfb 100%)",
          border: `1px solid ${hovered ? "rgba(249,115,22,0.18)" : "rgba(0,0,0,0.07)"}`,
          boxShadow: hovered
            ? "0 0 0 4px rgba(249,115,22,0.03), 0 20px 48px rgba(249,115,22,0.07), 0 4px 12px rgba(0,0,0,0.05)"
            : "0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition:
            "border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ color: hovered ? "#f98a42" : "#065f46", transition: "color 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
            <CategoryIcon iconKey={category.iconKey} />
          </div>
          <span style={{ fontSize: "0.625rem", fontWeight: 500, color: "#d1d5db", fontVariantNumeric: "tabular-nums" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.1rem",
            background: hovered ? "#f98a42" : "#4b5563",
            borderRadius: "0.75rem",
            padding: "0.2rem 0.2rem 0.2rem 0.625rem",
            transition: "background 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#ffffff", lineHeight: 1.2, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {category.name}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.375rem",
              height: "1.375rem",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              color: "#ffffff",
              fontSize: "0.875rem",
              flexShrink: 0,
            }}
          >
            →
          </span>
        </div>
      </Link>
    </div>
  );
}
