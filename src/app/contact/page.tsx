import { Suspense } from "react";

import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo, MapEmbed } from "@/components/sections/ContactInfo";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { CONTACT_FORM_ANCHOR } from "@/lib/quote";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Hubungi Kami",
  description:
    "Hubungi CV Artha Falah Utama untuk penawaran, konsultasi teknis, maupun kerja sama. Kirim pesan lewat formulir, email, telepon, atau WhatsApp.",
  path: "/contact",
  keywords: ["kontak", "penawaran", "konsultasi", "whatsapp"],
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Hubungi Kami"
        title="Mari bicarakan kebutuhan Anda"
        description="Isi formulir di bawah atau hubungi kami langsung — tim kami merespons pada jam kerja."
      />

      <Section width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Anchor #contact-form: dipakai CTA "Minta Penawaran" agar form langsung terlihat */}
          <div id={CONTACT_FORM_ANCHOR} className="scroll-mt-28 lg:col-span-7">
            <h2 className="text-heading font-bold uppercase tracking-[0.08em] text-brand-900">
              Formulir
            </h2>
            <span aria-hidden="true" className="mt-3 block h-1 w-12 rounded-full bg-accent-400" />
            <div className="mt-8">
              {/* Suspense: form membaca query parameter produk lewat useSearchParams */}
              <Suspense fallback={<FormSkeleton />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ContactInfo />
          </div>
        </div>
      </Section>

      <Section tone="muted" width="wide" spacing="sm">
        <h2 className="text-heading font-bold text-brand-900">Lokasi Kantor</h2>
        <span aria-hidden="true" className="mt-3 block h-1 w-12 rounded-full bg-accent-400" />
        <div className="mt-8">
          <MapEmbed />
        </div>
      </Section>
    </>
  );
}

/** Skeleton form saat parameter produk dibaca di klien. */
function FormSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="h-[86px] animate-pulse rounded-lg bg-surface-strong" />
        <div className="h-[86px] animate-pulse rounded-lg bg-surface-strong" />
      </div>
      <div className="h-[86px] animate-pulse rounded-lg bg-surface-strong" />
      <div className="h-[188px] animate-pulse rounded-lg bg-surface-strong" />
      <div className="h-12 w-40 animate-pulse rounded-lg bg-surface-strong" />
    </div>
  );
}
