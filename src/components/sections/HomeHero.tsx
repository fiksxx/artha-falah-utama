import Image from "next/image";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { COMPANY_PHOTO } from "@/lib/images";
import { siteConfig } from "@/lib/site";

/**
 * Hero halaman About - full-bleed, foto tampak depan gedung perusahaan.
 *
 * Susunan lapisan (bawah ke atas):
 *  1. next/image `fill` + object-cover -> foto memenuhi SELURUH area hero
 *  2. .hero-scrim                      -> dua lapis gradient gelap (globals.css)
 *  3. Konten teks                      -> putih dengan aksen hijau Artha Labs
 *
 * Catatan teknis:
 * - `priority` dipakai karena foto ini adalah elemen LCP halaman depan.
 * - Animasi masuk memakai keyframe `fade-up` bawaan Tailwind dengan delay
 *   bertingkat. `.hero-zoom` memberi zoom-out 24 detik sekali jalan supaya
 *   terasa hidup tanpa mengganggu. Keduanya mati otomatis pada
 *   prefers-reduced-motion (diatur di globals.css).
 * - MENGGANTI FOTO: timpa file `public/images/about/building.png` dengan foto
 *   asli (rasio 16:9, minimal 2000px lebar). Tidak ada kode yang perlu diubah.
 */
export function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[60vh] items-center overflow-hidden bg-brand-950 text-white lg:min-h-[68vh]">
      {/* Lapis 1 - foto gedung. alt kosong: dekoratif, pesannya sudah ada di teks. */}
      <Image
        src={COMPANY_PHOTO}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-zoom -z-20 object-cover object-center"
      />

      {/* Lapis 2 - dark overlay bertingkat, menjaga kontras teks di semua ukuran */}
      <div aria-hidden="true" className="hero-scrim absolute inset-0 -z-10" />

      {/* Garis emas tipis sebagai transisi elegan ke section berikutnya */}
      <div aria-hidden="true" className="divider-gold absolute inset-x-0 bottom-0 z-10 h-px" />

      <Container width="wide" className="relative py-14 lg:py-16">
        <div className="max-w-3xl">
          <p className="flex animate-fade-up items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400"
            />
            {siteConfig.shortName}
          </p>

          {/* Judul memakai skala `display-lg` yang sama dengan header halaman lain,
              bukan ukuran lepas - supaya tipografi seluruh situs tetap satu sistem. */}
          <h1 className="mt-6 animate-fade-up text-4xl text-white [animation-delay:90ms]">
            Solusi Terintegrasi Kebutuhan <span className="text-brand-300">Alat, Reagen, dan Bahan Laboratorium Presisi</span>
          </h1>

          <span
            aria-hidden="true"
            className="mt-7 block h-1 w-16 animate-fade-up rounded-full bg-accent-400 [animation-delay:150ms]"
          />

          <p className="mt-7 max-w-content animate-fade-up text-base leading-relaxed text-white/80 [animation-delay:200ms] lg:text-lg">
            Melalui Artha Labs, kami menyediakan reagen, instrumen laboratorium, dan alat kesehatan
            dari brand mitra, beserta dokumen pendukung, bantuan instalasi, dan layanan purna jual.
          </p>

          <div className="mt-10 flex animate-fade-up flex-wrap gap-3 [animation-delay:280ms]">
            <Button href="/artha-labs" variant="accent" size="lg">
              Lihat Katalog Produk
            </Button>
            <Button href="/contact" variant="inverted" size="lg">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
