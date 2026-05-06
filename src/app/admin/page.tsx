import { db } from "@/lib/db";
import AdminOverviewClient from "./overview-client";

export default async function AdminOverviewPage() {
  const [total, inProgress, planning, completed, blockCount] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { status: "in-progress" } }),
    db.project.count({ where: { status: "planning" } }),
    db.project.count({ where: { status: "completed" } }),
    db.block.count(),
  ]);

  return (
    <AdminOverviewClient
      projectStats={{ total, inProgress, planning, completed }}
      blockCount={blockCount}
    />
  );
}
