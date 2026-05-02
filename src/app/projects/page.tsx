import ProjectCard from "@/components/ProjectCard";
import FadeUp from "@/components/FadeUp";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { projects, ProjectStatus, statusConfig } from "@/lib/projects";

export default function ProjectsPage() {
  const grouped: Record<ProjectStatus, typeof projects> = {
    "in-progress": projects.filter((p) => p.status === "in-progress"),
    planning: projects.filter((p) => p.status === "planning"),
    completed: projects.filter((p) => p.status === "completed"),
  };

  const order: ProjectStatus[] = ["in-progress", "planning", "completed"];

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      {/* Header */}
      <FadeUp>
        <div className="mb-16 border-b border-stone-200 pb-10">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-stone-400">
            All Projects
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
              โปรเจคทั้งหมด
            </h1>
            <span className="font-mono text-sm text-stone-400">
              {projects.length} projects
            </span>
          </div>
        </div>
      </FadeUp>

      {/* Groups */}
      <div className="flex flex-col gap-20">
        {order.map((status, groupIdx) => {
          const group = grouped[status];
          if (!group.length) return null;
          const cfg = statusConfig[status];

          return (
            <section key={status}>
              <FadeUp delay={groupIdx * 0.06}>
                <div className="mb-7 flex items-center gap-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${cfg.color}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="font-mono text-xs text-stone-400">
                    {group.length}
                  </span>
                </div>
              </FadeUp>

              <StaggerGrid className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((project) => (
                  <StaggerItem key={project.id}>
                    <ProjectCard project={project} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </section>
          );
        })}
      </div>
    </div>
  );
}
