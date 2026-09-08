"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Aktif bila path persis sama; untuk sub-path (mis. /activity/xxx) tetap aktif. */
function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Tutup menu mobile setiap kali pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Shadow tipis setelah scroll (feedback visual navbar sticky)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape untuk menutup + kunci scroll body saat menu mobile terbuka
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-md transition-shadow duration-200",
        isScrolled && "shadow-nav",
      )}
    >
      <Container width="wide">
        <nav
          aria-label="Navigasi utama"
          className="flex h-[var(--nav-height)] items-center justify-between gap-4"
        >
          <Logo />

          {/* Navigasi desktop */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-[44px] items-center rounded-lg px-3.5 text-[0.9375rem] font-medium transition-colors duration-200",
                      active
                        ? "text-brand-700"
                        : "text-ink-muted hover:bg-surface-strong hover:text-ink",
                    )}
                  >
                    {item.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-brand-600"
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 32 }
                        }
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <Button href="/contact" size="sm">
              Hubungi Kami
            </Button>
          </div>

          {/* Tombol menu mobile */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="grid h-11 w-11 place-items-center rounded-lg border border-line text-ink transition-colors hover:bg-surface-strong lg:hidden"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>
      </Container>

      {/* Panel navigasi mobile */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-surface lg:hidden"
          >
            <Container width="wide" className="py-4">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-[48px] flex-col justify-center rounded-lg px-4 py-2 transition-colors",
                          active
                            ? "bg-brand-50 text-brand-800"
                            : "text-ink hover:bg-surface-strong",
                        )}
                      >
                        <span className="text-base font-semibold">{item.label}</span>
                        {item.description ? (
                          <span className="text-sm text-ink-subtle">{item.description}</span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Button href="/contact" className="mt-4 w-full" size="lg">
                Hubungi Kami
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
