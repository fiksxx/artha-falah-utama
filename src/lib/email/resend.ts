import { Resend } from "resend";

import { escapeHtml } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/** Env server-side (jangan pernah di-expose ke client). */
export const emailConfig = {
  apiKey: process.env.RESEND_API_KEY ?? "",
  from: process.env.CONTACT_FROM_EMAIL ?? "",
  to: (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
};

export function isEmailConfigured() {
  return Boolean(emailConfig.apiKey && emailConfig.from && emailConfig.to.length > 0);
}

let client: Resend | null = null;

/** Singleton client Resend (dibuat sekali per lambda instance). */
export function getResendClient() {
  if (!client) {
    client = new Resend(emailConfig.apiKey);
  }
  return client;
}

/**
 * Palet email.
 *
 * Template email WAJIB memakai hex literal - klien email (Gmail, Outlook)
 * tidak mendukung CSS variable, jadi token di `globals.css` tidak bisa dipakai
 * di sini. Nilai di bawah adalah salinan token palet website; bila warna brand
 * diubah di `globals.css`, perbarui juga daftar ini agar email tetap seragam.
 */
const emailPalette = {
  surfaceMuted: "#F6F9F7", // surface-muted
  surface: "#FFFFFF", // surface
  line: "#E2E9E4", // line
  brand900: "#0B3929", // brand-900
  brand700: "#165F44", // brand-700
  accent300: "#EDC85E", // accent-300
  ink: "#101B17", // ink
  inkMuted: "#4A5A52", // ink-muted
  inkSubtle: "#5F6C64", // ink-subtle
} as const;

type ContactEmailInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: Date;
};

/**
 * Susun email notifikasi. Seluruh nilai dari user di-escape sebelum masuk HTML
 * (mencegah HTML/script injection di inbox penerima).
 */
export function buildContactEmail({ name, email, subject, message, submittedAt }: ContactEmailInput) {
  const timestamp = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(submittedAt);

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject),
    message: escapeHtml(message).replace(/\n/g, "<br />"),
  };

  const c = emailPalette;

  const html = `<!doctype html>
<html lang="id">
  <body style="margin:0;padding:24px;background:${c.surfaceMuted};font-family:Arial,Helvetica,sans-serif;color:${c.ink};">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:${c.surface};border:1px solid ${c.line};border-radius:12px;overflow:hidden;">
      <tr>
        <td style="background:${c.brand900};padding:20px 24px;color:${c.surface};">
          <p style="margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${c.accent300};">Pesan baru dari website</p>
          <h1 style="margin:6px 0 0;font-size:20px;">${siteConfig.name}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 16px;font-size:14px;color:${c.inkMuted};">Diterima: ${timestamp} WIB</p>
          <table role="presentation" width="100%" style="font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;width:110px;color:${c.inkMuted};">Nama</td><td style="padding:8px 0;font-weight:bold;">${safe.name}</td></tr>
            <tr><td style="padding:8px 0;color:${c.inkMuted};">Email</td><td style="padding:8px 0;"><a href="mailto:${safe.email}" style="color:${c.brand700};">${safe.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:${c.inkMuted};">Subjek</td><td style="padding:8px 0;font-weight:bold;">${safe.subject}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:${c.surfaceMuted};border:1px solid ${c.line};border-radius:8px;font-size:14px;line-height:1.6;">
            ${safe.message}
          </div>
          <p style="margin:24px 0 0;font-size:12px;color:${c.inkSubtle};">Balas email ini untuk langsung menjawab pengirim.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Pesan baru dari website ${siteConfig.name}`,
    `Diterima: ${timestamp} WIB`,
    "",
    `Nama   : ${name}`,
    `Email  : ${email}`,
    `Subjek : ${subject}`,
    "",
    "Pesan:",
    message,
  ].join("\n");

  return { html, text, subject: `[Website] ${subject}` };
}
