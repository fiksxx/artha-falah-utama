import Image from "next/image";

import { Section, SectionHeading } from "@/components/ui/Section";
import { CheckIcon } from "@/components/ui/icons";
import { businessBlocks } from "@/lib/data/about";
import { cn } from "@/lib/utils";

/**
 * Lini bisnis dan cakupan produk - layout editorial yang panjang ke bawah.
 *
 * Empat blok berurutan; di setiap blok gambar berada di satu sisi dan teks
 * (label, judul, paragraf, butir informasi) di sisi lainnya, lalu posisinya
 * bergantian di blok berikutnya. Antar-blok diberi jarak vertikal lega dan tidak
 * dibungkus card, supaya terbaca sebagai halaman artikel, bukan kumpulan kotak.
 *
 * Tetap memakai pita hijau gelap yang sama seperti section ini sebelumnya. Di
 * ponsel semua blok menumpuk: gambar di atas, teks di bawah. Isi di lib/data/about.ts.
 */
export function BusinessScope() {
  return (
    <Section
      id="lini-bisnis"
      tone="brand"
      spacing="md"
      width="wide"
      className="surface-brand-deep border-y border-brand-800"
    >
      <SectionHeading
        tone="invert"
        title="Jual Reagen, Alat Laboratorium, dan Alat Kesehatan"
        description="Artha Labs menyediakan kebutuhan laboratorium, dari reagen dan bahan habis pakai hingga instrumen dan peralatan, untuk penelitian, pendidikan, pengujian, dan kegiatan operasional."
      />

      <div className="mt-10 space-y-12 lg:mt-14 lg:space-y-20">
        {businessBlocks.map((block, index) => {
          const imageFirst = index % 2 === 0;

          return (
            <article key={block.id} className="grid items-center gap-6 lg:grid-cols-12 lg:gap-14">
              <div className={cn("lg:col-span-5", !imageFirst && "lg:order-2")}>
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/10 bg-white">
                  <Image
                    src={block.image.src}
                    alt={block.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className={cn("lg:col-span-7", !imageFirst && "lg:order-1")}>
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400"
                  />
                  {block.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-snug text-white">{block.title}</h3>
                <p className="mt-3 max-w-content text-base leading-relaxed text-white/75">
                  {block.text}
                </p>

                <ul
                  className={cn(
                    "mt-5 grid gap-x-8 gap-y-2.5",
                    block.columns === 2 && "sm:grid-cols-2",
                  )}
                >
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-white/85">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-400/15 text-accent-300"
                      >
                        <CheckIcon width={12} height={12} strokeWidth={2.5} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
