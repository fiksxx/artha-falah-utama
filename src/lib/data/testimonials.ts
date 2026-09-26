import type { Testimonial } from "@/types";

/**
 * TESTIMONI PELANGGAN (halaman About)
 * ===================================
 *
 * SAAT INI SENGAJA KOSONG.
 * Data contoh (dummy) yang sebelumnya ada di sini sudah dihapus, karena menampilkan
 * testimoni rekaan sebagai ucapan pelanggan nyata dapat menyesatkan pengunjung dan
 * berisiko secara hukum. Selama array di bawah kosong, section "Testimoni Pelanggan"
 * di halaman About otomatis TIDAK ditampilkan (lihat kondisi di src/app/page.tsx dan
 * src/components/sections/TestimonialCarousel.tsx) - tidak ada kode lain yang perlu diubah.
 *
 * MENAMPILKAN TESTIMONI ASLI:
 * Tambahkan objek ke dalam array. Section langsung muncul kembali dengan tampilan yang
 * sama seperti sebelumnya (3 kartu terlihat, bergeser satu kartu tiap 4 detik).
 * Urutan array = urutan tampil di carousel.
 *
 * Contoh satu entri (ganti seluruh isinya dengan data asli):
 *
 *   {
 *     id: "testimonial-1",
 *     quote: "Kutipan asli dari pelanggan, ditulis apa adanya.",
 *     name: "Nama pelanggan",
 *     organization: "Nama instansi/perusahaan", // opsional
 *     rating: 5, // rating yang benar-benar diberikan pelanggan (1-5)
 *   },
 *
 * Aturan sebelum mempublikasikan testimoni:
 * - Hanya dari pelanggan sungguhan, dengan persetujuan tertulis untuk kutipan dan namanya.
 * - Kutipan ditulis apa adanya; jangan diubah maknanya.
 * - Rating harus rating yang benar-benar diberikan pelanggan.
 * - Jangan memakai field `placeholder: true` untuk data yang tampil di website publik.
 */
export const testimonials: Testimonial[] = [];
