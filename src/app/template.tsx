"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Sudah pernah ada halaman yang tampil di tab ini?
 * Hanya berubah di browser (lewat useEffect), jadi di server selalu false.
 */
let hasShownPage = false;

/**
 * Transisi halus antar halaman (fade + slide kecil).
 * template.tsx dirender ulang setiap navigasi, jadi animasinya konsisten di semua route.
 *
 * CATATAN PERFORMA: halaman PERTAMA yang dibuka sengaja tidak dianimasikan.
 * Bila dianimasikan, HTML dari server berisi style="opacity:0" sehingga seluruh
 * isi halaman baru terlihat setelah semua JavaScript selesai dimuat - menunda
 * LCP dan membuat halaman tampak kosong di koneksi lambat. Animasi tetap
 * berjalan saat berpindah halaman di dalam situs.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  // Dibaca sekali saat template ini dipasang: false untuk halaman pertama
  // (sama di server dan browser), true untuk navigasi berikutnya.
  const [animateIn] = useState(() => hasShownPage);

  useEffect(() => {
    hasShownPage = true;
  }, []);

  return (
    <motion.div
      initial={animateIn && !prefersReducedMotion ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
