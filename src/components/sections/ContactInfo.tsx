import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsappIcon,
} from "@/components/ui/icons";
import { siteConfig, socialLinks } from "@/lib/site";
import type { SocialIcon } from "@/types";

const socialIconMap: Record<SocialIcon, typeof MailIcon> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
  mail: MailIcon,
  facebook: FacebookIcon,
};

/** Kartu info kontak: alamat, email, telepon, WhatsApp, jam operasional, sosial media. */
export function ContactInfo() {
  const { contact } = siteConfig;

  return (
    <div className="rounded-xl border border-line bg-surface-muted p-6 lg:p-8">
      <h2 className="text-heading font-bold text-brand-900">Informasi Kontak</h2>
      <ul className="mt-6 space-y-5 text-sm">
        <li className="flex gap-3">
          <MapPinIcon className="mt-0.5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-ink">Alamat kantor</p>
            {/* TODO: ganti dengan konten asli */}
            <address className="mt-1 not-italic leading-relaxed text-ink-muted">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </li>

        <li className="flex gap-3">
          <MailIcon className="mt-0.5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-ink">Email</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-1 inline-block text-ink-muted underline-offset-4 hover:text-brand-700 hover:underline"
            >
              {contact.email}
            </a>
          </div>
        </li>

        <li className="flex gap-3">
          <PhoneIcon className="mt-0.5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-ink">Telepon</p>
            <a
              href={`tel:${contact.phoneHref}`}
              className="mt-1 inline-block text-ink-muted underline-offset-4 hover:text-brand-700 hover:underline"
            >
              {contact.phoneDisplay}
            </a>
          </div>
        </li>

        <li className="flex gap-3">
          <WhatsappIcon className="mt-0.5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-ink">WhatsApp</p>
            <a
              href={`https://wa.me/${contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-ink-muted underline-offset-4 hover:text-brand-700 hover:underline"
            >
              {contact.whatsappDisplay}
            </a>
          </div>
        </li>

        <li className="flex gap-3">
          <ClockIcon className="mt-0.5 shrink-0 text-brand-600" />
          <div>
            <p className="font-semibold text-ink">Jam operasional</p>
            <p className="mt-1 text-ink-muted">{contact.officeHours}</p>
          </div>
        </li>
      </ul>

      <div className="mt-7 border-t border-line pt-6">
        <p className="text-sm font-semibold text-ink">Media sosial</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {socialLinks.map((social) => {
            const Icon = socialIconMap[social.icon];
            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-11 w-11 place-items-center rounded-lg border border-line-strong bg-surface text-ink-muted transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icon />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Embed Google Maps - hanya tampil jika NEXT_PUBLIC_MAPS_EMBED_SRC diisi. */
export function MapEmbed() {
  const src = siteConfig.contact.mapsEmbedSrc;

  if (!src) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface-muted p-8 text-center">
        {/* TODO: ganti dengan konten asli - isi NEXT_PUBLIC_MAPS_EMBED_SRC di .env.local */}
        <MapPinIcon className="text-ink-subtle" />
        <p className="mt-3 text-sm font-semibold text-ink">Peta lokasi belum dikonfigurasi</p>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">
          Isi variabel NEXT_PUBLIC_MAPS_EMBED_SRC dengan URL embed Google Maps untuk menampilkan
          peta kantor di sini.
        </p>
        <a
          href={siteConfig.contact.mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm font-semibold text-brand-700 underline underline-offset-4"
        >
          Buka di Google Maps
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <iframe
        src={src}
        title={`Peta lokasi ${siteConfig.name}`}
        width="100%"
        height="420"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-[420px] w-full border-0"
      />
    </div>
  );
}
