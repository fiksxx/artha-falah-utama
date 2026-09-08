# Folder brosur produk (PDF)

Simpan file brosur PDF asli di folder ini, lalu daftarkan path-nya di
`src/lib/data/products.ts` pada field `brochureUrl`.

Contoh:

1. Simpan file: `public/brochures/spektrofotometer-uv-vis-al-2400.pdf`
2. Isi field pada produk terkait:

   ```ts
   brochureUrl: "/brochures/spektrofotometer-uv-vis-al-2400.pdf",
   ```

Aturan:

- Nama file huruf kecil, pakai tanda hubung, tanpa spasi dan tanpa karakter khusus.
- Path SELALU diawali `/brochures/` (tanpa kata `public`).
- Jangan pernah mengisi `brochureUrl` dengan file yang tidak ada di folder ini.
  Selama field dibiarkan kosong, tombol "Download Brochure" otomatis disembunyikan
  sehingga tidak ada broken link.
