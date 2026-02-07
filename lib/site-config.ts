/**
 * Site-wide contact and feature config.
 * Set these in .env.local (use .env.example as template).
 * When you have real contact details, add them to .env.local — no code change needed.
 */

function env(key: string, fallback: string): string {
  if (typeof process === "undefined" || !process.env) return fallback
  const value = process.env[key]
  return value != null && value.trim() !== "" ? value.trim() : fallback
}

/** Phone number for tel: links (e.g. +2348012345678) */
export function getContactPhone(): string {
  return env("NEXT_PUBLIC_CONTACT_PHONE", "+2340000000000")
}

/** WhatsApp number for wa.me (no +, no leading 0; e.g. 2348012345678) */
export function getContactWhatsApp(): string {
  return env("NEXT_PUBLIC_CONTACT_WHATSAPP", "2340000000000")
}

/** Contact email */
export function getContactEmail(): string {
  return env("NEXT_PUBLIC_CONTACT_EMAIL", "info@ebomisuites.com")
}

/** Show Paystack "Pay Online" option only when you have added API keys and set this to true */
export function isPaystackEnabled(): boolean {
  return env("NEXT_PUBLIC_PAYSTACK_ENABLED", "false") === "true"
}
