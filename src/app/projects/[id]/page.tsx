import Link from "next/link";
import { notFound } from "next/navigation";
import FadeUp from "@/components/FadeUp";
import { statusConfig, type ProjectStatus } from "@/lib/projects";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  const status = statusConfig[project.status as ProjectStatus] ?? statusConfig.planning;

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      {/* Breadcrumb */}
      <FadeUp>
        <nav className="mb-10 flex items-center gap-2 font-mono text-xs text-stone-400">
          <Link href="/" className="hover:text-stone-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-stone-700 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-stone-600">{project.title}</span>
        </nav>
      </FadeUp>

      {/* Status */}
      <FadeUp delay={0.04}>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </FadeUp>

      {/* Title */}
      <FadeUp delay={0.1}>
        <h1 className="mt-4 mb-5 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          {project.title}
        </h1>
      </FadeUp>

      {/* Description */}
      <FadeUp delay={0.15}>
        <p className="mb-10 text-base leading-relaxed text-stone-500">
          {project.longDescription || project.description}
        </p>
      </FadeUp>

      {/* Divider */}
      <div className="mb-10 h-px bg-stone-100" />

      {/* Meta grid */}
      <FadeUp delay={0.2}>
        <div className="mb-10 grid grid-cols-2 gap-6 rounded-xl border border-stone-200 bg-white p-6 sm:grid-cols-3">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-stone-400">เริ่มต้น</p>
            <p className="text-sm font-medium text-stone-800">
              {new Date(project.startDate).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
          {project.endDate && (
            <div>
              <p className="mb-1 font-mono text-xs uppercase tracking-wider text-stone-400">สิ้นสุด</p>
              <p className="text-sm font-medium text-stone-800">
                {new Date(project.endDate).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          )}
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-stone-400">สถานะ</p>
            <p className="text-sm font-medium text-stone-800">{status.label}</p>
          </div>
        </div>
      </FadeUp>

      {/* Tech Stack */}
      <FadeUp delay={0.25}>
        <div className="mb-10">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-stone-400">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 font-mono text-sm text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Links */}
      {(project.githubUrl || project.liveUrl) && (
        <FadeUp delay={0.3}>
          <div className="mb-12 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-all duration-200 hover:border-stone-300 hover:bg-stone-50"
              >
                GitHub Repository →
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-stone-50 transition-all duration-200 hover:bg-stone-800"
              >
                Live Demo →
              </a>
            )}
          </div>
        </FadeUp>
      )}

      {/* AI Prompts — coming soon */}
      <FadeUp delay={0.35}>
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-stone-400">
            AI Prompts
          </p>
          <p className="mt-2 text-sm text-stone-400">
            บันทึก prompt ที่ใช้สร้างโปรเจคนี้ — ยังไม่มีข้อมูล
          </p>
        </div>
      </FadeUp>
    </div>
  );
}
