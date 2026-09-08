import Link from "next/link";

import { ArrowRightIcon, BoxIcon, MailIcon, SparkIcon, ToolsIcon } from "@/components/ui/icons";
import { quickNavCards } from "@/lib/data/about";
import type { QuickNavCard } from "@/types";

const navIconMap: Record<QuickNavCard["icon"], typeof ToolsIcon> = {
  tools: ToolsIcon,
  box: BoxIcon,
  spark: SparkIcon,
  mail: MailIcon,
};

/**
 * Navigation cards menuju halaman utama (Artha Labs, Aktivitas, Hubungi Kami).
 *
 * Server Component murni - seluruh interaksi hover memakai CSS transition,
 * jadi tidak ada JavaScript tambahan yang dikirim ke browser.
 *
 * Interaksi hover dibuat berlapis tapi tetap tenang: latar berubah menjadi
 * dark green, kartu terangkat sedikit, dan panah bergeser. Semua memakai satu
 * durasi (300ms) dan satu easing agar terasa sebagai satu gerakan, bukan
 * beberapa animasi yang berlomba.
 *
 * Efek yang sama juga berlaku pada focus keyboard (focus-within), sehingga
 * pengguna tanpa mouse mendapat umpan balik yang identik.
 */
export function QuickNavCards() {
  return (
    <nav aria-label="Navigasi cepat">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quickNavCards.map((card) => {
          const Icon = navIconMap[card.icon];
          return (
            <li key={card.id} className="h-full">
              {/* TODO: ganti dengan konten asli */}
              <Link
                href={card.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-800 hover:shadow-card-hover focus-visible:-translate-y-1 focus-visible:border-brand-800 motion-reduce:transform-none"
              >
                {/* Latar dark green yang muncul halus saat hover */}
                <span
                  aria-hidden="true"
                  className="surface-brand-deep absolute inset-0 opacity-0 transition-opacity duration-300 ease-smooth group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                />
                {/* Garis emas tipis di sisi atas */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-accent-400 transition-transform duration-300 ease-smooth group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />

                <span
                  aria-hidden="true"
                  className="relative grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-all duration-300 ease-smooth group-hover:scale-105 group-hover:bg-accent-400 group-hover:text-brand-950 group-focus-visible:bg-accent-400 group-focus-visible:text-brand-950 motion-reduce:transform-none"
                >
                  <Icon />
                </span>

                <h3 className="relative mt-5 text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                  {card.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ink-muted transition-colors duration-300 group-hover:text-white/75 group-focus-visible:text-white/75">
                  {card.description}
                </p>

                {/* Indikator arah - panah bergeser saat hover */}
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors duration-300 group-hover:text-accent-300 group-focus-visible:text-accent-300">
                  Selengkapnya
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-smooth group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transform-none"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
