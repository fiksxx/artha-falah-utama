import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";

/** Skeleton halaman artikel - mengikuti struktur header (teks | sampul) & isi aslinya. */
export default function ActivityDetailLoading() {
  return (
    <>
      <section aria-hidden="true" className="relative overflow-hidden bg-brand-950">
        <div className="divider-gold absolute inset-x-0 bottom-0 h-px" />
        <Container width="wide" className="relative py-10 lg:py-14">
          <div className="flex items-center justify-between gap-6">
            <div className="h-4 w-48 animate-pulse rounded bg-white/15" />
            <div className="hidden h-4 w-36 animate-pulse rounded bg-white/15 sm:block" />
          </div>
          <div className="mt-6 grid items-center gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="h-3.5 w-24 animate-pulse rounded bg-white/15" />
              <div className="mt-5 space-y-3">
                <div className="h-9 w-full animate-pulse rounded bg-white/15" />
                <div className="h-9 w-3/5 animate-pulse rounded bg-white/15" />
              </div>
              <div className="mt-6 h-1 w-16 animate-pulse rounded-full bg-white/15" />
              <div className="mt-6 space-y-2.5">
                <div className="h-3.5 w-full animate-pulse rounded bg-white/10" />
                <div className="h-3.5 w-4/5 animate-pulse rounded bg-white/10" />
              </div>
              <div className="mt-8 h-10 w-64 animate-pulse rounded bg-white/10" />
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-white/10 lg:aspect-[4/3]" />
            </div>
          </div>
        </Container>
      </section>

      <Section width="wide">
        <div aria-hidden="true" className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <div className="max-w-content space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-3.5 w-full animate-pulse rounded bg-surface-strong" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-56 w-full animate-pulse rounded-xl bg-surface-strong" />
          </div>
        </div>
        <p className="sr-only" role="status">
          Memuat tulisan...
        </p>
      </Section>
    </>
  );
}
