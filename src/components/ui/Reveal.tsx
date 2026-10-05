"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { DURATION, EASE_SMOOTH, REVEAL_AMOUNT, REVEAL_DISTANCE, STAGGER } from "@/lib/motion";

type RevealTag = "div" | "section" | "ul" | "ol" | "li";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Elemen HTML pembungkus. Default: div. */
  as?: RevealTag;
  /** true: pembungkus diam, anak <RevealItem> muncul berurutan. */
  stagger?: boolean;
  /** Tunda mulai (detik). */
  delay?: number;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE, transition: { duration: 0 } },
  shown: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_SMOOTH } },
};

/**
 * Memunculkan isi dengan fade + geser ringan saat masuk layar (sekali saja).
 *
 * PENTING (pelajaran Tahap 3C): HTML dari server TIDAK pernah berisi
 * opacity:0. Elemen baru disembunyikan setelah hidrasi, dan hanya bila saat
 * itu posisinya masih di bawah layar. Jadi isi di layar pertama, pengguna
 * tanpa JavaScript, dan pengguna reduced-motion selalu langsung melihat isi.
 */
export function Reveal({ children, className, as = "div", stagger = false, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    // Hanya elemen yang belum terlihat yang boleh disembunyikan dulu.
    if (node.getBoundingClientRect().top <= window.innerHeight) return;

    setHidden(true);
    // Area pengamatan diperluas jauh ke ATAS layar (rootMargin), sehingga elemen
    // yang sudah terlewati - lompat ke tautan jangkar, gulir sangat cepat -
    // tetap terhitung "terlihat" dan langsung ditampilkan. Dengan begitu tidak
    // ada isi yang tertinggal tersembunyi.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !entry.isIntersecting) return;
        // Cukup terlihat: sebagian elemen (REVEAL_AMOUNT) atau, untuk elemen
        // yang sangat tinggi, sepertiga tinggi layar.
        if (
          entry.intersectionRatio >= REVEAL_AMOUNT ||
          entry.intersectionRect.height >= window.innerHeight * 0.33
        ) {
          setHidden(false);
          observer.disconnect();
        }
      },
      { rootMargin: "100000px 0px 0px 0px", threshold: [0, 0.05, 0.1, 0.15, REVEAL_AMOUNT, 0.35, 0.5] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const state = hidden ? "hidden" : "shown";
  const Component = motion[as] as typeof motion.div;

  const containerVariants: Variants = stagger
    ? {
        hidden: { transition: { duration: 0 } },
        shown: { transition: { staggerChildren: STAGGER, delayChildren: delay } },
      }
    : {
        hidden: itemVariants.hidden,
        shown: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION.slow, ease: EASE_SMOOTH, delay },
        },
      };

  return (
    <Component
      ref={ref}
      className={className}
      variants={containerVariants}
      initial={false}
      animate={state}
    >
      {children}
    </Component>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  as?: RevealTag;
};

/** Anak dari <Reveal stagger>. Mengikuti status induknya. */
export function RevealItem({ children, className, as = "div" }: RevealItemProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component className={className} variants={itemVariants}>
      {children}
    </Component>
  );
}
