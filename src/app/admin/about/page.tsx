"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
type SkillGroup = { id: string; category: string; items: string[] };
type Experience = { id: string; year: string; role: string; company: string; desc: string };
type GalleryPhoto = { id: string; src: string; alt: string; caption: string };
type ToastState = { message: string; variant: "success" | "added" | "error" };
type Tab = "profile" | "skills" | "experience" | "gallery";

/* ── Initial data (mirrors about/page.tsx) ── */
const initSkills: SkillGroup[] = [
  { id: "1", category: "Frontend", items: ["HTML / CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"] },
  { id: "2", category: "Backend", items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "REST API"] },
  { id: "3", category: "AI & Tools", items: ["Claude API", "Line API", "Git", "Docker", "Figma"] },
];

const initExperience: Experience[] = [
  { id: "1", year: "2024", role: "Software Developer Intern", company: "Intelligent Automation Engineering Center (Lanna)", desc: "พัฒนาระบบ automation ด้วย software tools สำหรับกระบวนการในโรงงานอุตสาหกรรม" },
  { id: "2", year: "2025", role: "Freelance Front-End Developer", company: "Independent", desc: "ออกแบบและพัฒนาเว็บแอปพลิเคชันสำหรับลูกค้า ด้วย React, Next.js และ Tailwind CSS" },
  { id: "3", year: "2026", role: "Coach Engineer Programming Technical", company: "iDekTep · Kasetsart University", desc: "สอนและ coach ด้านวิศวกรรมและการเขียนโปรแกรมให้กับเยาวชนอายุ 7–15 ปี ผ่านกระบวนการ project-based learning" },
];

const initGallery: GalleryPhoto[] = [
  { id: "1", src: "/me/night.jpg", alt: "Nighttime in Hokkaido", caption: "Hokkaido · Winter" },
  { id: "2", src: "/me/snow.jpg", alt: "Snowstorm in Hokkaido", caption: "Hokkaido · Snowstorm" },
  { id: "3", src: "/me/vending.jpg", alt: "Vending machines in the snow", caption: "Hokkaido · Japan" },
  { id: "4", src: "/me/beach.jpg", alt: "Photographing the ocean", caption: "Kamakura · Japan" },
  { id: "5", src: "/me/store.jpg", alt: "At a Japanese electronics store", caption: "Tokyo · Japan" },
];

const initProfile = {
  mainPhoto: "/me/aquarium.jpg",
  photoCaption: "Japan, 2024",
  name: "Phonlatat",
  title: "Computer Engineering",
  description: "With a strong interest in technology, I enjoy coding, building systems, and learning deep into things. I'm focused on every detail and eager to learn from every role.",
  university: "Prince of Songkhla University",
  degree: "B.Eng. Computer Engineering",
  location: "Thailand",
};

/* ── Shared styles ── */
const inputCls = "w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200";
const textareaCls = `${inputCls} resize-none`;

