"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Jarak geser minimum (px) agar sentuhan dihitung sebagai swipe. */
const SWIPE_PX = 40;

/** Kelas statis (Tailwind harus melihat nama kelas utuh) untuk jumlah kartu terlihat di layar >= 768px. */
const VISIBLE_CLASS = {
  1: "[--per:1] md:[--per:1]",
  3: "[--per:1] md:[--per:3]",
} as const;

type LoopCarouselProps = {
  /** Isi tiap slide, sudah dirender di server. Urutan array = urutan tampil. */
  slides: ReactNode[];
  /** Label untuk pembaca layar. */
  label: string;
  /** Jumlah kartu yang terlihat sekaligus di layar >= 768px. Di ponsel selalu 1. */
  visibleWide: 1 | 3;
  /** Jeda antar pergeseran (dari awal satu geseran ke awal geseran berikutnya). */
  intervalMs: number;
  /** Durasi gerak satu geseran. Harus jauh lebih pendek dari `intervalMs`. */
  transitionMs?: number;
  /**
   * Pola gerak:
   * - "loop"   : selalu bergeser ke kiri; setelah kartu terakhir kembali ke kartu pertama.
   * - "bounce" : bergeser ke kiri sampai kartu terakhir terlihat, lalu bergeser ke kanan
   *              sampai kartu pertama terlihat, dan seterusnya.
   */
  mode: "loop" | "bounce";
  className?: string;
};

type Position = { index: number; dir: 1 | -1 };

/**
 * Carousel horizontal otomatis yang bergeser SATU KARTU setiap `intervalMs`.
 *
 * Dipakai terpisah oleh Testimoni dan Activity. Setiap pemakaian adalah instance
 * tersendiri: index, arah, timer, dan data (`slides`) tidak dibagi antar section, jadi
 * isi satu section tidak mungkin muncul di section lain.
 *
 * TANPA LOMPATAN TATA LETAK: semua kartu berada dalam satu baris flex yang sama, jadi
 * tingginya seragam (mengikuti kartu tertinggi) dan tidak berubah saat bergeser. Lebar
 * kartu dihitung CSS murni dari `--per`, sehingga jumlah kartu terlihat sudah benar
 * sejak render pertama (tanpa menunggu JavaScript). Satu langkah geser =
 * (lebar jendela + celah) / jumlah terlihat = tepat satu kartu.
 *
 * LOOP: track berisi semua kartu + salinan beberapa kartu pertama di ujung. Setelah
 * tiba di posisi salinan, posisi dikembalikan ke awal tanpa animasi - tampilannya
 * identik, sehingga tidak ada kartu yang melompat. BOUNCE tidak memerlukan salinan.
 *
 * KENYAMANAN: tidak ada tombol; berhenti sementara saat kursor di atasnya atau fokus
 * di dalamnya dan saat tab tidak terlihat, dan swipe di layar sentuh tetap berfungsi.
 * Bagi pengguna "reduce motion" carousel tidak berputar sendiri, melainkan menjadi
 * deretan yang bisa digulir manual (semua kartu tetap terjangkau). Kartu di luar
 * jendela ditandai `inert` sehingga tidak bisa difokus lewat keyboard.
 */
