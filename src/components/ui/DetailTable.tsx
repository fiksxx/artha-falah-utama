import { cn } from "@/lib/utils";
import type { ProductDetailItem } from "@/types";

/**
 * Tabel label/nilai untuk packaging & spesifikasi.
 * Dua kolom saja agar tetap nyaman dibaca di mobile tanpa scroll horizontal.
 */
export function DetailTable({
  items,
  caption,
  labelHeader = "Informasi",
  valueHeader = "Detail",
}: {
  items: ProductDetailItem[];
  caption?: string;
  labelHeader?: string;
  valueHeader?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="scrollbar-soft overflow-x-auto overflow-y-hidden rounded-xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[20rem] table-fixed border-collapse text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="bg-brand-800 text-white">
            <th scope="col" className="w-[42%] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] sm:px-5">
              {labelHeader}
            </th>
            <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-300 sm:px-5">
              {valueHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.label}
              className={cn(
                "transition-colors duration-200 hover:bg-brand-50/70",
                index % 2 === 1 && "bg-surface-muted/70",
              )}
            >
              <th
                scope="row"
                className="break-words border-t border-line px-4 py-3 align-top font-semibold text-ink sm:px-5"
              >
                {item.label}
              </th>
              <td className="break-words border-t border-line px-4 py-3 align-top leading-relaxed text-ink-muted sm:px-5">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
