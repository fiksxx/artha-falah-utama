import Link from "next/link";

import { cn, formatDateID } from "@/lib/utils";
import type { Activity } from "@/types";

type Guide = Pick<Activity, "id" | "slug" | "title" | "category" | "date" | "readingMinutes">;

/**
 * Daftar tautan "Panduan terkait" di halaman produk dan subkategori (Tahap S5).
 *
 * Gayanya sama dengan daftar tulisan di beranda (HomeGuides): baris bergaris
 * tipis, keterangan kecil di atas judul. Teks tautan = judul artikel itu
 * sendiri. Tidak merender apa pun bila daftarnya kosong.
 */
export function RelatedGuides({ guides, className }: { guides: Guide[]; className?: string }) {
  if (guides.length === 0) return null;

  return (
    <ul className={cn("border-t border-line-strong", className)}>
      {guides.map((guide) => (
        <li key={guide.id} className="border-b border-line-strong">
          <article className="group/item relative py-4">
            <p className="text-sm text-ink-subtle">
              {[
                guide.category,
                formatDateID(guide.date),
                guide.readingMinutes ? `${guide.readingMinutes} menit baca` : null,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            <h3 className="mt-1 text-lg font-semibold leading-snug text-ink">
              <Link
                href={`/activity/${guide.slug}`}
                className="rounded transition-colors duration-200 after:absolute after:inset-0 after:content-[''] group-hover/item:text-brand-700"
              >
                {guide.title}
              </Link>
            </h3>
          </article>
        </li>
      ))}
    </ul>
  );
}
