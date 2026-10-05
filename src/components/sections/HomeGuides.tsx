import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { activityImageForPosition } from "@/lib/activity-images";
import { activities } from "@/lib/data/activities";
import { formatDateID } from "@/lib/utils";

/** Satu tulisan utama + daftar di sampingnya. */
const LIST_SIZE = 4;

/**
 * Beranda - tulisan terbaru (Tahap R2). Menggantikan carousel Activity.
 *
 * Isi sama dengan sebelumnya: tulisan terbaru kategori Insight dan Panduan,
 * sesuai urutan di lib/data/activities.ts. Bedanya bentuk: satu tulisan utama
 * dengan sampul, dan beberapa judul berikutnya sebagai daftar - tanpa gerak
 * otomatis. Sampul tulisan utama memakai gambar urutan ke-1 (activity-01.png),
 * sama seperti kartu pertama pada carousel lama.
 */
export function HomeGuides() {
  const items = activities
    .filter((activity) => activity.category !== "Kegiatan")
    .slice(0, LIST_SIZE + 1);

  if (items.length === 0) return null;

  const [lead, ...rest] = items;
  const leadImage = activityImageForPosition(1);

  const meta = (item: (typeof items)[number]) =>
    [
      item.category,
      formatDateID(item.date),
      item.readingMinutes ? `${item.readingMinutes} menit baca` : null,
    ]
      .filter(Boolean)
      .join(", ");

  return (
    <Section id="activity" spacing="md" width="wide">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          title="Panduan dan catatan teknis"
          description="Insight, panduan, dan informasi seputar laboratorium dari tim kami."
        />
        <Link
          href="/activity"
          className="inline-flex min-h-[44px] shrink-0 items-center self-start text-base font-semibold text-brand-700 underline-offset-4 transition-colors duration-200 hover:text-brand-600 hover:underline sm:self-auto"
        >
          Lihat semua tulisan
        </Link>
      </div>

      <Reveal className="mt-8 grid gap-x-14 gap-y-10 lg:grid-cols-2">
        <article className="group/lead relative">
          {leadImage ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-surface-strong">
              <Image
                src={leadImage}
                alt={`Dokumentasi: ${lead.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <p className="mt-5 text-sm text-ink-subtle">{meta(lead)}</p>
          <h3 className="mt-2 text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.02em] text-ink">
            <Link
              href={`/activity/${lead.slug}`}
              className="rounded transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover/lead:text-brand-700"
            >
              {lead.title}
            </Link>
          </h3>
        </article>

        {rest.length > 0 ? (
          <ul className="border-t border-line-strong">
            {rest.map((item) => (
              <li key={item.id} className="border-b border-line-strong">
                <article className="group/item relative py-5">
                  <p className="text-sm text-ink-subtle">{meta(item)}</p>
                  <h3 className="mt-1.5 text-lg font-semibold leading-snug text-ink">
                    <Link
                      href={`/activity/${item.slug}`}
                      className="rounded transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover/item:text-brand-700"
                    >
                      {item.title}
                    </Link>
                  </h3>
                </article>
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>
    </Section>
  );
}
