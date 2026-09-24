# Panduan Deployment ke Production

**CV Artha Falah Utama** — dari komputer lokal sampai website dapat diakses publik.

Prasyarat: baca dulu `docs/PANDUAN-KONTEN.md` bagian 1 (Audit Arsitektur) agar paham struktur
yang akan Anda deploy.

---

## 1. Baca Ini Dulu: Kondisi Project Saat Ini

Secara teknis project sudah siap dibangun dan dideploy. Yang belum siap adalah **isinya**.

### 1.1 Wajib dilakukan sebelum apa pun

Project ini dibuat di lingkungan tanpa akses internet, jadi dependency belum pernah dipasang dan
build produksi belum pernah diuji. **Tiga perintah pertama Anda:**

```bash
cd artha-falah-utama
npm install
npm run build
```

Kalau ketiganya lulus tanpa error, project sehat. Kalau ada error, lihat Bagian 8
(Troubleshooting) sebelum melanjutkan.

### 1.2 Yang masih placeholder — harus diganti sebelum go-live

| Yang perlu diganti | File yang diedit |
| --- | --- |
| Alamat kantor, telepon, WhatsApp, email | `src/lib/site.ts` → `siteConfig.contact` |
| Link Instagram & LinkedIn (masih generik) | `src/lib/site.ts` → `socialLinks` |
| 9 produk placeholder | `src/lib/data/products.ts` |
| 8 brand "Brand Placeholder" | `src/lib/data/brands.ts` |
| Semua foto produk, brand, kegiatan | `public/images/`, `public/brands/` |
| Logo (masih monogram SVG sementara) | `src/components/layout/Logo.tsx` |
| Favicon | `src/app/icon.png`, `src/app/apple-icon.png` |
| Visi, misi, values, daftar kegiatan | `src/lib/data/about.ts`, `activities.ts` |
| Label navbar masih Inggris | `src/lib/site.ts` → `navItems` |
| Tahun berdiri (`founded: "2020"`) | `src/lib/site.ts` |

### 1.3 Keterbatasan yang perlu Anda ketahui (bukan bug)

1. **Rate limit formulir kontak bersifat in-memory.** Batas 5 kiriman per 10 menit per IP
   tersimpan di memori serverless function, jadi hitungannya bisa reset saat function idle atau
   berjalan di instance berbeda. Untuk company profile ini sudah memadai — pertahanan utamanya
   adalah honeypot dan validasi Zod. Bila nanti spam jadi masalah, ganti ke Upstash Redis (gratis
   sampai 10 ribu perintah/hari).

2. **Peta lokasi belum aktif.** Selama `NEXT_PUBLIC_MAPS_EMBED_SRC` kosong, halaman kontak
   menampilkan kotak informasi netral, bukan peta rusak.

3. **Belum ada halaman Kebijakan Privasi.** Formulir mengumpulkan nama dan email, jadi sebaiknya
   dibuat. Lihat `PANDUAN-KONTEN.md` bagian 7.6.

4. **Belum ada halaman brand tersendiri.** Brand tampil di marquee, filter, dan label produk.
   Ini pilihan desain, bukan kekurangan — lihat `PANDUAN-KONTEN.md` bagian 4.6.

---

## 2. Checklist Persiapan Sebelum Deployment

### 2.1 Technical

```
[ ] Source code final    — semua perubahan konten sudah masuk
[ ] Git repository       — sudah ada commit, tree bersih (git status kosong)
[ ] Node.js >= 18.18     — disarankan Node 20 LTS atau 22 LTS
[ ] npm >= 9             — npm bawaan Node sudah cukup
[ ] Dependency terpasang — npm install lulus, package-lock.json ikut di-commit
[ ] Environment variables — .env.local terisi untuk lokal
[ ] Build command        — npm run build (default Vercel, tidak perlu diubah)
[ ] Start command        — npm run start (dipakai Vercel otomatis)
[ ] Output directory     — .next (default, JANGAN diubah ke "out" atau "dist")
[ ] Production config    — next.config.mjs sudah berisi security header & format gambar
[ ] API config           — kunci Resend valid, domain pengirim terverifikasi
[ ] Database             — TIDAK ADA, lewati
[ ] Storage              — aset lokal di public/, lewati
```

**Cek versi Anda:**

```bash
node -v      # harus v18.18.0 atau lebih baru
npm -v
git --version
```

Belum ada Node.js? Unduh Node 20 LTS di <https://nodejs.org>.

**Isi environment variables lokal:**

```bash
cp .env.example .env.local
```

Lalu buka `.env.local` dan isi nilai sebenarnya. File ini otomatis diabaikan Git (sudah ada di
`.gitignore`), jadi kunci rahasia Anda tidak akan terunggah.

**Mendapatkan `RESEND_API_KEY`:**

1. Daftar gratis di <https://resend.com>.
2. Masuk ke **Domains** → **Add Domain**, masukkan `arthafalahutama.co.id`.
3. Resend memberi beberapa record DNS (SPF, DKIM). Tambahkan di panel DNS domain Anda.
4. Tunggu status berubah menjadi **Verified** (biasanya 5–60 menit).
5. Masuk ke **API Keys** → **Create API Key**, salin nilainya ke `RESEND_API_KEY`.

Tanpa domain terverifikasi, email tetap bisa dikirim untuk pengujian dengan
`CONTACT_FROM_EMAIL="onboarding@resend.dev"`, tetapi untuk production gunakan domain sendiri agar
tidak masuk folder spam.

### 2.2 Domain

```
[ ] Domain sudah dibeli dan aktif       — mis. arthafalahutama.co.id
[ ] Akses ke panel DNS registrar        — login berhasil
[ ] Keputusan www atau non-www          — pilih SATU sebagai utama
[ ] Nameserver                          — biarkan di registrar, cukup ubah record A/CNAME
[ ] SSL/HTTPS                           — otomatis dari Vercel, tidak perlu beli
```

Untuk domain `.co.id`, penyedia lokal seperti Rumahweb, Dewaweb, atau Niagahoster memerlukan
dokumen legal perusahaan (akta/NIB). Siapkan lebih awal karena verifikasinya bisa 1–3 hari kerja.

**Saran www/non-www:** pakai **non-www** (`arthafalahutama.co.id`) sebagai utama dan arahkan
`www` untuk mengalihkan ke sana. Lebih pendek dan lebih mudah diucapkan. Vercel mengatur redirect
ini otomatis begitu kedua domain ditambahkan.

### 2.3 Hosting — perbandingan dan rekomendasi

Ingat dari audit: website ini punya satu API route (`/api/contact`) yang membutuhkan runtime
Node.js. Ini yang menentukan pilihan.

| Opsi | Kelebihan | Kekurangan | Cocok? |
| --- | --- | --- | --- |
| **Vercel** | Pembuat Next.js, semua fitur didukung tanpa konfigurasi; API route jalan otomatis; optimasi `next/image` bawaan; HTTPS otomatis; preview URL per commit; gratis untuk skala ini | Bandwidth gratis 100 GB/bln; harga naik bila lalu lintas sangat besar | **Ya — pilihan terbaik** |
| Netlify | Antarmuka bagus, form bawaan | Dukungan Next.js lewat adapter pihak ketiga; `next/image` dan ISR kadang tertinggal versi; berpotensi bug halus | Bisa, tidak ideal |
| Cloudflare Pages | CDN terbaik, bandwidth tak terbatas | Butuh runtime Edge — SDK Resend dan `runtime = "nodejs"` di API route harus ditulis ulang | Perlu perubahan kode |
| VPS (DigitalOcean, Contabo) | Kontrol penuh, biaya tetap | Anda mengurus Nginx, PM2, sertifikat SSL, patch keamanan, backup; ±$6/bln + waktu | Berlebihan |
| Shared hosting (cPanel) | Murah, familiar | **Tidak bisa** — hanya melayani file statis, tidak ada Node.js runtime, formulir kontak mati | **Tidak** |

