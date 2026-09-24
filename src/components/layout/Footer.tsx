import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
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
import { navItems, siteConfig, socialLinks } from "@/lib/site";
import type { SocialIcon } from "@/types";

const socialIconMap: Record<SocialIcon, typeof MailIcon> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  whatsapp: WhatsappIcon,
  mail: MailIcon,
  facebook: FacebookIcon,
};

const { contact } = siteConfig;

/** Heading kolom footer: uppercase kecil gold + garis aksen emas. */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
      {children}
      <span aria-hidden="true" className="mt-2.5 block h-px w-9 bg-accent-400" />
    </h2>
  );
}

const linkClass =
  "inline-flex text-sm text-white/70 transition-colors duration-200 hover:text-accent-300 focus-visible:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-brand-deep mt-auto text-white/70">
      {/* Garis aksen hijau -> emas sebagai pembuka footer */}
      <div aria-hidden="true" className="rule-accent h-0.5 w-full" />

      <Container width="wide" className="py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Kolom 1 - Company */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Logo tone="dark" />
            <p className="mt-4 text-sm font-semibold text-white">{siteConfig.legalName}</p>
            {/* Satu kalimat konteks: pengunjung yang mendarat langsung di footer
                tetap tahu perusahaan ini bergerak di bidang apa. */}
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">
              {siteConfig.tagline}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} ${siteConfig.shortName}`}
                      className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 bg-white/5 text-white/80 transition-all duration-200 ease-smooth hover:border-accent-400/60 hover:bg-accent-400/10 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950"
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Kolom 2 - Navigation */}
          <nav aria-label="Navigasi footer" className="lg:col-span-3">
            <ColumnHeading>Navigasi</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Kolom 3 - Contact (memakai data yang sudah ada di lib/site.ts) */}
          <div className="lg:col-span-4">
            <ColumnHeading>Kontak</ColumnHeading>
            {/* TODO: ganti dengan konten asli */}
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MailIcon aria-hidden="true" className="mt-0.5 shrink-0 text-accent-400" />
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <PhoneIcon aria-hidden="true" className="mt-0.5 shrink-0 text-accent-400" />
                <a href={`tel:${contact.phoneHref}`} className={linkClass}>
                  {contact.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <WhatsappIcon aria-hidden="true" className="mt-0.5 shrink-0 text-accent-400" />
                <a
                  href={`https://wa.me/${contact.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {contact.whatsappDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPinIcon aria-hidden="true" className="mt-0.5 shrink-0 text-accent-400" />
                <address className="not-italic text-white/70">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <ClockIcon aria-hidden="true" className="mt-0.5 shrink-0 text-accent-400" />
                <span className="text-white/70">{contact.officeHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <Container
          width="wide"
          className="py-6 text-xs text-white/55"
        >
          <p>
            &copy; {year} {siteConfig.legalName}. All Rights Reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
