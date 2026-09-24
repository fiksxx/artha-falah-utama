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

const DEFAULT_MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16278081.630689578!2d102.40425322906611!3d-5.080880444271725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d95bb00298e3e0f%3A0x4b9006f68c024804!2sCV%20Artha%20Falah%20Utama!5e0!3m2!1sid!2sid!4v1789794478170!5m2!1sid!2sid";

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

/** Embed Google Maps */
export function MapEmbed() {
  const src =
    process.env.NEXT_PUBLIC_MAPS_EMBED_SRC ||
    siteConfig.contact.mapsEmbedSrc ||
    DEFAULT_MAPS_EMBED_SRC;

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