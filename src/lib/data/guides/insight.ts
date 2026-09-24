import { h, note, p, table, tip, ul } from "@/lib/data/guides/blocks";
import type { ActivitySeed } from "@/types";

/**
 * INSIGHT LABORATORIUM
 * Tulisan tingkat lanjut: cara berpikir tentang mutu data dan pengelolaan
 * peralatan, bukan langkah kerja satu alat tertentu.
 */
export const insightArticles: ActivitySeed[] = [
  {
    id: "insight-alat-presisi-vs-data-akurat",
    title: "Alat berpresisi tinggi belum tentu menghasilkan data yang akurat",
    category: "Insight",
    date: "2026-09-15",
    excerpt:
      "Timbangan berresolusi 0,1 mg dan pH meter berlayar tiga desimal tetap dapat memberi angka yang keliru. Data yang dapat dipercaya lahir dari sistem pengukuran, bukan hanya dari alatnya.",
    tags: ["Mutu data", "Kalibrasi", "Kontrol mutu", "Akurasi"],
    body: [
      p("Ada anggapan yang lazim di ruang pengadaan: alat yang lebih mahal dan berdesimal lebih banyak pasti memberi hasil yang lebih benar. Anggapan ini menggoda karena angka di layar terlihat meyakinkan. Padahal ketepatan sebuah hasil adalah gabungan dari beberapa hal, dan alat hanya salah satunya."),
      h("Tiga istilah yang sering tertukar"),
      table(
        "Perbedaan resolusi, presisi, dan akurasi",
        ["Istilah", "Artinya"],
        ["Resolusi", "Seberapa halus angka ditampilkan. Ini sifat tampilan alat."],
        ["Presisi", "Seberapa konsisten hasil pada pengukuran berulang. Dapat baik meskipun semuanya meleset."],
        ["Akurasi", "Seberapa dekat hasil dengan nilai sebenarnya. Bergantung pada kalibrasi, metode, dan kondisi."],
      ),
      p("Sebuah timbangan dapat menunjukkan angka yang sangat konsisten (presisi tinggi) tetapi selalu kurang 2 mg dari massa sebenarnya karena belum dikalibrasi (akurasi rendah). Sebaliknya, sebuah alat sederhana yang baru dikalibrasi dapat memberi hasil yang lebih dekat dengan nilai sebenarnya daripada alat canggih yang lama tidak diperiksa."),
      h("Empat hal di luar alat yang menentukan hasil"),
      ul(
        "Kalibrasi dan ketertelusuran. Alat yang tidak pernah dibandingkan dengan standar tidak memiliki dasar untuk klaim akurasinya. Sertifikat kalibrasi dan pemeriksaan antara menjaga hubungan itu.",
        "Lingkungan. Timbangan analitik di meja yang bergetar, spektrofotometer di ruang yang suhunya naik turun, atau pH meter yang dipakai sambil mengukur sampel hangat, semuanya menurunkan mutu hasil tanpa terlihat pada layar.",
        "Sampel dan persiapannya. Pengambilan sampel yang tidak mewakili, wadah yang tercemar, dan penyimpanan yang keliru dapat menghilangkan seluruh keuntungan alat yang mahal.",
        "Orang dan prosedur. Teknik memipet, urutan pengerjaan, dan kedisiplinan mencatat berdampak nyata. Dua analis dengan alat yang sama dapat menghasilkan angka berbeda.",
      ),
      h("Cara sederhana menjaga mutu data"),
      p("Laboratorium tidak perlu sistem yang rumit untuk mulai. Beberapa kebiasaan berikut membawa dampak besar dan tidak mahal:"),
      ul(
        "Periksa alat dengan standar yang diketahui pada awal kerja, misalnya anak timbang untuk timbangan, buffer untuk pH meter, atau larutan standar untuk spektrofotometer. Catat hasilnya.",
        "Sertakan blanko dan sampel kontrol pada setiap rangkaian pengukuran.",
        "Lakukan pengukuran ganda dan perhatikan sebarannya. Sebaran yang tiba-tiba melebar adalah peringatan dini.",
        "Gambarkan hasil pemeriksaan kontrol dari waktu ke waktu. Pergeseran yang perlahan lebih mudah terlihat pada grafik daripada pada angka satu per satu.",
        "Jaga jadwal kalibrasi dan catat tindakan perbaikan.",
      ),
      note("Mengapa ini penting bagi pengadaan", "Anggaran alat yang baik memasukkan pula meja yang kokoh, standar pemeriksaan, kalibrasi berkala, dan pelatihan. Bila hanya alatnya yang dibeli, mutu data tetap bergantung pada hal-hal yang tidak dianggarkan."),
      tip("Pertanyaan yang berguna sebelum percaya sebuah angka", "Kapan alat ini terakhir dibandingkan dengan standar? Bagaimana kondisi ruangan saat mengukur? Apakah hasilnya konsisten pada pengulangan? Tiga pertanyaan ini menyaring sebagian besar hasil yang meragukan."),
    ],
  },
  {
    id: "insight-peralatan-akreditasi-17025",
    title: "Menyiapkan peralatan untuk akreditasi ISO/IEC 17025: apa yang diminta dan bagaimana memulainya",
    category: "Insight",
    date: "2026-08-13",
    excerpt:
      "Bagi laboratorium pengujian dan kalibrasi, peralatan bukan hanya soal membeli alat. Gambaran tentang persyaratan peralatan dalam SNI ISO/IEC 17025 dan langkah praktis menyiapkannya.",
    tags: ["ISO 17025", "Akreditasi", "Kalibrasi", "Mutu data"],
    body: [
      p("Banyak laboratorium di universitas, laboratorium lingkungan, industri, dan instansi pemerintah mengarah ke akreditasi agar hasil ujinya diakui. Di Indonesia akreditasi laboratorium pengujian dan kalibrasi diberikan oleh Komite Akreditasi Nasional (KAN) dengan acuan SNI ISO/IEC 17025. Salah satu bagian yang paling banyak menyita perhatian adalah peralatan."),
      h("Apa yang diharapkan dari peralatan"),
      p("Secara garis besar, standar meminta laboratorium menunjukkan bahwa alat yang dipakai mampu menghasilkan ketelitian yang dibutuhkan metodenya, dan bahwa hasilnya dapat ditelusuri ke standar pengukuran. Dalam praktik, itu berarti beberapa hal berikut."),
      table(
        "Ringkasan hal yang biasanya diperiksa pada peralatan",
        ["Aspek", "Yang biasanya diharapkan"],
        ["Kesesuaian alat", "Alat cocok untuk metode: rentang, resolusi, dan ketelitiannya memenuhi persyaratan."],
        ["Identifikasi", "Setiap alat memiliki identitas unik, dan ada daftar induk peralatan."],
        ["Kalibrasi dan ketertelusuran", "Alat yang berpengaruh pada hasil dikalibrasi, sebaiknya oleh laboratorium kalibrasi yang mampu dan terakreditasi, dengan sertifikat yang memuat ketidakpastian."],
        ["Pemeriksaan antara", "Ada pemeriksaan di sela kalibrasi untuk menjaga keyakinan pada alat."],
        ["Pemeliharaan", "Rencana dan catatan perawatan alat."],
        ["Penanganan alat bermasalah", "Alat yang rusak atau menyimpang ditarik dari pemakaian, diberi tanda, dan dampaknya pada hasil sebelumnya dikaji."],
        ["Kondisi lingkungan", "Suhu, kelembapan, atau kondisi lain yang memengaruhi hasil dipantau dan dicatat bila relevan."],
        ["Catatan", "Riwayat alat, penggunaan, dan hasil pemeriksaan dapat ditelusuri."],
      ),
      h("Langkah praktis memulai"),
      ul(
        "Buat daftar semua alat yang berpengaruh pada hasil uji, lalu beri nomor identitas dan catat merek, model, nomor seri, lokasi, dan tanggal kalibrasi terakhir.",
        "Tentukan alat mana yang perlu kalibrasi eksternal dan mana yang cukup pemeriksaan internal, berdasarkan seberapa besar pengaruhnya pada hasil.",
        "Pilih penyedia kalibrasi yang mampu untuk rentang dan alat Anda, dan periksa ruang lingkup akreditasinya.",
        "Tetapkan jadwal kalibrasi dan pemeriksaan antara, dan tunjuk penanggung jawabnya.",
        "Siapkan lembar catatan sederhana untuk pemakaian, perawatan, dan perbaikan.",
        "Latih pemakai tentang cara pakai yang benar dan apa yang harus dilakukan bila alat mencurigakan.",
      ),
      h("Saat membeli alat baru"),
      p("Bila alat direncanakan untuk laboratorium yang akan atau sedang diakreditasi, tanyakan sejak awal: apakah tersedia sertifikat kalibrasi dengan ketertelusuran yang jelas, siapa yang mengkalibrasi berkala, apakah spesifikasi cukup untuk metode yang dipakai, dan apakah ada catatan dan dokumen yang mudah dikelola. Alat yang mudah didokumentasikan menghemat banyak pekerjaan administrasi kemudian."),
      note("Cakupan tulisan ini", "Tulisan ini adalah gambaran umum, bukan pengganti teks standar dan panduan dari KAN. Persyaratan lengkap dan terbaru perlu dibaca langsung pada dokumen resmi, dan penilai akreditasi adalah pihak yang menentukan kesesuaiannya."),
      tip("Mulai dari yang paling berdampak", "Bila sumber daya terbatas, mulai dengan alat yang paling memengaruhi hasil ujinya: timbangan, alat pengukur volume, alat pengukur suhu, dan alat ukur utama metode. Perbaikan di sini memberi dampak terbesar terhadap mutu data."),
    ],
  },
];
