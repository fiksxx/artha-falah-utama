import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

type LogoProps = {
  className?: string;
  tone?: "light" | "dark";
  href?: string;
};

export function Logo({ className, tone = "light", href = "/" }: LogoProps) {
  const isDark = tone === "dark";

  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label={`${siteConfig.name} - beranda`}
    >
      <Image
        src={isDark ? "/logo-dark.png" : "/logo.png"}
        alt={siteConfig.name}
        width={160}
        height={40}
        priority
        className="h-10 w-auto"
      />
    </Link>
  );
}