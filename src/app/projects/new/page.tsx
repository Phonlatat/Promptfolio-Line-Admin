import FadeUp from "@/components/FadeUp";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      {/* Header */}
      <FadeUp>
        <div className="mb-12">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-stone-400">
            New Project
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            เพิ่มโปรเจคใหม่
          </h1>
          <p className="mt-2 text-stone-500">
            บันทึกไอเดียก่อนที่มันจะหายไป
          </p>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <form className="flex flex-col gap-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              ชื่อโปรเจค <span className="text-stone-400">*</span>
            </label>
            <input
              type="text"
              placeholder="เช่น My Awesome App"
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              คำอธิบาย <span className="text-stone-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="อธิบายสั้นๆ ว่าโปรเจคนี้ทำอะไร..."
              className="w-full resize-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              สถานะ
            </label>
            <select className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200">
              <option value="planning">วางแผน</option>
              <option value="in-progress">กำลังพัฒนา</option>
              <option value="completed">เสร็จแล้ว</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Tech Stack
            </label>
            <input
              type="text"
              placeholder="Next.js, TypeScript, AI (คั่นด้วยจุลภาค)"
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 font-mono text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          {/* Start date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
            />
          </div>

          {/* Links */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Live URL</label>
              <input
                type="url"
                placeholder="https://..."
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-all focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-stone-100" />

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 transition-all duration-200 hover:bg-stone-800 hover:shadow-md hover:shadow-stone-900/10"
            >
              บันทึกโปรเจค
            </button>
            <a
              href="/projects"
              className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:border-stone-300 hover:bg-stone-50"
            >
              ยกเลิก
            </a>
          </div>
        </form>
      </FadeUp>
    </div>
  );
}