**Rekomendasi final: Vercel.**

Alasan konkret:

1. `src/app/api/contact/route.ts` sudah menetapkan `runtime = "nodejs"` — Vercel menjalankannya
   sebagai serverless function tanpa konfigurasi apa pun.
2. `next.config.mjs` sudah mengatur `images.formats` AVIF/WebP; optimasi gambar Vercel langsung
   memakainya. Di platform lain fitur ini sering perlu penyesuaian.
3. 15 halaman statis + 1 function jauh di bawah batas paket gratis.
4. Setiap `git push` menghasilkan URL pratinjau tersendiri — Anda bisa memeriksa produk baru
   sebelum tampil di domain resmi.
5. HTTPS, HTTP/2, CDN global, dan kompresi aktif otomatis.
6. Rollback satu klik bila ada kesalahan.

Paket **Hobby (gratis)** cukup. Naik ke **Pro ($20/bln)** hanya bila lalu lintas melebihi 100 GB
per bulan atau butuh analitik lanjutan.

### 2.4 Business

```
[ ] Logo final               — SVG atau PNG transparan, versi terang & gelap
[ ] Favicon                  — PNG 512x512, timpa src/app/icon.png
[ ] Nama perusahaan resmi    — sesuai akta, sudah benar: CV Artha Falah Utama
[ ] Email perusahaan         — aktif dan dipantau
[ ] Nomor WhatsApp bisnis    — pastikan aktif, sebaiknya WhatsApp Business
[ ] Akun media sosial        — URL lengkap, bukan hanya nama akun
[ ] Alamat kantor lengkap    — termasuk kode pos
[ ] Katalog produk           — nama, model, spesifikasi tiap produk
[ ] Daftar brand             — nama resmi + izin pemakaian logo
[ ] Foto produk              — minimal 1 per produk, latar bersih
[ ] Company profile          — visi, misi, tahun berdiri yang benar
[ ] Kebijakan Privasi        — disarankan karena ada formulir
[ ] Syarat & Ketentuan       — opsional untuk company profile
[ ] Google Maps embed        — salin nilai src dari Google Maps > Share > Embed
```

**Catatan izin logo brand:** menampilkan logo prinsipal umumnya diperbolehkan bagi distributor
resmi, tetapi mintalah konfirmasi tertulis dari masing-masing prinsipal untuk keamanan.

---

## 3. Deployment Step-by-Step

Ikuti berurutan. Total waktu ±45 menit (belum termasuk propagasi DNS).

### Langkah 1 — Siapkan repository lokal

Repository Git sudah ada di project ini. Periksa kondisinya:

```bash
cd artha-falah-utama
git status
git log --oneline -5
```

Kalau ada perubahan belum tercatat:

```bash
git add -A
git commit -m "chore: persiapan production"
```

Belum ada repository sama sekali? Jalankan:

```bash
git init
git branch -M main
git add -A
git commit -m "initial commit"
```

### Langkah 2 — Pastikan project berjalan lokal

```bash
npm install
cp .env.example .env.local     # lalu isi nilainya
npm run dev
```

Buka <http://localhost:3000> dan periksa semua halaman:

```
/                              About
/artha-labs                    Katalog
/artha-labs/reagen-placeholder-01   Detail produk
/activity                      Aktivitas
/contact                       Hubungi Kami
```

Buka DevTools (F12) → tab Console. **Harus bersih, tanpa error merah.**

Hentikan server dengan `Ctrl+C`.

### Langkah 3 — Jalankan production build

```bash
npm run typecheck
npm run lint
npm run build
```

Jalankan berurutan. `typecheck` menangkap kesalahan tipe, `lint` menangkap masalah kualitas,
`build` adalah ujian sebenarnya.

Output build yang sehat terlihat seperti ini:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
├ ○ /activity                            ...      ...
├ ○ /artha-labs                          ...      ...
├ ● /artha-labs/[slug]                   ...      ...
├ ○ /contact                             ...      ...
└ ƒ /api/contact                         ...      ...

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML
ƒ  (Dynamic)  server-rendered on demand
```

Yang harus Anda pastikan: 5 halaman utama bertanda `○`, `/artha-labs/[slug]` bertanda `●`
dengan 9 halaman ter-generate, dan `/api/contact` bertanda `ƒ`. Kalau `/api/contact` tidak ada,
formulir kontak tidak akan berfungsi.

Uji hasil build:

```bash
npm run start
```

Buka <http://localhost:3000>. Ini versi yang persis sama dengan yang akan online.

### Langkah 4 — Perbaiki error dan warning

Jangan lanjut sebelum ketiga perintah di Langkah 3 lulus. Panduan singkat:

| Pesan | Artinya | Tindakan |
| --- | --- | --- |
| `Type error: ...` | Kesalahan tipe/format data | Perbaiki file & baris yang disebut |
| `Module not found: Can't resolve '@/...'` | Path atau nama file salah | Periksa file benar-benar ada, perhatikan huruf besar-kecil |
| `Error: Image is missing required "alt"` | Gambar tanpa alt | Tambahkan `imageAlt` di data produk |
| `useSearchParams() should be wrapped in a suspense boundary` | Hook client di luar Suspense | Sudah ditangani di `contact/page.tsx` |
| Warning `unused variable` | Tidak fatal | Boleh diabaikan, sebaiknya dibersihkan |

Warning tidak memblokir build. Error memblokir. Perbaiki error, catat warning.

### Langkah 5 — Unggah ke GitHub

Buat repository **private** kosong di <https://github.com/new>. Jangan centang README,
`.gitignore`, atau lisensi.

Lalu di terminal:

```bash
git remote add origin https://github.com/USERNAME/artha-falah-utama.git
git push -u origin main
```

Ganti `USERNAME` dengan nama akun GitHub Anda. Bila diminta kata sandi, gunakan **Personal Access
Token** (GitHub Settings → Developer settings → Personal access tokens), bukan kata sandi akun.

Periksa di GitHub bahwa **`.env.local` TIDAK ikut terunggah**. Kalau ternyata ada, segera ganti
kunci Resend Anda dan jalankan:

```bash
git rm --cached .env.local
git commit -m "chore: hapus env dari repo"
git push
```

### Langkah 6 — Buat akun Vercel

1. Buka <https://vercel.com/signup>.
2. Pilih **Continue with GitHub** — ini menghubungkan kedua akun sekaligus.
3. Pilih paket **Hobby** (gratis).

### Langkah 7 — Hubungkan repository

1. Di dasbor Vercel klik **Add New** → **Project**.
2. Cari `artha-falah-utama` dalam daftar, klik **Import**.
3. Bila repository tidak muncul, klik **Adjust GitHub App Permissions** dan beri akses.

### Langkah 8 — Atur build command

Vercel mendeteksi Next.js otomatis dan mengisi:

| Kolom | Nilai |
| --- | --- |
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Root Directory | `./` |

**Jangan diubah.** Kalau Framework Preset terdeteksi "Other", hentikan dan periksa bahwa
`package.json` ada di akar repository.

### Langkah 9 — Atur output directory

Biarkan **kosong**. Vercel tahu Next.js memakai `.next`.

> Kesalahan umum: mengisi `out` atau `dist`. Ini menghasilkan halaman kosong atau 404 di semua
> route. `out` hanya untuk `next export` yang **tidak** dipakai project ini (karena ada API route).

### Langkah 10 — Atur environment variables

Masih di halaman import, buka **Environment Variables** dan tambahkan satu per satu:

