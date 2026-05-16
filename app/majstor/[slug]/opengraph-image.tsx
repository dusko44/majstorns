import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const alt = "MajstoriNS — Direktorijum majstora u Novom Sadu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data } = await supabase
    .from("craftsmen_map_view")
    .select("business_name, category_name")
    .eq("slug", slug)
    .single();

  const businessName = data?.business_name ?? "MajstoriNS";
  const categoryName = data?.category_name ?? "Majstori Novog Sada";

  const fontSize = businessName.length > 45 ? 44 : businessName.length > 28 ? 54 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0f0f0f",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dekorativni krug */}
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            border: "1px solid rgba(249,115,22,0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "1px solid rgba(249,115,22,0.07)",
            display: "flex",
          }}
        />

        {/* Kategorija chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-start",
            background: "rgba(249,115,22,0.12)",
            border: "1px solid rgba(249,115,22,0.25)",
            borderRadius: 999,
            padding: "6px 18px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              color: "#f97316",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {categoryName} · Novi Sad
          </span>
        </div>

        {/* Ime firme */}
        <div
          style={{
            fontSize,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: 900,
            display: "flex",
          }}
        >
          {businessName}
        </div>

        {/* Branding dole */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 96,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span style={{ color: "#ffffff", fontSize: 18, fontWeight: 800 }}>
            Majstori
          </span>
          <span style={{ color: "#f97316", fontSize: 18, fontWeight: 800 }}>
            NS
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: 14,
              marginLeft: 12,
            }}
          >
            majstorins.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
