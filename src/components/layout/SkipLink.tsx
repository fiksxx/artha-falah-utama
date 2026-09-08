/**
 * Skip link aksesibilitas: tautan pertama pada tab order, tersembunyi
 * sampai menerima fokus keyboard, lalu melompat ke <main id="main">.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:inline-flex focus-visible:min-h-[48px] focus-visible:items-center focus-visible:rounded-lg focus-visible:bg-brand-800 focus-visible:px-5 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"
    >
      Lewati ke konten utama
    </a>
  );
}
