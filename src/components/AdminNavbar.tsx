"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/app/login/actions";

const adminLinks = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/about", label: "About Me" },
  { href: "/admin/blocks", label: "Blocks" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-stone-700/60 bg-stone-900"
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">

        {/* Brand + nav links */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="rounded bg-amber-500 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-900">
              Admin
            </span>
            <span className="text-[13px] font-semibold text-stone-200">Promptfolio</span>
          </Link>
          <div className="hidden h-4 w-px bg-stone-700 md:block" />
          <div className="hidden items-center gap-0.5 md:flex">
            {adminLinks.map((link) => {
              const isActive = link.exact
                ? pathname === link.href
                : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                    isActive
                      ? "bg-stone-800 text-white"
                      : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: view site + logout */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[12px] text-stone-500 transition-colors hover:text-stone-300"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            ดูเว็บไซต์
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-stone-700 px-3 py-1.5 text-[13px] text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-200"
            >
              ออกจากระบบ
            </button>
          </form>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-8 w-8 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-800 md:hidden"
        >
          <motion.div animate={menuOpen ? "open" : "closed"} className="flex flex-col items-center justify-center gap-[5px]">
            <motion.span variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 7 } }} transition={{ duration: 0.22 }} className="block h-px w-4 origin-center bg-stone-400" />
            <motion.span variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} transition={{ duration: 0.15 }} className="block h-px w-4 bg-stone-400" />
            <motion.span variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -7 } }} transition={{ duration: 0.22 }} className="block h-px w-4 origin-center bg-stone-400" />
          </motion.div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-stone-700/60 bg-stone-900 md:hidden"
          >
            <div className="flex flex-col gap-0.5 px-6 py-4">
              {adminLinks.map((link, i) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.18 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-stone-800 font-medium text-white"
                          : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="mt-3 flex items-center justify-between border-t border-stone-700/60 pt-3">
                <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm text-stone-500 transition-colors hover:text-stone-300">
                  ← ดูเว็บไซต์
                </Link>
                <form action={logout}>
                  <button type="submit" className="text-sm text-stone-400 transition-colors hover:text-stone-200">
                    ออกจากระบบ
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
