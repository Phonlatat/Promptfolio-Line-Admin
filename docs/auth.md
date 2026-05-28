# Authentication System

ระบบ auth ของ Promptfolio เป็น custom session-based auth สำหรับ admin คนเดียว ไม่ได้ใช้ library อย่าง NextAuth

---

## ภาพรวม

```
Browser          Next.js Server          Database (Supabase)
   |                    |                        |
   |-- POST /login ---→ |                        |
   |   {username,pass}  |-- findUnique --------→ |
   |                    |← {username,passwordHash}|
   |                    |                        |
   |                    | bcrypt.compare()        |
   |                    |                        |
   |← Set-Cookie ------  |  (ถ้าถูกต้อง)          |
   |  admin_session=... |                        |
   |                    |                        |
   |-- GET /admin ----→ |                        |
   |  Cookie: admin_... |                        |
   |                    | isAdmin() ← ตรวจ cookie |
   |← 200 OK ---------- |                        |
```

---

## ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|---|---|
| `src/lib/auth.ts` | `isAdmin()` และ `verifyAdminCredentials()` |
| `src/app/login/page.tsx` | หน้า login (Server Component) |
| `src/app/login/LoginForm.tsx` | Form UI (Client Component) |
| `src/app/login/actions.ts` | Server Action สำหรับตรวจ credentials |
| `src/app/admin/layout.tsx` | Guard ป้องกัน `/admin/*` ทุก route |
| `prisma/schema.prisma` | `AdminUser` model |
| `scripts/create-admin.ts` | Script สร้าง/อัปเดต admin user |

---

## Flow การ Login

### 1. ผู้ใช้กรอก form

`LoginForm.tsx` ใช้ React `useActionState` เพื่อส่ง form ไปยัง Server Action โดยตรง ไม่ผ่าน API route

```tsx
const [state, action, pending] = useActionState(login, null);
<form action={action}>...</form>
```

### 2. Server Action ตรวจ credentials

`login/actions.ts` → เรียก `verifyAdminCredentials(username, password)`

```ts
// src/lib/auth.ts
export async function verifyAdminCredentials(username, password) {
  const user = await db.adminUser.findUnique({ where: { username } });
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash); // bcrypt ไม่เปิดเผย plain text
}
```

### 3. ถ้าถูกต้อง — set cookie

```ts
jar.set("admin_session", ADMIN_SESSION, {
  httpOnly: true,   // JS ฝั่ง client เข้าถึงไม่ได้
  sameSite: "lax",
  maxAge: 60 * 60 * 8,  // หมดอายุ 8 ชั่วโมง
  path: "/",
});
redirect("/admin");
```

cookie value คือ `ADMIN_SESSION` จาก env — เป็น shared secret ที่ server ใช้ยืนยัน session

### 4. ทุก request ไปยัง `/admin/*`

`admin/layout.tsx` ทำงานเป็น Server Component ที่อ่าน cookie ทุกครั้ง:

```ts
const userId = jar.get("admin_session")?.value ?? "";
if (!isAdmin(userId)) redirect("/login");
```

```ts
// src/lib/auth.ts
export function isAdmin(sessionValue: string): boolean {
  return !!ADMIN_SESSION && sessionValue === ADMIN_SESSION;
}
```

ถ้า cookie ไม่ตรงหรือหมดอายุ → redirect ไป `/login` อัตโนมัติ

---

## การเก็บข้อมูล

### Database: `AdminUser` table

| column | type | หมายเหตุ |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `username` | String (unique) | ชื่อ login |
| `passwordHash` | String | bcrypt hash, salt rounds = 12 |
| `displayName` | String | ชื่อที่แสดงใน UI |
| `createdAt` / `updatedAt` | DateTime | auto |

Password เก็บเป็น bcrypt hash เท่านั้น — ไม่มีใครอ่าน plain text ได้แม้แต่ DB admin

### Environment Variables

| variable | เก็บที่ | หน้าที่ |
|---|---|---|
| `ADMIN_SESSION` | `.env.local` | Session token ใช้ยืนยัน cookie |
| `ADMIN_NAME` | `.env.local` | ชื่อ display (optional) |

`ADMIN_PASSWORD` ถูกลบออกแล้ว — password อยู่ใน DB เท่านั้น

---

## การสร้าง/เปลี่ยน Admin Password

```bash
npm run create-admin
```

Script จะถามทีละขั้น:

```
Username: Phonlatat
Password: ••••••••••
Display name (Enter to skip):
✅ Admin user "Phonlatat" created/updated.
```

ถ้า username นั้นมีอยู่แล้ว จะ update password ให้ทันที (upsert)

---

## Logout

`AdminNavbar` มีปุ่ม logout ที่เรียก Server Action `logout()`:

```ts
export async function logout() {
  jar.delete("admin_session");
  redirect("/login");
}
```

ลบ cookie ออกแล้ว redirect ไป `/login`
