"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function registerAdmin(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const existing = await db.adminUser.count();
  if (existing > 0) {
    redirect("/login");
  }

  const username = (formData.get("username") as string).trim();
  const displayName = (formData.get("displayName") as string).trim();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!username || !password) return { error: "กรุณากรอกข้อมูลให้ครบ" };
  if (password.length < 8) return { error: "Password ต้องมีอย่างน้อย 8 ตัวอักษร" };
  if (password !== confirm) return { error: "Password ไม่ตรงกัน" };

  const passwordHash = await bcrypt.hash(password, 12);
  await db.adminUser.create({
    data: { username, passwordHash, displayName: displayName || username },
  });

  redirect("/login");
}
