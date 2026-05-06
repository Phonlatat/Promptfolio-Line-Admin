import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.block.deleteMany();
  await db.project.deleteMany();

  // Projects
  await db.project.createMany({
    data: [
      {
        title: "Promptfolio",
        description: "Portfolio & project tracker ที่ช่วยบันทึกทุกโปรเจคและ prompt ที่ใช้สร้าง",
        status: "in-progress",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Supabase"],
        startDate: "2026-04-01",
        featured: true,
        githubUrl: null,
        liveUrl: null,
      },
      {
        title: "Line Admin Bot",
        description: "Admin panel สำหรับจัดการ Line Bot และส่งข้อความหา users",
        status: "planning",
        tags: ["Next.js", "Line API", "TypeScript"],
        startDate: "2026-05-01",
        featured: false,
        githubUrl: null,
        liveUrl: null,
      },
    ],
  });

  // Blocks
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

  const projectCount = await db.project.count();
  const blockCount = await db.block.count();
  console.log(`✅ Done! Seeded ${projectCount} projects and ${blockCount} blocks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
