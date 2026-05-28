import bcrypt from "bcryptjs";
import { db } from "./db";

export const ADMIN_SESSION = process.env.ADMIN_SESSION ?? "";
export const ADMIN_NAME = process.env.ADMIN_NAME ?? "Admin";

export function isAdmin(sessionValue: string): boolean {
  return !!ADMIN_SESSION && sessionValue === ADMIN_SESSION;
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const user = await db.adminUser.findUnique({ where: { username } });
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}
