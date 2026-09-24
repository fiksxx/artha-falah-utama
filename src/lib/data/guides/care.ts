import { h, note, p, table, tip, ul, warn } from "@/lib/data/guides/blocks";
import type { ActivitySeed } from "@/types";

/**
 * PANDUAN - TIPS & PERAWATAN
 * (Artikel perawatan autoklaf ada di lib/data/activities.ts.)
 */
export const careGuides: ActivitySeed[] = [
  {
    id: "guide-perawatan-micropipette",
    slug: "merawat-micropipette",
    title: "Merawat micropipette: pembersihan, penyimpanan, uji kebocoran, dan jadwal kalibrasi",
    category: "Panduan",
    topic: "Tips & Perawatan",
    date: "2026-09-01",
    excerpt:
      "Micropipette yang terawat memberi volume yang konsisten bertahun-tahun. Kebiasaan harian, cara memeriksa kebocoran sendiri, dan kapan pipet perlu dikalibrasi atau diservis.",
    tags: ["Micropipette", "Perawatan", "Kalibrasi"],
    body: [
      p("Micropipette adalah alat presisi yang bergantung pada piston dan segel karet yang bergerak halus. Kerusakannya jarang tampak dari luar: pipet yang mulai bocor atau kotor tetap bisa dipakai, hanya saja volumenya sedikit demi sedikit menyimpang. Karena itu perawatan yang paling efektif adalah kebiasaan kecil yang dijalankan setiap hari, ditambah pemeriksaan berkala."),
      h("Kebiasaan harian"),
      ul(
        "Simpan pipet tegak pada stand, jangan diletakkan mendatar di meja, dan jangan membiarkan tip berisi cairan menggantung.",
        "Atur volume pipet ke nilai terendah sebelum disimpan bila pabrik menganjurkannya, agar pegas tidak tertekan lama. Ikuti manual model Anda.",
        "Jangan mengatur volume di luar rentang, dan jangan memaksa pemutar.",
        "Usap bagian luar pipet secara berkala dengan kain yang dilembapkan etanol 70 persen atau desinfektan yang direkomendasikan pabrik. Jangan merendam pipet.",
        "Jangan menjatuhkan pipet. Benturan dapat menggeser mekanisme walaupun tidak tampak.",
      ),
      h("Cara memeriksa kebocoran"),
      p("Pasang tip baru, hisap volume maksimum dari air, lalu tahan pipet tegak selama sekitar 10 sampai 20 detik sambil memperhatikan ujung tip. Bila ada tetesan yang terbentuk atau volume dalam tip berkurang, ada kebocoran. Penyebab yang paling sering adalah tip tidak terpasang rapat, tip cacat, atau segel dan o-ring yang aus. Coba dengan tip lain sebelum menyimpulkan pipetnya yang bermasalah."),
      h("Pembersihan yang lebih dalam"),
      p("Bila cairan terlanjur masuk ke badan pipet, pipet perlu dibongkar dan dibersihkan sesuai manual, dengan piston, segel, dan o-ring diperiksa. Pekerjaan ini sebaiknya dilakukan oleh orang yang terlatih atau oleh teknisi. Membongkar tanpa memahami urutan dan pelumas yang benar dapat menimbulkan kerusakan yang lebih besar."),
      warn("Jangan menggunakan pelumas atau cairan pembersih sembarangan", "Pelumas atau pelarut yang tidak sesuai dapat merusak segel karet dan piston. Gunakan hanya bahan yang dianjurkan pabrik untuk model Anda."),
      h("Kalibrasi dan verifikasi"),
      p("Micropipette diperiksa dengan cara gravimetri: pipet air murni berulang kali ke atas timbangan analitik, lalu bandingkan rata-rata massa (dikonversi ke volume dengan mempertimbangkan suhu) dengan volume yang diatur. Prosedur dan batas kesalahan mengacu pada standar ISO 8655. Di laboratorium yang terakreditasi, hasil pemeriksaan dicatat dan pipet yang menyimpang ditarik dari pemakaian."),
      table(
        "Acuan waktu perawatan micropipette (indikatif)",
        ["Kondisi", "Tindakan yang dianjurkan"],
        ["Setiap hari dipakai", "Periksa visual, bersihkan bagian luar, dan simpan tegak pada stand."],
        ["Setiap beberapa bulan", "Uji kebocoran sederhana dan pemeriksaan gravimetri singkat pada volume yang sering dipakai."],
        ["Setiap 6 sampai 12 bulan", "Kalibrasi lengkap, atau lebih sering untuk pemakaian berat dan laboratorium yang terakreditasi."],
        ["Setelah jatuh atau kemasukan cairan", "Periksa dan kalibrasi ulang sebelum dipakai lagi."],
        ["Hasil replikat menyimpang", "Periksa kebocoran, tip, dan teknik pemipetan; bila tetap menyimpang, kirim untuk servis."],
      ),
      note("Angka di atas bersifat indikatif", "Interval sebenarnya ditetapkan oleh laboratorium berdasarkan tingkat pemakaian, riwayat kestabilan alat, dan persyaratan metode atau akreditasi yang diikuti."),
      tip("Penandaan pipet", "Beri tanda tanggal kalibrasi terakhir dan tanggal jatuh tempo berikutnya pada badan pipet. Cara sederhana ini mencegah pipet yang sudah lewat jadwal terus dipakai tanpa disadari."),
    ],
  },
  {
    id: "guide-kapan-alat-dikalibrasi",
    slug: "kapan-alat-lab-dikalibrasi",
    title: "Kapan alat laboratorium perlu dikalibrasi atau diperiksa, dan apa bedanya kalibrasi dengan verifikasi",
    category: "Panduan",
    topic: "Tips & Perawatan",
    date: "2026-09-05",
    excerpt:
      "Kalibrasi, verifikasi, dan pemeriksaan antara sering dicampuradukkan. Pahami perbedaannya, kapan masing-masing diperlukan, dan bagaimana menyusun jadwal yang masuk akal.",
    tags: ["Kalibrasi", "Verifikasi", "Perawatan", "Akreditasi"],
    body: [
      p("Hampir semua orang di laboratorium pernah mendengar “alatnya perlu dikalibrasi”, tetapi tidak semuanya jelas apa yang dimaksud, siapa yang melakukannya, dan seberapa sering. Akibatnya alat bisa dikalibrasi terlalu jarang, atau justru terlalu sering tanpa manfaat. Berikut pembedaan istilahnya."),
      h("Kalibrasi, verifikasi, dan pemeriksaan antara"),
      table(
        "Perbedaan istilah yang sering tertukar",
        ["Istilah", "Artinya"],
        ["Kalibrasi", "Membandingkan pembacaan alat dengan standar acuan yang diketahui nilainya, lalu mencatat selisihnya beserta ketidakpastiannya. Hasilnya berupa sertifikat kalibrasi."],
        ["Penyetelan (adjustment)", "Mengubah alat agar pembacaannya mendekati standar. Berbeda dari kalibrasi, meskipun sering dikerjakan bersamaan."],
        ["Verifikasi", "Memastikan alat memenuhi persyaratan tertentu, misalnya dengan memeriksa apakah selisih pembacaan masih dalam batas yang ditetapkan."],
        ["Pemeriksaan antara (intermediate check)", "Pemeriksaan singkat oleh pemakai di sela kalibrasi, misalnya menimbang anak timbang di awal hari. Menjaga keyakinan terhadap alat di antara dua kalibrasi."],
        ["Kualifikasi", "Rangkaian pembuktian bahwa alat terpasang dan bekerja sesuai tujuan, lazim di industri farmasi dan pekerjaan yang diatur ketat."],
      ),
      h("Kapan alat perlu diperiksa atau dikalibrasi"),
      ul(
        "Saat baru dibeli dan dipasang. Minta sertifikat kalibrasi pabrik dan lakukan pemeriksaan awal di lokasi.",
        "Secara berkala. Interval ditetapkan berdasarkan jenis alat, seberapa sering dipakai, seberapa kritis hasilnya, dan riwayat kestabilannya. Interval awal 12 bulan lazim dipakai, lalu disesuaikan dari catatan.",
        "Setelah dipindahkan, terutama untuk timbangan, mikroskop, dan alat berpendingin.",
        "Setelah perbaikan atau penggantian komponen penting.",
        "Setelah alat terjatuh, terkena cairan, atau mengalami lonjakan listrik.",
        "Ketika hasil kontrol mutu menyimpang atau muncul pembacaan yang meragukan.",
      ),
      h("Siapa yang mengkalibrasi"),
      p("Untuk hasil yang harus dapat ditelusuri, pilih laboratorium kalibrasi yang terakreditasi. Di Indonesia, akreditasi diberikan oleh Komite Akreditasi Nasional (KAN) berdasarkan SNI ISO/IEC 17025. Sertifikat dari laboratorium terakreditasi menyebutkan ketertelusuran ke standar nasional atau internasional, serta ketidakpastian pengukuran. Untuk pemeriksaan harian, laboratorium sendiri dapat melakukannya dengan anak timbang, larutan standar, atau termometer acuan yang telah dikalibrasi."),
      h("Contoh acuan interval untuk beberapa alat"),
      table(
        "Contoh pemeriksaan dan kalibrasi alat umum (indikatif)",
        ["Alat", "Pemeriksaan yang lazim"],
        ["Timbangan analitik", "Pemeriksaan dengan anak timbang tiap hari pakai, kalibrasi eksternal kira-kira setahun sekali."],
        ["Micropipette", "Kalibrasi tiap 6 sampai 12 bulan, pemeriksaan singkat di antaranya."],
        ["pH meter", "Kalibrasi dengan buffer tiap hari pakai; elektroda diganti bila performa turun."],
        ["Incubator, water bath, oven", "Verifikasi suhu dengan termometer terkalibrasi secara berkala, kalibrasi termometer sekitar tiap tahun."],
        ["Autoklaf", "Pemantauan tiap siklus, uji biologis berkala, dan kalibrasi sensor tekanan dan suhu menurut jadwal."],
        ["Centrifuge", "Pemeriksaan kecepatan dan pewaktu secara berkala, misalnya dengan tachometer terkalibrasi."],
        ["Spektrofotometer", "Pemeriksaan panjang gelombang dan fotometrik dengan filter atau larutan acuan secara berkala."],
      ),
      note("Angka di atas adalah contoh", "Interval yang berlaku bagi laboratorium Anda ditentukan oleh persyaratan metode, kebijakan mutu, dan hasil evaluasi alat. Ikuti rekomendasi pabrik dan persyaratan akreditasi bila ada."),
      tip("Catat dengan rapi", "Buat daftar alat yang memuat nomor identitas, tanggal kalibrasi terakhir, tanggal berikutnya, dan pihak yang melakukannya. Daftar sederhana ini mencegah alat lewat jadwal tanpa disadari dan sangat membantu saat audit."),
    ],
  },
];
