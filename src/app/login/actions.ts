"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION, verifyAdminCredentials } from "@/lib/auth";

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const username = formData.get("id") as string;
  const password = formData.get("password") as string;

  const valid = await verifyAdminCredentials(username, password);
  if (valid) {
    const jar = await cookies();
    jar.set("admin_session", ADMIN_SESSION, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    redirect("/admin");
  }

  return { error: "Username หรือ Password ไม่ถูกต้อง" };
}

export async function logout() {
  const jar = await cookies();
  jar.delete("admin_session");
  redirect("/login");
}
