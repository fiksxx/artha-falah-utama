import { z } from "zod";

/**
 * Skema validasi form kontak - dipakai bersama oleh client (real-time) dan
 * API route (validasi ulang di server, jangan pernah percaya input client).
 */
export const contactFormSchema = z.object({
  name: z
    .string({ required_error: "Nama wajib diisi" })
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string({ required_error: "Email wajib diisi" })
    .trim()
    .min(1, "Email wajib diisi")
    .max(150, "Email maksimal 150 karakter")
    .email("Format email tidak valid"),
  phone: z
    .string()
    .min(8, "Nomor telepon minimal 8 digit")
    .regex(/^[0-9+\-\s]+$/, "Nomor telepon hanya boleh angka dan simbol + atau -"),
  subject: z
    .string({ required_error: "Subjek wajib diisi" })
    .trim()
    .min(3, "Subjek minimal 3 karakter")
    .max(150, "Subjek maksimal 150 karakter"),
  message: z
    .string({ required_error: "Pesan wajib diisi" })
    .trim()
    .min(10, "Pesan minimal 10 karakter")
    .max(2000, "Pesan maksimal 2000 karakter"),
  /** Honeypot: field tersembunyi yang hanya diisi bot. Harus kosong. */
  company: z.string().max(0, "Terjadi kesalahan validasi").optional().default(""),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

/** Ubah ZodError menjadi map { field: pesan } untuk ditampilkan di form. */
export function toFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
