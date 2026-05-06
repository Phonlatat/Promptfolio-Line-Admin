import Link from "next/link";
import { statusConfig, type Project, type ProjectStatus } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const status = statusConfig[project.status as ProjectStatus] ?? statusConfig.planning;

  return (
    <Link href={`/projects/${project.id}`} className="block h-full">
      <div className="card-shadow group flex h-full flex-col rounded-xl border border-stone-200 bg-white p-6">
        {/* Status */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <span className="font-mono text-xs text-stone-400">
            {new Date(project.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-semibold leading-snug text-stone-900 transition-colors duration-200 group-hover:text-stone-600">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-5 flex-1 text-sm leading-relaxed text-stone-500">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-xs text-stone-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Arrow */}
        <div className="mt-4 flex items-center justify-end border-t border-stone-100 pt-4">
          <span className="text-xs font-medium text-stone-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-stone-700">
            ดูรายละเอียด →
          </span>
        </div>
      </div>
    </Link>
  );
}
