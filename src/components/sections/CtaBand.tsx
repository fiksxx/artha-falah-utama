import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { WhatsappIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site";

/**
 * Pita ajakan menghubungi tim (Tahap R2).
 * Teksnya sudah tampil di situs: judul dan keterangan waktu balasan dari
 * halaman Kontak. Kedua tombol menuju tujuan yang sama dengan halaman itu.
 */
export function CtaBand() {
  return (
    <Section id="hubungi" spacing="md" width="wide" className="pt-0 lg:pt-0">
      <Reveal className="flex flex-col gap-8 rounded-2xl bg-brand-900 p-7 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-12">
        <div>
          <h2 className="text-[clamp(1.5rem,1.2rem+0.95vw,2.125rem)] font-semibold leading-[1.18] tracking-[-0.02em] text-white">
            Sampaikan kebutuhan Anda
          </h2>
          <p className="mt-3 max-w-content text-base leading-relaxed text-white/85">
            Kirim permintaan penawaran atau pertanyaan teknis kepada tim kami. Kami biasanya
            membalas dalam 1-2 hari kerja.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button href="/contact" variant="accent" size="lg">
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
        </div>
      </Reveal>
    </Section>
  );
}
