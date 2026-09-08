import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { COMPANY_PHOTO } from "@/lib/images";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

/**
 * Hero standar tiap halaman: satu-satunya <h1> per halaman (hierarki heading konsisten).
 *
 * Latar memakai foto gedung perusahaan (satu sumber: lib/images.ts) dengan
 * scrim gelap dua lapis di atasnya. Scrim itulah yang menjaga teks putih tetap
 * kontras meski foto aslinya nanti lebih terang - jadi mengganti foto tidak
 * pernah membuat judul halaman sulit dibaca.
 *
 * Struktur, ukuran, dan posisi teks TIDAK berubah dari versi sebelumnya:
 * yang berganti hanya latarnya.
 */
export function PageHero({ eyebrow, title, description, actions, aside, className }: PageHeroProps) {
  return (
    <section
      className={cn("relative isolate overflow-hidden bg-brand-900 text-white", className)}
    >
      {/* Foto perusahaan sebagai latar - alt kosong karena murni dekoratif */}
      <Image
        src={COMPANY_PHOTO}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      {/* Scrim gelap: menjaga kontras teks tanpa menghilangkan detail foto */}
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
      {/* Garis gold tipis sebagai transisi elegan ke section berikutnya */}
      <div aria-hidden="true" className="divider-gold absolute inset-x-0 bottom-0 h-px" />
      <Container width="wide" className="relative py-16 lg:py-24">
        <div
          className={cn(
            "grid items-center gap-10",
            aside ? "lg:grid-cols-12 lg:gap-14" : "max-w-3xl",
          )}
        >
          <div className={cn(aside && "lg:col-span-7")}>
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-200">
              {eyebrow}
            </p>
            <h1 className="mt-5 text-display-lg text-white">{title}</h1>
            <p className="mt-5 max-w-content text-base leading-relaxed text-white/75 lg:text-lg">
              {description}
            </p>
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {aside ? <div className="lg:col-span-5">{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
