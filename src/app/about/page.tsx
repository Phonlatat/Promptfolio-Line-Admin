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

          <div className="flex flex-wrap justify-center gap-3">
            {/* Primary CTA */}
            <a
              href="mailto:phonlatues@gmail.com"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-stone-900 transition-all duration-200 hover:bg-stone-100"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Email
            </a>

            {/* Secondary CTAs — identical style */}
            <a
              href="https://line.me/ti/p/~h2ozn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-400 transition-all duration-200 hover:border-stone-500 hover:text-stone-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              LINE: h2ozn
            </a>
            <a
              href="https://github.com/Phonlatat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-400 transition-all duration-200 hover:border-stone-500 hover:text-stone-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/phonlatat-kathintip-648b823b2/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-400 transition-all duration-200 hover:border-stone-500 hover:text-stone-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-400 cursor-not-allowed opacity-40"
              title="Coming soon"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download CV
            </button>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-5 py-2.5 text-sm font-medium text-stone-400 transition-all duration-200 hover:border-stone-500 hover:text-stone-200"
            >
              ดูโปรเจค →
            </Link>
          </div>
        </FadeUp>
      </section>

    </div>
  );
}
