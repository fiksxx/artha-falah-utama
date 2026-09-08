import Link from "next/link";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  /** Kosongkan untuk item terakhir (halaman aktif). */
  href?: string;
};

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

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
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
