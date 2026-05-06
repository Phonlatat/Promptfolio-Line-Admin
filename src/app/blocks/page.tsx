import FadeUp from "@/components/FadeUp";
import { db } from "@/lib/db";

export default async function BlocksPage() {
  const blocks = await db.block.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="overflow-x-hidden">
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12">
        <FadeUp>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-stone-400">
            Blocks
          </p>
        </FadeUp>
        <FadeUp delay={0.07}>
          <h1 className="text-[40px] font-bold leading-tight tracking-tight text-stone-900 md:text-[52px]">
            Thoughts &amp; Notes
          </h1>
        </FadeUp>
        <FadeUp delay={0.13}>
          <p className="mt-4 max-w-md text-base leading-relaxed text-stone-400">
            สิ่งที่อยากแชร์ — ความคิด สิ่งที่เรียนรู้ และบันทึกระหว่างทาง
          </p>
        </FadeUp>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        {blocks.length === 0 ? (
          <p className="py-24 text-center text-sm text-stone-400">
            ยังไม่มี blocks — กลับมาเร็วๆ นี้
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blocks.map((block, i) => (
              <FadeUp key={block.id} delay={i * 0.08}>
                <div className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition-shadow duration-200 hover:shadow-md hover:shadow-stone-900/5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stone-400">
                      {block.tag}
                    </span>
                    <span className="font-mono text-[10px] text-stone-300">
                      {block.date}
                    </span>
                  </div>
                  <h2 className="mb-2 text-sm font-semibold text-stone-900">
                    {block.title}
                  </h2>
                  <p className="flex-1 text-sm leading-relaxed text-stone-400">
                    {block.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