| Name | Value | Environment |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://arthafalahutama.co.id` | Production |
| `RESEND_API_KEY` | `re_xxxxx...` | All |
| `CONTACT_FROM_EMAIL` | `Website Artha Falah <website@arthafalahutama.co.id>` | All |
| `CONTACT_TO_EMAIL` | `info@arthafalahutama.co.id` | All |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` (bila ada) | All |
| `NEXT_PUBLIC_MAPS_EMBED_SRC` | URL embed Maps (bila ada) | All |

Tiga catatan penting:

- Jangan sertakan tanda kutip pada nilai. Vercel menyimpannya apa adanya.
- Variabel `NEXT_PUBLIC_*` **dibaca saat build**. Mengubahnya nanti mewajibkan redeploy.
- Untuk Preview environment, isi `NEXT_PUBLIC_SITE_URL` dengan URL `.vercel.app` agar canonical
  URL pratinjau tidak menunjuk domain produksi.

### Langkah 11 — Deployment pertama

Klik **Deploy**. Prosesnya ±2–3 menit. Anda akan melihat log build yang sama dengan
`npm run build` di komputer Anda.

Selesai → Vercel memberi URL seperti `https://artha-falah-utama.vercel.app`. Buka dan periksa.
Website Anda sudah online.

Alternatif lewat terminal, tanpa GitHub:

```bash
npm i -g vercel
vercel login
vercel            # deployment pratinjau
vercel --prod     # deployment produksi
```

Tetapi jalur GitHub lebih disarankan karena memberi deploy otomatis dan riwayat versi.

### Langkah 12 — Hubungkan custom domain

1. Di project Vercel: **Settings** → **Domains**.
2. Ketik `arthafalahutama.co.id`, klik **Add**.
3. Ketik lagi `www.arthafalahutama.co.id`, klik **Add**. Vercel otomatis menawarkan redirect ke
   domain utama — terima.

### Langkah 13 — Atur DNS

Vercel menampilkan record yang harus Anda buat. Masuk ke panel DNS registrar domain Anda
(Rumahweb/Niagahoster/Cloudflare/dll) dan tambahkan:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` | `76.76.21.21` | 3600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 3600 |

**Gunakan nilai yang ditampilkan dasbor Vercel Anda**, bukan angka di tabel ini, karena bisa
berbeda.

Hapus record `A` atau `CNAME` lama untuk `@` dan `www` agar tidak bentrok.

Periksa propagasi:

```bash
nslookup arthafalahutama.co.id
dig arthafalahutama.co.id +short
dig www.arthafalahutama.co.id CNAME +short
```

Biasanya 5–30 menit, maksimal 48 jam. Pantau di <https://dnschecker.org>.

### Langkah 14 — Aktifkan HTTPS

**Otomatis.** Begitu DNS terarah, Vercel menerbitkan sertifikat Let's Encrypt dan
memperbaruinya sendiri. Di **Settings** → **Domains** status berubah menjadi **Valid
Configuration** dengan ikon kunci.

`next.config.mjs` juga sudah memasang header HSTS, jadi browser akan mengunci akses ke HTTPS.

Verifikasi:

```bash
curl -I https://arthafalahutama.co.id
curl -I http://arthafalahutama.co.id     # harus membalas 307/308 ke https
```

### Langkah 15 — Testing website production

Setelah `NEXT_PUBLIC_SITE_URL` diarahkan ke domain final, jalankan redeploy sekali:
**Deployments** → deployment terbaru → titik tiga → **Redeploy**.

Lalu periksa dengan terminal:

```bash
for p in "" artha-labs activity contact sitemap.xml robots.txt; do
  echo -n "/$p -> "
  curl -s -o /dev/null -w "%{http_code}\n" https://arthafalahutama.co.id/$p
done
```

Semua harus `200`.

### Langkah 16 — Pastikan semua halaman dapat diakses

Buka manual di browser:

```
https://arthafalahutama.co.id/
https://arthafalahutama.co.id/artha-labs
https://arthafalahutama.co.id/artha-labs/reagen-placeholder-01
https://arthafalahutama.co.id/activity
https://arthafalahutama.co.id/contact
https://arthafalahutama.co.id/sitemap.xml
https://arthafalahutama.co.id/robots.txt
https://arthafalahutama.co.id/halaman-tidak-ada       → harus tampil halaman 404 rapi
```

Uji juga alur navigasi: klik semua tab navbar, klik kartu produk, tekan tombol **Minta
Penawaran** dan pastikan halaman kontak terbuka dengan subjek sudah terisi.

### Langkah 17 — Pastikan gambar tidak broken

Di browser: buka halaman, tekan F12 → tab **Network** → filter **Img** → refresh. Cari status
`404`. Idealnya tidak ada.

Cek cepat lewat terminal:

```bash
for i in 01 02 03 04 05 06 07 08 09; do
  echo -n "product-$i: "
  curl -s -o /dev/null -w "%{http_code}\n" \
    https://arthafalahutama.co.id/images/products/product-$i.png
done

for i in 01 02 03 04 05 06 07 08; do
  echo -n "brand-$i: "
  curl -s -o /dev/null -w "%{http_code}\n" \
    https://arthafalahutama.co.id/brands/brand-$i.png
done
```

Semua `200`. Kalau ada `404`, hampir pasti masalah huruf besar-kecil pada nama file — lihat
Bagian 8.4.

### Langkah 18 — Pastikan produk dan brand tampil benar

Di `/artha-labs`, periksa satu per satu:

```
[ ] Semua produk tampil di grid
[ ] Penghitung menampilkan jumlah yang benar ("Menampilkan 9 dari 9 produk")
[ ] Pencarian bekerja — coba ketik nama dan kode model
[ ] Filter kategori bekerja — Reagen, Alat Lab, Alat Kesehatan
[ ] Dropdown filter brand memuat semua brand yang punya produk
[ ] Gabungan pencarian + filter menghasilkan hasil yang benar
[ ] Chip filter aktif muncul dan bisa dihapus
[ ] Empty state muncul saat pencarian tidak menemukan apa pun
[ ] Marquee logo brand berjalan mulus tanpa jeda
[ ] Nama brand di kartu produk sesuai dengan brands.ts
```

Di halaman detail produk:

```
[ ] Breadcrumb benar
[ ] Tiga tab berpindah dengan benar, hanya panel aktif yang terlihat
[ ] Tabel spesifikasi terbaca rapi
[ ] Tombol Download Brochure hanya muncul bila brochureUrl terisi
[ ] PDF benar-benar terbuka bila tombolnya ada
[ ] Produk Terkait menampilkan produk yang relevan, bukan dirinya sendiri
```

### Langkah 19 — Testing responsive

F12 → ikon **Toggle device toolbar** (Ctrl+Shift+M). Uji lebar berikut:

| Lebar | Perangkat | Yang diperiksa |
| --- | --- | --- |
| 375 px | iPhone SE | Menu hamburger, tombol Filter, kartu satu kolom |
| 768 px | iPad | Grid dua kolom, panel filter |
| 1024 px | iPad Pro | Navbar penuh, grid tiga kolom |
| 1440 px | Desktop | Layout maksimal, foto proporsional |

Di setiap lebar pastikan **tidak ada scroll horizontal**. Uji cepat di Console:

```js
document.documentElement.scrollWidth > window.innerWidth
// harus false
```

Uji juga di ponsel sungguhan — emulator tidak menangkap semuanya.

### Langkah 20 — Testing formulir, kontak, dan WhatsApp

```
[ ] Kirim formulir dengan data benar → pesan sukses muncul
[ ] Email masuk ke CONTACT_TO_EMAIL (cek folder spam juga)
[ ] Tombol Reply di email mengarah ke email pengirim
[ ] Kirim formulir dengan email tidak valid → pesan error di bawah field
[ ] Kirim dengan pesan di bawah 10 karakter → ditolak
[ ] Kirim 6 kali cepat → kiriman ke-6 dibalas "Terlalu banyak percobaan"
[ ] Tombol WhatsApp membuka wa.me dengan nomor benar
[ ] Link telepon memicu panggilan di ponsel
[ ] Link email membuka aplikasi mail
[ ] Alamat dan jam kerja sesuai data asli
[ ] Peta tampil (bila NEXT_PUBLIC_MAPS_EMBED_SRC diisi)
```

Kalau formulir mengembalikan pesan "Layanan email belum dikonfigurasi", berarti env Resend belum
terbaca di Vercel — lihat Bagian 8.3.

### Final production check

```bash
# Header keamanan aktif
curl -sI https://arthafalahutama.co.id | grep -Ei "strict-transport|x-content-type|x-frame|referrer-policy"

