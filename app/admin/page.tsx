import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  contacted: "Kontaktiran",
  paid: "Platio",
  removed: "Uklonjen",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "#6b7280",
  contacted: "#2563eb",
  paid: "#16a34a",
  removed: "#dc2626",
};

async function setContacted(id: string) {
  "use server";
  const supabase = createAdminClient();
  await supabase.from("craftsmen").update({ status: "contacted" }).eq("id", id);
}

async function setPaid(id: string) {
  "use server";
  const supabase = createAdminClient();
  const paidUntil = new Date();
  paidUntil.setFullYear(paidUntil.getFullYear() + 1);
  await supabase
    .from("craftsmen")
    .update({ status: "paid", paid_until: paidUntil.toISOString().split("T")[0] })
    .eq("id", id);
}

async function setRemoved(id: string) {
  "use server";
  const supabase = createAdminClient();
  await supabase.from("craftsmen").update({ status: "removed" }).eq("id", id);
}

async function setRestored(id: string) {
  "use server";
  const supabase = createAdminClient();
  await supabase.from("craftsmen").update({ status: "pending" }).eq("id", id);
}

const FILTERS = ["all", "pending", "contacted", "paid", "removed"] as const;
const FILTER_LABEL: Record<string, string> = {
  all: "Svi",
  pending: "Pending",
  contacted: "Kontaktirani",
  paid: "Platili",
  removed: "Uklonjeni",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = FILTERS.includes(status as typeof FILTERS[number]) ? status! : "all";

  const supabase = createAdminClient();
  let query = supabase
    .from("craftsmen")
    .select("id, slug, business_name, phone, email, status, paid_until, categories(name_sr)")
    .order("business_name");

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data: craftsmen } = await query;

  const counts: Record<string, number> = { all: 0, pending: 0, contacted: 0, paid: 0, removed: 0 };
  const { data: allStatuses } = await supabase.from("craftsmen").select("status");
  allStatuses?.forEach((c) => {
    counts.all++;
    counts[c.status] = (counts[c.status] ?? 0) + 1;
  });

  return (
    <div>
      {/* Filteri */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin" : `/admin?status=${f}`}
            style={{
              padding: "0.375rem 0.875rem",
              borderRadius: "999px",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
              background: filter === f ? "#111" : "#fff",
              color: filter === f ? "#fff" : "#374151",
              border: "1px solid",
              borderColor: filter === f ? "#111" : "#e5e7eb",
            }}
          >
            {FILTER_LABEL[f]} ({counts[f] ?? 0})
          </Link>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ background: "#fff", borderRadius: "1rem", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Radionica</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Kategorija</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Kontakt</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Status</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Plaćeno do</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600, color: "#374151" }}>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {craftsmen?.map((c, i) => {
              const cat = (Array.isArray(c.categories) ? c.categories[0] : c.categories) as { name_sr: string } | null;
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <Link href={`/majstor/${c.slug}`} target="_blank" style={{ fontWeight: 600, color: "#111", textDecoration: "none" }}>
                      {c.business_name}
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>{cat?.name_sr ?? "—"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} style={{ display: "block", color: "#2563eb", textDecoration: "none" }}>{c.phone}</a>
                    )}
                    {c.email && (
                      <span style={{ display: "block", color: "#6b7280", fontSize: "0.8125rem" }}>{c.email}</span>
                    )}
                    {!c.phone && !c.email && <span style={{ color: "#d1d5db" }}>—</span>}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ background: STATUS_COLOR[c.status] + "18", color: STATUS_COLOR[c.status], borderRadius: "999px", padding: "0.2rem 0.6rem", fontWeight: 600, fontSize: "0.75rem" }}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "#6b7280" }}>
                    {c.paid_until ?? "—"}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                      {c.status === "pending" && (
                        <form action={setContacted.bind(null, c.id)}>
                          <button type="submit" style={btnStyle("#2563eb")}>Kontaktiran</button>
                        </form>
                      )}
                      {(c.status === "contacted" || c.status === "pending") && (
                        <form action={setPaid.bind(null, c.id)}>
                          <button type="submit" style={btnStyle("#16a34a")}>Platio</button>
                        </form>
                      )}
                      {c.status !== "removed" && (
                        <form action={setRemoved.bind(null, c.id)}>
                          <button type="submit" style={btnStyle("#dc2626")}>Ukloni</button>
                        </form>
                      )}
                      {c.status === "removed" && (
                        <form action={setRestored.bind(null, c.id)}>
                          <button type="submit" style={btnStyle("#6b7280")}>Vrati</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(!craftsmen || craftsmen.length === 0) && (
          <div style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
            Nema majstora za ovaj filter.
          </div>
        )}
      </div>
    </div>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    background: color + "12",
    color,
    border: `1px solid ${color}30`,
    borderRadius: "0.375rem",
    padding: "0.25rem 0.625rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}
