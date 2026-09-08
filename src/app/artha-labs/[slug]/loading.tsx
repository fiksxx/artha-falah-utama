import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";

/** Skeleton halaman detail produk - mengikuti struktur header & section aslinya. */
export default function ProductDetailLoading() {
  return (
    <>
      <section aria-hidden="true" className="relative overflow-hidden bg-brand-900">
        <div className="divider-gold absolute inset-x-0 bottom-0 h-px" />
        <Container width="wide" className="relative py-10 lg:py-14">
          <div className="h-4 w-48 animate-pulse rounded bg-white/15" />
          <div className="mt-5 h-4 w-36 animate-pulse rounded bg-white/15" />
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-white/10" />
            </div>
            <div className="lg:col-span-6">
              <div className="h-6 w-28 animate-pulse rounded-full bg-white/15" />
              <div className="mt-4 h-9 w-4/5 animate-pulse rounded bg-white/15" />
              <div className="mt-3 h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-5 space-y-2.5">
                <div className="h-3.5 w-full animate-pulse rounded bg-white/10" />
                <div className="h-3.5 w-11/12 animate-pulse rounded bg-white/10" />
              </div>
              <div className="mt-8 flex gap-3">
                <div className="h-12 w-44 animate-pulse rounded-lg bg-white/20" />
                <div className="h-12 w-36 animate-pulse rounded-lg bg-white/10" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section width="wide">
        <div aria-hidden="true" className="max-w-content">
          <div className="h-3 w-16 animate-pulse rounded bg-surface-strong" />
          <div className="mt-4 h-7 w-64 animate-pulse rounded bg-surface-strong" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-3.5 w-full animate-pulse rounded bg-surface-strong" />
            ))}
          </div>
        </div>
        <p className="sr-only" role="status">
          Memuat detail produk...
        </p>
      </Section>
    </>
  );
}