# Sitemap memuat 14 URL (5 halaman + 9 produk)
curl -s https://arthafalahutama.co.id/sitemap.xml | grep -c "<loc>"

# robots.txt menunjuk sitemap yang benar
curl -s https://arthafalahutama.co.id/robots.txt

# Header X-Powered-By tidak ada (poweredByHeader: false)
curl -sI https://arthafalahutama.co.id | grep -i "x-powered-by" || echo "OK: header disembunyikan"
```

---

## 4. Setelah Website Online

### 4.1 Google Search Console (prioritas utama)

1. Buka <https://search.google.com/search-console>.
2. **Add property** → pilih **URL prefix** → masukkan `https://arthafalahutama.co.id`.
3. Verifikasi dengan metode **HTML tag**: salin nilai `content` dari meta tag yang diberikan.
4. Tambahkan ke `src/app/layout.tsx` di dalam objek `metadata`:

   ```ts
   verification: {
     google: "kode-verifikasi-dari-google",
   },
   ```

5. Commit, push, tunggu deploy, lalu klik **Verify**.
6. Masuk **Sitemaps** → masukkan `sitemap.xml` → **Submit**.
7. Gunakan **URL Inspection** → **Request Indexing** untuk halaman utama.

Pengindeksan biasanya 3–14 hari. Ini normal.

### 4.2 Google Analytics

1. Buat property di <https://analytics.google.com>.
2. Salin Measurement ID (format `G-XXXXXXXXXX`).
3. Isi di Vercel: **Settings** → **Environment Variables** → `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
4. **Redeploy** — wajib, karena variabel ini dibaca saat build.
5. Verifikasi di GA → **Reports** → **Realtime** sambil membuka website.

GA hanya dimuat bila variabel terisi, jadi website tidak jadi lambat saat variabel kosong.

### 4.3 Performance dan Lighthouse

Jalankan pada **URL produksi**, bukan localhost, dan dalam mode Incognito (ekstensi browser
merusak skor):

```bash
npx lighthouse https://arthafalahutama.co.id \
  --output html --output-path ./lighthouse-desktop.html --preset desktop

npx lighthouse https://arthafalahutama.co.id \
  --output html --output-path ./lighthouse-mobile.html
```

Target: Performance, Accessibility, Best Practices, dan SEO masing-masing **≥ 90**.

Bila Performance di bawah 90, penyebab tersering adalah gambar terlalu besar. Kompres ulang
foto produk agar di bawah 300 KB.

Periksa juga data pengguna nyata: **PageSpeed Insights** di <https://pagespeed.web.dev>.

### 4.4 Keamanan

```
[ ] Header keamanan aktif      — sudah dari next.config.mjs, verifikasi dengan curl di atas
[ ] Nilai A di securityheaders.com
[ ] .env.local tidak pernah masuk Git
[ ] Repository GitHub berstatus private
[ ] Aktifkan 2FA di GitHub, Vercel, dan Resend
[ ] Kunci Resend dibatasi izin "Sending access" saja
[ ] Aktifkan Dependabot alerts di GitHub (Settings > Code security)
```

Uji sekali:

```bash
curl -s https://securityheaders.com/?q=https://arthafalahutama.co.id -o /dev/null
# atau buka https://securityheaders.com di browser
```

### 4.5 Backup

Anda punya tiga lapisan otomatis:

1. **Git lokal** — seluruh riwayat ada di komputer Anda.
2. **GitHub** — salinan cloud.
3. **Vercel** — menyimpan setiap deployment; rollback satu klik.

Satu langkah manual yang disarankan: simpan arsip di luar ketiganya, sekali per kuartal.

```bash
cd ..
zip -r artha-falah-utama-backup-$(date +%Y%m%d).zip artha-falah-utama \
  -x "artha-falah-utama/node_modules/*" \
  -x "artha-falah-utama/.next/*" \
  -x "artha-falah-utama/.git/*"
```

Simpan hasilnya di Google Drive atau hard disk eksternal. Catat juga daftar env vars di pengelola
kata sandi — nilai ini **tidak** ada di Git.

### 4.6 Monitoring dan error tracking

| Kebutuhan | Alat | Biaya |
| --- | --- | --- |
| Website mati/hidup | UptimeRobot (cek tiap 5 menit, email bila mati) | Gratis |
| Error runtime | Vercel Logs (**Deployments** → **Functions** → **Logs**) | Termasuk |
| Error mendetail | Sentry | Gratis 5.000 error/bln |
| Statistik kunjungan | Google Analytics | Gratis |

Untuk company profile ini, **UptimeRobot + Vercel Logs sudah cukup**. Sentry baru relevan bila
nanti ada fitur interaktif yang lebih kompleks.

Setel UptimeRobot: buat monitor tipe HTTP(s), URL `https://arthafalahutama.co.id`, interval 5
menit, notifikasi ke email Anda.

### 4.7 Perpanjangan domain dan pengelolaan hosting

```
[ ] Aktifkan auto-renew domain di registrar
[ ] Pastikan kartu/metode pembayaran registrar masih berlaku
[ ] Catat tanggal kedaluwarsa domain di kalender + pengingat 30 hari sebelumnya
[ ] Simpan kredensial registrar, GitHub, Vercel, Resend di pengelola kata sandi
[ ] Catat email pemilik akun — jangan pakai email pribadi karyawan yang bisa berpindah
```

Domain kedaluwarsa adalah cara paling menyakitkan kehilangan website. Auto-renew wajib.

Rutinitas bulanan (10 menit):

```
[ ] Buka website, klik semua halaman
[ ] Kirim satu formulir uji, pastikan email masuk
[ ] Lihat Vercel > Usage, pastikan bandwidth masih dalam batas
[ ] Lihat Search Console > Pages, periksa error indexing
[ ] Jalankan npm outdated, catat dependency yang tertinggal
```

---

## 5. Workflow Update Setelah Production

### 5.0 Catatan sinkronisasi folder (September 2026)

Pada tahap ini ditemukan project punya DUA folder terpisah: `D:\Notion\artha-falah-utama`
(punya riwayat Git, terhubung ke `github.com/fiksxx/artha-falah-utama` dan Vercel, tapi isinya
versi lama/scaffold awal) dan `D:\Notion\website-arthalabs` (tempat seluruh revisi terbaru
dikerjakan - About, Activity, testimoni, konten Panduan, produk - tapi tidak punya Git sama
sekali). Sebelum redeploy revisi tersebut, kedua folder ini disatukan dengan memindahkan
folder `.git` dari `artha-falah-utama` ke `website-arthalabs`, lalu `website-arthalabs`
dijadikan satu-satunya folder kerja ke depannya (folder lama diarsipkan/dihapus setelah
dipastikan tersinkron). Perubahan lokal yang belum ter-commit di `artha-falah-utama` (alamat,
link maps, form kontak) sudah diverifikasi ikut terbawa di `website-arthalabs` sebelum
langkah ini dilakukan.

