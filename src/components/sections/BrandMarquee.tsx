import Image from "next/image";
import type { CSSProperties } from "react";

import { Container } from "@/components/layout/Container";
import { brands } from "@/lib/data/brands";
import { cn } from "@/lib/utils";

type BrandMarqueeProps = {
  /** Durasi satu putaran penuh. Makin besar = makin pelan. */
  durationSeconds?: number;
  /** Judul section di atas marquee. */
  title?: string;
  /** Keterangan singkat opsional di bawah marquee. Dilewati bila tidak diisi. */
  description?: string;
  /**
   * id heading. Wajib diganti bila ada dua marquee di satu halaman,
   * supaya id di dalam HTML tetap unik.
   */
  headingId?: string;
  className?: string;
};

/**
 * Marquee logo brand - infinite auto-scroll horizontal.
 *
 * Cara kerja seamless loop:
 * - Track berisi DUA grup <ul> identik (grup kedua aria-hidden agar tidak dibaca dua kali).
 * - Animasi CSS keyframes menggeser track dari translateX(0) ke translateX(-50%).
 *   Karena kedua grup lebarnya persis sama, posisi akhir = posisi awal -> tanpa jeda/lompatan.
 * - Murni CSS transform (GPU-accelerated), tanpa JS di runtime -> nol beban di main thread.
 * - Pause on hover / focus-within diatur di globals.css (.marquee-viewport).
 * - prefers-reduced-motion: animasi dimatikan otomatis di globals.css.
 *
 * Menambah/mengurangi brand cukup lewat array di `src/lib/data/brands.ts`.
 */
export function BrandMarquee({
  durationSeconds = 45,
  title = "Brand yang kami sediakan",
  description,
  headingId = "brand-marquee-title",
  className,
}: BrandMarqueeProps) {
  const group = (hidden = false) => (
    <ul
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
      aria-hidden={hidden || undefined}
    >
      {brands.map((brand) => (
        <li key={`${hidden ? "dup-" : ""}${brand.id}`} className="shrink-0">
          <Image
            src={brand.logo}
            alt={hidden ? "" : `Logo ${brand.name}`}
            width={320}
            height={160}
            sizes="160px"
            // Marquee berada di paruh atas halaman: muat lebih awal tanpa memblokir LCP
            loading="lazy"
            className="h-14 w-auto opacity-90 saturate-90 transition duration-300 hover:opacity-100 hover:saturate-150 sm:h-16"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className={cn("border-b border-line bg-surface-muted py-10 lg:py-12", className)}
      aria-labelledby={headingId}
    >
      <Container width="wide">
        <h2
          id={headingId}
          className="flex items-center justify-center gap-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-900 sm:text-sm"
        >
          <span className="h-px w-8 bg-line sm:w-12" aria-hidden="true" />
          {title}
          <span className="h-px w-8 bg-line sm:w-12" aria-hidden="true" />
        </h2>
      </Container>

      <div className="marquee-viewport marquee-mask relative mt-8 overflow-hidden">
        <div
          className="marquee-track flex w-max animate-marquee items-center"
          style={{ "--marquee-duration": `${durationSeconds}s` } as CSSProperties}
        >
          {group()}
          {group(true)}
        </div>
      </div>

      {description ? (
        <Container width="wide">
          <p className="mt-8 text-center text-sm leading-relaxed text-ink-subtle">{description}</p>
        </Container>
      ) : null}
    </section>
  );
}