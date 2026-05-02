import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#faf9f7]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="text-sm font-semibold text-stone-900">Promptfolio</span>
            <p className="font-mono text-xs text-stone-400">
              Portfolio & Project Tracker
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-stone-400">
            <Link href="/" className="hover:text-stone-700 transition-colors duration-200">Home</Link>
            <Link href="/projects" className="hover:text-stone-700 transition-colors duration-200">Projects</Link>
            <Link href="/about" className="hover:text-stone-700 transition-colors duration-200">About</Link>
          </div>

          <p className="font-mono text-xs text-stone-300">
            © {new Date().getFullYear()} H2o
          </p>
        </div>
      </div>
    </footer>
  );
}
