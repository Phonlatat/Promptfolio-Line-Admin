import bcrypt from "bcryptjs";
import { db } from "./db";

export const ADMIN_NAME = process.env.ADMIN_NAME ?? "Admin";

export async function verifyAdminLogin(
  username: string,
  password: string
): Promise<string | null> {
  const user = await db.adminUser.findUnique({ where: { username } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user.id : null;
}
