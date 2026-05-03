import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const VALID_USERS = new Set(["aom242544"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const userId = jar.get("admin_session")?.value ?? "";
  if (!VALID_USERS.has(userId)) {
    redirect("/login");
  }
  return <>{children}</>;
}