/* ── Toast ── */
function Toast({ toast }: { toast: ToastState }) {
  const color = toast.variant === "error" ? "bg-red-500/20" : toast.variant === "added" ? "bg-sky-500/20" : "bg-emerald-500/20";
  const iconColor = toast.variant === "error" ? "text-red-400" : toast.variant === "added" ? "text-sky-400" : "text-emerald-400";
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className="fixed right-6 top-20 z-50 flex items-center gap-3 rounded-xl bg-stone-900 px-5 py-3.5 shadow-xl shadow-stone-900/20"
    >
      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${color}`}>
        {toast.variant === "error" ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={iconColor}><path d="M18 6 6 18M6 6l12 12" /></svg>
        ) : toast.variant === "added" ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={iconColor}><path d="M12 5v14M5 12h14" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={iconColor}><polyline points="20 6 9 17 4 12" /></svg>
        )}
      </div>
      <p className="text-sm font-medium text-stone-100">{toast.message}</p>
    </motion.div>
  );
}

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState(initProfile);
  const [skills, setSkills] = useState<SkillGroup[]>(initSkills);
  const [experience, setExperience] = useState<Experience[]>(initExperience);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(initGallery);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showToast(message: string, variant: ToastState["variant"] = "success") {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  }

  /* ── Profile ── */
  function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setProfile({
      mainPhoto: photoPreview ?? profile.mainPhoto,
      photoCaption: fd.get("photoCaption") as string,
      name: fd.get("name") as string,
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      university: fd.get("university") as string,
      degree: fd.get("degree") as string,
      location: fd.get("location") as string,
    });
    setPhotoPreview(null);
    showToast("บันทึก Profile เรียบร้อยแล้ว");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  }

  /* ── Skills ── */
  function addSkill(groupId: string, skill: string) {
    const trimmed = skill.trim();
    if (!trimmed) return;
    setSkills((prev) =>
      prev.map((g) =>
        g.id === groupId && !g.items.includes(trimmed)
          ? { ...g, items: [...g.items, trimmed] }
          : g
      )
    );
    showToast(`เพิ่ม "${trimmed}" แล้ว`, "added");
  }

  function removeSkill(groupId: string, skill: string) {
    setSkills((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, items: g.items.filter((i) => i !== skill) } : g
      )
    );
    showToast(`ลบ "${skill}" แล้ว`);
  }

  function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSkills((prev) => [...prev, { id: crypto.randomUUID(), category: trimmed, items: [] }]);
    showToast(`เพิ่มหมวดหมู่ "${trimmed}" แล้ว`, "added");
  }

  function removeCategory(groupId: string) {
    setSkills((prev) => prev.filter((g) => g.id !== groupId));
    showToast("ลบหมวดหมู่แล้ว");
  }

  /* ── Experience ── */
  function saveExperience(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const entry: Experience = {
      id: editingExp?.id ?? crypto.randomUUID(),
      year: fd.get("year") as string,
      role: fd.get("role") as string,
      company: fd.get("company") as string,
      desc: fd.get("desc") as string,
    };
    if (editingExp) {
      setExperience((prev) => prev.map((x) => (x.id === entry.id ? entry : x)));
      showToast("บันทึกแล้ว", "added");
    } else {
      setExperience((prev) => [...prev, entry]);
      showToast(`เพิ่ม "${entry.role}" แล้ว`, "added");
    }
    setEditingExp(null);
    e.currentTarget.reset();
  }

  function deleteExperience(id: string) {
    setExperience((prev) => prev.filter((x) => x.id !== id));
    showToast("ลบแล้ว");
  }

  /* ── Gallery ── */
  function addGalleryPhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const src = (fd.get("src") as string).trim();
    if (!src) return;
    const photo: GalleryPhoto = {
      id: crypto.randomUUID(),
      src,
      alt: (fd.get("alt") as string) || src,
      caption: (fd.get("caption") as string) || "",
    };
    setGallery((prev) => [...prev, photo]);
    e.currentTarget.reset();
    showToast("เพิ่มรูปภาพแล้ว", "added");
  }

  function removeGalleryPhoto(id: string) {
    setGallery((prev) => prev.filter((p) => p.id !== id));
    showToast("ลบรูปภาพแล้ว");
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "gallery", label: "Gallery" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">About Me</h1>
        <p className="mt-1 text-sm text-stone-500">จัดการ bio, skills, ประสบการณ์ และ gallery</p>
      </motion.div>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-xl border border-stone-200 bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════ TAB: PROFILE ═══════════════════ */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <form onSubmit={handleProfileSave} className="grid gap-8 lg:grid-cols-[240px_1fr]">

            {/* Photo column */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">รูปภาพหลัก</p>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                <Image
                  src={photoPreview ?? profile.mainPhoto}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-stone-200 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
              >
                อัพโหลดรูปใหม่
              </button>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="rounded-lg border border-red-200 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
                >
                  ยกเลิกการเปลี่ยน
                </button>
              )}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-600">Caption</label>
                <input name="photoCaption" defaultValue={profile.photoCaption} className={inputCls} placeholder="Japan, 2024" />
              </div>
            </div>

            {/* Info column */}
            <div className="flex flex-col gap-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">ข้อมูลทั่วไป</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">ชื่อ (Headline)</label>
                  <input name="name" defaultValue={profile.name} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Subtitle</label>
                  <input name="title" defaultValue={profile.title} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-600">คำอธิบาย Bio</label>
                <textarea name="description" rows={3} defaultValue={profile.description} className={textareaCls} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Quick Info</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">University</label>
                  <input name="university" defaultValue={profile.university} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Degree</label>
                  <input name="degree" defaultValue={profile.degree} className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Location</label>
                  <input name="location" defaultValue={profile.location} className={inputCls} />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700">
                  บันทึก Profile
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* ═══════════════════ TAB: SKILLS ═══════════════════ */}
      {activeTab === "skills" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col gap-6">
          {skills.map((group) => (
            <SkillGroupCard
              key={group.id}
              group={group}
              onAddSkill={(skill) => addSkill(group.id, skill)}
              onRemoveSkill={(skill) => removeSkill(group.id, skill)}
              onRemoveCategory={() => removeCategory(group.id)}
            />
          ))}
          <AddCategoryForm onAdd={addCategory} />
          <p className="text-center font-mono text-[10px] text-stone-300">
            ข้อมูลอยู่ใน memory — ต้องเชื่อมต่อ database เพื่อให้ persistent
          </p>
        </motion.div>
      )}

      {/* ═══════════════════ TAB: EXPERIENCE ═══════════════════ */}
      {activeTab === "experience" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col gap-6">
          {/* List */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="border-b border-stone-100 bg-stone-50 px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-stone-400">Experience ({experience.length})</p>
            </div>
            <ul className="divide-y divide-stone-100">
              {experience.map((exp) => (
                <motion.li
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="flex flex-col gap-3 px-4 py-4 hover:bg-stone-50 sm:flex-row sm:items-start sm:gap-6"
                >
                  <p className="w-12 shrink-0 font-mono text-sm text-stone-400">{exp.year}</p>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-stone-900">{exp.role}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{exp.company}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-400">{exp.desc}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 font-mono text-[11px]">
                    <button onClick={() => setEditingExp(exp)} className="text-stone-500 transition-colors hover:text-stone-900">แก้ไข</button>
                    <span className="text-stone-200">|</span>
                    <button onClick={() => deleteExperience(exp.id)} className="text-red-400 transition-colors hover:text-red-600">ลบ</button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Add / Edit form */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <p className="mb-5 text-sm font-semibold text-stone-900">
              {editingExp ? "แก้ไข Experience" : "เพิ่ม Experience ใหม่"}
            </p>
            <form key={editingExp?.id ?? "new"} onSubmit={saveExperience} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">ปี</label>
                  <input name="year" required defaultValue={editingExp?.year} placeholder="2025" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">ตำแหน่ง <span className="text-red-400">*</span></label>
                  <input name="role" required defaultValue={editingExp?.role} placeholder="Front-End Developer" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">บริษัท / สถาบัน</label>
                  <input name="company" defaultValue={editingExp?.company} placeholder="Company Name" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-600">คำอธิบาย</label>
                <textarea name="desc" rows={2} defaultValue={editingExp?.desc} placeholder="บอกเล่าสิ่งที่ทำในตำแหน่งนี้..." className={textareaCls} />
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700">
                  {editingExp ? "บันทึก" : "เพิ่ม"}
                </button>
                {editingExp && (
                  <button type="button" onClick={() => setEditingExp(null)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100">
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>
          </div>

          <p className="text-center font-mono text-[10px] text-stone-300">
            ข้อมูลอยู่ใน memory — ต้องเชื่อมต่อ database เพื่อให้ persistent
          </p>
        </motion.div>
      )}

      {/* ═══════════════════ TAB: GALLERY ═══════════════════ */}
      {activeTab === "gallery" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col gap-6">
          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence initial={false}>
              {gallery.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-stone-900/0 transition-colors group-hover:bg-stone-900/40" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="rounded-lg bg-white/90 px-2 py-1 font-mono text-[10px] text-stone-600 backdrop-blur-sm">{photo.caption}</p>
                  </div>
                  <button
                    onClick={() => removeGalleryPhoto(photo.id)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    title="ลบรูปภาพ"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {gallery.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-400">
              ยังไม่มีรูปภาพ — เพิ่มรูปภาพด้านล่าง
            </div>
          )}

          {/* Add photo form */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <p className="mb-5 text-sm font-semibold text-stone-900">เพิ่มรูปภาพ</p>
            <form onSubmit={addGalleryPhoto} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Image Path / URL <span className="text-red-400">*</span></label>
                  <input name="src" required placeholder="/me/photo.jpg" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Alt Text</label>
                  <input name="alt" placeholder="Description of photo" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Caption</label>
                  <input name="caption" placeholder="Tokyo · Japan" className={inputCls} />
                </div>
              </div>
              <div>
                <button type="submit" className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700">
                  เพิ่มรูปภาพ
                </button>
              </div>
            </form>
          </div>

          <p className="text-center font-mono text-[10px] text-stone-300">
            ไฟล์รูปภาพต้องอัพโหลดไปที่ /public/me/ ก่อน — ข้อมูลอยู่ใน memory
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function SkillGroupCard({
  group,
  onAddSkill,
  onRemoveSkill,
  onRemoveCategory,
}: {
  group: SkillGroup;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  onRemoveCategory: () => void;
}) {
  const [input, setInput] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    onAddSkill(input);
    setInput("");
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-stone-500">{group.category}</p>
        <button
          onClick={onRemoveCategory}
          className="rounded-md px-2.5 py-1 text-[11px] text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          ลบหมวดหมู่
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {group.items.map((item) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
              className="group flex items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 font-mono text-xs text-stone-600"
            >
              {item}
              <button
                onClick={() => onRemoveSkill(item)}
                className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-stone-300 text-stone-600 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-400 hover:text-white"
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {group.items.length === 0 && (
          <span className="text-xs text-stone-300">ยังไม่มี skill — เพิ่มด้านล่าง</span>
        )}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="เพิ่ม skill..."
          className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
        />
        <button type="submit" className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700">
          เพิ่ม
        </button>
      </form>
    </div>
  );
}

function AddCategoryForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(input);
    setInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-2xl border border-dashed border-stone-300 p-5">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="ชื่อหมวดหมู่ใหม่ (เช่น Mobile, DevOps)"
        className="flex-1 rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
      />
      <button type="submit" className="shrink-0 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700">
        + เพิ่มหมวดหมู่
      </button>
    </form>
  );
}
