import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password") as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", process.env.ADMIN_SECRET!, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f4" }}>
      <div style={{ background: "#fff", borderRadius: "1rem", padding: "2.5rem", width: "100%", maxWidth: "360px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#111", marginBottom: "0.25rem" }}>
          MajstorNS Admin
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>
          Unesite lozinku za pristup
        </p>

        {error && (
          <p style={{ fontSize: "0.875rem", color: "#dc2626", marginBottom: "1rem" }}>
            Pogrešna lozinka.
          </p>
        )}

        <form action={login}>
          <input
            type="password"
            name="password"
            placeholder="Lozinka"
            autoFocus
            style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "0.625rem 0.875rem", fontSize: "0.9375rem", outline: "none", boxSizing: "border-box", marginBottom: "0.75rem" }}
          />
          <button
            type="submit"
            style={{ width: "100%", background: "#111", color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.625rem", fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer" }}
          >
            Prijavi se →
          </button>
        </form>
      </div>
    </div>
  );
}
