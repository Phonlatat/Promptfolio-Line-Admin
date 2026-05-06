import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import FadeUp from "@/components/FadeUp";
import CountUp from "@/components/CountUp";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import PhotoSlideshow from "@/components/PhotoSlideshow";
import { db } from "@/lib/db";

export default async function HomePage() {
  const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } });
  const featured = projects.filter((p) => p.featured);
  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === "in-progress").length,
    planning: projects.filter((p) => p.status === "planning").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  return (
    <div className="flex flex-col">
      {/* ─── Hero ─── */}
      <section className="px-6 pb-28 pt-24">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <p className="mb-6 font-mono text-xs font-medium uppercase tracking-widest text-stone-400">
              Portfolio & Project Tracker
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mb-6 max-w-2xl text-5xl font-bold leading-[1.1] tracking-tight text-stone-900 md:text-6xl lg:text-7xl">
              บันทึกทุกโปรเจค
              <br />
              <span className="text-stone-400">ที่คุณจะสร้าง</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-stone-500">
              Promptfolio ช่วยติดตาม วางแผน และแสดงผลงานทั้งหมด
              พร้อม prompt ที่ใช้สร้างแต่ละชิ้นงาน
            </p>
          </FadeUp>

          <FadeUp delay={0.22}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 transition-all duration-200 hover:bg-stone-800 hover:shadow-lg hover:shadow-stone-900/10"
              >
                ดูโปรเจคทั้งหมด
              </Link>
              <Link
                href="/about"
                className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-all duration-200 hover:border-stone-400 hover:bg-stone-50"
              >
                เกี่ยวกับฉัน →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="border-y border-stone-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "โปรเจคทั้งหมด", value: stats.total },
              { label: "กำลังพัฒนา", value: stats.inProgress },
              { label: "วางแผนไว้", value: stats.planning },
              { label: "เสร็จแล้ว", value: stats.completed },
            ].map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.07}>
                <div className="flex flex-col gap-1">
                  <CountUp
                    to={s.value}
                    className="text-4xl font-bold tabular-nums text-stone-900"
                  />
                  <span className="text-sm text-stone-500">{s.label}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Projects ─── */}
      {featured.length > 0 && (
        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <FadeUp>
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <p className="mb-1 font-mono text-xs uppercase tracking-widest text-stone-400">
                    Featured
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
                    โปรเจคเด่น
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
                >
                  ดูทั้งหมด →
                </Link>
              </div>
            </FadeUp>

            <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project) => (
                <StaggerItem key={project.id}>
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}

      {/* ─── Photo Slideshow ─── */}
      <section className="overflow-hidden py-20">
        <div className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-1 font-mono text-xs uppercase tracking-widest text-stone-400">
                  From My Journey
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
                  ชีวิตนอกหน้าจอ
                </h2>
              </div>
              <Link
                href="/about"
                className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
              >
                เกี่ยวกับฉัน →
              </Link>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <PhotoSlideshow />
        </FadeUp>
      </section>

      {/* ─── Divider ─── */}
      <div className="mx-auto max-w-5xl w-full px-6">
        <div className="h-px bg-stone-200" />
      </div>

      {/* ─── CTA Banner ─── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-stone-400">
                Let&apos;s connect
              </p>
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-stone-900">
                สนใจร่วมงานกัน?
              </h2>
              <p className="mb-8 text-stone-500">
                พร้อมรับโปรเจคใหม่และโอกาสใหม่ๆ เสมอ
              </p>
              <Link
                href="/about#connect"
                className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-stone-50 transition-all duration-200 hover:bg-stone-800 hover:shadow-lg hover:shadow-stone-900/10"
              >
                ติดต่อฉัน →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