**Pelajaran untuk ke depan:** jangan bekerja di lebih dari satu folder untuk project yang
sama. Pastikan folder kerja SELALU folder yang punya `.git` dan remote yang benar
(`git remote -v`) sebelum memulai revisi apa pun.

### 5.1 Alur harian (perubahan kecil)

```
Edit data  →  npm run dev  →  typecheck  →  build  →  commit  →  push  →  Vercel deploy  →  verifikasi
```

Contoh nyata, menambah satu produk:

```bash
# 1. Tarik perubahan terbaru (bila ada orang lain yang ikut mengedit)
git pull

# 2. Simpan foto produk
cp ~/Downloads/foto-produk.jpg public/images/products/spektrofotometer-uv-vis.jpg

# 3. Edit data
code src/lib/data/products.ts

# 4. Periksa di browser
npm run dev
# buka http://localhost:3000/artha-labs, Ctrl+C untuk berhenti

# 5. Validasi
npm run typecheck
npm run build

# 6. Simpan ke Git
git add -A
git commit -m "produk: tambah spektrofotometer UV-1900i"

# 7. Kirim — Vercel otomatis deploy
git push

# 8. Tunggu 2-3 menit, lalu verifikasi
open https://arthafalahutama.co.id/artha-labs
```

### 5.2 Cara update tanpa merusak website live

Ada tiga lapisan pengaman. Gunakan sesuai risiko.

**Lapisan 1 — build lokal wajib.** `npm run build` adalah simulasi persis dari build Vercel.
Kalau lulus di komputer Anda, hampir pasti lulus di Vercel. Selalu jalankan sebelum push.

**Lapisan 2 — branch + preview URL** (disarankan untuk perubahan besar):

```bash
# Buat cabang terpisah
git checkout -b tambah-produk-november

# Kerjakan perubahan, lalu
git add -A
git commit -m "produk: tambah 12 produk baru"
git push -u origin tambah-produk-november
```

Vercel otomatis membuat URL pratinjau khusus untuk cabang ini, mis.
`https://artha-falah-utama-git-tambah-produk-xxx.vercel.app`. Domain resmi Anda **tidak
tersentuh**. Periksa pratinjau, tunjukkan ke rekan bila perlu. Kalau sudah yakin:

```bash
git checkout main
git merge tambah-produk-november
git push
git branch -d tambah-produk-november
```

**Lapisan 3 — rollback instan** bila sesuatu lolos ke produksi:

Cara tercepat (tanpa terminal): Vercel → **Deployments** → pilih deployment yang sebelumnya
sehat → titik tiga → **Promote to Production**. Website kembali normal dalam beberapa detik.

Cara Git:

```bash
git log --oneline -5           # temukan hash commit bermasalah
git revert <hash>
git push
```

`git revert` membuat commit baru yang membatalkan perubahan — lebih aman daripada `git reset`
karena riwayat tetap utuh.

### 5.3 Aturan praktis

| Aturan | Alasan |
| --- | --- |
| Jangan pernah push tanpa `npm run build` lulus | Mencegah build gagal di produksi |
| Satu commit = satu perubahan logis | Rollback jadi presisi |
| Pesan commit deskriptif | Enam bulan lagi Anda akan lupa |
| Jangan ubah `href` di `navItems` | Memutus URL yang sudah diindeks |
| Jangan ubah `name` produk yang sudah lama online | URL berubah, link lama mati |
| Deploy besar jangan di Jumat sore | Kalau ada masalah, tidak ada yang siaga |
| Selalu `git pull` sebelum mulai mengedit | Menghindari konflik |

---

## 6. Panduan Update Konten Berkala

| Kebutuhan | File | Setelah edit |
| --- | --- | --- |
| Tambah/ubah produk | `src/lib/data/products.ts` | commit → push |
| Tambah/ubah brand | `src/lib/data/brands.ts` + logo di `public/brands/` | commit → push |
| Tambah kategori | `src/types/index.ts` + `products.ts` | typecheck dulu |
| Tambah kegiatan | `src/lib/data/activities.ts` + foto | commit → push |
| Ganti nomor/alamat | `src/lib/site.ts` | commit → push |
| Ganti env var | Dasbor Vercel | **wajib redeploy** |
| Ganti gambar (nama sama) | timpa file di `public/` | commit → push |

Satu-satunya perubahan yang **tidak** cukup dengan push adalah environment variable — itu harus
diubah di dasbor Vercel lalu redeploy manual.

---

## 7. Troubleshooting

Format setiap masalah: **Penyebab → Cara mengecek → Solusi**.

### 7.1 `npm install` error

**Penyebab:** versi Node terlalu lama, cache npm rusak, koneksi internet terputus, atau
`node_modules` setengah terpasang.

**Cara mengecek:**

```bash
node -v          # harus >= v18.18.0
npm -v
npm ping         # menguji koneksi ke registry
```

**Solusi:**

```bash
# 1. Pasang ulang dari nol
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 2. Bila error EACCES / permission (macOS atau Linux)
sudo chown -R $(whoami) ~/.npm

# 3. Bila error peer dependency
npm install --legacy-peer-deps

# 4. Bila jaringan lambat/timeout
npm install --fetch-timeout=120000
```

Di Windows, jalankan terminal sebagai Administrator dan hindari folder yang disinkronkan OneDrive.

### 7.2 `npm run build` error

**Penyebab:** kesalahan tipe TypeScript, salah format data, atau import file yang tidak ada.

**Cara mengecek:** baca pesan error — selalu menyebut nama file dan nomor baris. Lalu jalankan
yang lebih spesifik:

```bash
npm run typecheck
```

**Solusi menurut jenis error:**

| Pesan | Solusi |
| --- | --- |
| `Type '"Alat lab"' is not assignable to type 'ProductCategory'` | Salah ejaan kategori. Harus `"Alat Lab"` tepat huruf besar-kecilnya |
| `Property 'foo' does not exist on type 'Product'` | Nama field salah atau belum ada di `src/types/index.ts` |
| `Module not found: Can't resolve '@/components/...'` | File tidak ada atau salah huruf besar-kecil. Cek: `ls src/components/layout/` |
| `',' expected` / `Unexpected token` | Koma atau kurung kurang. Periksa blok yang baru Anda edit |
| `Duplicate identifier` | Ada dua `id` produk yang sama |

Bersihkan cache bila error terasa tidak masuk akal:

```bash
rm -rf .next
npm run build
```

### 7.3 Environment variable tidak terbaca

**Penyebab:** file bernama salah, variabel belum didaftarkan di Vercel, belum redeploy setelah
menambahkan variabel, atau variabel `NEXT_PUBLIC_*` diubah tanpa build ulang.

**Cara mengecek:**

```bash
# Lokal: pastikan namanya .env.local, bukan .env.local.txt atau env.local
ls -la | grep env
cat .env.local
```

Di Vercel: **Settings** → **Environment Variables** → pastikan variabel ada **dan** environment
yang dipilih benar (Production/Preview/Development).

Uji dari sisi produksi:

```bash
curl -s -X POST https://arthafalahutama.co.id/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Uji Coba","email":"test@example.com","subject":"Tes","message":"Ini pesan pengujian minimal 10 karakter."}'
```

Jawaban `"Layanan email belum dikonfigurasi"` berarti `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`,
atau `CONTACT_TO_EMAIL` tidak terbaca.

**Solusi:**

1. Tambahkan/perbaiki variabel di dasbor Vercel.
2. **Redeploy** — langkah ini paling sering terlupa. **Deployments** → deployment terbaru →
   titik tiga → **Redeploy**.
3. Untuk lokal, restart `npm run dev` setiap kali `.env.local` diubah.
4. Ingat: variabel tanpa awalan `NEXT_PUBLIC_` hanya bisa dibaca di server (API route), bukan di
   komponen browser.

