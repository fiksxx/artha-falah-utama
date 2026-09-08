import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SearchIcon } from "@/components/ui/icons";

/** Produk tidak ditemukan - pesan ramah, bukan error teknis. */
export default function ProductNotFound() {
  return (
    <Section width="narrow" spacing="lg">
      <div className="rounded-xl border border-line bg-surface px-6 py-14 text-center shadow-card">
        <span
          aria-hidden="true"
          className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700"
        >
          <SearchIcon />
        </span>
        <h1 className="mt-5 text-display">Product Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-muted">
          Produk yang Anda cari tidak tersedia di katalog Artha Labs, atau tautannya sudah berubah.
          Silakan kembali ke katalog untuk menelusuri produk lain.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/artha-labs#katalog" size="lg">
            Back to Artha Labs
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Hubungi kami
          </Button>
        </div>
      </div>
    </Section>
  );
}
