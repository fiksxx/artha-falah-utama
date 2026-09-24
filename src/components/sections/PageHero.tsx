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
 * Bahasa visualnya SAMA dengan hero About (HomeHero) - inilah acuan kualitasnya:
 *   eyebrow bertitik emas -> judul `text-4xl` -> garis emas -> deskripsi -> aksi.
 * Ukuran judul sengaja tidak memakai skala `display-lg`: pada halaman dalam,
 * judul yang terlalu besar mengalahkan konten di bawahnya.
 *
 * Latar memakai foto gedung perusahaan (satu sumber: lib/images.ts) dengan
 * scrim gelap dua lapis di atasnya. Scrim itulah yang menjaga teks putih tetap
 * kontras meski foto aslinya nanti lebih terang - jadi mengganti foto tidak
 * pernah membuat judul halaman sulit dibaca.
 *
 * Karakter tiap halaman datang dari slot, bukan dari gaya yang berbeda:
 * - `actions` : tombol aksi utama halaman (Artha Labs, Activity, Contact)
 * - `aside`   : elemen pendamping di kanan (foto di Artha Labs, topik di Activity)
 *
 * Animasi masuk memakai keyframe `fade-up` dengan delay bertingkat, dan mati
 * otomatis pada prefers-reduced-motion (diatur di globals.css).
 */
export function PageHero({ eyebrow, title, description, actions, aside, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex items-center overflow-hidden bg-brand-950 text-white lg:min-h-[44vh]",
        className,
      )}
    >
      {/* Foto perusahaan sebagai latar - alt kosong karena murni dekoratif */}
      <Image
        src={COMPANY_PHOTO}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-zoom -z-20 object-cover object-center"
      />
      {/* Scrim gelap: menjaga kontras teks tanpa menghilangkan detail foto */}
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />
      {/* Garis gold tipis sebagai transisi elegan ke section berikutnya */}
      <div aria-hidden="true" className="divider-gold absolute inset-x-0 bottom-0 z-10 h-px" />

      <Container width="wide" className="relative py-14 lg:py-16">
        <div
          className={cn(
            "grid items-center gap-10",
            aside ? "lg:grid-cols-12 lg:gap-14" : "max-w-3xl",
          )}
        >
          <div className={cn(aside && "lg:col-span-7")}>
            <p className="flex animate-fade-up items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400"
              />
              {eyebrow}
            </p>

            <h1 className="mt-6 animate-fade-up text-4xl text-white [animation-delay:90ms]">
              {title}
            </h1>

            <span
              aria-hidden="true"
              className="mt-7 block h-1 w-16 animate-fade-up rounded-full bg-accent-400 [animation-delay:150ms]"
            />

            <p className="mt-7 max-w-content animate-fade-up text-base leading-relaxed text-white/80 [animation-delay:200ms] lg:text-lg">
              {description}
            </p>

            {actions ? (
              <div className="mt-10 flex animate-fade-up flex-wrap gap-3 [animation-delay:280ms]">
                {actions}
              </div>
            ) : null}
          </div>

          {aside ? (
            <div className="animate-fade-up lg:col-span-5 [animation-delay:200ms]">{aside}</div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
