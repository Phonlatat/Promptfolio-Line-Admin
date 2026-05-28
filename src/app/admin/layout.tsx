import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import { isAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const sessionValue = jar.get("admin_session")?.value ?? "";
  if (!await isAdmin(sessionValue)) {
    redirect("/login");
  }
  return (
    <div className="min-h-full bg-stone-50">
      <AdminNavbar />
      {children}
    </div>
  );
}
