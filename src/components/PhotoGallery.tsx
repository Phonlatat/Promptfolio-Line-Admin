"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type GalleryPhoto = { id: string; src: string; alt: string; caption: string };

export default function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-stone-400">
        ยังไม่มีรูปใน Gallery — เพิ่มที่ Admin → About → Gallery
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:auto-rows-[300px]">
      {photos.map((photo, i) => {
        const isWide = i === 3;
        return (
          <motion.div
            key={photo.id}
            className={`group relative overflow-hidden rounded-xl ${isWide ? "md:col-span-2" : ""} aspect-[3/4] md:aspect-auto`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-stone-900/0 transition-colors duration-500 group-hover:bg-stone-900/20" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 p-3">
              <span className="inline-block rounded-lg bg-white/90 px-3 py-1.5 font-mono text-xs text-stone-600 backdrop-blur-sm shadow-sm">
                {photo.caption}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
