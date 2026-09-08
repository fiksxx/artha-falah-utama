"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  BoxIcon,
  CheckIcon,
  HandshakeIcon,
  ShieldIcon,
  SparkIcon,
  ToolsIcon,
} from "@/components/ui/icons";
import { companyStats } from "@/lib/data/about";
import type { CompanyStat } from "@/types";

const statIconMap: Record<CompanyStat["icon"], typeof ShieldIcon> = {
  handshake: HandshakeIcon,
  box: BoxIcon,
  tools: ToolsIcon,
  check: CheckIcon,
  shield: ShieldIcon,
  spark: SparkIcon,
};

/** Durasi satu animasi counter. Cukup singkat agar tidak terasa lambat. */
const DURATION_MS = 1400;

/** easeOutExpo - melaju cepat lalu mengendap halus tepat di angka akhir. */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Trust & Company Statistics.
 *
 * Angka diambil dari `companyStats` di `src/lib/data/about.ts`. Dua di antaranya
 * (Produk Tersedia & Brand Mitra) terhubung otomatis ke data katalog, jadi
 * menambah produk atau brand langsung memperbarui angka di halaman ini.
 *
 * Animasi counter berjalan SEKALI saat section masuk viewport (IntersectionObserver),
 * lalu observer dilepas supaya tidak membebani scroll.
 */
export function CompanyStats() {
  const prefersReducedMotion = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const hasRunRef = useRef(false);

  /**
   * progress 1 = angka final.
   *
   * Nilai awal sengaja 1 supaya HTML hasil server (dan browser tanpa JS)
   * langsung menampilkan angka sebenarnya - aman untuk SEO, aksesibilitas, dan
   * bebas hydration mismatch. Reset ke 0 hanya terjadi di client.
   */
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    // Hormati preferensi sistem: tampilkan angka final tanpa animasi.
    if (prefersReducedMotion) return;

    const node = listRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (hasRunRef.current) return;

    setProgress(0);

    const observer = new IntersectionObserver(
      (entries) => {
        if (hasRunRef.current || !entries.some((entry) => entry.isIntersecting)) return;

        hasRunRef.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = Math.min((now - start) / DURATION_MS, 1);
          setProgress(elapsed);
          if (elapsed < 1) frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);
      },
      // Menyala saat sekitar sepertiga section terlihat - terasa pas, tidak dini
      { threshold: 0.3 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
  }, [prefersReducedMotion]);

  const eased = easeOutExpo(progress);

  return (
    <ul ref={listRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {companyStats.map((stat) => {
        const Icon = statIconMap[stat.icon];
        const current = Math.round(stat.value * eased);

        return (
          <li
            key={stat.id}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 ease-smooth hover:border-accent-400/40"
          >
            {/* Garis aksen halus di sisi atas kartu saat hover */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-400 to-accent-400 transition-transform duration-300 ease-smooth group-hover:scale-x-100 motion-reduce:transition-none"
            />

            <span
              aria-hidden="true"
              className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/5 text-accent-400"
            >
              <Icon />
            </span>

            <p className="mt-6 text-4xl font-bold tracking-tight text-white lg:text-5xl">
              {/* Angka beranimasi disembunyikan dari screen reader; nilai final di sr-only */}
              <span aria-hidden="true">
                {stat.prefix}
                {current.toLocaleString("id-ID")}
                {stat.suffix}
              </span>
              <span className="sr-only">
                {stat.prefix}
                {stat.value.toLocaleString("id-ID")}
                {stat.suffix}
              </span>
            </p>

            <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-brand-200">
              {stat.label}
            </h3>

            {stat.description ? (
              <p className="mt-2 text-sm leading-relaxed text-white/60">{stat.description}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
