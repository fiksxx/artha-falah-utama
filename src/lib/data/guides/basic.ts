import { h, note, p, table, tip, ul, warn } from "@/lib/data/guides/blocks";
import type { ActivitySeed } from "@/types";

/**
 * PANDUAN - LABORATORIUM DASAR
 * Bekal yang dipakai hampir semua laboratorium: air, alat gelas, penyimpanan bahan.
 * (Artikel penyimpanan reagen ada di lib/data/activities.ts.)
 */
export const basicGuides: ActivitySeed[] = [
  {
    id: "guide-air-laboratorium",
    title: "Air untuk laboratorium: aquades, aquabidest, dan air deionisasi, kapan memakai yang mana",
    category: "Panduan",
    topic: "Laboratorium Dasar",
    date: "2026-09-13",
    excerpt:
      "Air adalah reagen yang paling sering dipakai sekaligus paling sering diabaikan. Kenali jenis air laboratorium, kelas kemurniannya, dan cara memilihnya sesuai pekerjaan.",
    tags: ["Air laboratorium", "Aquades", "Dasar laboratorium"],
    body: [
      p("Hampir setiap prosedur laboratorium memakai air: melarutkan reagen, membilas alat gelas, mengisi water bath, sampai membuat media kultur. Karena jumlahnya banyak dan tampilannya sama-sama bening, air sering diperlakukan seolah semuanya setara. Padahal air dengan kemurnian yang salah adalah salah satu penyebab hasil analisis meleset yang paling sulit dilacak, sebab tidak ada yang menduga air sebagai sumbernya."),
      h("Jenis air laboratorium dan bedanya"),
      table(
        "Perbandingan jenis air yang umum ditemui di laboratorium",
        ["Jenis air", "Karakter dan pemakaian"],
        ["Air keran (PDAM atau sumur)", "Mengandung mineral, klorin, dan kadang logam serta bahan organik. Cukup untuk mencuci kasar, bukan untuk membuat larutan."],
        ["Aquades (air suling)", "Hasil distilasi satu kali. Sebagian besar mineral dan partikel tertinggal. Standar kerja harian di banyak laboratorium."],
        ["Aquabidest", "Didistilasi dua kali. Lebih murni daripada aquades, dipakai bila metode menuntut pengotor lebih rendah."],
        ["Air deionisasi (DI)", "Dilewatkan pada resin penukar ion sehingga ion terambil. Bahan organik, bakteri, dan gas terlarut bisa tetap ada."],
        ["Air reverse osmosis (RO)", "Membran menahan sebagian besar ion dan partikel. Sering dipakai sebagai air umpan sebelum DI atau distilasi."],
        ["Air ultrapure", "Gabungan RO, DI, lampu UV, dan filtrasi halus. Untuk HPLC, ICP, kultur sel, dan biologi molekuler."],
      ),
      h("Kelas kemurnian menurut ISO 3696"),
      p("Standar ISO 3696 mengelompokkan air untuk keperluan analisis ke dalam tiga kelas. Tolok ukur utamanya adalah daya hantar listrik (konduktivitas) pada 25 °C: makin sedikit ion terlarut, makin kecil nilainya."),
      table(
        "Tiga kelas air laboratorium menurut ISO 3696",
        ["Kelas", "Batas konduktivitas dan contoh pemakaian"],
        ["Kelas 1", "Maksimum 0,01 mS/m (0,1 µS/cm). Analisis paling menuntut, misalnya HPLC dan ICP."],
        ["Kelas 2", "Maksimum 0,1 mS/m (1 µS/cm). Analisis sensitif seperti spektrometri serapan atom dan analisis jejak."],
        ["Kelas 3", "Maksimum 0,5 mS/m (5 µS/cm). Pekerjaan kimia basah umum dan pembuatan larutan reagen biasa."],
      ),
      h("Memilih air sesuai pekerjaan"),
      ul(
        "Bilasan akhir alat gelas: aquades. Air keran meninggalkan bercak mineral yang bisa mengganggu pengukuran.",
        "Larutan reagen dan standar untuk titrasi atau spektrofotometri rutin: air kelas 3 biasanya cukup, tetapi metode yang Anda ikuti selalu menjadi acuan pertama.",
        "Analisis logam jejak, HPLC, biologi molekuler, dan kultur sel: kelas 1 atau air ultrapure. Air kelas rendah akan tampak sebagai puncak pengganggu atau latar yang tinggi.",
        "Media kultur mikroba: air murni, lalu disterilkan bersama media.",
        "Pengisi water bath, autoklaf, dan humidifier: aquades atau air DI. Di daerah dengan air sadah, kerak menumpuk dengan cepat pada elemen pemanas bila air keran dipakai terus-menerus.",
      ),
      h("Kesalahan yang sering terjadi"),
      p("Yang paling sering ditemui adalah memakai air mineral kemasan atau air galon isi ulang sebagai pengganti aquades. Mineral dalam air minum kemasan memang sengaja ada dan kadarnya tidak dikendalikan untuk keperluan analisis. Kekeliruan kedua adalah menyimpan aquades dalam wadah terbuka. Air murni menyerap karbon dioksida dari udara, sehingga pH-nya turun ke sekitar 5,5 sampai 6 dan konduktivitasnya naik. Inilah sebabnya pembacaan pH pada air murni sering tidak stabil dan bukan selalu tanda alatnya bermasalah."),
      ul(
        "Simpan air murni dalam wadah bersih yang tertutup, beri label tanggal, dan gunakan dalam waktu singkat. Air yang disimpan berminggu-minggu bisa ditumbuhi bakteri atau alga.",
        "Jangan menuang kembali sisa air ke wadah induk.",
        "Untuk analisis jejak, pilih wadah plastik polietilena atau polipropilena yang sudah dibilas asam, bukan botol kaca lama yang dapat melepaskan ion.",
      ),
      tip("Cek mutu yang murah", "Ukur konduktivitas aquades secara berkala dengan conductivity meter dan catat hasilnya. Bila air yang baru dibuat menunjukkan puluhan µS/cm, periksa kerak pada alat distilasi atau kejenuhan resin pada unit deionisasi sebelum air itu dipakai untuk pekerjaan penting."),
      p("Kualitas air baku berbeda dari satu daerah ke daerah lain, mulai dari air PDAM yang berklorin sampai air sumur dangkal yang sadah atau berwarna. Karena itu unit pengolah air laboratorium sebaiknya dipilih dengan melihat kondisi air baku setempat, bukan hanya dari kapasitas produksinya."),
    ],
  },
  {
    id: "guide-alat-gelas-ukur",
    title: "Alat gelas ukur: labu ukur, pipet gondok, buret, dan gelas ukur, kapan memakai yang mana",
    category: "Panduan",
    topic: "Laboratorium Dasar",
    date: "2026-09-02",
    excerpt:
      "Tidak semua alat gelas berskala dibuat untuk mengukur volume dengan teliti. Pelajari perbedaan kelas A dan B, tanda TC dan TD, serta pemakaian yang tepat untuk tiap alat.",
    tags: ["Alat gelas", "Labu ukur", "Volumetrik", "Kimia dasar"],
    body: [
      p("Di rak alat gelas, banyak wadah punya garis skala, tetapi hanya sebagian yang dirancang untuk mengukur volume dengan teliti. Gelas kimia dan erlenmeyer, misalnya, hanya memberi perkiraan kasar. Memakainya untuk membuat larutan standar adalah kesalahan yang sangat umum di laboratorium pendidikan maupun laboratorium rutin, dan hasilnya baru terasa ketika kurva kalibrasi tidak mau lurus."),
      h("Empat alat, empat tingkat ketelitian"),
      table(
        "Ketelitian alat gelas ukur (toleransi kelas A menurut standar ISO, contoh ukuran)",
        ["Alat", "Toleransi dan fungsi"],
        ["Labu ukur 100 mL", "±0,10 mL. Untuk membuat larutan dengan volume akhir tepat, misalnya larutan standar dan pengenceran."],
        ["Pipet gondok 10 mL", "±0,02 mL. Untuk memindahkan satu volume tertentu dengan teliti."],
        ["Buret 50 mL", "±0,05 mL. Untuk titrasi, karena volume titran yang keluar dibaca dan dicatat."],
        ["Gelas ukur 100 mL", "±0,5 mL. Untuk mengukur volume yang tidak menuntut ketelitian tinggi, seperti pelarut cuci."],
        ["Gelas kimia dan erlenmeyer", "Hanya perkiraan kasar. Tidak untuk pengukuran volume yang menentukan hasil."],
      ),
      p("Angka di atas menunjukkan mengapa satu alat tidak bisa menggantikan yang lain. Bila larutan standar dibuat dalam gelas ukur 100 mL, ketidakpastian volumenya sudah lima kali lebih besar daripada memakai labu ukur dengan ukuran yang sama."),
      h("Kelas A, kelas B, serta tanda TC dan TD"),
      p("Alat gelas volumetrik dijual dalam dua kelas. Kelas A memiliki toleransi lebih ketat dan biasanya disertai nomor batch atau sertifikat; kelas B toleransinya kira-kira dua kali lebih longgar dan lebih murah. Untuk analisis kuantitatif dan larutan standar, pilih kelas A. Untuk praktikum yang hasilnya tidak dilaporkan sebagai data, kelas B sering sudah memadai."),
      ul(
        "Tanda “In” atau TC (to contain) berarti alat berisi tepat pada volume tertulis. Contohnya labu ukur.",
        "Tanda “Ex” atau TD (to deliver) berarti alat mengeluarkan tepat volume tertulis. Contohnya pipet gondok dan buret.",
        "Suhu acuan kalibrasi umumnya 20 °C. Cairan dan alat sebaiknya berada pada suhu ruang saat dipakai; volume berubah bila cairan masih hangat.",
      ),
      h("Membaca meniskus dengan benar"),
      p("Permukaan cairan dalam tabung kaca melengkung. Letakkan mata sejajar dengan permukaan cairan, bukan dari atas atau bawah, lalu baca bagian terendah lengkungan untuk cairan bening. Untuk cairan yang sangat gelap dan tidak tembus cahaya, seperti larutan kalium permanganat pekat, bagian atas lengkungan yang dibaca. Melihat dari atas membuat angka tampak lebih besar, dari bawah tampak lebih kecil."),
      h("Kesalahan yang sering terjadi"),
      ul(
        "Mengeringkan alat volumetrik di dalam oven. Pemanasan dapat mengubah volume kaca secara permanen. Bilas dengan aquades dan keringkan di udara, atau bilas dengan sedikit larutan yang akan diukur.",
        "Meniup habis sisa cairan di ujung pipet gondok. Pipet ini dikalibrasi dengan sisa kecil yang tertinggal di ujungnya; biarkan tetesan terakhir tidak dikeluarkan kecuali pipet bertanda blow-out.",
        "Menyimpan larutan dalam labu ukur. Labu ukur dipakai untuk membuat larutan, bukan menyimpannya. Pindahkan ke botol bertutup, karena larutan basa dapat mengikis kaca dan tutup yang longgar membuat larutan menguap.",
        "Memakai pipet gondok tanpa alat penghisap yang aman. Gunakan pipet filler atau bulb, jangan menghisap dengan mulut.",
        "Lupa membilas pipet dan buret dengan sedikit larutan yang akan dipakai. Sisa air pada dinding kaca akan mengencerkan larutan.",
      ),
      warn("Kaca retak", "Alat gelas yang sumbing atau retak halus, terutama pada bibir dan ujung pipet, dapat melukai tangan dan mengubah volume. Sisihkan, jangan dipakai lagi."),
      h("Mana yang dipakai untuk apa"),
      p("Untuk membuat larutan standar, pakai labu ukur dan pipet gondok kelas A. Untuk titrasi, buret. Untuk mengambil cairan dengan volume kurang dari 1 mL atau bila volumenya sering berganti, micropipette lebih praktis dan lebih teliti daripada pipet ukur kaca. Untuk pelarut cuci, medium kasar, dan pekerjaan yang tidak menuntut ketelitian, gelas ukur atau bahkan gelas kimia sudah cukup."),
      note("Untuk laboratorium pendidikan", "Menyediakan campuran kelas A dan B adalah cara wajar menekan biaya. Beri tanda yang jelas pada alat kelas A agar tidak terpakai untuk pekerjaan kasar dan agar mahasiswa terbiasa memilih alat menurut tingkat ketelitian yang dibutuhkan."),
    ],
  },
];
