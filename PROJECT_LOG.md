# Promptfolio — บันทึกสิ่งที่ทำทั้งหมด

> ไฟล์นี้อัปเดตอัตโนมัติก่อนทุกครั้งที่ `git push`  
> Last updated: 2026-05-09

---

## ภาพรวมโปรเจกต์

**Promptfolio** เป็น personal portfolio + project tracker สำหรับ H2o  
เป้าหมาย: มีที่เดียวสำหรับแสดงและติดตามโปรเจกต์ทั้งหมด พร้อม AI prompt log ที่ใช้สร้างแต่ละโปรเจกต์

**URL:** localhost:3000 (dev) | deployed on Vercel  
**Repo:** main branch

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 + @prisma/adapter-pg |
| Animation | Framer Motion 12 |
| Runtime | Node.js / React 19 |

---

## โครงสร้างหน้า (Pages)

### Public
| หน้า | Path | สถานะ |
|------|------|--------|
| Home | `/` | ✅ |
| Projects | `/projects` | ✅ |
| Project Detail | `/projects/[id]` | ✅ |
| Blocks | `/blocks` | ✅ |
| About | `/about` | ✅ |
| Login | `/login` | ✅ |

### Admin (ต้อง login)
| หน้า | Path | สถานะ |
|------|------|--------|
| Admin Overview | `/admin` | ✅ |
| Admin Projects | `/admin/projects` | ✅ |
| Admin Blocks | `/admin/blocks` | ✅ |
| Admin About | `/admin/about` | ✅ |

---

## โครงสร้างไฟล์สำคัญ

```
src/
├── app/
│   ├── page.tsx                     # Home — Hero, stats, featured projects
│   ├── layout.tsx                   # Root layout
│   ├── projects/
│   │   ├── page.tsx                 # All projects grouped by status
│   │   └── [id]/page.tsx            # Project detail page
│   ├── blocks/page.tsx              # Blocks showcase
│   ├── about/page.tsx               # Developer bio + skills
│   ├── login/
│   │   ├── page.tsx                 # Login page
│   │   ├── LoginForm.tsx            # Login form component
│   │   └── actions.ts               # Server action: authenticate
│   └── admin/
│       ├── layout.tsx               # Admin layout (auth guard)
│       ├── page.tsx                 # Admin overview
│       ├── overview-client.tsx      # Client overview component
│       ├── projects/
│       │   ├── page.tsx             # Admin projects page
│       │   ├── projects-client.tsx  # CRUD UI for projects
│       │   └── actions.ts           # Server actions: create/update/delete project
│       ├── blocks/
│       │   ├── page.tsx             # Admin blocks page
│       │   ├── blocks-client.tsx    # CRUD UI for blocks
│       │   └── actions.ts           # Server actions: create/update/delete block
│       └── about/
│           ├── page.tsx             # Admin about page
│           ├── about-client.tsx     # Edit about content + photo upload
│           └── actions.ts           # Server actions: update about, upload photo
├── components/
│   ├── Navbar.tsx                   # Top navigation
│   ├── Footer.tsx                   # Footer
│   ├── AdminNavbar.tsx              # Admin navigation
│   ├── ProjectCard.tsx              # Project card component
│   ├── PhotoSlideshow.tsx           # Photo slideshow (about page)
│   ├── PhotoGallery.tsx             # Photo gallery component
│   ├── FadeUp.tsx                   # Animation: fade up
│   ├── CountUp.tsx                  # Animation: count up numbers
│   └── StaggerGrid.tsx              # Animation: stagger grid items
└── lib/
    ├── db.ts                        # Prisma client singleton
    └── projects.ts                  # Project types + status config
prisma/
├── schema.prisma                    # DB schema
└── seed.ts                          # Seed data
```

---

## ประวัติ Git Commits

### 2026-05-02

**`23de428` — Initial commit**
- สร้างโปรเจกต์ Next.js ครั้งแรก

**`4bdab15` — Update Aboutme and deploy**
- เพิ่มและแก้ไขหน้า About
- Deploy ครั้งแรก

**`4484197` — Update about me**
- อัปเดตข้อมูลใน About

---

### 2026-05-03

**`8dc9f5d` — Add adminpage and fix bug**
- เพิ่มหน้า Admin ครั้งแรก
- แก้ bug ต่างๆ

**`a1717aa` — finish add photo to home**
- เพิ่มรูปภาพในหน้า Home
- PhotoSlideshow และ PhotoGallery components

---

### 2026-05-06

**`22f56cf` — add admin-page**
- พัฒนาระบบ Admin เพิ่มเติม

**`cc9bfc7` — connect supabase**
- เชื่อมต่อ Supabase (PostgreSQL)
- ตั้งค่า Prisma + PrismaClient singleton
- เพิ่ม seed data

**`cf89f1c` — g1**
- แก้ไขต่างๆ

**`82df514` — finish edit Aboutme and everything without Photo path**
- แก้ไข About page อย่างครอบคลุม
- เพิ่ม `about-client.tsx` — full edit UI สำหรับ admin
- เพิ่ม server actions สำหรับ about (update content, upload photo)
- Refactor `PhotoGallery` และ `PhotoSlideshow`
- ปรับ Prisma schema เพิ่ม About/Photo models
- แก้ admin layout เพิ่ม auth guard

**`f03a08a` — deploy**
- เตรียม deploy

**`16a14d6` — Deploy no1**
- แก้ `next.config.ts` สำหรับ production
- แก้ `admin/about/actions.ts` — photo path handling สำหรับ deployed environment
- เพิ่ม `dev_output.txt` — build output log

---


### 2026-05-08

**`897b5aa`** - chap1
- (add details here)

**`ac2291d`** - delete photo from storage
- (add details here)

---


### 2026-05-08

**`b9eadc2`** - Project log update
- (add details here)

---


### 2026-05-09

**`2a1552d`** - save
- (add details here)

**`6e8640b`** - clean code and env local security
- (add details here)

---


### 2026-05-09

**`0159487`** - Phase 01 finish Doc add
- (add details here)

---

## Features ที่ทำเสร็จแล้ว

- [x] Public portfolio site (Home, Projects, About, Blocks)
- [x] Project detail pages
- [x] Admin authentication (login/logout)
- [x] Admin CRUD — Projects
- [x] Admin CRUD — Blocks
- [x] Admin — Edit About page content
- [x] Admin — Photo upload สำหรับ About page
- [x] Supabase PostgreSQL integration
- [x] Prisma ORM setup
- [x] Framer Motion animations (FadeUp, CountUp, StaggerGrid)
- [x] Dark theme (slate-950 bg, violet/indigo accents)
- [x] Deploy to Vercel


### 2026-05-08

**`897b5aa`** - chap1
- (add details here)

**`ac2291d`** - delete photo from storage
- (add details here)

---


### 2026-05-08

**`b9eadc2`** - Project log update
- (add details here)

---


### 2026-05-09

**`2a1552d`** - save
- (add details here)

**`6e8640b`** - clean code and env local security
- (add details here)

---


### 2026-05-09

**`0159487`** - Phase 01 finish Doc add
- (add details here)

---

## Features ที่ยังไม่ได้ทำ

- [ ] Prompt log ใน project detail
- [ ] Image upload สำหรับ projects
- [ ] Authentication ที่ robust กว่านี้ (ตอนนี้ simple)
- [ ] Search / filter projects
- [ ] Analytics / stats จริงจาก DB

---

*Auto-generated by `scripts/update-log.ps1` — do not edit commit history section manually*
