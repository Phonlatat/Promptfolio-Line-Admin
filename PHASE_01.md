# Phase 01 — Promptfolio: From Zero to Live

**Period:** 2 May 2026 – 9 May 2026 (8 วัน)  
**Author:** H2o (Phonlatat)  
**Status:** ✅ Complete

---

## ภาพรวม

Phase 01 คือช่วงที่สร้าง Promptfolio ขึ้นมาจากศูนย์ ตั้งแต่ Next.js project ใหม่เปล่า ไปจนถึง portfolio website ที่ deploy บน Vercel พร้อม Admin panel เต็มรูปแบบ เชื่อมต่อฐานข้อมูลจริง และ photo storage บน Supabase

เป้าหมายที่ตั้งไว้ตั้งแต่ต้น:
- มีที่เดียวสำหรับแสดงและติดตามโปรเจกต์ทั้งหมด
- บันทึก AI prompt ที่ใช้สร้างแต่ละโปรเจกต์
- Admin ที่จัดการเนื้อหาได้เองโดยไม่ต้องแตะโค้ด

---

## Tech Stack

| Layer | Technology | เหตุผลที่เลือก |
|-------|-----------|----------------|
| Framework | Next.js 16.2.4 (App Router) | Server Components, Server Actions, ไม่ต้องทำ API layer แยก |
| Language | TypeScript 5 | Type safety ตลอด codebase |
| Styling | Tailwind CSS 4 | Design system ที่ consistent ทำได้เร็ว |
| Database | PostgreSQL (Supabase) | Managed DB ฟรีสำหรับ personal project |
| ORM | Prisma 7 + @prisma/adapter-pg | Type-safe queries, schema migration ง่าย |
| Animation | Framer Motion 12 | Declarative animations ที่ smooth |
| Storage | Supabase Storage | อัปโหลดรูปโดยตรงจาก Server Action |
| Deploy | Vercel | ง่ายสุดสำหรับ Next.js |
| Runtime | Node.js / React 19 | - |

---

## Timeline

### Day 1 — 2 May 2026: ก่อร่างโปรเจกต์

**Commits:** `23de428` Initial commit → `4bdab15` → `4484197`

**สิ่งที่ทำ:**
- Init Next.js project พร้อม TypeScript, Tailwind CSS 4, App Router
- สร้างหน้าแรก (Home) และหน้า About เวอร์ชันแรก
- วางโครงสี้: stone palette, font Geist
- Deploy ครั้งแรกขึ้น Vercel

**Design decisions:**
- ใช้ stone palette แทน slate/gray เพื่อให้ดู warm และ editorial
- `max-w-5xl` เป็น container หลักตลอดทั้งเว็บ
- Font: Geist Sans + Geist Mono (Next.js default ที่ดีพอ)

---

### Day 2-3 — 3 May 2026: Admin + ระบบรูปภาพ

**Commits:** `8dc9f5d` Add adminpage → `a1717aa` finish add photo to home

**สิ่งที่ทำ:**
- สร้าง Admin section ครั้งแรก (layout, หน้าหลัก)
- เพิ่ม cookie-based authentication (login/logout)
- สร้าง `PhotoSlideshow` component — slideshow แบบ carousel บน Home page
- สร้าง `PhotoGallery` component — masonry-style grid บน About page
- เพิ่ม animation components: `FadeUp`, `CountUp`, `StaggerGrid`
- Auth guard บน admin routes

**ทำไมถึงเลือก cookie auth แบบ simple:**
- เป็น personal site ที่มีผู้ใช้คนเดียว
- ไม่ต้องการ session store หรือ JWT ที่ซับซ้อน
- `httpOnly` + `sameSite: "lax"` ป้องกันได้เพียงพอ

---

### Day 4-6 — 6 May 2026: วันใหญ่ — Database + Full Admin

**Commits:** `22f56cf` → `cc9bfc7` → `cf89f1c` → `82df514` → `f03a08a` → `16a14d6`

วันนี้คือวันที่โปรเจกต์เปลี่ยนจาก static site เป็น dynamic web app จริงๆ

#### ช่วงเช้า — แยก Admin pages

**`22f56cf` add admin-page** (+2,598 lines)

แยก Admin ออกเป็น 3 sections พร้อม client components:
- `/admin/projects` — Projects CRUD
- `/admin/blocks` — Blocks CRUD  
- `/admin/about` — About content editor

แต่ละ section ใช้ pattern: **Server Component (data fetching) + Client Component (UI + state)**

