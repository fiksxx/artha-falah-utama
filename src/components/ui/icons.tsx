import type { SVGProps } from "react";

/**
 * Set ikon inline (SVG) - ringan, tanpa dependency icon library.
 * Semua ikon bersifat dekoratif: default aria-hidden, warna ikut `currentColor`.
 */
type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function MenuIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="24" height="24" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="24" height="24" {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="18" height="18" {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="18" height="18" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="18" height="18" {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="18" height="18" {...props}>
      <path d="M12 4v10M8 11l4 4 4-4M5 19h14" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="18" height="18" {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4z" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M12 6.5C10.3 5.3 8 4.8 4.5 5v13.5c3.5-.2 5.8.3 7.5 1.5 1.7-1.2 4-1.7 7.5-1.5V5c-3.5-.2-5.8.3-7.5 1.5z" />
      <path d="M12 6.5V20" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
    </svg>
  );
}

export function FlaskIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M9.5 3.5h5M10.5 3.5v5.2l-5.3 8.9a2 2 0 0 0 1.7 2.9h10.2a2 2 0 0 0 1.7-2.9l-5.3-8.9V3.5" />
      <path d="M8 14.5h8" />
    </svg>
  );
}

export function ChecklistIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="m4 7 1.5 1.5L8.5 5M4 13l1.5 1.5L8.5 11M4 19l1.5 1.5L8.5 17" />
      <path d="M12 7h8M12 13h8M12 19h8" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6.2" />
      <path d="M12 3.5v2.3M12 18.2v2.3M3.5 12h2.3M18.2 12h2.3M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="16" height="16" fill="currentColor" stroke="none" {...props}>
      <path d="m12 2.8 2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="16" height="16" {...props}>
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="16" height="16" {...props}>
      <path d="M8.5 5.5v13M15.5 5.5v13" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M12 3l7 3v6c0 4.2-2.9 7.8-7 9-4.1-1.2-7-4.8-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9z" />
    </svg>
  );
}

export function HandshakeIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="m3 11 3-3 4 1 2-2 2 2 4-1 3 3" />
      <path d="M7 12.5 10.5 16l1.5-1.5L14 16l3-3.5" />
      <path d="M4 11v4.5A2.5 2.5 0 0 0 6.5 18H8" />
      <path d="M20 11v4.5a2.5 2.5 0 0 1-2.5 2.5H16" />
    </svg>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M12 3 4 7v10l8 4 8-4V7z" />
      <path d="m4 7 8 4 8-4M12 11v10" />
    </svg>
  );
}

export function ToolsIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M14.5 6.5a3.5 3.5 0 0 0 4.6 4.4l-8 8a2.1 2.1 0 0 1-3-3l8-8a3.5 3.5 0 0 0-1.6-1.4z" />
      <path d="m5 5 3 3" />
    </svg>
  );
}

export function OfficeIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <rect x="4" y="3" width="10" height="18" rx="1.5" />
      <path d="M14 9h5a1 1 0 0 1 1 1v11M7 7h4M7 11h4M7 15h4M17 13h1M17 17h1" />
    </svg>
  );
}

export function SafetyIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M5 14a7 7 0 0 1 14 0z" />
      <path d="M3.5 14h17M8.5 14V8a3.5 3.5 0 0 1 7 0v6" />
      <path d="M6 18h12" />
    </svg>
  );
}

export function ElectricIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M13 3 5.5 13H11l-1 8 7.5-10H12z" />
    </svg>
  );
}

export function LogisticsIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="22" height="22" {...props}>
      <path d="M3 7h10v9H3zM13 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="18" height="18" {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="18" height="18" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16.2h.01" />
    </svg>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="18" height="18" className={props.className} {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

/* --- Social (filled) --- */
export function InstagramIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 7h.01" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V17M8 7.5h.01M12 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12z" />
      <path d="M9.2 9c.3 1.4 1.2 2.9 2.5 4 .7.6 1.5 1 2.3 1.3l.9-1.4 1.6.8-.4 1.3c-1.9.3-4-.7-5.6-2.3S8 9.4 8.3 7.6l1.3-.4.8 1.6z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...baseProps} width="20" height="20" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M14.5 8h-1a1.8 1.8 0 0 0-1.8 1.8V20M10 12.8h4" />
    </svg>
  );
}
