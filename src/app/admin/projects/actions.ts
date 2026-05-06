"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return db.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createProject(data: {
  title: string;
  description: string;
  status: string;
  tags: string[];
  startDate: string;
  featured: boolean;
  githubUrl?: string | null;
  liveUrl?: string | null;
}) {
  const project = await db.project.create({ data });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  return project;
}

export async function updateProject(
  id: string,
  data: {
    title: string;
    description: string;
    status: string;
    tags: string[];
    startDate: string;
    featured: boolean;
    githubUrl?: string | null;
    liveUrl?: string | null;
  }
) {
  const project = await db.project.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/admin/projects");
  return project;
}

export async function deleteProject(id: string) {
  await db.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}
