import Image from "next/image";
import Link from "next/link";
import FadeUp from "@/components/FadeUp";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import PhotoGallery from "@/components/PhotoGallery";

const experience = [
  {
    year: "2024",
    role: "Software Developer Intern",
    company: "Intelligent Automation Engineering Center (Lanna)",
    desc: "พัฒนาระบบ automation ด้วย software tools สำหรับกระบวนการในโรงงานอุตสาหกรรม",
  },
  {
    year: "2025",
    role: "Freelance Front-End Developer",
    company: "Independent",
    desc: "ออกแบบและพัฒนาเว็บแอปพลิเคชันสำหรับลูกค้า ด้วย React, Next.js และ Tailwind CSS",
  },
  {
    year: "2026",
    role: "Coach Engineer Programming Technical",
    company: "iDekTep · Kasetsart University",
    desc: "สอนและ coach ด้านวิศวกรรมและการเขียนโปรแกรมให้กับเยาวชนอายุ 7–15 ปี ผ่านกระบวนการ project-based learning เน้นการพัฒนา systems thinking, robotics และ creative coding ภายใต้โปรแกรม Thailand Robot & Coding Challenge ของศูนย์นวัตกรรมดิจิทัล มหาวิทยาลัยเกษตรศาสตร์",
  },
];

const skills: { category: string; items: string[] }[] = [
  {
    category: "Frontend",
    items: ["HTML / CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "REST API"],
  },
  {
    category: "AI & Tools",
    items: ["Claude API", "Line API", "Git", "Docker", "Figma"],
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ─────────────────────────────────────────
          01 · HERO — split layout
      ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-0">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_340px] md:gap-16 items-start">

          {/* Left: text */}
          <div className="flex flex-col justify-between md:pt-4 md:pb-12">
            <div>
              <FadeUp>
                <p className="mb-8 font-mono text-xs uppercase tracking-widest text-stone-400">
                  About me
                </p>
              </FadeUp>

              <FadeUp delay={0.07}>
                <h1 className="mb-4 text-[56px] font-bold leading-[1.0] tracking-tight text-stone-900 md:text-[72px]">
                  Phonlatat
                </h1>
              </FadeUp>

              <FadeUp delay={0.13}>
                <p className="mb-8 text-xl font-light text-stone-400 tracking-wide">
                  Computer Engineering
                </p>
              </FadeUp>

              <FadeUp delay={0.18}>
                <p className="max-w-md text-base leading-[1.85] text-stone-500">
                  With a strong interest in technology, I enjoy coding, building
                  systems, and learning deep into things. I&apos;m focused on
                  every detail and eager to learn from every role.
                </p>
              </FadeUp>
            </div>

            {/* Quick info */}
            <FadeUp delay={0.26}>
              <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-stone-200 pt-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                    University
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-stone-700">
                    Prince of Songkhla University
                  </p>
                </div>
                <div className="h-8 w-px bg-stone-200 hidden sm:block" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                    Degree
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-stone-700">
                    B.Eng. Computer Engineering
                  </p>
                </div>
                <div className="h-8 w-px bg-stone-200 hidden sm:block" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">
                    Based in
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-stone-700">
                    Thailand
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right: main photo */}
          <FadeUp delay={0.1} className="w-full">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl shadow-stone-900/8">
              <Image
                src="/me/aquarium.jpg"
                alt="Phonlatat at an aquarium tunnel"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 340px"
              />
              {/* Subtle gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="inline-block rounded-lg bg-white/85 px-3 py-1.5 font-mono text-xs text-stone-600 backdrop-blur-sm">
                  Japan, 2024
                </span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          02 · EXPERIENCE
      ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <FadeUp>
          <p className="mb-10 font-mono text-xs uppercase tracking-widest text-stone-400">
            Experience
          </p>
        </FadeUp>

        <div className="flex flex-col gap-0">
          {experience.map((exp, i) => (
            <FadeUp key={exp.company} delay={i * 0.1}>
              <div className="group grid grid-cols-[80px_1fr] gap-8 border-t border-stone-200 py-8 last:border-b">
                {/* Year */}
                <p className="font-mono text-sm text-stone-400 pt-0.5">{exp.year}</p>

                {/* Content */}
                <div>
                  <p className="mb-0.5 text-sm font-semibold text-stone-900">{exp.role}</p>
                  <p className="mb-3 text-sm text-stone-500">{exp.company}</p>
                  <p className="text-sm leading-relaxed text-stone-400">{exp.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────
          03 · SKILLS
      ───────────────────────────────────────── */}
      <section className="border-y border-stone-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <p className="mb-10 font-mono text-xs uppercase tracking-widest text-stone-400">
              Skills
            </p>
          </FadeUp>

          <StaggerGrid className="grid gap-px border border-stone-200 rounded-2xl overflow-hidden sm:grid-cols-3">
            {skills.map((group) => (
              <StaggerItem key={group.category}>
                <div className="bg-white p-7 h-full">
                  <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-stone-400">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 font-mono text-xs text-stone-600"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          04 · GALLERY
      ───────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <FadeUp>
          <div className="mb-10 flex items-baseline justify-between">
            <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
              Gallery
            </p>
            <p className="font-mono text-xs text-stone-300">Japan · 2024</p>
          </div>
        </FadeUp>

        <PhotoGallery />
      </section>

      {/* ─────────────────────────────────────────
          05 · CONNECT
      ───────────────────────────────────────── */}
      <section className="border-t border-stone-200 bg-stone-900 px-6 py-24 text-center">
        <FadeUp>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-stone-500">
            Let&apos;s connect
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
            สนใจร่วมงานกัน?
          </h2>
          <p className="mb-10 text-stone-400">
            พร้อมรับโปรเจคใหม่และโอกาสใหม่ๆ เสมอ
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="mailto:phonlatues@gmail.com"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-stone-900 transition-all duration-200 hover:bg-stone-100"
            >
              phonlatues@gmail.com
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-6 py-3 text-sm font-medium text-stone-400 transition-all duration-200 hover:border-stone-500 hover:text-stone-200"
            >
              ดูโปรเจคทั้งหมด
            </Link>
          </div>
        </FadeUp>
      </section>

    </div>
  );
}
