import { basicGuides } from "@/lib/data/guides/basic";
import { buyingGuides } from "@/lib/data/guides/buying";
import { careGuides } from "@/lib/data/guides/care";
import { functionGuides } from "@/lib/data/guides/function";
import { insightArticles } from "@/lib/data/guides/insight";
import { selectionGuides } from "@/lib/data/guides/selection";
import { troubleshootingGuides } from "@/lib/data/guides/troubleshooting";
import { usageGuides } from "@/lib/data/guides/usage";
import { activityCategories, guideTopics } from "@/lib/activity-meta";
import { slugify } from "@/lib/utils";
import type { Activity, ActivitySeed, ArticleBlock } from "@/types";

/**
 * KONTEN HALAMAN ACTIVITY
 * =======================
 *
 * Satu file ini menjadi sumber tunggal untuk: daftar artikel di /activity,
 * halaman detail /activity/[slug], artikel terkait, dan entri sitemap.
 *
 * MENAMBAH ARTIKEL BARU:
 *   1. Tambahkan satu objek pada `activitySeeds` di bawah.
 *   2. (Opsional) Letakkan foto di `public/images/activities/` lalu isi `image`
 *      dan `imageAlt`. Tanpa foto, kartu dan header artikel otomatis memakai
 *      sampul bergaya brand - artikel tidak perlu menunggu foto untuk terbit.
 *   Selesai - URL, filter kategori, kartu, daftar isi, estimasi waktu baca,
 *   artikel terkait, pencarian, dan sitemap menyesuaikan sendiri.
 *
 * `slug` dan `readingMinutes` TIDAK perlu ditulis: keduanya dihasilkan otomatis
 * di bagian bawah file ini (pola yang sama dipakai pada data produk).
 */

/*
 * Kategori, topik, keterangannya, dan isEventActivity didefinisikan di
 * lib/activity-meta.ts (file ringan tanpa isi artikel, aman dipakai komponen
 * browser) dan diekspor ulang dari sini agar impor lama tetap bekerja.
 */
export {
  activityCategories,
  activityCategoryDescription,
  guideTopicDescription,
  guideTopics,
  isEventActivity,
} from "@/lib/activity-meta";

/**
 * Artikel Panduan ditulis di file terpisah per kelompok topik (folder `guides/`)
 * agar mudah dicari dan disunting. Semuanya digabung di sini.
 */