```
admin/projects/
├── page.tsx          ← Server: fetch data
├── projects-client.tsx  ← Client: UI, state, optimistic updates
└── actions.ts        ← Server Actions: create/update/delete
```

#### ช่วงบ่าย — เชื่อมต่อ Supabase

**`cc9bfc7` connect supabase**

- ตั้งค่า PostgreSQL connection ผ่าน Supabase
- สร้าง Prisma client singleton ใน `src/lib/db.ts`
- ใช้ `PrismaClient + @prisma/adapter-pg` สำหรับ Edge/Node compatibility

**Prisma Schema — Models ที่สร้าง:**

| Model | ใช้ทำอะไร |
|-------|-----------|
| `Project` | โปรเจกต์ทั้งหมด พร้อม status, tags, links |
| `Block` | notes/thoughts สั้นๆ |
| `Profile` | ข้อมูล About page (singleton row) |
| `SkillGroup` | หมวดหมู่ skills + รายการ |
| `Experience` | ประสบการณ์การทำงาน |
| `Photo` | รูปภาพ gallery + slideshow |

#### ช่วงเย็น — About Editor + Photo Upload

**`82df514` finish edit Aboutme** (+1,453 lines net)

สร้าง `about-client.tsx` — component ที่ใหญ่ที่สุดในโปรเจกต์ มี 4 tabs:

1. **Profile** — แก้ชื่อ, bio, รูปหลัก (upload file หรือใส่ path)
2. **Skills** — เพิ่ม/ลบ skill groups และ items แบบ real-time
3. **Experience** — จัดการประวัติการทำงาน พร้อม edit modal
4. **Gallery** — อัปโหลดรูปจากเครื่องหรือใส่ URL, toggle slideshow

**Photo upload flow:**
```
User เลือกไฟล์
  → อ่าน EXIF GPS (ถ้ามี)
  → Reverse geocode ผ่าน Nominatim API (auto-caption)
  → Server Action อัปโหลดไฟล์ → Supabase Storage
  → บันทึก URL ใน PostgreSQL
```

**Key UX decisions:**
- Optimistic updates — UI อัปเดตทันทีก่อน server ตอบกลับ
- Toast notifications แทน alert()
- ใช้ `useTransition` เพื่อไม่ block UI ระหว่าง async operations

#### Deploy ครั้งแรก

**`16a14d6` Deploy no1**
- แก้ `next.config.ts` สำหรับ production image domains
- ปรับ photo path handling สำหรับ Supabase Storage URLs
- เว็บ live บน Vercel

---

### Day 7 — 8 May 2026: Storage Cleanup + Dev Tools

**Commits:** `ac2291d` delete photo from storage → `897b5aa` chap1

**`ac2291d` delete photo from storage**
- เพิ่ม `deletePhoto` ใน about actions ให้ลบไฟล์ออกจาก Supabase Storage ด้วย
- ก่อนหน้านี้ ลบ record ใน DB แต่ไฟล์ยังค้างอยู่ใน storage bucket

**`897b5aa` chap1**
- สร้าง `PROJECT_LOG.md` — เอกสารติดตาม progress
- สร้าง `scripts/update-log.ps1` — script อัปเดต log อัตโนมัติก่อน git push
- เพิ่ม EXIF location detection ใน photo upload

---

### Day 8 — 9 May 2026: Clean Code Pass

**สิ่งที่ทำวันนี้:**

ทำ clean code ทั้งโปรเจกต์ พบและแก้ปัญหา 6 จุด:

| # | ปัญหา | แก้อย่างไร |
|---|-------|------------|
| 1 | Credentials hardcoded ใน source code (security risk) | ย้ายทั้งหมดไป env vars ผ่าน `src/lib/auth.ts` |
| 2 | `FALLBACK_PROFILE` ซ้ำกัน 2 ที่ + description ถูก truncate (bug) | Extract เป็น `src/lib/profile-defaults.ts` |
| 3 | `inputCls`/`selectCls` ซ้ำใน 3 admin files | Extract เป็น `src/lib/admin-styles.ts` |
| 4 | `<button>` ใน project detail ที่ไม่มี handler | ลบออก |
| 5 | `dev_output.txt` ไม่อยู่ใน `.gitignore` | เพิ่มใน `.gitignore` |
| 6 | "Japan · 2024" hardcoded ใน gallery header | ลบออก |

**ไฟล์ใหม่ที่เพิ่ม:**
- `src/lib/auth.ts`
- `src/lib/profile-defaults.ts`
- `src/lib/admin-styles.ts`

