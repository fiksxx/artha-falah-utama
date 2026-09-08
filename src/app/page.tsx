import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { CompanyStats } from "@/components/sections/CompanyStats";
import { HomeHero } from "@/components/sections/HomeHero";
import { QuickNavCards } from "@/components/sections/QuickNavCards";
import { Section } from "@/components/ui/Section";
import { ClockIcon, HandshakeIcon, ShieldIcon, SparkIcon } from "@/components/ui/icons";
import { companyValues, missions, vision } from "@/lib/data/about";
import { createPageMetadata } from "@/lib/seo";
import type { CompanyValue } from "@/types";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Profil CV Artha Falah Utama: visi, misi, dan nilai perusahaan di balik Artha Labs, penyedia reagen, alat laboratorium, dan alat kesehatan untuk institusi, industri, dan fasilitas kesehatan.",
  path: "/",
  keywords: [
    "profil perusahaan",
    "visi misi",
    "nilai perusahaan",
    "Artha Labs",
    "distributor alat laboratorium",
  ],
});

const valueIconMap: Record<CompanyValue["icon"], typeof ShieldIcon> = {
  shield: ShieldIcon,
  spark: SparkIcon,
  handshake: HandshakeIcon,
  clock: ClockIcon,
};

/**
 * Halaman About.
 *
 * Urutan section mengikuti cara pengunjung menilai sebuah perusahaan:
 * kenali dulu, buktikan, arahkan, baru jelaskan prinsipnya.
 *
 *   1. Hero              : perkenalan + foto gedung (full-width)
 *   2. Brand Mitra       : bukti sosial paling cepat dicerna (marquee logo)
 *   3. Navigation Cards  : arahkan pengunjung ke halaman tujuan
 *   4. Artha Labs dalam Angka : statistik kepercayaan dengan counter
 *   5. Visi & Misi       : arah perusahaan
 *   6. Values            : prinsip kerja
 *   7. Footer            : dirender global di layout.tsx
 */
export default function AboutPage() {
  return (
    <>
      {/* 1. Hero / Company Introduction */}
      <HomeHero />

      {/* 2. Brand Mitra Artha Labs - daftar brand yang sama dengan halaman Artha Labs */}
      <BrandMarquee title="Brand mitra Artha Labs" headingId="brand-marquee-about" />

      {/* 3. Navigation Cards */}
      <Section id="navigasi" width="wide">
        <QuickNavCards />
      </Section>

      {/* 4. Artha Labs dalam Angka - angka bersumber dari companyStats di lib/data/about.ts */}
      <Section
        id="statistik"
        tone="brand"
        width="wide"
        className="surface-brand-deep border-y border-brand-800"
      >
        <h2 className="text-heading font-bold uppercase tracking-[0.08em] text-white">
          Artha Labs dalam Angka
        </h2>
        <span aria-hidden="true" className="mt-3 block h-1 w-12 rounded-full bg-accent-400" />

        <div className="mt-10">
          <CompanyStats />
        </div>
      </Section>

      {/* 5. Visi & Misi - dipisah secara visual: pernyataan tunggal vs daftar langkah */}
      <Section id="visi-misi" tone="soft" width="wide">
        <h2 className="text-heading font-bold uppercase tracking-[0.08em] text-brand-900">
          Visi &amp; Misi
        </h2>
        <span aria-hidden="true" className="mt-3 block h-1 w-12 rounded-full bg-accent-400" />

        {/* VISI - satu pernyataan, diberi ruang besar dan tipografi paling menonjol */}
        <article className="surface-brand-deep relative mt-10 overflow-hidden rounded-xl border border-brand-800 px-7 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent-400 to-transparent"
          />
          <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-accent-300">Visi</h3>
          {/* TODO: ganti dengan konten asli */}
          <p className="mt-5 max-w-4xl text-2xl font-semibold leading-snug text-white sm:text-3xl lg:text-[2.125rem]">
            {vision}
          </p>
        </article>

        {/* MISI - daftar bernomor, bukan kotak teks: langkah terasa berurutan */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-brand-700">Misi</h3>

          {/* TODO: ganti dengan konten asli */}
          <ol className="mt-6 grid gap-x-10 gap-y-1 lg:grid-cols-2">
            {missions.map((mission, index) => (
              <li
                key={mission}
                className="group flex items-start gap-5 border-t border-line py-6 transition-colors duration-300 ease-smooth hover:border-accent-400"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl font-bold tabular-nums text-accent-400 transition-colors duration-300 group-hover:text-brand-700"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base leading-relaxed text-ink-muted lg:text-[1.0625rem]">
                  {mission}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 6. Values - prinsip kerja perusahaan */}
      <Section id="values" width="wide">
        <h2 className="text-heading font-bold uppercase tracking-[0.08em] text-brand-900">
          Values
        </h2>
        <span aria-hidden="true" className="mt-3 block h-1 w-12 rounded-full bg-accent-400" />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {companyValues.map((value) => {
            const Icon = valueIconMap[value.icon];
            return (
              <li key={value.id} className="h-full">
                {/* TODO: ganti dengan konten asli */}
                <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover motion-reduce:transform-none">
                  {/* Garis aksen tipis yang tumbuh saat hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-600 to-accent-400 transition-transform duration-300 ease-smooth group-hover:scale-x-100 motion-reduce:transition-none"
                  />

                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors duration-300 ease-smooth group-hover:bg-brand-900 group-hover:text-accent-300"
                  >
                    <Icon />
                  </span>

                  <h3 className="mt-5 text-lg font-semibold text-ink transition-colors duration-300 group-hover:text-brand-700">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{value.description}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}