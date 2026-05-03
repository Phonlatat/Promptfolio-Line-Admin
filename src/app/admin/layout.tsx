import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (jar.get("admin_session")?.value !== "ok") {
    redirect("/login");
  }
  return <>{children}</>;
}
