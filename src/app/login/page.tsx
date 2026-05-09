import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const jar = await cookies();
  if (isAdmin(jar.get("admin_session")?.value ?? "")) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-700">
            Admin
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">
            เข้าสู่ระบบ
          </h1>
          <p className="mt-1 text-sm text-stone-400">สำหรับผู้ดูแลระบบเท่านั้น</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
