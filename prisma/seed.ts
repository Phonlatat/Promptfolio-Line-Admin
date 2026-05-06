import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear all tables
  await db.photo.deleteMany();
  await db.experience.deleteMany();
  await db.skillGroup.deleteMany();
  await db.profile.deleteMany();
  await db.block.deleteMany();
  await db.project.deleteMany();

  // ── Projects ──────────────────────────────────────────────────────
  await db.project.createMany({
    data: [
      {
        title: "Promptfolio",
        description: "Portfolio & project tracker ที่ช่วยบันทึกทุกโปรเจคและ prompt ที่ใช้สร้าง",
        status: "in-progress",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Supabase"],
        startDate: "2026-04-01",
        featured: true,
      },
      {
        title: "Line Admin Bot",
        description: "Admin panel สำหรับจัดการ Line Bot และส่งข้อความหา users",
        status: "planning",
        tags: ["Next.js", "Line API", "TypeScript"],
        startDate: "2026-05-01",
        featured: false,
      },
    ],
  });

  // ── Blocks ────────────────────────────────────────────────────────
  await db.block.createMany({
    data: [
      {
        tag: "Note",
        date: "May 2026",
        title: "เริ่มต้นใช้ Prisma 7",
        body: "Prisma 7 มี breaking change สำคัญ — ต้องย้าย database URL ออกจาก schema.prisma ไปไว้ใน prisma.config.ts แทน และใช้ adapter pattern สำหรับ PostgreSQL",
      },
    ],
  });

  // ── Profile ───────────────────────────────────────────────────────
  await db.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      mainPhoto: "/me/aquarium.jpg",
      photoCaption: "Japan, 2024",
      name: "Phonlatat",
      title: "Computer Engineering",
      description: "With a strong interest in technology, I enjoy coding, building systems, and learning deep into things. I'm focused on every detail and eager to learn from every role.",
      university: "Prince of Songkhla University",
      degree: "B.Eng. Computer Engineering",
      location: "Thailand",
    },
  });

  // ── Skills ────────────────────────────────────────────────────────
  await db.skillGroup.createMany({
    data: [
      { category: "Frontend", items: ["HTML / CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"] },
      { category: "Backend", items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "REST API"] },
      { category: "AI & Tools", items: ["Claude API", "Line API", "Git", "Docker", "Figma"] },
    ],
  });

  // ── Experience ────────────────────────────────────────────────────
  await db.experience.createMany({
    data: [
      { year: "2024", role: "Software Developer Intern", company: "Intelligent Automation Engineering Center (Lanna)", desc: "พัฒนาระบบ automation ด้วย software tools สำหรับกระบวนการในโรงงานอุตสาหกรรม", order: 0 },
      { year: "2025", role: "Freelance Front-End Developer", company: "Independent", desc: "ออกแบบและพัฒนาเว็บแอปพลิเคชันสำหรับลูกค้า ด้วย React, Next.js และ Tailwind CSS", order: 1 },
      { year: "2026", role: "Coach Engineer Programming Technical", company: "iDekTep · Kasetsart University", desc: "สอนและ coach ด้านวิศวกรรมและการเขียนโปรแกรมให้กับเยาวชนอายุ 7–15 ปี ผ่านกระบวนการ project-based learning", order: 2 },
    ],
  });

  // ── Photos ────────────────────────────────────────────────────────
  await db.photo.createMany({
    data: [
      { src: "/me/aquarium.jpg", alt: "Phonlatat at an aquarium tunnel", caption: "Osaka · Japan", inSlideshow: true, order: 0 },
      { src: "/me/beach.jpg", alt: "Photographing the ocean", caption: "Kamakura · Japan", inSlideshow: true, order: 1 },
      { src: "/me/vending.jpg", alt: "Vending machines in the snow", caption: "Hokkaido · Japan", inSlideshow: true, order: 2 },
      { src: "/me/snow.jpg", alt: "Snowstorm in Hokkaido", caption: "Hokkaido · Japan", inSlideshow: true, order: 3 },
      { src: "/me/night.jpg", alt: "Nighttime in Hokkaido", caption: "Hokkaido · Japan", inSlideshow: true, order: 4 },
      { src: "/me/store.jpg", alt: "At a Japanese electronics store", caption: "Tokyo · Japan", inSlideshow: true, order: 5 },
    ],
  });

  const [projects, blocks, skills, experience, photos] = await Promise.all([
    db.project.count(),
    db.block.count(),
    db.skillGroup.count(),
    db.experience.count(),
    db.photo.count(),
  ]);

  console.log(`✅ Done! ${projects} projects, ${blocks} blocks, ${skills} skill groups, ${experience} experiences, ${photos} photos`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
