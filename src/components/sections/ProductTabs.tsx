"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type ReactNode, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type ProductTab = {
  id: string;
  label: string;
  content: ReactNode;
};

/**
 * Navigasi tab compact untuk halaman detail produk.
 * Hanya konten tab aktif yang dirender agar halaman tetap pendek.
 * Tab aktif: dark green + teks gold + underline gold. Mobile: scroll horizontal.
 */
export function ProductTabs({ tabs, className }: { tabs: ProductTab[]; className?: string }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const prefersReducedMotion = useReducedMotion();

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId),
  );
  const active = tabs[activeIndex];

  if (!active) return null;

  // Navigasi keyboard standar tablist: panah kiri/kanan, Home, End
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    let next = activeIndex;
    if (event.key === "ArrowRight") next = (activeIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (activeIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;

    const nextTab = tabs[next];
    if (!nextTab) return;
    setActiveId(nextTab.id);
    buttonRefs.current[nextTab.id]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Informasi produk"
        className="scrollbar-soft -mx-1 flex gap-1.5 overflow-x-auto border-b border-line px-1 sm:mx-0 sm:gap-2 sm:px-0"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active.id;

          return (
            <button
              key={tab.id}
              ref={(node) => {
                buttonRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`product-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`product-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={handleKeyDown}
              className={cn(
                "relative min-h-[44px] shrink-0 whitespace-nowrap rounded-t-lg px-4 text-sm font-semibold transition-all duration-200 ease-smooth sm:px-5 sm:text-[0.9375rem]",
                isActive
                  ? "bg-brand-800 text-accent-300 after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:rounded-t-full after:bg-accent-400 after:content-['']"
                  : "text-ink-muted hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            role="tabpanel"
            id={`product-panel-${active.id}`}
            aria-labelledby={`product-tab-${active.id}`}
            tabIndex={0}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="focus-visible:outline-none"
          >
            {active.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
