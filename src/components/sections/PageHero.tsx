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
  /**
   * Foto latar. Bawaan: foto gedung perusahaan (COMPANY_PHOTO). Halaman yang
   * punya foto sendiri (mis. Artha Labs) boleh menggantinya; scrim tetap sama.
   */
  backgroundSrc?: string;
  /**
   * Lebar area teks bila tidak ada `aside`. "wide" mengikuti hero beranda:
   * judul lebih besar dan boleh memanjang (Tahap R3B).
   */
  textWidth?: "default" | "wide";
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
export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  backgroundSrc = COMPANY_PHOTO,
  textWidth = "default",
  className,
}: PageHeroProps) {
  const wide = textWidth === "wide" && !aside;

  return (
    <section
      className={cn(
        "relative isolate flex items-center overflow-hidden bg-brand-950 text-white",
        className,
      )}
    >
      {/* Foto perusahaan sebagai latar - alt kosong karena murni dekoratif */}
      <Image
        src={backgroundSrc}
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

      <Container width="wide" className="relative py-12 lg:py-[4.5rem]">
        <div
          className={cn(
            "grid items-center gap-10",
            aside ? "lg:grid-cols-12 lg:gap-14" : wide ? "max-w-5xl" : "max-w-3xl",
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

            <h1
              className={cn(
                "mt-5 animate-fade-up text-white [animation-delay:90ms]",
                wide
                  ? "max-w-[50rem] text-[clamp(1.75rem,1.15rem+1.95vw,2.75rem)] leading-[1.12] tracking-[-0.022em]"
                  : "text-[clamp(1.75rem,1.3rem+1.1vw,2.25rem)] leading-[1.15] tracking-[-0.02em]",
              )}
            >
              {title}
            </h1>

            <span
              aria-hidden="true"
              className="mt-6 block h-[3px] w-12 animate-fade-up rounded-full bg-accent-400 [animation-delay:150ms]"
            />

            <p
              className={cn(
                "mt-6 max-w-[42rem] animate-fade-up text-base leading-[1.65] [animation-delay:200ms] lg:text-[1.0625rem]",
                wide ? "text-white/85" : "text-white/80",
              )}
            >
              {description}
            </p>

            {actions ? (
              <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:280ms]">
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
