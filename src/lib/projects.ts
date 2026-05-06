import type { Project } from "@prisma/client";

export type ProjectStatus = "planning" | "in-progress" | "completed";
export type { Project };

export const statusConfig: Record<ProjectStatus, { label: string; color: string; dot: string }> = {
  planning: {
    label: "วางแผน",
    color: "bg-stone-100 text-stone-600 border border-stone-200",
    dot: "bg-stone-400",
  },
  "in-progress": {
    label: "กำลังพัฒนา",
    color: "bg-stone-900 text-stone-50 border border-stone-900",
    dot: "bg-stone-300",
  },
  completed: {
    label: "เสร็จแล้ว",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
};