---

## สถาปัตยกรรม (Architecture)

```
Browser
  │
  ├── Public Routes (/  /projects  /about  /blocks)
  │     └── Server Components → fetch จาก DB ทุก request
  │
  ├── Admin Routes (/admin/*)
  │     ├── Server Component → auth check → fetch initial data
  │     └── Client Component → manage local state → call Server Actions
  │
  └── Login (/login)
        └── Server Action → set httpOnly cookie → redirect

Server Actions (ทำงานบน server, เรียกจาก client)
  └── CRUD operations → Prisma → PostgreSQL (Supabase)
                                     ↕
                              Supabase Storage (photos)
```

**Pattern หลัก — Server/Client Split:**

```tsx
// page.tsx (Server Component)
export default async function AdminProjectsPage() {
  const projects = await getProjects(); // fetch ที่ server
  return <ProjectsClient initialProjects={projects} />;
}

// projects-client.tsx (Client Component)
"use client";
export default function ProjectsClient({ initialProjects }) {
  const [list, setList] = useState(initialProjects);
  // จัดการ UI state และ call Server Actions
}
```

---

## โครงสร้างไฟล์ปัจจุบัน

```
src/
├── app/
│   ├── layout.tsx                   # Root layout + Navbar + Footer
│   ├── page.tsx                     # Home — Hero, Stats, Featured, Slideshow
│   ├── about/page.tsx               # About — bio, experience, skills, gallery
│   ├── projects/
│   │   ├── page.tsx                 # All projects (grouped by status)
│   │   └── [id]/page.tsx            # Project detail
│   ├── blocks/page.tsx              # Blocks showcase
│   ├── login/
│   │   ├── page.tsx                 # Login page (redirect if already logged in)
│   │   ├── LoginForm.tsx            # Form + useActionState
│   │   └── actions.ts               # login() / logout() server actions
│   └── admin/
│       ├── layout.tsx               # Auth guard + AdminNavbar
│       ├── page.tsx                 # Overview stats
│       ├── overview-client.tsx      # Overview UI
│       ├── projects/
│       │   ├── page.tsx             # Data fetcher
│       │   ├── projects-client.tsx  # Full CRUD UI + modals + toast
│       │   └── actions.ts           # getProjects / create / update / delete
│       ├── blocks/
│       │   ├── page.tsx
│       │   ├── blocks-client.tsx    # CRUD + preview panel
│       │   └── actions.ts
│       └── about/
│           ├── page.tsx
│           ├── about-client.tsx     # 4-tab editor (Profile/Skills/Exp/Gallery)
│           └── actions.ts           # saveProfile / CRUD skills, exp, photos + upload
├── components/
│   ├── Navbar.tsx                   # Public nav + mobile menu + breadcrumb animation
│   ├── Footer.tsx                   # Footer (hidden on admin)
│   ├── AdminNavbar.tsx              # Admin nav + logout
│   ├── ProjectCard.tsx              # Project card with status badge
│   ├── PhotoSlideshow.tsx           # Circular carousel + auto-advance + dot nav
│   ├── PhotoGallery.tsx             # Responsive grid gallery
│   ├── FadeUp.tsx                   # whileInView fade-up animation
│   ├── CountUp.tsx                  # Number count-up animation
│   └── StaggerGrid.tsx              # Staggered grid reveal animation
└── lib/
    ├── db.ts                        # Prisma singleton (globalThis pattern)
    ├── projects.ts                  # ProjectStatus type + statusConfig
    ├── auth.ts                      # isAdmin() + env var constants  ← ใหม่
    ├── profile-defaults.ts          # PROFILE_DEFAULTS constant       ← ใหม่
    └── admin-styles.ts              # inputCls / selectCls / textareaCls ← ใหม่
prisma/
├── schema.prisma                    # 6 models
└── seed.ts                          # Seed data
```

---

## Database Schema

```prisma
model Project {
  id              String    // cuid
  title           String
  description     String
  longDescription String?
  tags            String[]
  status          String    // "planning" | "in-progress" | "completed"
  startDate       String
  endDate         String?
  featured        Boolean
  githubUrl       String?
  liveUrl         String?
}

model Block {
  id    String    // cuid
  tag   String    // "Note" | "Tutorial" | "Tip" | ...
  date  String    // display string เช่น "May 2026"
  title String
  body  String
}

model Profile {
  id           String  // singleton: "singleton"
  mainPhoto    String
  photoCaption String
  name         String
  title        String
  description  String
  university   String
  degree       String
  location     String
}

model SkillGroup { id, category, items String[] }
model Experience { id, year, role, company, desc, order }
model Photo      { id, src, alt, caption, inSlideshow, order }
```

