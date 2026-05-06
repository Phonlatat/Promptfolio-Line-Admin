"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Profile, SkillGroup, Experience, Photo } from "@prisma/client";
import {
  saveProfile,
  createSkillGroup,
  deleteSkillGroup,
  updateSkillItems,
  createExperience,
  updateExperience,
  deleteExperience,
  createPhoto,
  deletePhoto,
  togglePhotoSlideshow,
  uploadPhotoFile,
  updatePhotoMeta,
} from "./actions";

type Tab = "profile" | "skills" | "experience" | "gallery";
type ToastState = { message: string; variant: "success" | "added" | "error" };

interface Props {
  initialProfile: Profile | null;
  initialSkills: SkillGroup[];
  initialExperience: Experience[];
  initialPhotos: Photo[];
}

const DEFAULT_PROFILE: Profile = {
  id: "singleton",
  mainPhoto: "/me/aquarium.jpg",
  photoCaption: "Japan, 2024",
  name: "Phonlatat",
  title: "Computer Engineering",
  description: "With a strong interest in technology, I enjoy coding, building systems, and learning deep into things.",
  university: "Prince of Songkhla University",
  degree: "B.Eng. Computer Engineering",
  location: "Thailand",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const inputCls = "w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200";
const textareaCls = `${inputCls} resize-none`;

async function readExifCaption(file: File): Promise<string | null> {
  try {
    const { gps } = await import("exifr");
    const result = await gps(file);
    if (!result?.latitude || !result?.longitude) return null;
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${result.latitude}&lon=${result.longitude}&format=json&accept-language=en`,
      { headers: { "User-Agent": "Promptfolio/1.0" } }
    );
    const data = await r.json();
    const addr = data.address;
    const city = addr?.city || addr?.town || addr?.village || addr?.county;
    const country = addr?.country;
    if (city && country) return `${city} · ${country}`;
    if (country) return country;
    return null;
  } catch { return null; }
}

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

export default function AdminAboutClient({ initialProfile, initialSkills, initialExperience, initialPhotos }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<Profile>(initialProfile ?? DEFAULT_PROFILE);
  const [skills, setSkills] = useState<SkillGroup[]>(initialSkills);
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();

  // Profile photo
  const profileFileRef = useRef<HTMLInputElement>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(profile.mainPhoto);

  // Gallery upload
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const [galleryMode, setGalleryMode] = useState<"upload" | "url">("upload");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);
  const [galleryAlt, setGalleryAlt] = useState("");
  const [galleryCaption, setGalleryCaption] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Modals
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  function showToast(message: string, variant: ToastState["variant"] = "success") {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "gallery", label: "Gallery" },
  ];

  /* ── Profile ─────────────────────────────────────────────────────── */
  function handleProfileFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  }

  function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      mainPhoto: profileFile ? profile.mainPhoto : (fd.get("mainPhotoPath") as string).trim() || profile.mainPhoto,
      photoCaption: fd.get("photoCaption") as string,
      name: fd.get("name") as string,
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      university: fd.get("university") as string,
      degree: fd.get("degree") as string,
      location: fd.get("location") as string,
    };
    const capturedFile = profileFile;
    startTransition(async () => {
      let finalData = { ...data };
      if (capturedFile) {
        const uploadFd = new FormData();
        uploadFd.set("file", capturedFile);
        const url = await uploadPhotoFile(uploadFd);
        finalData = { ...finalData, mainPhoto: url };
        setProfilePreview(url);
        setProfileFile(null);
      }
      setProfile((p) => ({ ...p, ...finalData }));
      await saveProfile(finalData);
      showToast("บันทึก Profile เรียบร้อยแล้ว");
    });
  }

  /* ── Skills ──────────────────────────────────────────────────────── */
  function addSkill(group: SkillGroup, skill: string) {
    const trimmed = skill.trim();
    if (!trimmed || group.items.includes(trimmed)) return;
    const newItems = [...group.items, trimmed];
    setSkills((prev) => prev.map((g) => (g.id === group.id ? { ...g, items: newItems } : g)));
    startTransition(async () => {
      await updateSkillItems(group.id, newItems);
      showToast(`เพิ่ม "${trimmed}" แล้ว`, "added");
    });
  }

  function removeSkill(group: SkillGroup, skill: string) {
    const newItems = group.items.filter((i) => i !== skill);
    setSkills((prev) => prev.map((g) => (g.id === group.id ? { ...g, items: newItems } : g)));
    startTransition(async () => {
      await updateSkillItems(group.id, newItems);
      showToast(`ลบ "${skill}" แล้ว`);
    });
  }

  function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const group = await createSkillGroup(trimmed);
      setSkills((prev) => [...prev, group]);
      showToast(`เพิ่มหมวดหมู่ "${trimmed}" แล้ว`, "added");
    });
  }

  function removeCategory(id: string) {
    setSkills((prev) => prev.filter((g) => g.id !== id));
    startTransition(async () => {
      await deleteSkillGroup(id);
      showToast("ลบหมวดหมู่แล้ว");
    });
  }

  /* ── Experience ──────────────────────────────────────────────────── */
  function handleAddExperience(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      year: fd.get("year") as string,
      role: fd.get("role") as string,
      company: fd.get("company") as string,
      desc: fd.get("desc") as string,
    };
    e.currentTarget.reset();
    startTransition(async () => {
      const exp = await createExperience(data);
      setExperience((prev) => [...prev, exp]);
      showToast(`เพิ่ม "${data.role}" แล้ว`, "added");
    });
  }

  function handleSaveEditExp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingExp) return;
    const fd = new FormData(e.currentTarget);
    const data = {
      year: fd.get("year") as string,
      role: fd.get("role") as string,
      company: fd.get("company") as string,
      desc: fd.get("desc") as string,
    };
    const id = editingExp.id;
    setExperience((prev) => prev.map((x) => (x.id === id ? { ...x, ...data } : x)));
    setEditingExp(null);
    startTransition(async () => {
      await updateExperience(id, data);
      showToast("บันทึกแล้ว");
    });
  }

  function removeExperience(id: string) {
    setExperience((prev) => prev.filter((x) => x.id !== id));
    startTransition(async () => {
      await deleteExperience(id);
      showToast("ลบแล้ว");
    });
  }

  /* ── Gallery ─────────────────────────────────────────────────────── */
  async function handleGalleryFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryFile(file);
    setGalleryPreview(URL.createObjectURL(file));
    setGalleryAlt(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    setIsDetectingLocation(true);
    const caption = await readExifCaption(file);
    setGalleryCaption(caption ?? "");
    setIsDetectingLocation(false);
  }

  function addPhotoByUrl(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const src = (fd.get("src") as string).trim();
    if (!src) return;
    const data = {
      src,
      alt: (fd.get("alt") as string) || src,
      caption: (fd.get("caption") as string) || "",
    };
    e.currentTarget.reset();
    startTransition(async () => {
      const photo = await createPhoto(data);
      setPhotos((prev) => [...prev, photo]);
      showToast("เพิ่มรูปภาพแล้ว", "added");
    });
  }

  function addPhotoByUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!galleryFile) return;
    const file = galleryFile;
    const alt = galleryAlt || file.name;
    const caption = galleryCaption;
    startTransition(async () => {
      const uploadFd = new FormData();
      uploadFd.set("file", file);
      const src = await uploadPhotoFile(uploadFd);
      const photo = await createPhoto({ src, alt, caption });
      setPhotos((prev) => [...prev, photo]);
      setGalleryFile(null);
      setGalleryPreview(null);
      setGalleryAlt("");
      setGalleryCaption("");
      if (galleryFileRef.current) galleryFileRef.current.value = "";
      showToast("เพิ่มรูปภาพแล้ว", "added");
    });
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    startTransition(async () => {
      await deletePhoto(id);
      showToast("ลบรูปภาพแล้ว");
    });
  }

  function toggleSlideshow(photo: Photo) {
    const next = !photo.inSlideshow;
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, inSlideshow: next } : p)));
    startTransition(async () => {
      await togglePhotoSlideshow(photo.id, next);
      showToast(next ? "เพิ่มใน Slideshow แล้ว" : "ลบออกจาก Slideshow แล้ว", "added");
    });
  }

  function handleSavePhotoMeta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingPhoto) return;
    const fd = new FormData(e.currentTarget);
    const alt = fd.get("alt") as string;
    const caption = fd.get("caption") as string;
    const id = editingPhoto.id;
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, alt, caption } : p)));
    setEditingPhoto(null);
    startTransition(async () => {
      await updatePhotoMeta(id, { alt, caption });
      showToast("บันทึก caption แล้ว");
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>

      {/* ── Experience Edit Modal ── */}
      <AnimatePresence>
        {editingExp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-stone-900/50 px-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingExp(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-900">แก้ไข Experience</p>
                <button onClick={() => setEditingExp(null)} className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <form key={editingExp.id} onSubmit={handleSaveEditExp} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">ปี</label>
                    <input name="year" required defaultValue={editingExp.year} placeholder="2025" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">ตำแหน่ง <span className="text-red-400">*</span></label>
                    <input name="role" required defaultValue={editingExp.role} placeholder="Front-End Developer" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">บริษัท / สถาบัน</label>
                    <input name="company" defaultValue={editingExp.company} placeholder="Company Name" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">คำอธิบาย</label>
                  <textarea name="desc" rows={3} defaultValue={editingExp.desc} placeholder="บอกเล่าสิ่งที่ทำ..." className={textareaCls} />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60">
                    บันทึก
                  </button>
                  <button type="button" onClick={() => setEditingExp(null)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100">
                    ยกเลิก
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Photo Edit Modal ── */}
      <AnimatePresence>
        {editingPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-stone-900/50 px-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingPhoto(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-900">แก้ไขข้อมูลรูป</p>
                <button onClick={() => setEditingPhoto(null)} className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="relative mb-4 h-32 w-full overflow-hidden rounded-xl bg-stone-100">
                <Image src={editingPhoto.src} alt={editingPhoto.alt} fill className="object-cover" sizes="400px" />
              </div>
              <form onSubmit={handleSavePhotoMeta} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Alt Text</label>
                  <input name="alt" defaultValue={editingPhoto.alt} placeholder="Description of photo" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">Caption</label>
                  <input name="caption" defaultValue={editingPhoto.caption} placeholder="Tokyo · Japan" className={inputCls} />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60">
                    บันทึก
                  </button>
                  <button type="button" onClick={() => setEditingPhoto(null)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100">
                    ยกเลิก
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* ════ PROFILE ════ */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <form onSubmit={handleProfileSave} className="grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* Photo column */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">รูปภาพหลัก</p>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                {profilePreview.startsWith("blob:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePreview} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <Image src={profilePreview || "/me/aquarium.jpg"} alt="Profile" fill className="object-cover" sizes="240px" />
                )}
              </div>
              <input
                ref={profileFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileFileChange}
              />
              <button
                type="button"
                onClick={() => profileFileRef.current?.click()}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                {profileFile ? `${profileFile.name}` : "เลือกรูปภาพ..."}
              </button>
              {profileFile ? (
                <p className="text-[11px] text-stone-400">รูปจะอัพโหลดเมื่อกด &quot;บันทึก Profile&quot;</p>
              ) : (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">หรือใส่ Path</label>
                  <input
                    name="mainPhotoPath"
                    value={profilePreview}
                    onChange={(e) => setProfilePreview(e.target.value)}
                    placeholder="/me/aquarium.jpg"
                    className={inputCls}
                  />
                </div>
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
                <label className="mb-1.5 block text-xs font-medium text-stone-600">Bio</label>
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
                <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60">
                  {isPending ? "กำลังบันทึก..." : "บันทึก Profile"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* ════ SKILLS ════ */}
      {activeTab === "skills" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col gap-6">
          {skills.map((group) => (
            <SkillGroupCard
              key={group.id}
              group={group}
              onAddSkill={(skill) => addSkill(group, skill)}
              onRemoveSkill={(skill) => removeSkill(group, skill)}
              onRemoveCategory={() => removeCategory(group.id)}
            />
          ))}
          <AddCategoryForm onAdd={addCategory} />
        </motion.div>
      )}

      {/* ════ EXPERIENCE ════ */}
      {activeTab === "experience" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col gap-6">
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
                    <button onClick={() => removeExperience(exp.id)} className="text-red-400 transition-colors hover:text-red-600">ลบ</button>
                  </div>
                </motion.li>
              ))}
              {experience.length === 0 && (
                <li className="py-10 text-center text-sm text-stone-400">ยังไม่มีประสบการณ์ — เพิ่มด้านล่าง</li>
              )}
            </ul>
          </div>

          {/* Add new — always visible */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <p className="mb-5 text-sm font-semibold text-stone-900">เพิ่ม Experience ใหม่</p>
            <form onSubmit={handleAddExperience} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">ปี</label>
                  <input name="year" required placeholder="2025" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">ตำแหน่ง <span className="text-red-400">*</span></label>
                  <input name="role" required placeholder="Front-End Developer" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-600">บริษัท / สถาบัน</label>
                  <input name="company" placeholder="Company Name" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-stone-600">คำอธิบาย</label>
                <textarea name="desc" rows={2} placeholder="บอกเล่าสิ่งที่ทำ..." className={textareaCls} />
              </div>
              <div>
                <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60">
                  เพิ่ม
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* ════ GALLERY ════ */}
      {activeTab === "gallery" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex flex-col gap-6">

          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-amber-500">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs leading-relaxed text-amber-700">
              รูปที่ toggle <strong>Slideshow</strong> จะปรากฏใน slideshow หน้าแรก — กดไอคอนดินสอเพื่อแก้ไข alt / caption
            </p>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence initial={false}>
              {photos.map((photo) => (
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

                  {/* Slideshow toggle */}
                  <button
                    onClick={() => toggleSlideshow(photo)}
                    title={photo.inSlideshow ? "ลบออกจาก Slideshow" : "เพิ่มใน Slideshow"}
                    className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-all ${
                      photo.inSlideshow
                        ? "bg-amber-400 text-amber-900 shadow-sm"
                        : "bg-black/40 text-white opacity-0 backdrop-blur-sm group-hover:opacity-100"
                    }`}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill={photo.inSlideshow ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    {photo.inSlideshow ? "Slideshow" : "+ Slide"}
                  </button>

                  {/* Edit pencil */}
                  <button
                    onClick={() => setEditingPhoto(photo)}
                    className="absolute right-9 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100"
                    title="แก้ไข alt / caption"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-700">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    title="ลบรูปภาพ"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {photos.length === 0 && (
            <div className="rounded-2xl border border-dashed border-stone-200 py-12 text-center text-sm text-stone-400">
              ยังไม่มีรูปภาพ — เพิ่มด้านล่าง
            </div>
          )}

          {photos.length > 0 && (
            <p className="font-mono text-[11px] text-stone-400">
              Slideshow: {photos.filter((p) => p.inSlideshow).length} / {photos.length} รูป
            </p>
          )}

          {/* Add form */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-stone-900">เพิ่มรูปภาพ</p>
              <div className="flex rounded-lg border border-stone-200 bg-white p-0.5 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setGalleryMode("upload")}
                  className={`rounded-md px-3 py-1.5 transition-colors ${galleryMode === "upload" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"}`}
                >
                  อัพโหลดไฟล์
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryMode("url")}
                  className={`rounded-md px-3 py-1.5 transition-colors ${galleryMode === "url" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800"}`}
                >
                  Path / URL
                </button>
              </div>
            </div>

            {galleryMode === "upload" ? (
              <form onSubmit={addPhotoByUpload} className="flex flex-col gap-4">
                <input
                  ref={galleryFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleGalleryFileChange}
                />
                <button
                  type="button"
                  onClick={() => galleryFileRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors ${
                    galleryFile ? "border-stone-400 bg-stone-100" : "border-stone-300 hover:border-stone-400 hover:bg-stone-100"
                  }`}
                >
                  {galleryPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={galleryPreview} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                  <p className="text-sm text-stone-500">{galleryFile ? galleryFile.name : "คลิกเพื่อเลือกรูป"}</p>
                  {isDetectingLocation && (
                    <p className="font-mono text-[11px] text-stone-400">กำลังตรวจจับสถานที่จาก GPS...</p>
                  )}
                </button>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Alt Text</label>
                    <input
                      value={galleryAlt}
                      onChange={(e) => setGalleryAlt(e.target.value)}
                      placeholder="Description of photo"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-stone-600">
                      Caption
                      {isDetectingLocation && <span className="font-mono text-[10px] text-amber-500">ตรวจจับ GPS...</span>}
                    </label>
                    <input
                      value={galleryCaption}
                      onChange={(e) => setGalleryCaption(e.target.value)}
                      placeholder="Tokyo · Japan (auto-detect จาก EXIF)"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <button type="submit" disabled={isPending || !galleryFile} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60">
                    {isPending ? "กำลังอัพโหลด..." : "อัพโหลดและเพิ่มรูป"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={addPhotoByUrl} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-stone-600">Image Path <span className="text-red-400">*</span></label>
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
                  <button type="submit" disabled={isPending} className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-60">
                    เพิ่มรูปภาพ
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function SkillGroupCard({ group, onAddSkill, onRemoveSkill, onRemoveCategory }: {
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
        <button onClick={onRemoveCategory} className="rounded-md px-2.5 py-1 text-[11px] text-red-400 transition-colors hover:bg-red-50 hover:text-red-600">
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
        {group.items.length === 0 && <span className="text-xs text-stone-300">ยังไม่มี skill</span>}
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
