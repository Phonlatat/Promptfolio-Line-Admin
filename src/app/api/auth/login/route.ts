import { NextRequest, NextResponse } from "next/server";
import { verifyAdminLogin } from "@/lib/auth";
import { signSession, COOKIE_NAME, MAX_AGE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  const userId = await verifyAdminLogin(username, password);
  if (!userId) {
    return NextResponse.json({ error: "Username หรือ Password ไม่ถูกต้อง" }, { status: 401 });
  }

  const token = await signSession(userId);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}
