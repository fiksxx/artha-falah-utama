import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** "default" untuk konten umum, "narrow" untuk teks panjang (45-75 karakter/baris). */
  width?: "default" | "narrow" | "wide";
};

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({ children, className, as: Tag = "div", width = "default" }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-6 lg:px-8", widths[width], className)}>{children}</Tag>
  );
}
