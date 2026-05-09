export const ADMIN_SESSION = process.env.ADMIN_SESSION ?? "";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
export const ADMIN_NAME = process.env.ADMIN_NAME ?? "Admin";

export function isAdmin(sessionValue: string): boolean {
  return !!ADMIN_SESSION && sessionValue === ADMIN_SESSION;
}
