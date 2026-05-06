"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getBlocks() {
  return db.block.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createBlock(data: {
  tag: string;
  date: string;
  title: string;
  body: string;
}) {
  const block = await db.block.create({ data });
  revalidatePath("/blocks");
  revalidatePath("/admin/blocks");
  return block;
}

export async function updateBlock(
  id: string,
  data: { tag: string; date: string; title: string; body: string }
) {
  const block = await db.block.update({ where: { id }, data });
  revalidatePath("/blocks");
  revalidatePath("/admin/blocks");
  return block;
}

export async function deleteBlock(id: string) {
  await db.block.delete({ where: { id } });
  revalidatePath("/blocks");
  revalidatePath("/admin/blocks");
}
