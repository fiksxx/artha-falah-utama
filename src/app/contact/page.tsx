import { Suspense } from "react";

import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo, MapEmbed } from "@/components/sections/ContactInfo";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { WhatsappIcon } from "@/components/ui/icons";
import { CONTACT_FORM_ANCHOR } from "@/lib/quote";
import { createPageMetadata, jsonLdScript, pageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/** Dipakai meta description dan JSON-LD halaman agar keduanya selalu sama. */
const PAGE_DESCRIPTION =
  "Hubungi CV Artha Falah Utama untuk permintaan penawaran, pertanyaan teknis, maupun kebutuhan pengadaan. Kirim pesan lewat formulir, email, telepon, atau WhatsApp.";

export const metadata = createPageMetadata({
  title: "Hubungi Kami",
  description: PAGE_DESCRIPTION,
  path: "/contact",
  keywords: ["kontak", "penawaran", "konsultasi", "whatsapp"],
});

export default function ContactPage() {
  const pageSchema = pageJsonLd({
    type: "ContactPage",
    path: "/contact",
    // Sama dengan teks H1 halaman ini.
    name: "Sampaikan kebutuhan Anda",
    description: PAGE_DESCRIPTION,
  });

  return (
    <>
      {/* Jenis halaman untuk mesin pencari (Tahap S4) - tidak menampilkan apa pun. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(pageSchema) }}
      />

      <PageHero
        eyebrow="Kontak"
        textWidth="wide"
        title="Sampaikan kebutuhan Anda"
        description="Permintaan penawaran, pertanyaan teknis soal produk, atau kebutuhan pengadaan, semuanya bisa dikirim lewat halaman ini. Kami biasanya membalas dalam 1-2 hari kerja."
        actions={
          <>
            <Button href={`#${CONTACT_FORM_ANCHOR}`} variant="accent" size="lg">
              Kirim pesan
            </Button>
            <Button
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
              variant="inverted"
              size="lg"
            >
              <WhatsappIcon aria-hidden="true" width={18} height={18} />
              Chat WhatsApp
            </Button>
          </>
        }
      />

      <Section width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Anchor #contact-form: dipakai CTA "Minta Penawaran" agar form langsung terlihat */}
          <div id={CONTACT_FORM_ANCHOR} className="scroll-mt-28 lg:col-span-7">
            <SectionHeading title="Kirim pesan" />
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
        <SectionHeading title="Lokasi kantor" />
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
