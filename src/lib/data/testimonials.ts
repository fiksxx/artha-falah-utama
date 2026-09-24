import type { Testimonial } from "@/types";

/**
 * TESTIMONI PELANGGAN (halaman About)
 * ===================================
 *
 * PERHATIAN - ISI SAAT INI ADALAH DATA DUMMY.
 * Nama, instansi, kutipan, dan rating di bawah adalah contoh rekaan agar tampilan
 * section dapat dinilai. Tidak ada pelanggan sungguhan di baliknya. GANTI dengan
 * testimoni asli sebelum website dibuka untuk publik: menampilkan testimoni rekaan
 * sebagai ucapan pelanggan nyata dapat menyesatkan pengunjung dan berisiko secara hukum.
 *
 * Yang ditampilkan: rating (bintang + angka), kutipan, dan nama pelanggan/instansi.
 * Jabatan tidak ditampilkan.
 *
 * Urutan array = urutan tampil di carousel: 3 kartu terlihat, bergeser satu kartu tiap 4 detik.
 *
 * Mengganti per kartu: isi `quote`, `name`, `organization`, `rating` dengan data asli,
 * lalu HAPUS baris `placeholder: true`. Tambah/kurangi kartu sesuka Anda. Bila array
 * dikosongkan, section tidak ditampilkan.
 *
 * Sebelum mempublikasikan testimoni asli: minta persetujuan tertulis pelanggan untuk
 * kutipan dan namanya, tulis kutipan apa adanya, dan pakai rating yang benar-benar
 * diberikan pelanggan.
 */
export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "Kami mengirim daftar kebutuhan alat praktikum, lalu penawaran kembali dengan rapi dan lengkap dengan spesifikasi tiap item. Itu memudahkan kami menyiapkan dokumen pengadaan.",
    name: "Rina Kusumawati",
    organization: "Perguruan Tinggi Negeri",
    rating: 5.0,
    placeholder: true,
  },
  {
    id: "testimonial-2",
    quote:
      "Sebelum membeli kami sempat bertanya soal perbedaan dua tipe alat. Penjelasannya runtut dan tidak mengarahkan ke yang lebih mahal.",
    name: "Hendra Wijaya",
    organization: "Klinik Pratama",
    rating: 4.9,
    placeholder: true,
  },
  {
    id: "testimonial-3",
    quote:
      "Saat kami meminta CoA dan SDS untuk beberapa reagen, dokumennya dikirim tanpa berbelit. Itu penting untuk arsip mutu kami.",
    name: "Sari Puspitasari",
    organization: "Laboratorium Pengujian Air",
    rating: 5.0,
    placeholder: true,
  },
  {
    id: "testimonial-4",
    quote:
      "Tim sales menanyakan jenis sampel dan volume harian kami lebih dulu sebelum merekomendasikan model. Kebutuhan kami terasa didengarkan.",
    name: "Ahmad Fauzi",
    organization: "Industri Pangan dan Minuman",
    rating: 4.8,
    placeholder: true,
  },
  {
    id: "testimonial-5",
    quote:
      "Anggaran laboratorium sekolah kami terbatas. Kami dibantu menyesuaikan daftar alat dengan anggaran tanpa mengorbankan kebutuhan praktikum utama.",
    name: "Maya Anggraini",
    organization: "SMK",
    rating: 4.9,
    placeholder: true,
  },
  {
    id: "testimonial-6",
    quote:
      "Halaman produk yang memuat spesifikasi lengkap memudahkan kami mencocokkannya dengan kebutuhan teknis. Komunikasi lewat email dan WhatsApp juga lancar.",
    name: "Bambang Santoso",
    organization: "Instansi Pemerintah Daerah",
    rating: 5.0,
    placeholder: true,
  },
];
