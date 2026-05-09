"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Block } from "@prisma/client";
import { inputCls, selectCls } from "@/lib/admin-styles";
import { createBlock, updateBlock, deleteBlock } from "./actions";

type ModalState =
  | { kind: "confirm-delete"; id: string; title: string }
  | { kind: "edit"; block: Block };

type ToastState = { message: string; variant: "success" | "added" };

const TAGS = ["Note", "Tutorial", "Tip", "Idea", "Reflection", "Update"];

export default function BlocksClient({ initialBlocks }: { initialBlocks: Block[] }) {
  const [list, setList] = useState<Block[]>(initialBlocks);
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(message: string, variant: ToastState["variant"] = "success") {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3200);
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const data = {
      tag: (fd.get("tag") as string) || "Note",
      date: (fd.get("date") as string) || "",
      title,
      body: fd.get("body") as string,
    };
    e.currentTarget.reset();
    setShowForm(false);
    startTransition(async () => {
      const block = await createBlock(data);
      setList((prev) => [block, ...prev]);
      showToast(`เพิ่ม "${title}" แล้ว`, "added");
    });
  }

  function handleEditSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!modal || modal.kind !== "edit") return;
    const fd = new FormData(e.currentTarget);
    const data = {
      tag: (fd.get("tag") as string) || "Note",
      date: (fd.get("date") as string) || "",
      title: fd.get("title") as string,
      body: fd.get("body") as string,
    };
    const id = modal.block.id;
    setModal(null);
    startTransition(async () => {
      const updated = await updateBlock(id, data);
      setList((prev) => prev.map((b) => (b.id === id ? updated : b)));
      showToast(`บันทึก "${data.title}" แล้ว`, "added");
    });
  }

  function confirmDelete() {
    if (!modal || modal.kind !== "confirm-delete") return;
    const { id, title } = modal;
    setList((prev) => prev.filter((b) => b.id !== id));
    setModal(null);
    startTransition(async () => {
      await deleteBlock(id);
      showToast(`ลบ "${title}" แล้ว`);
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setModal(null)}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {modal.kind === "confirm-delete" && (
                <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl shadow-stone-900/20">
                  <div className="p-6">
                    <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </div>
                    <h2 className="text-center text-base font-semibold text-stone-900">ยืนยันการลบ?</h2>
                    <p className="mt-2 text-center text-sm leading-relaxed text-stone-500">
                      &ldquo;{modal.title}&rdquo;<br />จะถูกลบออกและไม่สามารถกู้คืนได้
                    </p>
                  </div>
                  <div className="flex border-t border-stone-100">
                    <button onClick={() => setModal(null)} className="flex-1 py-3.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-50">ยกเลิก</button>
                    <div className="w-px bg-stone-100" />
                    <button onClick={confirmDelete} className="flex-1 py-3.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50">ลบเลย</button>
                  </div>
                </div>
              )}

              {modal.kind === "edit" && (
                <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl shadow-stone-900/20">
                  <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                    <h2 className="text-sm font-semibold text-stone-900">แก้ไข Block</h2>
                    <button onClick={() => setModal(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <form onSubmit={handleEditSave} className="flex flex-col gap-4 px-6 py-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-stone-600">Tag</label>
                        <select name="tag" defaultValue={modal.block.tag} className={selectCls}>
                          {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-stone-600">วันที่ (แสดงผล)</label>
                        <input name="date" defaultValue={modal.block.date} placeholder="May 2026" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-stone-600">หัวข้อ <span className="text-red-400">*</span></label>
                      <input name="title" required defaultValue={modal.block.title} className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-stone-600">เนื้อหา <span className="text-red-400">*</span></label>
                      <textarea name="body" required rows={5} defaultValue={modal.block.body} className={`${inputCls} resize-none`} />
                    </div>
                    <div className="flex items-center gap-3 border-t border-stone-100 pt-3">
                      <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60">บันทึก</button>
                      <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100">ยกเลิก</button>
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
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="fixed right-6 top-20 z-50 flex items-center gap-3 rounded-xl bg-stone-900 px-5 py-3.5 shadow-xl shadow-stone-900/20"
          >
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${toast.variant === "success" ? "bg-emerald-500/20" : "bg-sky-500/20"}`}>
              {toast.variant === "success" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400"><path d="M12 5v14M5 12h14" /></svg>
              )}
            </div>
            <p className="text-sm font-medium text-stone-100">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Blocks</h1>
          <p className="mt-1 text-sm text-stone-500">เพิ่ม แก้ไข และลบ notes, thoughts</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
        >
          {showForm ? "ยกเลิก" : "+ เพิ่ม Block"}
        </button>
      </motion.div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <p className="mb-6 text-sm font-semibold text-stone-900">เพิ่ม Block ใหม่</p>
              <form onSubmit={handleAdd} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Tag</label>
                    <select name="tag" className={selectCls}>
                      {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">วันที่ (แสดงผล)</label>
                    <input name="date" placeholder="May 2026" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">หัวข้อ <span className="text-red-400">*</span></label>
                  <input name="title" required placeholder="ชื่อ block..." className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">เนื้อหา <span className="text-red-400">*</span></label>
                  <textarea name="body" required rows={4} placeholder="เขียนอะไรก็ได้..." className={`${inputCls} resize-none`} />
                </div>
                <div className="flex items-center gap-3 border-t border-stone-200 pt-4">
                  <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60">บันทึก</button>
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100">ยกเลิก</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blocks grid preview + list */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

        {/* List (management) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.38 }}
          className="overflow-hidden rounded-2xl border border-stone-200"
        >
          <div className="border-b border-stone-200 bg-stone-50 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">
              Blocks ({list.length})
            </p>
          </div>

          {list.length === 0 ? (
            <div className="py-16 text-center text-sm text-stone-400">
              ยังไม่มี block — กด &quot;+ เพิ่ม Block&quot; เพื่อเริ่มต้น
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              <AnimatePresence initial={false}>
                {list.map((block) => (
                  <motion.li
                    key={block.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.22 } }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-2 bg-white px-4 py-4 transition-colors hover:bg-stone-50 sm:flex-row sm:items-start sm:gap-4"
                  >
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-md border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-stone-400">
                        {block.tag}
                      </span>
                      <span className="font-mono text-[10px] text-stone-300">{block.date}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-900">{block.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-stone-400">{block.body}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 font-mono text-[11px]">
                      <button onClick={() => setModal({ kind: "edit", block })} className="text-stone-500 transition-colors hover:text-stone-900">แก้ไข</button>
                      <span className="text-stone-200">|</span>
                      <button onClick={() => setModal({ kind: "confirm-delete", id: block.id, title: block.title })} className="text-red-400 transition-colors hover:text-red-600">ลบ</button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>

        {/* Preview panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.38 }}
          className="flex flex-col gap-4"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">Preview (เหมือนหน้า /blocks)</p>
          <div className="grid gap-3">
            <AnimatePresence initial={false}>
              {list.slice(0, 4).map((block) => (
                <motion.div
                  key={block.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                  className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stone-400">
                      {block.tag}
                    </span>
                    <span className="font-mono text-[10px] text-stone-300">{block.date}</span>
                  </div>
                  <p className="mb-1.5 text-sm font-semibold text-stone-900">{block.title}</p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-stone-400">{block.body}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {list.length > 4 && (
              <p className="text-center font-mono text-[10px] text-stone-300">
                + {list.length - 4} blocks more
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
