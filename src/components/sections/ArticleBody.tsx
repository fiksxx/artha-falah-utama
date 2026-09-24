import { DetailTable } from "@/components/ui/DetailTable";
import { AlertIcon, CheckIcon } from "@/components/ui/icons";
import { cn, slugify } from "@/lib/utils";
import type { ArticleBlock } from "@/types";

/**
 * Gaya kotak catatan per tone. Sengaja tanpa merah: `danger` di website ini
 * khusus state error form. Peringatan dibedakan lewat ikon, border emas yang
 * lebih tegas, dan labelnya - bukan lewat warna alarm.
 */
const calloutStyles = {
  note: { box: "border-accent-200 bg-accent-50", title: "text-accent-700" },
  tip: { box: "border-brand-200 bg-brand-50", title: "text-brand-700" },
  warning: { box: "border-accent-400 bg-accent-50", title: "text-accent-700" },
} as const;

/**
 * Perender isi artikel Activity.
 *
 * Menerjemahkan daftar blok berjenis (lihat `ArticleBlock` di types) menjadi
 * tampilan yang sudah mengikuti design system. Penulis konten cukup menulis
 * data; seluruh keputusan visual ada di sini, satu tempat.
 *
 * Lebar kolom teks dibatasi `max-w-content` (72ch) karena baris yang terlalu
 * panjang membuat mata sulit menemukan awal baris berikutnya. Tabel sengaja
 * dibiarkan lebih lebar agar isinya tidak terhimpit.
 */

/** Id anchor sebuah heading - dipakai bersama oleh daftar isi dan judulnya. */
export function headingId(text: string) {
  return `bagian-${slugify(text)}`;
}

/** Ambil seluruh heading untuk daftar isi. */
export function extractHeadings(body: ArticleBlock[] = []) {
  return body
    .filter((block): block is Extract<ArticleBlock, { type: "heading" }> => block.type === "heading")
    .map((block) => ({ id: headingId(block.text), text: block.text }));
}

export function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return (
    <div className="space-y-6">
      {body.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                id={headingId(block.text)}
                className="max-w-content scroll-mt-28 pt-4 text-heading font-semibold text-brand-900"
              >
                {block.text}
              </h2>
            );

          case "paragraph":
            return (
              <p
                key={index}
                className="max-w-content text-base leading-[1.75] text-ink-muted lg:text-[1.0625rem]"
              >
                {block.text}
              </p>
            );

          case "list":
            return block.ordered ? (
              <ol key={index} className="max-w-content space-y-3.5">
                {block.items.map((item, itemIndex) => (
                  <li key={item} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold tabular-nums text-brand-700"
                    >
                      {itemIndex + 1}
                    </span>
                    <span className="text-base leading-[1.7] text-ink-muted">{item}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="max-w-content space-y-3.5">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden="true" className="mt-1 shrink-0 text-accent-500">
                      <CheckIcon width={18} height={18} />
                    </span>
                    <span className="text-base leading-[1.7] text-ink-muted">{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "table":
            return (
              <div key={index} className="max-w-4xl pt-2">
                <DetailTable
                  items={block.items}
                  caption={block.caption}
                  labelHeader={block.labelHeader}
                  valueHeader={block.valueHeader}
                />
              </div>
            );

          case "steps":
            return (
              <ol key={index} className="max-w-content">
                {block.items.map((step, stepIndex) => {
                  const isLast = stepIndex === block.items.length - 1;
                  return (
                    <li key={step.title} className={cn("relative flex gap-4", !isLast && "pb-7")}>
                      {/* Garis penghubung antar langkah */}
                      {!isLast ? (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 left-[15px] top-9 w-px bg-line-strong"
                        />
                      ) : null}
                      <span
                        aria-hidden="true"
                        className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold tabular-nums text-white"
                      >
                        {stepIndex + 1}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="font-semibold leading-snug text-ink">{step.title}</p>
                        <p className="mt-1.5 text-base leading-[1.7] text-ink-muted">{step.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            );

          case "callout": {
            const tone = block.tone ?? "note";
            const style = calloutStyles[tone];
            return (
              <aside
                key={index}
                className={cn("max-w-content rounded-xl border p-5 sm:p-6", style.box)}
              >
                {block.title ? (
                  <p
                    className={cn(
                      "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]",
                      style.title,
                    )}
                  >
                    {tone === "warning" ? (
                      <AlertIcon aria-hidden="true" width={16} height={16} className="shrink-0" />
                    ) : null}
                    {block.title}
                  </p>
                ) : null}
                <p className="mt-2 text-base leading-[1.7] text-ink-muted">{block.text}</p>
              </aside>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
