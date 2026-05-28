# Promptfolio — Project Documentation

เอกสารรวมสำหรับโปรเจกต์ Promptfolio Line Admin

---

## สารบัญ

1. [ภาพรวมโปรเจกต์](#1-ภาพรวมโปรเจกต์)
2. [Tech Stack](#2-tech-stack)
3. [การติดตั้งและรันโปรเจกต์](#3-การติดตั้งและรันโปรเจกต์)
4. [Environment Variables](#4-environment-variables)
5. [โครงสร้างโปรเจกต์](#5-โครงสร้างโปรเจกต์)
6. [Routes และ Pages](#6-routes-และ-pages)
7. [Database Schema](#7-database-schema)
8. [Authentication System](#8-authentication-system)
9. [Admin Panel](#9-admin-panel)
10. [Scripts](#10-scripts)

---

## 1. ภาพรวมโปรเจกต์

**Promptfolio** คือ personal portfolio และ project tracker ที่บันทึกทุกโปรเจกต์พร้อม AI prompt ที่ใช้สร้าง มี admin panel สำหรับจัดการเนื้อหาทั้งหมด

- **Frontend public**: แสดง portfolio, projects, about page
- **Admin panel** (`/admin`): จัดการ projects, blocks, about page — ป้องกันด้วย session auth

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| ORM | Prisma 7 (adapter-pg) |
| Database | PostgreSQL (Supabase) |
| Password Hashing | bcryptjs |
| Runtime | Node.js |

> **หมายเหตุ**: Prisma 7 มี breaking changes — database URL ถูกย้ายออกจาก `schema.prisma` ไปไว้ใน `prisma.config.ts` และใช้ adapter pattern สำหรับ PostgreSQL

---

## 3. การติดตั้งและรันโปรเจกต์

```bash
# ติดตั้ง dependencies
npm install

# สร้าง admin user ครั้งแรก (ก่อน run ครั้งแรก)
npm run create-admin

# รัน dev server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

```bash
# Build สำหรับ production (รัน prisma generate อัตโนมัติ)
npm run build
npm run start
```

---

## 4. Environment Variables

สร้างไฟล์ `.env.local` ที่ root:

```env
# Database
DATABASE_URL="postgresql://..."         # connection pooling URL
DIRECT_URL="postgresql://..."           # direct URL (ใช้สำหรับ migration/seed)
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."

# Admin Session
ADMIN_SESSION="your-secret-token"       # session token เก็บใน cookie
ADMIN_NAME="Your Name"                  # display name (optional)
```

> `ADMIN_PASSWORD` ไม่มีแล้ว — password เก็บใน database เป็น bcrypt hash

---

## 5. โครงสร้างโปรเจกต์

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Navbar, Footer)
│   ├── page.tsx                # หน้าแรก (Hero, stats, featured projects)
│   ├── about/page.tsx          # About page (public)
│   ├── projects/
│   │   ├── page.tsx            # All projects
│   │   └── [id]/page.tsx       # Project detail
│   ├── blocks/page.tsx         # Blocks/notes (public)
│   ├── login/
│   │   ├── page.tsx            # Login page
│   │   ├── LoginForm.tsx       # Form (Client Component)
│   │   └── actions.ts          # Server Action: login, logout
│   └── admin/
│       ├── layout.tsx          # Admin layout + auth guard
│       ├── page.tsx            # Admin overview (stats)
│       ├── projects/           # CRUD projects
│       ├── blocks/             # CRUD blocks
│       └── about/              # Edit about/profile
├── components/
│   ├── Navbar.tsx
│   ├── AdminNavbar.tsx
│   ├── Footer.tsx
│   ├── ProjectCard.tsx
│   ├── PhotoSlideshow.tsx
│   ├── PhotoGallery.tsx
│   ├── FadeUp.tsx              # Animation wrapper
│   ├── CountUp.tsx             # Animated number
│   └── StaggerGrid.tsx         # Staggered grid animation
└── lib/
    ├── auth.ts                 # isAdmin(), verifyAdminCredentials()
    ├── db.ts                   # Prisma client singleton
    ├── projects.ts             # Static project data (legacy)
    ├── profile-defaults.ts     # Default profile values
    └── admin-styles.ts         # Shared admin UI class strings

prisma/
├── schema.prisma               # Database models
└── seed.ts                     # Seed script

scripts/
└── create-admin.ts             # Script สร้าง/อัปเดต admin user

docs/
├── docHere.md                  # เอกสารนี้
└── auth.md                     # Auth system รายละเอียด
```

---

## 6. Routes และ Pages

### Public Routes

| Route | หน้าที่ |
|---|---|
| `/` | Hero section, project stats, featured projects |
| `/about` | Bio, skills, experience, photos |
| `/projects` | ทุก project แบ่งตาม status |
| `/projects/[id]` | รายละเอียด project + prompt log |
| `/blocks` | Notes/blocks ทั้งหมด |
| `/login` | หน้า login สำหรับ admin |

### Admin Routes (ต้อง login ก่อน)

| Route | หน้าที่ |
|---|---|
| `/admin` | Overview: stats จำนวน projects, blocks |
| `/admin/projects` | จัดการ projects (add / edit / delete) |
| `/admin/blocks` | จัดการ blocks/notes |
| `/admin/about` | แก้ไข profile, skills, experience, photos |

---

## 7. Database Schema

### `Project`

| field | type | หมายเหตุ |
|---|---|---|
| `id` | String (cuid) | PK |
| `title` | String | |
| `description` | String | short |
| `longDescription` | String? | optional, ใช้ใน detail page |
| `tags` | String[] | |
| `status` | String | `planning` / `in-progress` / `completed` |
| `startDate` | String | |
| `endDate` | String? | |
| `featured` | Boolean | แสดงในหน้าแรก |
| `githubUrl` / `liveUrl` / `demoUrl` | String? | links |

### `Block`

| field | type | หมายเหตุ |
|---|---|---|
| `id` | String (cuid) | PK |
| `tag` | String | เช่น "Note", "Tip" |
| `date` | String | เช่น "May 2026" |
| `title` | String | |
| `body` | String | เนื้อหา |

### `Profile`

| field | type | หมายเหตุ |
|---|---|---|
| `id` | String | PK = `"singleton"` (มีแค่ 1 row) |
| `name`, `title`, `description` | String | |
| `university`, `degree`, `location` | String | |
| `mainPhoto`, `photoCaption` | String | |

### `SkillGroup`

| field | type |
|---|---|
| `category` | String |
| `items` | String[] |

### `Experience`

| field | type | หมายเหตุ |
|---|---|---|
| `year` | String | |
| `role`, `company`, `desc` | String | |
| `order` | Int | เรียงลำดับ |

### `Photo`

| field | type | หมายเหตุ |
|---|---|---|
| `src` | String | path หรือ URL |
| `alt`, `caption` | String | |
| `inSlideshow` | Boolean | แสดงใน slideshow |
| `order` | Int | เรียงลำดับ |

### `AdminUser`

| field | type | หมายเหตุ |
|---|---|---|
| `username` | String (unique) | ชื่อ login |
| `passwordHash` | String | bcrypt hash |
| `displayName` | String | ชื่อที่แสดงใน UI |

---

## 8. Authentication System

ดูรายละเอียดเต็มได้ที่ [`auth.md`](./auth.md)

### ภาพรวมสั้น

```
กรอก form → Server Action → verifyAdminCredentials() → bcrypt.compare()
                                                              ↓ (ถ้าถูก)
                                                    set cookie: admin_session
                                                              ↓
                                                    redirect → /admin
```

ทุก request ไปยัง `/admin/*` ผ่าน `admin/layout.tsx` ที่ตรวจ cookie กับ `ADMIN_SESSION` ทุกครั้ง

### สร้าง/เปลี่ยน password

```bash
npm run create-admin
```

---

## 9. Admin Panel

### Pattern ของทุก admin page

แต่ละ admin section ใช้ pattern เดียวกัน:

```
page.tsx (Server Component)
  └── *-client.tsx (Client Component)
        └── actions.ts (Server Actions: create / update / delete)
```

- **Server Component** (`page.tsx`): fetch ข้อมูลจาก DB, ส่งเป็น props
- **Client Component** (`*-client.tsx`): จัดการ UI state, form, optimistic updates
- **Server Actions** (`actions.ts`): mutation (create/update/delete) + `revalidatePath`

### ตัวอย่าง: Projects

```
/admin/projects/page.tsx         → ดึง projects ทั้งหมดจาก DB
/admin/projects/projects-client.tsx → UI: list, add form, edit, delete
/admin/projects/actions.ts       → createProject(), updateProject(), deleteProject()
```

---

## 10. Scripts

```bash
npm run dev           # รัน dev server (localhost:3000)
npm run build         # prisma generate + next build
npm run start         # รัน production server
npm run lint          # ESLint
npm run create-admin  # สร้าง/อัปเดต admin user ใน DB
```

### Seed Database

```bash
npx tsx prisma/seed.ts
```

> **คำเตือน**: seed จะลบข้อมูลทุกตาราง (ยกเว้น `AdminUser`) แล้ว insert ใหม่

### Prisma Commands

```bash
npx prisma db push          # sync schema → DB (ไม่มี migration history)
npx prisma studio           # เปิด DB GUI
npx prisma generate         # re-generate Prisma Client
```