export function LoopCarousel({
  slides,
  label,
  visibleWide,
  intervalMs,
  transitionMs = 800,
  mode,
  className,
}: LoopCarouselProps) {
  const count = slides.length;
  const prefersReducedMotion = useReducedMotion();

  const [wide, setWide] = useState(true);
  const visible = wide ? visibleWide : 1;

  // Indeks terbesar yang boleh dicapai. Loop: `count` (posisi salinan). Bounce: kartu terakhir tepat di tepi kanan.
  const canMove = count > visible;
  const lastIndex = !canMove ? 0 : mode === "loop" ? count : count - visible;

  const [pos, setPos] = useState<Position>({ index: 0, dir: 1 });
  const [animate, setAnimate] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const index = Math.min(pos.index, lastIndex);

  // Tentukan mode ponsel/lebar. Lebar kartu diatur CSS; ini hanya untuk logika geser.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Jumlah kartu terlihat berubah (mis. layar diputar): mulai lagi dari awal.
  useEffect(() => {
    setAnimate(false);
    setPos({ index: 0, dir: 1 });
    const restore = window.setTimeout(() => setAnimate(true), 80);
    return () => window.clearTimeout(restore);
  }, [visible]);

  /** Satu langkah maju sesuai pola gerak. */
  const advance = useCallback(
    (current: Position): Position => {
      if (!canMove) return current;
      if (mode === "loop") {
        return current.index >= count ? current : { index: current.index + 1, dir: 1 };
      }
      if (current.dir === 1) {
        return current.index >= lastIndex
          ? { index: lastIndex - 1, dir: -1 }
          : { index: current.index + 1, dir: 1 };
      }
      return current.index <= 0 ? { index: 1, dir: 1 } : { index: current.index - 1, dir: -1 };
    },
    [canMove, count, lastIndex, mode],
  );

  const autoplay = !prefersReducedMotion && !interacting && canMove;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setPos(advance);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [autoplay, advance, intervalMs]);

  // Loop: setelah tiba di posisi salinan, kembalikan ke awal secara diam-diam.
  useEffect(() => {
    if (mode !== "loop" || !canMove || pos.index !== count) return;
    const jump = window.setTimeout(() => {
      setAnimate(false);
      setPos({ index: 0, dir: 1 });
      // Dijadwalkan di dalam callback (bukan di effect): perubahan `pos` menjalankan
      // cleanup effect yang akan membatalkannya dan mematikan animasi selamanya.
      window.setTimeout(() => setAnimate(true), 80);
    }, transitionMs + 40);
    return () => window.clearTimeout(jump);
  }, [mode, canMove, pos.index, count, transitionMs]);

  const goNext = useCallback(() => {
    setAnimate(true);
    setPos(advance);
  }, [advance]);

  const goPrev = useCallback(() => {
    if (!canMove) return;
    if (mode === "loop" && index === 0) {
      // Dari awal mundur ke akhir: lompat diam-diam ke salinan, lalu geser satu langkah.
      setAnimate(false);
      setPos({ index: count, dir: 1 });
      window.setTimeout(() => {
        setAnimate(true);
        setPos({ index: count - 1, dir: 1 });
      }, 40);
      return;
    }
    setAnimate(true);
    setPos((current) => ({ ...current, index: Math.max(0, Math.min(current.index, lastIndex) - 1) }));
  }, [canMove, mode, index, count, lastIndex]);

  if (count === 0) return null;

  const slideStyle = { flex: "0 0 calc((100% - (var(--per) - 1) * var(--gap)) / var(--per))" };

  // Reduce motion: tanpa gerak otomatis. Kartu disusun sebagai deretan yang dapat digulir manual.
  if (prefersReducedMotion) {
    return (
      <div className={className} role="region" aria-roledescription="carousel" aria-label={label}>
        <ul
          tabIndex={0}
          aria-label={label}
          className={cn(
            "-my-3 flex snap-x snap-mandatory overflow-x-auto py-3 [--gap:1.25rem]",
            VISIBLE_CLASS[visibleWide],
          )}
          style={{ gap: "var(--gap)" }}
        >
          {slides.map((slide, position) => (
            <li key={position} className="min-w-0 snap-start" style={slideStyle}>
              {slide}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const track = mode === "loop" && canMove ? [...slides, ...slides.slice(0, visibleWide)] : slides;

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        const end = event.changedTouches[0]?.clientX;
        if (start === null || end === undefined) return;
        const delta = end - start;
        if (Math.abs(delta) < SWIPE_PX) return;
        if (delta < 0) goNext();
        else goPrev();
      }}
    >
      {/* Jendela: overflow horizontal dipotong, vertikal dibiarkan agar bayangan dan efek angkat kartu tidak terpotong. */}
      <div className="-my-3 overflow-x-clip py-3">
        <ul
          aria-live={interacting ? "polite" : "off"}
          className={cn("flex [--gap:1.25rem]", VISIBLE_CLASS[visibleWide])}
          style={{
            gap: "var(--gap)",
            // Satu langkah = (lebar jendela + satu celah) / jumlah terlihat = tepat satu kartu.
            // Persen di translateX mengacu ke lebar <ul>, yang sama dengan lebar jendela.
            transform: `translateX(calc(${-index} * (100% + var(--gap)) / var(--per)))`,
            transition: animate ? `transform ${transitionMs}ms cubic-bezier(0.45, 0, 0.2, 1)` : "none",
          }}
        >
          {track.map((slide, position) => {
            const inView = position >= index && position < index + visible;
            return (
              <li
                key={position}
                className="min-w-0"
                style={slideStyle}
                aria-roledescription="slide"
                aria-label={`${(position % count) + 1} dari ${count}`}
                aria-hidden={inView ? undefined : true}
                inert={inView ? undefined : true}
              >
                {slide}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
