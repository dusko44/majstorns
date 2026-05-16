"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Result = {
  slug: string;
  business_name: string;
  category_name: string;
  address: string | null;
};

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.rpc("search_craftsmen", { term }).limit(7);
      setResults(data ?? []);
      setOpen(true);
      setLoading(false);
    }, 280);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", maxWidth: "22rem", width: "100%" }}>
      {/* Input — izgleda kao staro dugme */}
      <div
        className="flex items-center rounded-full"
        style={{
          background: "#f97316",
          padding: "0.875rem 0.875rem 0.875rem 1.75rem",
          gap: "0.75rem",
          width: "100%",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={e => {
            if (e.key === "Escape") { setOpen(false); return; }
            if (e.key === "Enter") {
              const val = query.trim();
              if (val) router.push(`/pretraga?q=${encodeURIComponent(val)}`);
            }
          }}
          placeholder="Traži majstora…"
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "#ffffff",
            width: "100%",
          }}
        />
        <button
          type="button"
          onClick={() => {
            const val = query.trim();
            if (val) router.push(`/pretraga?q=${encodeURIComponent(val)}`);
          }}
          className="flex items-center justify-center rounded-full"
          style={{ width: "2.25rem", height: "2.25rem", background: "rgba(0,0,0,0.18)", flexShrink: 0, border: "none", cursor: "pointer" }}
        >
          {loading ? (
            <div style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          )}
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 0.75rem)",
          left: 0,
          minWidth: "100%",
          background: "#ffffff",
          borderRadius: "1rem",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          overflow: "hidden",
          zIndex: 100,
        }}>
          {results.length === 0 ? (
            <div style={{ padding: "1rem 1.25rem", fontSize: "0.8125rem", color: "#9ca3af" }}>
              Nema rezultata
            </div>
          ) : (
            results.map(r => (
              <Link
                key={r.slug}
                href={`/majstor/${r.slug}`}
                onClick={() => { setOpen(false); setQuery(""); }}
                style={{ display: "block", padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(0,0,0,0.05)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#faf9f7")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#111827" }}>
                  {r.business_name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.125rem" }}>
                  {r.category_name}{r.address ? ` · ${r.address}` : ""}
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      <style>{`
        ::placeholder { color: rgba(255,255,255,0.7); }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