### 7.4 Gambar tidak muncul setelah deployment

**Penyebab paling umum:** perbedaan huruf besar-kecil. Windows dan macOS tidak membedakan
`Product-01.PNG` dan `product-01.png`, tetapi server Linux Vercel **membedakan**. Jadi gambar
yang tampil di komputer Anda bisa 404 di produksi.

Penyebab lain: path menyertakan kata `public`, file lupa di-commit, atau nama file berspasi.

**Cara mengecek:**

```bash
# Apakah file benar-benar terkirim ke Git?
git ls-files public/images/products/

# Uji langsung di produksi
curl -I https://arthafalahutama.co.id/images/products/product-01.png

# Cari nama file yang berisiko
find public -name "* *" -o -name "*[A-Z]*"

# Cari path yang salah menyertakan "public"
grep -rn '"/public/' src/
```

**Solusi:**

```bash
# 1. Path di kode HARUS tanpa "public"
#    Benar : "/images/products/foo.jpg"
#    Salah : "/public/images/products/foo.jpg"

# 2. Ganti nama file agar seluruhnya huruf kecil
cd public/images/products
for f in *; do mv "$f" "$(echo "$f" | tr 'A-Z' 'a-z' | tr ' ' '-')"; done

# 3. Bila Git tidak mendeteksi perubahan huruf besar-kecil
git mv Product-01.png temp.png
git mv temp.png product-01.png

# 4. Pastikan file benar-benar ikut ter-commit
git add public/
git commit -m "fix: normalisasi nama file gambar"
git push
```

### 7.5 Routing 404

**Penyebab:** Output Directory salah diisi di Vercel, slug produk berubah, atau URL memang tidak
ada.

**Cara mengecek:**

```bash
# Apakah halaman produk ter-generate saat build?
npm run build | grep artha-labs

# Slug apa saja yang valid?
grep -n "name:" src/lib/data/products.ts
```

Di Vercel: **Settings** → **Build & Development Settings** → **Output Directory** harus **kosong**
(atau `.next`).

**Solusi:**

1. Kosongkan Output Directory, lalu redeploy.
2. Slug dibuat dari `name`. Produk `"Reagen Placeholder 01"` →
   `/artha-labs/reagen-placeholder-01`. Kalau Anda mengubah nama produk, URL lamanya mati.
3. Bila URL lama sudah tersebar, buat redirect di `next.config.mjs`:

   ```js
   async redirects() {
     return [
       {
         source: "/artha-labs/nama-lama",
         destination: "/artha-labs/nama-baru",
         permanent: true,
       },
     ];
   },
   ```

### 7.6 Domain tidak terhubung

**Penyebab:** record DNS salah, ada record lama yang bentrok, atau DNS masih menyebar.

**Cara mengecek:**

```bash
dig arthafalahutama.co.id +short
dig www.arthafalahutama.co.id CNAME +short
nslookup arthafalahutama.co.id 8.8.8.8
```

Status di Vercel: **Settings** → **Domains**. Vercel menampilkan pesan spesifik seperti
"Invalid Configuration" beserta nilai yang seharusnya.

**Solusi:**

1. Cocokkan record DNS **persis** dengan yang ditampilkan Vercel.
2. Hapus record `A`, `AAAA`, atau `CNAME` lama untuk `@` dan `www`.
3. Bila memakai Cloudflare, setel proxy ke **DNS only** (ikon awan kelabu), bukan **Proxied**.
   Proxy Cloudflare di depan Vercel menyebabkan konflik sertifikat.
4. Tunggu. TTL 3600 berarti bisa sampai satu jam. Pantau di <https://dnschecker.org>.
5. Bersihkan cache DNS komputer Anda:

   ```bash
   sudo dscacheutil -flushcache                     # macOS
   ipconfig /flushdns                               # Windows
   sudo systemd-resolve --flush-caches              # Linux
   ```

### 7.7 SSL/HTTPS belum aktif

**Penyebab:** DNS belum sepenuhnya menyebar (Let's Encrypt harus bisa memverifikasi domain
lebih dulu), atau ada record CAA yang menghalangi.

**Cara mengecek:**

```bash
curl -vI https://arthafalahutama.co.id 2>&1 | grep -i "SSL\|certificate"
dig arthafalahutama.co.id CAA +short
```

**Solusi:**

1. Tunggu 10–60 menit setelah DNS benar. Penerbitan sertifikat otomatis.
2. Bila ada record CAA, tambahkan `letsencrypt.org`:

   ```
   Type: CAA   Name: @   Value: 0 issue "letsencrypt.org"
   ```

3. Bila masih gagal setelah 24 jam: hapus domain di Vercel, tambahkan kembali. Ini memicu
   penerbitan ulang.

### 7.8 API error (formulir kontak gagal)

**Penyebab:** env Resend belum lengkap, domain pengirim belum terverifikasi, atau kena rate limit.

**Cara mengecek:** Vercel → **Deployments** → pilih deployment → tab **Functions** → **Logs**.
Cari baris berawalan `[contact]`.

Kode status dan artinya:

| Status | Arti | Tindakan |
| --- | --- | --- |
| `415` | Content-Type bukan JSON | Biasanya bot; abaikan |
| `400` | Validasi gagal | Isian pengunjung tidak memenuhi syarat |
| `429` | Rate limit tercapai | Tunggu 10 menit |
| `500` | Env email belum lengkap | Lengkapi env, redeploy |
| `502` | Resend menolak | Cek dasbor Resend → Logs |

**Solusi:**

1. Pastikan ketiga env email terisi dan sudah redeploy.
2. Di Resend → **Domains**, status harus **Verified**. Domain `CONTACT_FROM_EMAIL` **harus**
   domain yang terverifikasi — tidak boleh Gmail atau Yahoo.
3. Cek Resend → **Logs** untuk melihat apakah email benar-benar terkirim.
4. Periksa folder spam penerima.
5. Uji manual dengan perintah `curl` di Bagian 7.3.

### 7.9 Website lambat

**Penyebab:** gambar terlalu besar, `<img>` biasa dipakai menggantikan `next/image`, atau font
tambahan.

**Cara mengecek:**

```bash
# Ukuran gambar terbesar
ls -lhS public/images/products/ | head
du -sh public/

# Skor Lighthouse
npx lighthouse https://arthafalahutama.co.id --output html --output-path ./lh.html
```

Di browser: F12 → **Network** → refresh → lihat kolom **Size**, urutkan dari terbesar.

**Solusi:**

1. Kompres gambar di atas 300 KB lewat <https://squoosh.app>.
2. Pastikan semua gambar memakai komponen `Image` dari `next/image`, bukan `<img>`:

   ```bash
   grep -rn "<img" src/
   ```

   Idealnya tidak ada hasil (kecuali di dalam string SVG).
3. `formats: ["image/avif", "image/webp"]` sudah aktif di `next.config.mjs` — jangan dihapus.
4. Jangan menambah font baru. Inter sudah dimuat efisien lewat `next/font`.

### 7.10 Deployment gagal

**Penyebab:** build error yang tidak muncul di lokal, dependency hilang dari `package.json`,
atau env var yang dibutuhkan saat build belum ada.

**Cara mengecek:** Vercel → **Deployments** → klik deployment merah → baca **Build Logs**.
Gulir ke baris error pertama, bukan yang terakhir.

**Solusi:**

```bash
# Reproduksi kondisi build Vercel secara persis
rm -rf node_modules .next
npm ci                # memakai package-lock.json, sama seperti Vercel
npm run build
```

Penyebab tersering: `package-lock.json` tidak ikut di-commit, atau dependency dipasang dengan
`--save-dev` padahal dibutuhkan saat build.

