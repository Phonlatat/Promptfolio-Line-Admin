"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const id = formData.get("id") as string;
  const pass = formData.get("password") as string;

  if (id === "aom242544" && pass === "AoM242544") {
    const jar = await cookies();
    jar.set("admin_session", "ok", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
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
