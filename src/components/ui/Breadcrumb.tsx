import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  /** Kosongkan untuk item terakhir (halaman aktif). */
  href?: string;
};

/**
 * Structured data BreadcrumbList (schema.org) dari item yang SAMA dengan yang
 * tampil, sehingga isi data terstruktur selalu cocok dengan breadcrumb yang
 * dilihat pengunjung (syarat Google).
 *
 * - href relatif diubah menjadi URL lengkap dengan format yang sama seperti
 *   canonical & sitemap (beranda = siteConfig.url tanpa garis miring akhir).
 * - Item terakhir = halaman yang sedang dibuka; `item` (URL) boleh dihilangkan
 *   untuk item terakhir menurut dokumentasi Google, jadi tidak diisi.
 * - Bila ada item selain yang terakhir tanpa href, data tidak dibuat (Google
 *   mewajibkan URL untuk item-item tersebut).
 */
function absoluteUrl(href: string) {
  if (/^https?:\/\//.test(href)) return href;
  if (href === "/") return siteConfig.url;
  return `${siteConfig.url}${href.startsWith("/") ? href : `/${href}`}`;
}

function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  if (items.length < 2) return null;
  const middleComplete = items.slice(0, -1).every((item) => Boolean(item.href));
  if (!middleComplete) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(!isLast && item.href ? { item: absoluteUrl(item.href) } : {}),
      };
    }),
  };
}

/** Breadcrumb ringkas: teks kecil, pemisah gold tipis, item aktif tidak berupa link. */
export function Breadcrumb({
  items,
  className,
  tone = "default",
}: {
  items: BreadcrumbItem[];
  className?: string;
  tone?: "default" | "invert";
}) {
  const invert = tone === "invert";
  const jsonLd = breadcrumbJsonLd(items);

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      {/* Di dalam <nav> agar tidak menggeser tata letak elemen di sekitarnya. */}
      {jsonLd ? (
        <script
          type="application/ld+json"
          // "<" di-escape agar teks judul tidak pernah bisa menutup tag <script>.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      ) : null}
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors duration-200",
                    invert
                      ? "text-white/70 hover:text-accent-300"
                      : "text-ink-subtle hover:text-brand-700",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "font-medium",
                    invert ? "text-white" : "text-ink",
                    isLast && "max-w-[16rem] truncate sm:max-w-none",
                  )}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden="true" className={invert ? "text-accent-400/70" : "text-accent-500/70"}>
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