const activitySeeds: ActivitySeed[] = [
  ...basicGuides,
  ...selectionGuides,
  ...functionGuides,
  ...usageGuides,
  ...careGuides,
  ...troubleshootingGuides,
  ...buyingGuides,
  ...insightArticles,

  /* ======================================================================
     INSIGHT & PANDUAN
     Artikel teknis bersifat umum - aman dipublikasikan apa adanya dan bisa
     Anda sunting kapan saja. Tidak memuat klaim tentang perusahaan.
     ====================================================================== */
  {
    id: "article-sentrifus",
    // URL lama dikunci agar tautan yang sudah beredar tidak putus.
    slug: "memilih-sentrifus-rcf-jenis-rotor-dan-kapasitas",
    title: "Memilih sentrifus: RCF, jenis rotor, dan kapasitas",
    category: "Panduan",
    topic: "Memilih Alat",
    date: "2026-02-18",
    excerpt:
      "Dua sentrifus dengan RPM sama bisa memberi gaya pemisahan yang jauh berbeda. Berikut cara membaca spesifikasi sentrifus sebelum memutuskan pembelian.",
    tags: ["Sentrifugasi", "Instrumen", "Pemilihan alat"],
    body: [
      {
        type: "paragraph",
        text: "Sentrifus adalah salah satu alat yang paling sering dipakai di laboratorium, dan juga salah satu yang paling sering dibeli berdasarkan angka yang keliru. Banyak permintaan penawaran yang masuk hanya menyebutkan kecepatan putar dalam RPM, padahal RPM saja tidak menjelaskan seberapa kuat sampel benar-benar dipisahkan.",
      },
      {
        type: "heading",
        text: "RPM tidak sama dengan RCF",
      },
      {
        type: "paragraph",
        text: "RPM (rotation per minute) hanya menghitung berapa kali rotor berputar dalam satu menit. Yang sebenarnya bekerja pada sampel adalah RCF (relative centrifugal force), yaitu gaya sentrifugal relatif terhadap gravitasi, biasanya ditulis sebagai × g. RCF bergantung pada RPM dan radius rotor: pada RPM yang sama, rotor dengan radius lebih besar menghasilkan gaya yang lebih besar.",
      },
      {
        type: "paragraph",
        text: "Konsekuensinya praktis. Protokol yang meminta pemusingan pada 3.000 × g tidak bisa langsung diterjemahkan menjadi 3.000 RPM. Bila alat lama diganti dengan model lain yang radius rotornya berbeda, angka RPM pada prosedur lama perlu dihitung ulang, atau hasilnya bisa berbeda. Sebagian besar sentrifus modern sudah bisa diatur langsung dalam satuan RCF, dan sebaiknya fitur ini yang dipakai di prosedur tertulis.",
      },
      {
        type: "callout",
        title: "Sebelum mengganti sentrifus",
        text: "Catat nilai RCF pada prosedur yang sedang berjalan, bukan nilai RPM-nya. Nilai RCF dapat dipindahkan ke alat baru apa pun, sedangkan nilai RPM hanya berlaku untuk rotor yang radiusnya sama.",
      },
      {
        type: "heading",
        text: "Fixed-angle atau swing-out",
      },
      {
        type: "paragraph",
        text: "Rotor fixed-angle memegang tabung pada sudut tetap, umumnya sekitar 30 sampai 45 derajat. Jalur pengendapan partikel menjadi lebih pendek, sehingga pemisahan berlangsung lebih cepat dan rotor ini tahan kecepatan lebih tinggi. Pelet yang terbentuk menempel di dinding samping tabung dan sedikit miring.",
      },
      {
        type: "paragraph",
        text: "Rotor swing-out membuat tabung berayun menjadi horizontal saat berputar. Pelet terbentuk rata di dasar tabung dan batas antar lapisan lebih tegas, sehingga rotor ini lebih disukai untuk pemisahan darah, gradien densitas, dan pekerjaan yang lapisannya perlu diambil dengan pipet.",
      },
      {
        type: "table",
        caption: "Perbandingan ringkas jenis rotor sentrifus",
        labelHeader: "Pertimbangan",
        valueHeader: "Penjelasan",
        items: [
          { label: "Fixed-angle", value: "Lebih cepat, mendukung kecepatan lebih tinggi, pelet menempel di dinding tabung." },
          { label: "Swing-out", value: "Batas lapisan lebih rapi, pelet rata di dasar, cocok untuk pemisahan darah dan gradien." },
          { label: "Kapasitas", value: "Hitung dari beban puncak per hari, bukan rata-rata, agar tidak perlu memusing dua kali." },
          { label: "Pendinginan", value: "Diperlukan untuk sampel yang tidak stabil pada suhu ruang, misalnya kerja protein dan asam nukleat." },
        ],
      },
      {
        type: "heading",
        text: "Kapasitas dan adaptor tabung",
      },
      {
        type: "paragraph",
        text: "Kapasitas sebaiknya dihitung dari beban puncak, bukan dari jumlah sampel rata-rata. Sentrifus yang tepat untuk hari biasa akan terasa kurang ketika ada pengujian massal, dan memusing dua batch berturut-turut menambah waktu tunggu sekaligus risiko kesalahan penandaan. Perhatikan juga adaptor yang tersedia: satu rotor yang mendukung beberapa ukuran tabung sering lebih berguna daripada rotor khusus yang hanya muat satu ukuran.",
      },
      {
        type: "heading",
        text: "Hal yang sering terlewat",
      },
      {
        type: "list",
        items: [
          "Keseimbangan beban. Tabung harus dipasang berpasangan dengan massa yang setara, bukan sekadar volume yang terlihat sama.",
          "Kebisingan dan panas. Unit berkecepatan tinggi di ruang kecil tanpa ventilasi memadai akan terasa mengganggu setiap hari.",
          "Ketersediaan suku cadang. Gasket, adaptor, dan rotor pengganti lebih sering dibutuhkan daripada yang diperkirakan.",
          "Sertifikat kalibrasi. Pastikan alat datang dengan dokumen kalibrasi pabrik bila hasil pengujian Anda perlu ditelusuri.",
        ],
      },
      {
        type: "paragraph",
        text: "Bila spesifikasi pada dokumen pengadaan masih berupa angka RPM, kami dapat membantu mengonversinya ke RCF dan mencocokkannya dengan rotor yang tersedia. Sampaikan jenis sampel, volume, dan jumlah tabung per siklus melalui halaman kontak.",
      },
    ],
  },
  {
    id: "article-autoklaf",
    title: "Perawatan rutin autoklaf agar hasil sterilisasi konsisten",
    category: "Panduan",
    topic: "Tips & Perawatan",
    date: "2026-01-27",
    excerpt:
      "Siklus yang selesai tanpa alarm belum tentu berarti steril. Berikut pemeriksaan harian, mingguan, dan bulanan yang menjaga kinerja autoklaf.",
    tags: ["Sterilisasi", "Perawatan", "Autoklaf"],
    body: [
      {
        type: "paragraph",
        text: "Autoklaf bekerja dengan uap jenuh bertekanan. Yang mematikan mikroorganisme bukan suhu udara di dalam ruang, melainkan kontak langsung uap dengan seluruh permukaan muatan. Karena itu sebagian besar kegagalan sterilisasi bukan disebabkan alat yang rusak, melainkan udara yang tidak keluar sepenuhnya, muatan yang terlalu padat, atau air yang kualitasnya buruk.",
      },
      {
        type: "heading",
        text: "Pemeriksaan harian",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Periksa ketinggian air pada reservoir sebelum siklus pertama, dan gunakan air dengan kemurnian sesuai anjuran pabrik.",
          "Bersihkan sisa kotoran pada saringan pembuangan di dasar ruang; saringan yang tersumbat menahan udara dan mengganggu pembuangan uap.",
          "Usap gasket pintu dengan kain lembap dan periksa apakah ada retakan, pengerasan, atau bagian yang terlipat.",
          "Pastikan muatan tidak melebihi tiga per empat ruang dan ada jarak antar wadah agar uap dapat bersirkulasi.",
          "Catat suhu, tekanan, dan durasi tahan pada setiap siklus - catatan ini yang akan dicari saat audit.",
        ],
      },
      {
        type: "callout",
        title: "Indikator bukan pelengkap",
        text: "Indikator kimia menunjukkan bahwa satu paket telah terpapar kondisi sterilisasi, sedangkan indikator biologis menguji apakah spora benar-benar mati. Keduanya menjawab pertanyaan yang berbeda dan tidak saling menggantikan.",
      },
      {
        type: "heading",
        text: "Pemeriksaan mingguan dan bulanan",
      },
      {
        type: "paragraph",
        text: "Sekali seminggu, jalankan uji indikator biologis menggunakan spora yang sesuai untuk sterilisasi uap, dan tempatkan pada titik yang paling sulit dicapai uap di dalam muatan. Bersihkan ruang bagian dalam sesuai petunjuk pabrik, hindari bahan abrasif maupun pemutih berbasis klorin pada permukaan stainless steel karena dapat memicu korosi.",
      },
      {
        type: "paragraph",
        text: "Sekali sebulan, periksa katup pengaman, sambungan selang, serta kondisi segel pintu secara lebih teliti. Endapan mineral pada dinding ruang menandakan kualitas air yang perlu diperbaiki - pada jangka panjang, endapan ini akan mengganggu sensor suhu dan mempercepat kerusakan elemen pemanas.",
      },
      {
        type: "heading",
        text: "Tanda alat perlu diperiksa teknisi",
      },
      {
        type: "list",
        items: [
          "Siklus memakan waktu lebih lama dari biasanya untuk mencapai suhu tahan.",
          "Ada rembesan uap di sekeliling pintu saat tekanan naik.",
          "Muatan masih basah setelah tahap pengeringan selesai.",
          "Indikator biologis gagal, meskipun parameter siklus tercatat normal.",
          "Pembacaan suhu menyimpang dari hasil kalibrasi terakhir.",
        ],
      },
      {
        type: "paragraph",
        text: "Jadwal kalibrasi berkala sebaiknya mengikuti anjuran pabrik dan ketentuan lembaga yang menaungi laboratorium Anda. Simpan seluruh catatan siklus dan hasil uji indikator dalam satu berkas agar riwayat alat mudah ditelusuri ketika terjadi penyimpangan.",
      },
    ],
  },
  {
    id: "article-penyimpanan-reagen",
    // URL lama dikunci agar tautan yang sudah beredar tidak putus.
    slug: "menyimpan-reagen-suhu-cahaya-dan-masa-simpan",
    title: "Menyimpan reagen: suhu, cahaya, dan masa simpan",
    category: "Panduan",
    topic: "Laboratorium Dasar",
    date: "2025-12-15",
    excerpt:
      "Reagen yang disimpan keliru akan memberi hasil yang meleset jauh sebelum tanggal kedaluwarsanya. Catatan praktis untuk penyimpanan sehari-hari.",
    tags: ["Reagen", "Penyimpanan", "Cold chain"],
    body: [
      {
        type: "paragraph",
        text: "Masa simpan yang tertera pada label berlaku dengan satu syarat: reagen disimpan pada kondisi yang disebutkan pabrik. Begitu syarat itu tidak terpenuhi, tanggal kedaluwarsa berhenti menjadi acuan yang berarti. Botol yang beberapa kali ditinggalkan di suhu ruang bisa memberi hasil yang menyimpang meski tanggalnya masih jauh.",
      },
      {
        type: "heading",
        text: "Suhu dan rantai dingin",
      },
      {
        type: "paragraph",
        text: "Reagen yang memerlukan rantai dingin harus dipindahkan ke penyimpanan dingin segera setelah diterima, bukan setelah semua dokumen penerimaan selesai diproses. Catat suhu lemari pendingin dan freezer setiap hari, termasuk akhir pekan, dan pasang alarm bila memungkinkan. Pintu yang tidak tertutup sempurna semalaman adalah penyebab kerusakan yang paling sering terjadi dan paling jarang tercatat.",
      },
      {
        type: "paragraph",
        text: "Hindari membekukan ulang reagen yang sudah dicairkan kecuali pabrik menyatakannya aman. Untuk reagen yang sering dipakai sedikit-sedikit, membagi menjadi alikuot sekali pakai lebih baik daripada membuka botol induk berulang kali.",
      },
      {
        type: "table",
        caption: "Acuan umum kondisi penyimpanan",
        labelHeader: "Kondisi",
        valueHeader: "Catatan praktis",
        items: [
          { label: "Suhu ruang terkendali", value: "Jauhkan dari jendela, alat pemanas, dan sinar matahari langsung." },
          { label: "2 - 8 °C", value: "Gunakan lemari pendingin khusus laboratorium, bukan kulkas rumah tangga." },
          { label: "-20 °C ke bawah", value: "Hindari freezer dengan sistem defrost otomatis karena suhunya berfluktuasi." },
          { label: "Terlindung cahaya", value: "Simpan dalam botol amber atau kotak tertutup; jangan andalkan lemari tertutup saja." },
        ],
      },
      {
        type: "heading",
        text: "Pemisahan bahan yang tidak boleh berdekatan",
      },
      {
        type: "paragraph",
        text: "Asam kuat, basa kuat, oksidator, dan pelarut mudah terbakar disimpan terpisah, bukan sekadar diberi jarak di rak yang sama. Pelarut mudah terbakar sebaiknya berada di lemari khusus, dan bahan yang mengeluarkan uap korosif dijauhkan dari peralatan logam maupun instrumen. Urutan penyimpanan menurut abjad tanpa memperhatikan sifat kimia adalah kesalahan yang masih sering dijumpai.",
      },
      {
        type: "heading",
        text: "Pencatatan yang memudahkan penelusuran",
      },
      {
        type: "list",
        items: [
          "Tulis tanggal penerimaan dan tanggal pembukaan pada setiap wadah.",
          "Terapkan urutan pemakaian first in, first out agar stok lama tidak mengendap.",
          "Simpan Certificate of Analysis per nomor batch, bukan per jenis produk.",
          "Pastikan Safety Data Sheet mudah dijangkau dari area kerja, bukan hanya tersimpan di arsip.",
          "Periksa stok kedaluwarsa secara berkala dan pisahkan segera dari rak aktif.",
        ],
      },
      {
        type: "paragraph",
        text: "Untuk pengiriman yang memerlukan penanganan khusus, sampaikan kebutuhan suhu sejak tahap permintaan penawaran agar pengemasan dan jadwal pengiriman dapat disiapkan sesuai.",
      },
    ],
  },
];

