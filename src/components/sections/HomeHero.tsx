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
    <section className="relative isolate flex items-center overflow-hidden bg-brand-950 text-white">
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

      <Container width="wide" className="relative py-12 lg:py-[4.5rem]">
        {/* Tahap R2: area teks dilebarkan agar judul memakai ruang horizontal (2 baris di desktop). */}
        <div className="max-w-5xl">
          <p className="flex animate-fade-up items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent-300">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400"
            />
            {siteConfig.shortName}
          </p>

          {/* Judul memakai skala `display-lg` yang sama dengan header halaman lain,
              bukan ukuran lepas - supaya tipografi seluruh situs tetap satu sistem. */}
          <h1 className="mt-5 max-w-[50rem] animate-fade-up text-[clamp(1.75rem,1.15rem+1.95vw,2.75rem)] leading-[1.12] tracking-[-0.022em] text-white [animation-delay:90ms]">
            Solusi Terintegrasi Kebutuhan <span className="text-brand-300">Alat, Reagen, dan Bahan Laboratorium Presisi</span>
          </h1>

          <span
            aria-hidden="true"
            className="mt-6 block h-[3px] w-12 animate-fade-up rounded-full bg-accent-400 [animation-delay:150ms]"
          />

          <p className="mt-6 max-w-[42rem] animate-fade-up text-base leading-[1.65] text-white/85 [animation-delay:200ms] lg:text-[1.0625rem]">
            Melalui Artha Labs, kami menyediakan reagen, instrumen laboratorium, dan alat kesehatan
            dari brand mitra, beserta dokumen pendukung, bantuan instalasi, dan layanan purna jual.
          </p>

          <div className="mt-8 flex animate-fade-up flex-wrap gap-3 [animation-delay:280ms]">
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
