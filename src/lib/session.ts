import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "admin_session";
export const MAX_AGE = 60 * 60 * 8; // 8 hours

function getKey() {
  const secret = process.env.JWT_SECRET ?? "fallback-dev-secret-change-in-prod";
  return new TextEncoder().encode(secret);
}

export async function signSession(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getKey());
}

export async function verifySession(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getKey());
    return payload as { userId: string };
  } catch {
    return null;
  }
}
