"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  projectStats: {
    total: number;
    inProgress: number;
    planning: number;
    completed: number;
  };
  blockCount: number;
}

export default function AdminOverviewClient({ projectStats, blockCount }: Props) {
  const sections = [
    {
      href: "/admin/projects",
      label: "Projects",
      desc: "เพิ่ม ลบ แก้ไขโปรเจค และเปลี่ยนสถานะแต่ละโปรเจคได้",
      stat: `${projectStats.total} projects`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
    },
    {
      href: "/admin/about",
      label: "About Me",
      desc: "แก้ไข bio, เพิ่ม/ลบ skills, จัดการประสบการณ์ และอัพโหลดรูปภาพ",
      stat: "Skills & Photos",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
    },
    {
      href: "/admin/blocks",
      label: "Blocks",
      desc: "เพิ่ม ลบ แก้ไข notes, thoughts และบทความสั้นๆ",
      stat: `${blockCount} blocks`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10"
      >
        <span className="rounded-md bg-amber-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-amber-700">
          Admin
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900">
          Overview
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          จัดการเนื้อหาทั้งหมดของเว็บไซต์จากที่นี่
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[
          { label: "Total Projects", value: projectStats.total },
          { label: "กำลังพัฒนา", value: projectStats.inProgress },
          { label: "วางแผน", value: projectStats.planning },
          { label: "เสร็จแล้ว", value: projectStats.completed },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.32 }}
            className="rounded-xl border border-stone-200 bg-white p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-stone-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Section cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map((section, i) => (
          <motion.div
            key={section.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 + i * 0.08, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={section.href}
              className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-200 hover:border-stone-300 hover:shadow-md hover:shadow-stone-900/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600 transition-colors group-hover:bg-stone-900 group-hover:text-white">
                {section.icon}
              </div>
              <p className="mb-1.5 text-sm font-semibold text-stone-900">{section.label}</p>
              <p className="mb-4 flex-1 text-[13px] leading-relaxed text-stone-500">{section.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-stone-400">{section.stat}</span>
                <span className="text-[12px] font-medium text-stone-400 transition-colors group-hover:text-stone-900">
                  จัดการ →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
