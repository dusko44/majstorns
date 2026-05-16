import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4" }}>
      <div style={{ background: "#111", padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: "0.9375rem" }}>
          MajstorNS Admin
        </span>
        <form action={logout}>
          <button
            type="submit"
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", borderRadius: "0.375rem", padding: "0.3rem 0.75rem", fontSize: "0.8125rem", cursor: "pointer" }}
          >
            Odjavi se
          </button>
        </form>
      </div>
      <div style={{ padding: "1.5rem" }}>
        {children}
      </div>
    </div>
  );
}
