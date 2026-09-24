# Panduan Menulis Artikel Activity

Dokumen ini menjelaskan cara menambah dan menjaga mutu artikel di halaman Activity, terutama kategori **Panduan** yang dirancang tumbuh menjadi knowledge hub.

## 1. Struktur konten

Dua lapis:

| Lapis | Nilai | Fungsi |
|---|---|---|
| Kategori | `Insight`, `Panduan`, `Kegiatan` | Jenis tulisan. Tampil sebagai tab utama. |
| Topik (hanya Panduan) | `Cara Penggunaan`, `Memilih Alat`, `Fungsi & Prinsip Kerja`, `Tips & Perawatan`, `Troubleshooting`, `Laboratorium Dasar`, `Panduan Pembelian` | Kebutuhan pembaca. Tampil sebagai filter tingkat dua saat Panduan dipilih. |

Menambah topik baru: tambahkan di `ActivityTopic` (`src/types/index.ts`), lalu di `guideTopics` dan `guideTopicDescription` (`src/lib/data/activities.ts`) dan beri ikon di `ActivityCategoryIcon.tsx`. TypeScript akan menolak build bila ada yang terlewat.

## 2. Lokasi file

```
src/lib/data/guides/
  blocks.ts               helper penulis blok (p, h, ul, ol, steps, table, note, tip, warn)
  basic.ts                Laboratorium Dasar
  selection.ts            Memilih Alat
  function.ts             Fungsi & Prinsip Kerja
  usage-general.ts        Cara Penggunaan (alat serbaguna)
  usage-instruments.ts    Cara Penggunaan (instrumen ukur)
  care.ts                 Tips & Perawatan
  troubleshooting.ts      Troubleshooting
  buying.ts               Panduan Pembelian
  insight.ts              Insight
src/lib/data/activities.ts   menggabungkan semuanya + tiga kegiatan placeholder
```

## 3. Menambah satu artikel

Tambahkan satu objek pada file topik yang sesuai:

```ts
{
  id: "guide-cara-oven-laboratorium",        // unik, awali guide- atau insight-
  title: "Cara menggunakan oven laboratorium: ...",
  category: "Panduan",
  topic: "Cara Penggunaan",
  date: "2026-10-01",                        // ISO; menentukan urutan terbaru
  excerpt: "1-2 kalimat, dipakai di kartu dan meta description.",
  tags: ["Oven", "Cara penggunaan"],         // tag pertama = nama alat
  body: [ p("..."), h("..."), steps([...]), warn("...", "...") ],
}
```

- `slug` dibuat otomatis dari bagian judul sebelum tanda titik dua. Isi `slug` manual hanya untuk mengunci URL yang sudah beredar.
- `readingMinutes` dihitung otomatis.
- Foto sampul bersifat opsional: isi `image` dan `imageAlt` bila ada, kalau tidak sampul bergaya brand dipakai otomatis.
- `featured: true` pada satu artikel menjadikannya Sorotan di halaman Activity.
- Artikel terkait dipilih otomatis dari tag, topik, dan kategori. **Gunakan nama alat yang sama pada tag pertama** agar semua tulisan tentang satu alat saling menaut.

## 4. Jenis blok

| Helper | Dipakai untuk |
|---|---|
| `p(text)` | Paragraf |
| `h(text)` | Sub-judul (otomatis masuk daftar isi) |
| `ul(...)` / `ol(...)` | Daftar poin / bernomor |
| `steps([judul, isi], ...)` | Langkah kerja berurutan |
| `table(caption, [kiri, kanan], [a, b], ...)` | Tabel dua kolom |
| `note` / `tip` / `warn` | Catatan / tips / peringatan keselamatan |

Gunakan callout secukupnya (dua sampai tiga per artikel) agar tetap berarti.

## 5. Aturan editorial

1. **Tanpa klaim yang tidak dapat dibuktikan.** Hindari "terbaik", "paling terpercaya", "nomor satu". Kepercayaan dibangun dari kejelasan dan ketepatan informasi.
2. **Troubleshooting hanya tindakan aman.** Jangan menyuruh membuka casing, mengubah pengaturan pabrik, melewati pengaman, atau membongkar komponen tanpa pelatihan. Arahkan ke teknisi bila pemeriksaan sederhana gagal.
3. **Angka harus dapat dipertanggungjawabkan.** Nilai seperti suhu, toleransi, dan interval kalibrasi ditulis sebagai acuan umum ("indikatif") dan diarahkan ke manual pabrik atau metode baku. Bila ragu akan sebuah angka, jangan ditulis.
4. **Konteks Indonesia.** Gunakan contoh dari universitas, rumah sakit, klinik, industri pangan, farmasi, kimia, laboratorium lingkungan, dan pendidikan. Sebut kondisi lokal yang relevan: listrik 220 V yang berfluktuasi, kelembapan tropis, air sadah, suhu ruang yang tinggi, ketersediaan suku cadang.
5. **Bahasa.** Indonesia yang natural dan profesional. Kalimat konkret, istilah asing dijelaskan pada penyebutan pertama. Hindari pembuka klise dan daftar yang hanya mengulang judul.
6. **Setiap artikel harus berdiri sendiri** dan memberi sesuatu yang dapat langsung dipakai pembaca: langkah, tabel pembanding, atau daftar pemeriksaan.
7. **Kutip standar dengan hati-hati.** Sebut standar (ISO 8655, ISO 3696, SNI ISO/IEC 17025) hanya bila isinya memang Anda pahami; tulis ringkasan, bukan mengutip bunyi pasal.

## 6. Sebelum menerbitkan

- [ ] Angka dan istilah teknis sudah diperiksa oleh orang yang paham alatnya.
- [ ] Tidak ada klaim superlatif atau klaim tentang perusahaan yang belum terverifikasi.
- [ ] Langkah keselamatan dan peringatan ada di tempat yang tepat.
- [ ] `npm run typecheck` dan `npm run lint` lulus.
- [ ] Halaman `/activity` dan halaman detail artikel dibuka dan dibaca di desktop dan ponsel.

> **Catatan.** Tanggal (`date`) pada artikel yang sudah ada bersifat awal. Sesuaikan dengan tanggal terbit sebenarnya sebelum situs dipublikasikan.
