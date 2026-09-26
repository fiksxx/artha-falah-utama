import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  description: "Halaman yang Anda cari tidak tersedia.",
  // Tahap 5D: putuskan warisan metadata beranda dari layout. Halaman 404 tidak
  // boleh ber-canonical ke beranda atau memakai pratinjau sosial beranda.
  // robots: null menghapus "index, follow" warisan layout; Next.js sendiri
  // menambahkan tepat satu <meta name="robots" content="noindex"> di halaman 404.
  robots: null,
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Error 404</p>
      <h1 className="mt-4 text-display">Halaman tidak ditemukan</h1>
      <p className="mt-4 max-w-content text-ink-muted">
        Tautan yang Anda buka mungkin sudah dipindahkan atau tidak pernah ada.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Kembali ke About</Button>
        <Button href="/contact" variant="secondary">
          Hubungi kami
        </Button>
      </div>
    </Container>
  );
}
