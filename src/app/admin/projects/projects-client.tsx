"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { statusConfig, type Project, type ProjectStatus } from "@/lib/projects";
import { createProject, updateProject, deleteProject } from "./actions";

type ModalState =
  | { kind: "confirm-delete"; id: string; name: string }
  | { kind: "edit"; project: Project };

type ToastState = { message: string; variant: "success" | "added" };

const inputCls =
  "w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200";
const selectCls =
  "w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-700 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200";

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [showForm, setShowForm] = useState(false);
  const [list, setList] = useState<Project[]>(initialProjects);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = {
    total: list.length,
    "in-progress": list.filter((p) => p.status === "in-progress").length,
    planning: list.filter((p) => p.status === "planning").length,
    completed: list.filter((p) => p.status === "completed").length,
  };

  function showToast(message: string, variant: ToastState["variant"] = "success") {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3200);
  }

  function confirmDelete() {
    if (!modal || modal.kind !== "confirm-delete") return;
    const { id, name } = modal;
    setList((prev) => prev.filter((p) => p.id !== id));
    setModal(null);
    startTransition(async () => {
      await deleteProject(id);
      showToast(`ลบ "${name}" เรียบร้อยแล้ว`);
    });
  }

  function handleEditSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal || modal.kind !== "edit") return;
    const fd = new FormData(e.currentTarget);
    const data = {
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      status: fd.get("status") as ProjectStatus,
      tags: ((fd.get("tags") as string) ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      startDate: (fd.get("startDate") as string) || modal.project.startDate,
      featured: fd.get("featured") === "true",
      githubUrl: (fd.get("github") as string) || null,
      liveUrl: (fd.get("live") as string) || null,
    };
    const id = modal.project.id;
    setModal(null);
    startTransition(async () => {
      const updated = await updateProject(id, data);
      setList((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(`บันทึก "${data.title}" เรียบร้อยแล้ว`, "added");
    });
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const data = {
      title,
      description: fd.get("description") as string,
      status: (fd.get("status") as string) || "planning",
      tags: ((fd.get("tags") as string) ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      startDate: (fd.get("startDate") as string) || new Date().toISOString().slice(0, 10),
      featured: fd.get("featured") === "true",
      githubUrl: (fd.get("github") as string) || null,
      liveUrl: (fd.get("live") as string) || null,
    };
    e.currentTarget.reset();
    setShowForm(false);
    startTransition(async () => {
      const newProject = await createProject(data);
      setList((prev) => [newProject, ...prev]);
      showToast(`เพิ่ม "${title}" เรียบร้อยแล้ว`, "added");
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm" onClick={() => setModal(null)} />
            <motion.div key="modal" initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 16 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>

              {modal.kind === "confirm-delete" && (
                <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl shadow-stone-900/20">
                  <div className="p-6">
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                    </div>
                    <h2 className="text-center text-base font-semibold text-stone-900">ยืนยันการลบ?</h2>
                    <p className="mt-2 text-center text-sm leading-relaxed text-stone-500">&ldquo;{modal.name}&rdquo;<br />จะถูกลบออกและไม่สามารถกู้คืนได้</p>
                  </div>
                  <div className="flex border-t border-stone-100">
                    <button onClick={() => setModal(null)} className="flex-1 py-3.5 text-sm font-medium text-stone-500 hover:bg-stone-50">ยกเลิก</button>
                    <div className="w-px bg-stone-100" />
                    <button onClick={confirmDelete} disabled={isPending} className="flex-1 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50">ลบเลย</button>
                  </div>
                </div>
              )}

              {modal.kind === "edit" && (
                <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl shadow-stone-900/20">
                  <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                    <h2 className="text-sm font-semibold text-stone-900">แก้ไขโปรเจค</h2>
                    <button onClick={() => setModal(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg></button>
                  </div>
                  <form onSubmit={handleEditSave} className="flex flex-col gap-4 px-6 py-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label className="mb-1.5 block text-xs font-medium text-stone-600">ชื่อโปรเจค <span className="text-red-400">*</span></label><input name="title" required defaultValue={modal.project.title} className={inputCls} /></div>
                      <div><label className="mb-1.5 block text-xs font-medium text-stone-600">สถานะ</label><select name="status" defaultValue={modal.project.status} className={selectCls}><option value="planning">วางแผน</option><option value="in-progress">กำลังพัฒนา</option><option value="completed">เสร็จแล้ว</option></select></div>
                    </div>
                    <div><label className="mb-1.5 block text-xs font-medium text-stone-600">คำอธิบาย <span className="text-red-400">*</span></label><textarea name="description" required rows={2} defaultValue={modal.project.description} className={`${inputCls} resize-none`} /></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label className="mb-1.5 block text-xs font-medium text-stone-600">Tech Stack</label><input name="tags" defaultValue={modal.project.tags.join(", ")} placeholder="Next.js, TypeScript (คั่นด้วย ,)" className={inputCls} /></div>
                      <div><label className="mb-1.5 block text-xs font-medium text-stone-600">วันที่เริ่ม</label><input name="startDate" type="date" defaultValue={modal.project.startDate} className={inputCls} /></div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label className="mb-1.5 block text-xs font-medium text-stone-600">GitHub URL</label><input name="github" type="url" defaultValue={modal.project.githubUrl ?? ""} placeholder="https://github.com/..." className={inputCls} /></div>
                      <div><label className="mb-1.5 block text-xs font-medium text-stone-600">Live URL</label><input name="live" type="url" defaultValue={modal.project.liveUrl ?? ""} placeholder="https://..." className={inputCls} /></div>
                    </div>
                    <div><label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600"><input name="featured" type="checkbox" value="true" defaultChecked={modal.project.featured} className="h-4 w-4 rounded border-stone-300" />แสดงใน Featured</label></div>
                    <div className="flex items-center gap-3 border-t border-stone-100 pt-3">
                      <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50">{isPending ? "กำลังบันทึก..." : "บันทึก"}</button>
                      <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100">ยกเลิก</button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.message} initial={{ opacity: 0, y: -16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.96 }} transition={{ type: "spring", stiffness: 420, damping: 28 }} className="fixed right-6 top-20 z-50 flex items-center gap-3 rounded-xl bg-stone-900 px-5 py-3.5 shadow-xl">
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${toast.variant === "success" ? "bg-emerald-500/20" : "bg-sky-500/20"}`}>
              {toast.variant === "success" ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M12 5v14M5 12h14" /></svg>}
            </div>
            <p className="text-sm font-medium text-stone-100">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Projects</h1>
          <p className="mt-1 text-sm text-stone-500">เพิ่ม แก้ไข และลบโปรเจค</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
          {showForm ? "ยกเลิก" : "+ เพิ่มโปรเจค"}
        </button>
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: counts.total },
          { label: statusConfig["in-progress"].label, value: counts["in-progress"] },
          { label: statusConfig.planning.label, value: counts.planning },
          { label: statusConfig.completed.label, value: counts.completed },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.35 }} className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <p className="mb-6 text-sm font-semibold text-stone-900">เพิ่มโปรเจคใหม่</p>
              <form onSubmit={handleAdd} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="mb-1.5 block text-xs font-medium text-stone-600">ชื่อโปรเจค <span className="text-red-400">*</span></label><input name="title" required placeholder="My Awesome App" className={inputCls} /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-stone-600">สถานะ</label><select name="status" className={selectCls}><option value="planning">วางแผน</option><option value="in-progress">กำลังพัฒนา</option><option value="completed">เสร็จแล้ว</option></select></div>
                </div>
                <div><label className="mb-1.5 block text-xs font-medium text-stone-600">คำอธิบาย <span className="text-red-400">*</span></label><textarea name="description" required rows={2} placeholder="อธิบายสั้นๆ..." className={`${inputCls} resize-none`} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="mb-1.5 block text-xs font-medium text-stone-600">Tech Stack</label><input name="tags" placeholder="Next.js, TypeScript (คั่นด้วย ,)" className={inputCls} /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-stone-600">วันที่เริ่ม</label><input name="startDate" type="date" className={inputCls} /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="mb-1.5 block text-xs font-medium text-stone-600">GitHub URL</label><input name="github" type="url" placeholder="https://github.com/..." className={inputCls} /></div>
                  <div><label className="mb-1.5 block text-xs font-medium text-stone-600">Live URL</label><input name="live" type="url" placeholder="https://..." className={inputCls} /></div>
                </div>
                <div><label className="flex cursor-pointer items-center gap-2 text-sm text-stone-600"><input name="featured" type="checkbox" value="true" className="h-4 w-4 rounded border-stone-300" />แสดงใน Featured</label></div>
                <div className="flex items-center gap-3 border-t border-stone-200 pt-4">
                  <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50">{isPending ? "กำลังบันทึก..." : "บันทึก"}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100">ยกเลิก</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project list */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.38 }} className="overflow-hidden rounded-2xl border border-stone-200">
        <div className="border-b border-stone-200 bg-stone-50 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">Projects ({list.length})</p>
        </div>
        {list.length === 0 ? (
          <div className="py-16 text-center text-sm text-stone-400">ยังไม่มีโปรเจค — กด &quot;+ เพิ่มโปรเจค&quot; เพื่อเริ่มต้น</div>
        ) : (
          <ul className="divide-y divide-stone-100">
            <AnimatePresence initial={false}>
              {list.map((p) => {
                const cfg = statusConfig[p.status as ProjectStatus] ?? statusConfig.planning;
                return (
                  <motion.li key={p.id} layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, transition: { duration: 0.22 } }} transition={{ duration: 0.3 }} className="flex flex-col gap-3 bg-white px-4 py-4 transition-colors hover:bg-stone-50 sm:flex-row sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-stone-900">{p.title}</p>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.color}`}><span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />{cfg.label}</span>
                        {p.featured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">Featured</span>}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-xs text-stone-400">{p.description}</p>
                      {p.tags.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{p.tags.map((tag) => <span key={tag} className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[10px] text-stone-500">{tag}</span>)}</div>}
                    </div>
                    <p className="shrink-0 font-mono text-[11px] text-stone-300">{p.startDate}</p>
                    <div className="flex shrink-0 items-center gap-3 font-mono text-[11px]">
                      <Link href={`/projects/${p.id}`} target="_blank" className="text-stone-400 hover:text-stone-700">ดู</Link>
                      <span className="text-stone-200">|</span>
                      <button onClick={() => setModal({ kind: "edit", project: p })} className="text-stone-500 hover:text-stone-900">แก้ไข</button>
                      <span className="text-stone-200">|</span>
                      <button onClick={() => setModal({ kind: "confirm-delete", id: p.id, name: p.title })} className="text-red-400 hover:text-red-600">ลบ</button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </div>
  );
}
