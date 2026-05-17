"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

export function CategoryCard({
  category,
}: {
  category: Category;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/${category.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.875rem",
        background: "#f4f4f5",
        borderRadius: "0.875rem",
        padding: "0.875rem 1rem",
        border: "1px solid rgba(0,0,0,0.18)",
        boxShadow: "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition:
          "box-shadow 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1)",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "0.75rem",
          flexShrink: 0,
          background: hovered ? "#27272a" : "#18181b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fb923c",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition:
            "background 0.3s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <CategoryIcon iconKey={category.iconKey} size={26} />
      </div>
      <span
        style={{
          fontSize: "0.9375rem",
          fontWeight: 700,
          color: "#18181b",
          lineHeight: 1.2,
        }}
      >
        {category.name}
      </span>
    </Link>
  );
}
