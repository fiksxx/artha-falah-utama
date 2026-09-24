import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ActivityCard } from "@/components/sections/ActivityCard";
import { ActivityHeader } from "@/components/sections/ActivityHeader";
import { ArticleBody, extractHeadings } from "@/components/sections/ArticleBody";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { LinkedinIcon, MailIcon, WhatsappIcon } from "@/components/ui/icons";
import { withActivityImages } from "@/lib/activity-images";
import {
  activities,
  getActivityBySlug,
  getRelatedActivities,
} from "@/lib/data/activities";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import type { Activity } from "@/types";

/**
 * Gambar sampul dilengkapi di sini (Server Component - fs), berdasarkan posisi
 * entri pada `activities` PENUH, agar penomorannya sama dengan halaman daftar
 * /activity. Lihat src/lib/activity-images.ts.
 */
function activityImagesById(): Map<string, Activity> {
  return new Map(withActivityImages(activities).map((item) => [item.id, item]));
}

type ActivityPageProps = {
  params: Promise<{ slug: string }>;
};

/** Seluruh halaman artikel dibuat otomatis dari data - tidak ada halaman hardcoded. */
export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = getActivityBySlug(slug);

  if (!found) {
    return createPageMetadata({
      title: "Tulisan tidak ditemukan",
      description: "Tulisan yang Anda cari tidak tersedia di halaman Activity.",
      path: `/activity/${slug}`,
    });
  }

  const activity = activityImagesById().get(found.id) ?? found;

  return createPageMetadata({
    title: activity.title,
    description: activity.excerpt,
    path: `/activity/${activity.slug}`,
    image: activity.image,
    keywords: activity.tags,
    type: "article",
    publishedTime: activity.date,
  });
}

export default async function ActivityDetailPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const found = getActivityBySlug(slug);

  if (!found) notFound();

  const byId = activityImagesById();
  const activity = byId.get(found.id) ?? found;
  const body = activity.body ?? [];
  const headings = extractHeadings(body);
  const related = getRelatedActivities(activity).map((item) => byId.get(item.id) ?? item);
  const url = `${siteConfig.url}/activity/${activity.slug}`;

  /** Daftar isi hanya berguna bila artikelnya memang panjang. */
  const showTableOfContents = headings.length >= 3;

  /** Structured data artikel - hanya field yang datanya benar-benar tersedia. */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: activity.title,
    description: activity.excerpt,
    datePublished: activity.date,
    // Tanpa foto sampul, field image dihilangkan - lebih baik kosong daripada menunjuk ke berkas yang tidak ada.
    ...(activity.image ? { image: `${siteConfig.url}${activity.image}` } : {}),
    articleSection: activity.category,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: url,
  };

  const shareLinks = [
    {
      label: "Bagikan lewat WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${activity.title} - ${url}`)}`,
      Icon: WhatsappIcon,
    },
    {
      label: "Bagikan lewat LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      Icon: LinkedinIcon,
    },
    {
      label: "Bagikan lewat email",
      href: `mailto:?subject=${encodeURIComponent(activity.title)}&body=${encodeURIComponent(url)}`,
      Icon: MailIcon,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* HEADER - teks di kiri, sampul di kanan; sampul tidak diulang di isi artikel */}
      <ActivityHeader activity={activity} />

      {/* ISI ARTIKEL */}
      <Section width="wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className={showTableOfContents ? "lg:col-span-8" : "lg:col-span-9"}>
            <div>
              {body.length > 0 ? (
                <ArticleBody body={body} />
              ) : (
                <p className="max-w-content text-base leading-relaxed text-ink-muted">
                  Isi tulisan ini belum tersedia. Hubungi kami bila Anda membutuhkan keterangan
                  lebih lanjut mengenai topik ini.
                </p>
              )}
            </div>

            {/* Catatan batas panduan - keselamatan dan kejujuran informasi */}
            {activity.category === "Panduan" ? (
              <p className="mt-10 max-w-content rounded-xl border border-line bg-surface-muted p-5 text-sm leading-relaxed text-ink-subtle">
                <span className="font-semibold text-ink-muted">Catatan. </span>
                Panduan ini bersifat umum. Prosedur, batas pemakaian, dan interval perawatan dapat
                berbeda antar merek dan model, jadi utamakan manual pabrikan dan SOP laboratorium
                Anda. Bila ragu, tanyakan kepada kami atau teknisi resmi alat tersebut.
              </p>
            ) : null}

            {/* Tag topik */}
            {activity.tags && activity.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                  Topik
                </span>
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-line-strong bg-surface-muted px-3 py-1 text-sm text-ink-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Bagikan */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                Bagikan
              </span>
              {shareLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-line-strong bg-surface text-ink-muted transition-colors duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icon aria-hidden="true" width={18} height={18} />
                </a>
              ))}
            </div>
          </div>

          {/*
            Daftar isi - menempel saat digulir.
            Sengaja disembunyikan di layar kecil: pada tata letak satu kolom,
            kotak ini jatuh SETELAH isi artikel, sehingga tidak lagi berfungsi
            sebagai navigasi dan hanya menambah panjang halaman.
          */}
          {showTableOfContents ? (
            <aside className="hidden lg:col-span-4 lg:block">
              <nav
                aria-labelledby="daftar-isi"
                className="rounded-xl border border-line bg-surface-muted p-6 lg:sticky lg:top-28"
              >
                <h2
                  id="daftar-isi"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700"
                >
                  Daftar isi
                </h2>
                <span aria-hidden="true" className="rule-accent mt-2.5 block h-px w-10" />
                <ol className="mt-4 space-y-2.5">
                  {headings.map((heading, index) => (
                    <li key={heading.id} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="text-xs font-bold tabular-nums text-accent-500"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <a
                        href={`#${heading.id}`}
                        className="text-sm leading-relaxed text-ink-muted underline-offset-4 transition-colors duration-200 hover:text-brand-700 hover:underline"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
        </div>

        {/* CTA ringkas - gaya sama dengan halaman detail produk */}
        <div className="mt-14 flex flex-col gap-4 rounded-xl border border-accent-200 bg-accent-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Ada yang ingin didiskusikan?</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Sampaikan kebutuhan laboratorium Anda, tim kami akan membantu menyiapkan pilihannya.
            </p>
          </div>
          <Button href="/contact" size="lg" className="shrink-0">
            Hubungi kami
          </Button>
        </div>
      </Section>

      {/* TULISAN LAINNYA */}
      {related.length > 0 ? (
        <Section tone="muted" width="wide" spacing="sm">
          <SectionHeading title="Informasi lainnya" as="h2" />
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.id} className="h-full">
                <ActivityCard activity={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