/* ==========================================================================
   FIELD TURUNAN
   Dihitung sekali saat modul dimuat - komponen tinggal memakai hasilnya.
   ========================================================================== */

/** Rata-rata kecepatan baca teks bahasa Indonesia yang dipakai sebagai acuan. */
const WORDS_PER_MINUTE = 200;

/** Hitung jumlah kata dari seluruh blok artikel. */
function countWords(body: ArticleBlock[] = []): number {
  return body.reduce((total, block) => {
    const text =
      block.type === "list"
        ? block.items.join(" ")
        : block.type === "steps"
          ? block.items.map((item) => `${item.title} ${item.text}`).join(" ")
          : block.type === "table"
            ? block.items.map((item) => `${item.label} ${item.value}`).join(" ")
            : block.text;

    return total + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
}

/**
 * Dasar slug dari judul. Judul artikel Panduan berbentuk "Pokok bahasan:
 * penjelasan tambahan" - yang masuk URL cukup pokok bahasannya, agar tautan
 * tetap ringkas dan enak dibagikan. Bila bagian sebelum titik dua terlalu
 * pendek (kurang dari tiga kata), seluruh judul dipakai.
 */
function slugBase(title: string): string {
  const head = title.split(":")[0].trim();
  return head.split(/\s+/).length >= 3 ? head : title;
}

/** Lengkapi setiap entri dengan slug unik dan estimasi waktu baca. */
function withDerivedFields(seeds: ActivitySeed[]): Activity[] {
  const used = new Set<string>();

  return seeds.map((seed) => {
    const base = slugify(seed.slug ?? slugBase(seed.title)) || seed.id;
    let slug = base;
    let suffix = 2;
    while (used.has(slug)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(slug);

    return {
      ...seed,
      slug,
      readingMinutes: Math.max(1, Math.round(countWords(seed.body) / WORDS_PER_MINUTE)),
    };
  });
}

/** Seluruh entri, terurut dari yang terbaru. */
export const activities: Activity[] = withDerivedFields(activitySeeds).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

/** Kategori yang benar-benar dipakai minimal satu entri - filter tidak pernah kosong. */
export const usedActivityCategories = activityCategories.filter((category) =>
  activities.some((activity) => activity.category === category),
);

/** Topik Panduan yang sudah punya minimal satu artikel - filter tingkat dua tidak pernah kosong. */
export const usedGuideTopics = guideTopics.filter((topic) =>
  activities.some((activity) => activity.topic === topic),
);

/**
 * Artikel sorotan di bagian atas halaman Activity.
 * Diambil dari entri bertanda `featured`, atau entri terbaru bila tidak ada.
 */
export const featuredActivity: Activity | undefined =
  activities.find((activity) => activity.featured) ?? activities[0];

/** Cari satu entri dari slug URL. Dipakai route /activity/[slug]. */
export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((activity) => activity.slug === slug);
}

/**
 * Artikel terkait: prioritas daftar manual, lalu yang paling banyak berbagi
 * tag (mis. semua tulisan tentang "Micropipette" saling menaut), lalu topik
 * dan kategori yang sama, lalu entri terbaru. Artikel yang sedang dibuka tidak
 * pernah ikut.
 *
 * Skor tag dihitung per tag bersama, jadi pembaca artikel cara pakai pH meter
 * lebih dulu diarahkan ke panduan memilih dan troubleshooting pH meter
 * daripada ke artikel lain yang kebetulan sama topiknya.
 */
export function getRelatedActivities(activity: Activity, limit = 3): Activity[] {
  const pool = activities.filter((item) => item.id !== activity.id);
  const picked: Activity[] = [];

  const push = (candidate?: Activity) => {
    if (candidate && !picked.some((item) => item.id === candidate.id)) {
      picked.push(candidate);
    }
  };

  const score = (item: Activity) => {
    const sharedTags = item.tags?.filter((tag) => activity.tags?.includes(tag)).length ?? 0;
    const sameTopic = item.topic && item.topic === activity.topic ? 1 : 0;
    const sameCategory = item.category === activity.category ? 1 : 0;
    return sharedTags * 3 + sameTopic * 2 + sameCategory;
  };

  activity.relatedIds?.forEach((id) => push(pool.find((item) => item.id === id)));

  // Array.sort stabil: skor sama tetap terurut dari yang terbaru.
  [...pool].sort((a, b) => score(b) - score(a)).forEach(push);

  return picked.slice(0, limit);
}