---

## Features ที่เสร็จใน Phase 01

### Public Site
- [x] Home — Hero section, stats (CountUp), featured projects, photo slideshow, CTA
- [x] Projects — แสดงทั้งหมด grouped by status (in-progress / planning / completed)
- [x] Project Detail — title, description, tech stack, links, start/end date
- [x] Blocks — grid ของ notes/thoughts
- [x] About — bio, experience timeline, skills grid, photo gallery, connect section

### Admin Panel
- [x] Authentication — login/logout ด้วย httpOnly cookie
- [x] Auth guard — ทุก `/admin/*` redirect ถ้าไม่ได้ login
- [x] Admin Overview — stats dashboard + navigation cards
- [x] Projects CRUD — เพิ่ม/แก้ไข/ลบโปรเจกต์ พร้อม modals + optimistic UI
- [x] Blocks CRUD — เพิ่ม/แก้ไข/ลบ blocks พร้อม preview panel
- [x] About Editor — 4-tab editor:
  - Profile: แก้ข้อมูล + upload/เปลี่ยนรูปหลัก
  - Skills: จัดการ skill groups + items แบบ real-time
  - Experience: เพิ่ม/แก้ไข/ลบ พร้อม edit modal
  - Gallery: อัปโหลด + URL mode, toggle slideshow, แก้ alt/caption

### Infrastructure
- [x] PostgreSQL บน Supabase
- [x] Prisma ORM พร้อม adapter สำหรับ Supabase
- [x] Supabase Storage สำหรับ photo upload
- [x] Photo cleanup — ลบไฟล์ออกจาก storage เมื่อลบ photo record
- [x] Deployed บน Vercel
- [x] Credentials ย้ายเป็น env vars (ไม่ hardcode ใน source)
- [x] `revalidatePath` ทุก mutation เพื่อ invalidate Next.js cache

---

## สิ่งที่เรียนรู้ใน Phase 01

### 1. Server Actions ทำให้ไม่ต้องทำ API routes
แทนที่จะทำ `/api/projects/create` แยก สามารถ import function จาก `actions.ts` ไปใช้ใน client component ได้เลย Next.js จัดการ serialization/network call ให้เอง

### 2. Optimistic Updates + `useTransition`
```tsx
// อัปเดต UI ก่อน แล้วค่อย sync กับ server
setList((prev) => prev.filter((p) => p.id !== id)); // instant
startTransition(async () => {
  await deleteProject(id); // background
});
```
ทำให้ UX รู้สึก responsive แม้ network ช้า

### 3. Prisma Singleton Pattern
ใน dev mode Next.js hot reload สร้าง PrismaClient ใหม่ทุกครั้ง ต้องใช้ `globalThis` เป็น cache:
```ts
export const db = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### 4. Framer Motion `whileInView` vs `animate`
- `whileInView` — animate เมื่อ element เข้า viewport (ใช้กับ public pages)
- `animate` — animate ทันทีเมื่อ mount (ใช้กับ admin ที่ไม่มี scroll)

---

## Metrics

| Metric | ค่า |
|--------|-----|
| ระยะเวลา | 8 วัน |
| Commits | 16 commits |
| Pages | 10 pages (6 public + 4 admin) |
| Components | 9 components |
| Database Models | 6 models |
| Lines of code (net) | ~4,000+ |
| Deploy | Vercel (live) |

---

## สิ่งที่ยังไม่ได้ทำ (Phase 02)

- [ ] **AI Prompt Log** — บันทึก prompts ที่ใช้สร้างแต่ละโปรเจกต์ (จุดประสงค์หลักของแอป)
- [ ] **Search & Filter** — ค้นหาและกรองโปรเจกต์
- [ ] **Image upload สำหรับ Projects** — รูป thumbnail ของโปรเจกต์
- [ ] **Authentication ที่ robust ขึ้น** — อาจเปลี่ยนเป็น random token แทน username
- [ ] **Analytics** — ดูว่ามีคนเข้าดูโปรเจกต์ไหนบ้าง
- [ ] **Blocks — rich content** — Markdown support
- [ ] **Project — `longDescription`** — ยังมี field ใน schema แต่ยังไม่ได้ทำ UI

---

*Phase 01 complete — 9 May 2026*
