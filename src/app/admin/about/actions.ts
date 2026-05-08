"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const PATHS = ["/about", "/", "/admin/about"];
function revalidateAll() {
  PATHS.forEach((p) => revalidatePath(p));
}

// ── Fetch ─────────────────────────────────────────────────────────────

export async function getAboutData() {
  const [profile, skills, experience, photos] = await Promise.all([
    db.profile.findUnique({ where: { id: "singleton" } }),
    db.skillGroup.findMany({ orderBy: { createdAt: "asc" } }),
    db.experience.findMany({ orderBy: { order: "asc" } }),
    db.photo.findMany({ orderBy: { order: "asc" } }),
  ]);
  return { profile, skills, experience, photos };
}

// ── Profile ───────────────────────────────────────────────────────────

export type ProfileData = {
  mainPhoto: string;
  photoCaption: string;
  name: string;
  title: string;
  description: string;
  university: string;
  degree: string;
  location: string;
};

export async function saveProfile(data: ProfileData) {
  const profile = await db.profile.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });
  revalidateAll();
  return profile;
}

// ── Skills ────────────────────────────────────────────────────────────

export async function createSkillGroup(category: string) {
  const group = await db.skillGroup.create({ data: { category, items: [] } });
  revalidateAll();
  return group;
}

export async function deleteSkillGroup(id: string) {
  await db.skillGroup.delete({ where: { id } });
  revalidateAll();
}

export async function updateSkillItems(id: string, items: string[]) {
  const group = await db.skillGroup.update({ where: { id }, data: { items } });
  revalidateAll();
  return group;
}

// ── Experience ────────────────────────────────────────────────────────

export async function createExperience(data: {
  year: string;
  role: string;
  company: string;
  desc: string;
}) {
  const count = await db.experience.count();
  const exp = await db.experience.create({ data: { ...data, order: count } });
  revalidateAll();
  return exp;
}

export async function updateExperience(
  id: string,
  data: { year: string; role: string; company: string; desc: string }
) {
  const exp = await db.experience.update({ where: { id }, data });
  revalidateAll();
  return exp;
}

export async function deleteExperience(id: string) {
  await db.experience.delete({ where: { id } });
  revalidateAll();
}

// ── Photos ────────────────────────────────────────────────────────────

export async function createPhoto(data: {
  src: string;
  alt: string;
  caption: string;
}) {
  const count = await db.photo.count();
  const photo = await db.photo.create({ data: { ...data, order: count } });
  revalidateAll();
  return photo;
}

export async function deletePhoto(id: string) {
  const photo = await db.photo.findUnique({ where: { id }, select: { src: true } });

  await db.photo.delete({ where: { id } });

  if (photo?.src) {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const bucket = "gallery";
    // Extract filename from full public URL
    const filename = photo.src.split(`/object/public/${bucket}/`)[1];
    if (filename) {
      await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${filename}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${serviceKey}` },
      });
    }
  }

  revalidateAll();
}

export async function togglePhotoSlideshow(id: string, inSlideshow: boolean) {
  const photo = await db.photo.update({ where: { id }, data: { inSlideshow } });
  revalidateAll();
  return photo;
}

export async function updatePhotoMeta(id: string, data: { alt: string; caption: string }) {
  const photo = await db.photo.update({ where: { id }, data });
  revalidateAll();
  return photo;
}

export async function uploadPhotoFile(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}.${ext}`;
  const bucket = "gallery";

  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const bytes = await file.arrayBuffer();

  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": file.type || "image/jpeg",
        "x-upsert": "true",
      },
      body: bytes,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${text}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
}
