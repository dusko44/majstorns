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
        background: "rgba(0,0,0,0.025)",
        borderRadius: "1.5rem",
        padding: "6px",
        border: `1px solid ${hovered ? "rgba(249,115,22,0.5)" : "rgba(0,0,0,0.1)"}`,
        boxShadow: hovered
          ? "0 0 0 3px rgba(249,115,22,0.08), 0 8px 28px rgba(249,115,22,0.15)"
          : "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition:
          "border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <Link
        href={`/${category.slug}`}
        style={{
          borderRadius: "calc(1.5rem - 6px)",
          padding: "1.25rem",
          minHeight: "8.5rem",
          background: "#ffffff",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ color: hovered ? "#fb923c" : "#d1d5db", transition: "color 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
            <CategoryIcon iconKey={category.iconKey} />
          </div>
          <span style={{ fontSize: "0.625rem", fontWeight: 500, color: "#e5e7eb", fontVariantNumeric: "tabular-nums" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: hovered ? "#f97316" : "#111827",
            marginTop: "auto",
            paddingTop: "1rem",
            lineHeight: 1.3,
            transition: "color 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {category.name}
        </span>
      </Link>
    </div>
  );
}
