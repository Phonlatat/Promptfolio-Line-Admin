"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blocks", label: "Blocks" },
  { href: "/about", label: "About Me" },
];

export default function Navbar({ username }: { username?: string | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  // Match current section — exact for "/", prefix for everything else
  const activeLink = navLinks
    .filter((l) =>
      l.href === "/" ? pathname === "/" : pathname.startsWith(l.href)
    )
    .at(-1);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf9f7]/95 backdrop-blur-sm"
    >
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">

        {/* ── Logo + breadcrumb ── */}
        <Link href="/" className="group flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold tracking-tight text-stone-900">
            Promptfolio
          </span>

          <AnimatePresence mode="wait">
            {activeLink && activeLink.href !== "/" && (
              <motion.span
                key={activeLink.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="font-mono text-[11px] text-stone-400 select-none"
              >
                /{activeLink.label}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-px text-[13px] transition-colors duration-200 ${
                  isActive
                    ? "text-stone-900"
                    : "text-stone-400 hover:text-stone-700"
                }`}
              >
                {link.label}

                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-[1px] left-0 right-0 h-px bg-stone-800"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Auth button ── */}
        <div className="hidden md:flex">
          {username ? (
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-md border border-stone-300 px-3.5 py-1.5 text-[13px] font-medium text-stone-700 transition-all duration-200 hover:border-stone-400 hover:bg-stone-100/70"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 font-mono text-[10px] font-semibold text-white">
                {username[0].toUpperCase()}
              </span>
              {username}
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3.5 py-1.5 text-[13px] font-medium text-stone-700 transition-all duration-200 hover:border-stone-400 hover:bg-stone-100/70"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Login
            </Link>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="flex h-8 w-8 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 md:hidden"
        >
          <motion.div
            animate={menuOpen ? "open" : "closed"}
            className="flex flex-col items-center justify-center gap-[5px]"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 7 },
              }}
              transition={{ duration: 0.22 }}
              className="block h-px w-4 bg-stone-600 origin-center"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              transition={{ duration: 0.15 }}
              className="block h-px w-4 bg-stone-600"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -7 },
              }}
              transition={{ duration: 0.22 }}
              className="block h-px w-4 bg-stone-600 origin-center"
            />
          </motion.div>
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-stone-100 bg-[#faf9f7] md:hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-0.5">
              {navLinks.map((link, i) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-stone-100 text-stone-900 font-medium"
                          : "text-stone-500 hover:text-stone-900"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="h-1 w-1 rounded-full bg-stone-500" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18 }}
                className="mt-3 border-t border-stone-100 pt-3"
              >
                {username ? (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-medium text-stone-700"
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 font-mono text-[10px] font-semibold text-white">
                        {username[0].toUpperCase()}
                      </span>
                      {username}
                    </span>
                    <span className="text-stone-400">→</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-medium text-stone-700"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Login
                    </span>
                    <span className="text-stone-400">→</span>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