```bash
git ls-files package-lock.json    # harus muncul
```

### 7.11 Produk baru tidak muncul

**Penyebab:** file belum tersimpan, belum di-commit, `id` bertabrakan dengan produk lain, atau
deployment belum selesai.

**Cara mengecek:**

```bash
# Apakah produk benar-benar ada di file?
grep -n "Spektrofotometer" src/lib/data/products.ts

# Apakah perubahan sudah masuk Git?
git status
git log --oneline -3

# Apakah id-nya unik?
grep -o 'id: "product-[0-9]*"' src/lib/data/products.ts | sort | uniq -d
```

Perintah terakhir harus tidak mengeluarkan apa pun. Kalau ada keluaran, ada `id` ganda.

**Solusi:**

1. Simpan file, `git add -A`, `git commit`, `git push`.
2. Pastikan blok produk berada **di dalam** array `productSeeds`, bukan di luar `]`.
3. Pastikan `brandId` merujuk brand yang ada di `brands.ts` — kalau tidak, nama brand tampil
   sebagai kode id.
4. Tunggu deployment selesai (lihat Vercel → **Deployments**, status **Ready**).
5. Refresh keras di browser: `Ctrl+Shift+R` (Windows/Linux) atau `Cmd+Shift+R` (macOS).

### 7.12 Perubahan tidak terlihat di production

**Penyebab:** belum push, deployment masih berjalan, deployment gagal secara diam-diam, atau
cache browser.

**Cara mengecek:**

```bash
git log --oneline -1              # commit terakhir lokal
git log --oneline -1 origin/main  # commit terakhir yang sudah di GitHub
```

Kalau keduanya berbeda, Anda belum push.

Di Vercel: **Deployments** — apakah commit terbaru tercantum dan berstatus **Ready**?

**Solusi:**

```bash
git push
```

Lalu:

1. Tunggu status **Ready** (2–3 menit).
2. Refresh keras: `Ctrl+Shift+R`.
3. Uji di jendela Incognito — ini memastikan bukan masalah cache lokal.
4. Bandingkan dengan URL `.vercel.app`. Kalau di sana sudah benar tapi di domain belum, itu cache
   CDN atau proxy Cloudflare.

### 7.13 Masalah cache

**Penyebab:** halaman statis di-cache agresif di browser, CDN, atau proxy pihak ketiga.

**Cara mengecek:**

```bash
curl -sI https://arthafalahutama.co.id | grep -i "cache-control\|x-vercel-cache\|age"
```

`x-vercel-cache: HIT` berarti disajikan dari cache, `MISS` berarti baru dibuat.

**Solusi:**

1. Cache browser: `Ctrl+Shift+R`, atau F12 → **Network** → centang **Disable cache**.
2. Cache Vercel: setiap deployment baru otomatis membatalkan cache lama. Bila perlu paksa,
   redeploy dengan mencentang **Use existing Build Cache = off**.
3. Cloudflare (bila dipakai): **Caching** → **Purge Everything**.
4. Cache di sisi ISP/kantor: uji lewat data seluler untuk memastikan.

### 7.14 DNS belum propagate

**Penyebab:** TTL record lama belum kedaluwarsa; resolver di seluruh dunia butuh waktu
memperbarui.

**Cara mengecek:**

```bash
# Bandingkan beberapa resolver publik
dig @8.8.8.8 arthafalahutama.co.id +short      # Google
dig @1.1.1.1 arthafalahutama.co.id +short      # Cloudflare
dig @208.67.222.222 arthafalahutama.co.id +short  # OpenDNS
```

Atau buka <https://dnschecker.org> dan masukkan domain Anda — tampilan peta menunjukkan wilayah
mana yang sudah menerima pembaruan.

**Solusi:**

1. Tunggu. Umumnya 5–30 menit, maksimal 48 jam. Tidak ada cara mempercepat propagasi global.
2. Turunkan TTL menjadi 300 detik **sebelum** melakukan perubahan DNS berikutnya — ini membuat
   perubahan mendatang jauh lebih cepat.
3. Sementara menunggu, gunakan URL `.vercel.app` untuk pengujian dan demo.
4. Bersihkan cache DNS lokal (perintah di Bagian 7.6).

---

## 8. Master Checklist Sebelum Peluncuran Resmi

Centang satu per satu. Jangan lewati bagian mana pun.

### Content Ready

```
[ ] Visi perusahaan sudah teks asli (src/lib/data/about.ts)
[ ] Misi perusahaan sudah teks asli
[ ] Nilai perusahaan (values) sudah teks asli
[ ] Tahun berdiri benar (siteConfig.founded)
[ ] Deskripsi perusahaan menggambarkan bisnis sebenarnya
[ ] Daftar kegiatan berisi kegiatan yang benar-benar terjadi
[ ] Tidak ada satu pun kata "Placeholder" atau "Lorem" tersisa
[ ] Semua teks berbahasa Indonesia, terminologi konsisten
[ ] Label navbar sudah Bahasa Indonesia
```

Verifikasi cepat:

```bash
grep -rn -i "lorem\|placeholder" src/lib/data/ src/lib/site.ts
```

### Product Ready

```
[ ] Semua produk asli sudah masuk products.ts
[ ] Setiap produk punya nama sesuai katalog resmi
[ ] Setiap produk punya kode model (SKU) yang benar
[ ] Setiap produk punya kategori yang tepat
[ ] Setiap produk punya brandId yang valid
[ ] description informatif, bukan generik
[ ] Produk utama punya specifications lengkap
[ ] Semua id produk unik
[ ] Urutan produk sudah sesuai prioritas bisnis
[ ] Tombol Minta Penawaran berfungsi dari setiap produk
```

```bash
grep -o 'id: "product-[^"]*"' src/lib/data/products.ts | sort | uniq -d   # harus kosong
```

### Brand Ready

```
[ ] Semua brand asli sudah masuk brands.ts
[ ] Nama brand sesuai ejaan resmi prinsipal
[ ] Logo asli sudah ada di public/brands/
[ ] Semua id brand unik
[ ] Setiap brand punya minimal satu produk
[ ] Tidak ada brandId di produk yang tidak ada di brands.ts
[ ] Izin pemakaian logo sudah dikonfirmasi
[ ] Marquee brand berjalan mulus
```

### Image Ready

```
[ ] Semua foto produk asli terpasang
[ ] Semua logo brand asli terpasang
[ ] Foto kegiatan asli terpasang
[ ] Foto perusahaan terpasang (public/images/about/)
[ ] Photo frame di Artha Labs sudah diganti foto asli
[ ] Semua nama file huruf kecil, tanpa spasi
[ ] Semua file di bawah 300 KB
[ ] Setiap gambar punya imageAlt yang deskriptif
[ ] og-image.png sudah berisi branding asli
[ ] Favicon sudah logo asli (src/app/icon.png)
[ ] Brosur PDF (bila ada) tersimpan di public/brochures/
[ ] Tidak ada brochureUrl yang menunjuk file tidak ada
```

```bash
find public -name "* *" -o -name "*[A-Z]*"        # harus kosong
find public -size +300k                            # tinjau hasilnya
```

### Technical Ready

```
[ ] npm install lulus tanpa error
[ ] npm run typecheck lulus tanpa error
[ ] npm run lint lulus tanpa error
[ ] npm run build lulus tanpa error
[ ] npm run start berjalan dan halaman normal
[ ] Console browser bersih di semua halaman
[ ] Tidak ada scroll horizontal di 375 / 768 / 1024 / 1440 px
[ ] package-lock.json ter-commit
[ ] .env.local TIDAK ter-commit
[ ] git status bersih
[ ] Repository GitHub private dan terisi
```

### SEO Ready

