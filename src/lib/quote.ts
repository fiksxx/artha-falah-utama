import { getProductBySlug } from "@/lib/data/products";
import type { Product } from "@/types";

/** Nama query parameter alur Request for Quotation (dipakai link & form). */
export const QUOTE_PARAMS = { product: "product", category: "category" } as const;

/** Anchor formulir kontak - dipakai agar user langsung melihat form setelah redirect. */
export const CONTACT_FORM_ANCHOR = "contact-form";

/**
 * Link "Minta penawaran" untuk satu produk.
 * Satu logic untuk semua produk (10, 50, atau 100 produk tetap sama).
 */
export function quoteHref(product: Pick<Product, "slug" | "category">) {
  const params = new URLSearchParams({
    [QUOTE_PARAMS.product]: product.slug,
    [QUOTE_PARAMS.category]: product.category,
  });

  return `/contact?${params.toString()}#${CONTACT_FORM_ANCHOR}`;
}

/** Susun subjek & pesan default permintaan penawaran. */
export function buildQuotePrefill(productName: string, category?: string) {
  return {
    subject: category
      ? `Permintaan Penawaran \u2014 ${category}`
      : "Permintaan Penawaran",
    message: `Berikan saya penawaran terkait produk ${productName}`,
  };
}

export type QuoteRequest = {
  productName: string;
  category?: string;
  subject: string;
  message: string;
  /** true bila slug cocok dengan produk yang ada di katalog. */
  matched: boolean;
};

/** Ubah slug jadi label terbaca bila produk tidak ditemukan di katalog. */
const humanize = (slug: string) =>
  slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Baca parameter URL menjadi data prefill form.
 * Mengembalikan null bila tidak ada parameter produk, sehingga Contact Us tetap
 * bekerja normal (form kosong) saat dibuka tanpa parameter.
 */
export function resolveQuoteRequest(
  productParam?: string | null,
  categoryParam?: string | null,
): QuoteRequest | null {
  const rawProduct = (productParam ?? "").trim().slice(0, 120);
  if (!rawProduct) return null;

  const product = getProductBySlug(rawProduct.toLowerCase());
  const productName = product ? product.name : humanize(rawProduct);
  const category =
    product?.category ?? ((categoryParam ?? "").trim().slice(0, 60) || undefined);

  return {
    productName,
    category,
    matched: Boolean(product),
    ...buildQuotePrefill(productName, category),
  };
}
