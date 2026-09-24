import type { ArticleBlock } from "@/types";

/**
 * PENULIS BLOK ARTIKEL
 * ====================
 *
 * Fungsi kecil agar isi artikel ditulis sebagai daftar yang ringkas dan mudah
 * dibaca, bukan objek panjang berulang. Hasilnya tetap data biasa bertipe
 * `ArticleBlock` - tampilan tiap blok diputuskan di ArticleBody.tsx.
 *
 *   body: [
 *     p("Paragraf biasa."),
 *     h("Sub-judul (otomatis masuk daftar isi)"),
 *     ul("Butir satu.", "Butir dua."),
 *     steps(["Judul langkah", "Penjelasan langkah."], ...),
 *     table("Keterangan tabel", ["Kolom kiri", "Kolom kanan"], ["A", "B"], ...),
 *     note("Judul", "Isi"), tip("Judul", "Isi"), warn("Judul", "Isi"),
 *   ]
 */

/** Paragraf. */
export const p = (text: string): ArticleBlock => ({ type: "paragraph", text });

/** Sub-judul. Otomatis masuk daftar isi. */
export const h = (text: string): ArticleBlock => ({ type: "heading", text });

/** Daftar poin. */
export const ul = (...items: string[]): ArticleBlock => ({ type: "list", items });

/** Daftar bernomor (urutan penting, tetapi tiap butir tidak perlu judul). */
export const ol = (...items: string[]): ArticleBlock => ({ type: "list", items, ordered: true });

/** Langkah kerja berurutan: setiap langkah = [judul singkat, penjelasan]. */
export const steps = (...items: Array<[title: string, text: string]>): ArticleBlock => ({
  type: "steps",
  items: items.map(([title, text]) => ({ title, text })),
});

/** Tabel dua kolom. `head` = [judul kolom kiri, judul kolom kanan]. */
export const table = (
  caption: string,
  head: [string, string],
  ...rows: Array<[label: string, value: string]>
): ArticleBlock => ({
  type: "table",
  caption,
  labelHeader: head[0],
  valueHeader: head[1],
  items: rows.map(([label, value]) => ({ label, value })),
});

/** Catatan penting. */
export const note = (title: string, text: string): ArticleBlock => ({
  type: "callout",
  tone: "note",
  title,
  text,
});

/** Tips kerja yang lebih baik. */
export const tip = (title: string, text: string): ArticleBlock => ({
  type: "callout",
  tone: "tip",
  title,
  text,
});

/** Peringatan keselamatan atau risiko kerusakan alat. */
export const warn = (title: string, text: string): ArticleBlock => ({
  type: "callout",
  tone: "warning",
  title,
  text,
});
