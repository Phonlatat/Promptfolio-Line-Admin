"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION, ADMIN_PASSWORD } from "@/lib/auth";

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const id = formData.get("id") as string;
  const pass = formData.get("password") as string;

  if (id === ADMIN_SESSION && pass === ADMIN_PASSWORD) {
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
