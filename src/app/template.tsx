"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Transisi halus antar halaman (fade + slide kecil).
 * template.tsx dirender ulang setiap navigasi, jadi animasinya konsisten di semua route.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
