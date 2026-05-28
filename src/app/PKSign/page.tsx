import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import RegisterForm from "./RegisterForm";

export default async function PKSignPage() {
  const existing = await db.adminUser.count();
  if (existing > 0) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <span className="rounded-md bg-violet-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-violet-700">
            First Setup
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">
            สร้างบัญชี Admin
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            ตั้งค่าครั้งแรก — หน้านี้จะถูกปิดทันทีหลังสร้างบัญชีสำเร็จ
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
