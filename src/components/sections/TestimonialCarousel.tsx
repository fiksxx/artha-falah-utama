import { LoopCarousel } from "@/components/sections/LoopCarousel";
import { StarIcon } from "@/components/ui/icons";
import { testimonials } from "@/lib/data/testimonials";
import type { Testimonial } from "@/types";

/** Setiap 4 detik carousel bergeser satu kartu (gerakannya sendiri berlangsung sekitar 0,9 detik). */
const INTERVAL_MS = 4000;

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const stars = Math.min(5, Math.max(0, Math.round(testimonial.rating)));

  return (
    <figure className="flex h-full flex-col rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6">
      {/* Rating: bintang + angka (mis. 4.9). Angka mengikuti data testimoni. */}
      <div className="flex items-center gap-2">
        <div
          role="img"
          aria-label={`Rating ${testimonial.rating.toFixed(1)} dari 5`}
          className="flex gap-0.5 text-accent-400"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              width={16}
              height={16}
              className={star <= stars ? undefined : "text-line-strong"}
            />
          ))}
        </div>
        <span className="text-sm font-semibold tabular-nums text-ink">
          {testimonial.rating.toFixed(1)}
        </span>
      </div>

      <blockquote className="mt-4 flex-1">
        <p className="text-sm leading-relaxed text-ink-muted">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </blockquote>

      <figcaption className="mt-5 border-t border-line pt-4">
        <span className="block text-sm font-semibold text-ink">{testimonial.name}</span>
        {testimonial.organization ? (
          <span className="mt-0.5 block text-xs text-ink-subtle">{testimonial.organization}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * Carousel Testimoni - 3 kartu terlihat sekaligus (1 di ponsel), bergeser satu kartu
 * setiap 4 detik dan terus maju ke kiri sesuai urutan data, lalu kembali ke awal.
 *
 * Datanya HANYA dari lib/data/testimonials.ts dan urutan tampil = urutan array. State
 * dan timer berada di instance LoopCarousel ini sendiri, terpisah dari carousel
 * Activity. Tinggi kartu seragam (mengikuti kutipan terpanjang), jadi tidak ada
 * lompatan tata letak saat bergeser. Yang ditampilkan: rating, kutipan, nama, dan
 * instansi - tanpa jabatan.
 */
export function TestimonialCarousel() {
  if (testimonials.length === 0) return null;

  return (
    <LoopCarousel
      label="Testimoni pelanggan"
      slides={testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
      visibleWide={3}
      mode="loop"
      intervalMs={INTERVAL_MS}
      transitionMs={900}
    />
  );
}