```
[ ] Setiap halaman punya title unik
[ ] Setiap halaman punya description unik 120-160 karakter
[ ] NEXT_PUBLIC_SITE_URL menunjuk domain final
[ ] sitemap.xml bisa diakses dan memuat semua halaman
[ ] robots.txt bisa diakses dan menunjuk sitemap yang benar
[ ] og-image.png tampil benar saat link dibagikan
[ ] JSON-LD Organization berisi data kontak yang benar
[ ] Kode verifikasi Google Search Console terpasang
[ ] Sitemap sudah disubmit ke Search Console
[ ] Google Analytics aktif dan mencatat kunjungan
```

Uji tampilan saat dibagikan: <https://metatags.io> atau
<https://developers.facebook.com/tools/debug>.

### Domain Ready

```
[ ] Domain terdaftar atas nama perusahaan
[ ] Auto-renew aktif
[ ] Record A untuk @ sudah benar
[ ] Record CNAME untuk www sudah benar
[ ] www mengalihkan ke non-www (atau sebaliknya, konsisten)
[ ] DNS sudah propagate di beberapa resolver
[ ] Status domain di Vercel: Valid Configuration
[ ] Tanggal kedaluwarsa dicatat di kalender
```

### Hosting Ready

```
[ ] Project Vercel terhubung ke repository GitHub
[ ] Framework Preset terdeteksi Next.js
[ ] Build Command: npm run build
[ ] Output Directory: kosong
[ ] Semua environment variable terdaftar di Production
[ ] Deployment terakhir berstatus Ready
[ ] Auto-deploy dari branch main aktif
[ ] Notifikasi email deployment aktif
[ ] Anggota tim yang perlu akses sudah ditambahkan
```

### Security Ready

```
[ ] HTTPS aktif, http mengalihkan ke https
[ ] Header HSTS terkirim
[ ] X-Content-Type-Options, X-Frame-Options, Referrer-Policy terkirim
[ ] X-Powered-By tidak ada
[ ] Honeypot formulir berfungsi
[ ] Validasi server-side aktif (uji dengan data tidak valid)
[ ] Rate limit berfungsi (uji 6 kiriman cepat)
[ ] RESEND_API_KEY tidak pernah muncul di kode atau Git
[ ] 2FA aktif di GitHub, Vercel, Resend, registrar
[ ] Dependabot alerts aktif
```

```bash
curl -sI https://arthafalahutama.co.id | grep -Ei "strict-transport|x-content-type|x-frame|referrer"
```

### Testing Ready

```
[ ] Enam halaman utama bisa diakses (status 200)
[ ] Semua halaman detail produk bisa diakses
[ ] Halaman 404 tampil rapi untuk URL tidak ada
[ ] Tidak ada gambar broken di halaman mana pun
[ ] Pencarian produk berfungsi
[ ] Filter kategori berfungsi
[ ] Filter brand berfungsi
[ ] Empty state tampil saat hasil kosong
[ ] Tiga tab detail produk berpindah dengan benar
[ ] Produk Terkait relevan
[ ] Tombol Download Brochure hanya muncul bila file ada
[ ] Formulir kontak terkirim dan email masuk
[ ] Validasi formulir menolak input tidak valid
[ ] Tombol WhatsApp membuka nomor yang benar
[ ] Link email dan telepon berfungsi
[ ] Peta lokasi tampil (bila dikonfigurasi)
[ ] Diuji di Chrome, Safari, Firefox, dan Edge
[ ] Diuji di ponsel Android dan iOS sungguhan
[ ] Navigasi keyboard berfungsi (Tab, Enter, Esc)
[ ] Skip link berfungsi
```

### Production Ready

```
[ ] Lighthouse Performance >= 90 (mobile & desktop)
[ ] Lighthouse Accessibility >= 90
[ ] Lighthouse Best Practices >= 90
[ ] Lighthouse SEO >= 90
[ ] Halaman utama memuat di bawah 3 detik pada 4G
[ ] Monitoring uptime aktif (UptimeRobot)
[ ] Backup arsip tersimpan di luar Git
[ ] Env vars tercatat di pengelola kata sandi
[ ] Kredensial semua layanan tercatat
[ ] Dokumen panduan ini tersimpan dan bisa diakses
[ ] Alur update sudah dilatih sekali dari awal sampai akhir
[ ] Rollback sudah dicoba sekali agar Anda tahu caranya
[ ] Kebijakan Privasi tersedia (disarankan)
[ ] Pihak internal sudah meninjau dan menyetujui isi website
```

---

## 9. Ringkasan Perintah

Simpan bagian ini — 90% pekerjaan Anda hanya butuh perintah di bawah.

```bash
# --- Persiapan sekali saja -----------------------------------
npm install                       # pasang dependency
cp .env.example .env.local        # siapkan env lokal

# --- Pengembangan sehari-hari --------------------------------
npm run dev                       # jalankan di localhost:3000
npm run typecheck                 # periksa format data
npm run lint                      # periksa kualitas kode
npm run build                     # uji build produksi
npm run start                     # jalankan hasil build

# --- Menyimpan & menerbitkan --------------------------------
git status                        # lihat apa yang berubah
git add -A                        # tandai semua perubahan
git commit -m "pesan jelas"       # simpan
git push                          # terbitkan (Vercel deploy otomatis)

# --- Perubahan besar dengan aman ----------------------------
git checkout -b nama-cabang       # kerjakan di cabang terpisah
git push -u origin nama-cabang    # dapatkan URL pratinjau
git checkout main && git merge nama-cabang && git push

# --- Bila ada masalah ---------------------------------------
rm -rf node_modules .next && npm ci && npm run build   # bangun ulang bersih
git log --oneline -5                                   # lihat riwayat
git revert <hash> && git push                          # batalkan perubahan

# --- Verifikasi produksi ------------------------------------
curl -sI https://arthafalahutama.co.id
curl -s https://arthafalahutama.co.id/sitemap.xml | grep -c "<loc>"
npx lighthouse https://arthafalahutama.co.id --output html --output-path ./lh.html
```

---

## 10. Urutan Kerja yang Disarankan

```
Minggu 1  — Persiapan konten
  [ ] Kumpulkan data produk asli (nama, model, spesifikasi)
  [ ] Kumpulkan nama brand + logo resmi
  [ ] Foto produk, kompres di bawah 300 KB
  [ ] Finalkan logo dan favicon
  [ ] Kumpulkan data kontak & sosial media yang benar

Minggu 2  — Pengisian konten
  [ ] Isi src/lib/site.ts (kontak, sosial, navbar)
  [ ] Isi src/lib/data/brands.ts + unggah logo
  [ ] Isi src/lib/data/products.ts + unggah foto
  [ ] Isi about.ts dan activities.ts
  [ ] npm run dev, periksa semua halaman
  [ ] npm run typecheck && npm run build

Minggu 3  — Deployment
  [ ] Daftar Resend, verifikasi domain
  [ ] Push ke GitHub
  [ ] Import ke Vercel, isi env vars
  [ ] Deployment pertama, uji di URL .vercel.app
  [ ] Hubungkan domain, atur DNS
  [ ] Tunggu HTTPS aktif

Minggu 4  — Testing & peluncuran
  [ ] Kerjakan Master Checklist Bagian 8
  [ ] Google Search Console + submit sitemap
  [ ] Google Analytics
  [ ] Lighthouse, perbaiki bila di bawah 90
  [ ] UptimeRobot
  [ ] Umumkan peluncuran
```

Jadwal ini realistis. Bagian yang paling lama bukan teknis, melainkan mengumpulkan data produk
dan foto asli dari prinsipal.

---

Dokumen terkait: `docs/PANDUAN-KONTEN.md` (pengelolaan konten),
`docs/QA-CHECKLIST.md` (pengujian rinci per fitur).
