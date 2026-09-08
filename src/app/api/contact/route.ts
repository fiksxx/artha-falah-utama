import { NextResponse } from "next/server";

import { buildContactEmail, emailConfig, getResendClient, isEmailConfigured } from "@/lib/email/resend";
import { contactFormSchema, toFieldErrors } from "@/lib/validation/contact";
import { sanitizeText } from "@/lib/utils";
import type { ContactApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Rate limit sederhana per IP (in-memory, per instance).
 * Cukup untuk company profile; untuk skala besar ganti ke Upstash Redis / Vercel KV.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 menit
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const previous = hits.get(ip) ?? [];
  const recent = previous.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Bersihkan entri lama agar map tidak tumbuh terus
  if (hits.size > 500) {
    for (const [key, values] of hits) {
      if (values.every((timestamp) => now - timestamp > RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function json(body: ContactApiResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  // 1. Tolak content-type yang bukan JSON (mengurangi CSRF form-post lintas situs)
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, message: "Format permintaan tidak valid." }, 415);
  }

  // 2. Rate limit
  if (isRateLimited(getClientIp(request))) {
    return json(
      { ok: false, message: "Terlalu banyak percobaan. Silakan coba lagi dalam beberapa menit." },
      429,
    );
  }

  // 3. Parse body
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: "Data yang dikirim tidak dapat dibaca." }, 400);
  }

  // 4. Validasi ulang di server (tidak percaya validasi client)
  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        message: "Mohon periksa kembali isian Anda.",
        fieldErrors: toFieldErrors(parsed.error),
      },
      400,
    );
  }

  // 5. Honeypot: bot mengisi field tersembunyi -> pura-pura sukses, jangan kirim email
  if (parsed.data.company && parsed.data.company.length > 0) {
    return json({ ok: true, message: "Terima kasih, pesan Anda sudah kami terima." }, 200);
  }

  // 6. Sanitasi sebelum dipakai
  const name = sanitizeText(parsed.data.name, 100);
  const email = sanitizeText(parsed.data.email, 150);
  const subject = sanitizeText(parsed.data.subject, 150);
  const message = sanitizeText(parsed.data.message, 2000);

  // 7. Kirim email notifikasi via Resend
  if (!isEmailConfigured()) {
    console.error(
      "[contact] Env email belum lengkap. Isi RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL.",
    );
    return json(
      {
        ok: false,
        message:
          "Layanan email belum dikonfigurasi. Silakan hubungi kami langsung lewat email atau WhatsApp.",
      },
      500,
    );
  }

  try {
    const { html, text, subject: emailSubject } = buildContactEmail({
      name,
      email,
      subject,
      message,
      submittedAt: new Date(),
    });

    const { error } = await getResendClient().emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      replyTo: email,
      subject: emailSubject,
      html,
      text,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return json(
        { ok: false, message: "Pesan gagal dikirim. Silakan coba lagi beberapa saat lagi." },
        502,
      );
    }
  } catch (error) {
    console.error("[contact] Unexpected error:", error);
    return json(
      { ok: false, message: "Terjadi kesalahan tak terduga. Silakan coba lagi nanti." },
      500,
    );
  }

  return json(
    { ok: true, message: "Terima kasih! Pesan Anda sudah terkirim. Tim kami akan segera membalas." },
    200,
  );
}

/** Method selain POST tidak diizinkan. */
export async function GET() {
  return json({ ok: false, message: "Method tidak diizinkan." }, 405);
}
