# EBOMI Suites & Towers — Improvement Recommendations

A review of what’s in place and concrete ways to improve the site.

---

## What’s Already Strong

- **Tech stack**: Next.js App Router, Tailwind, Framer Motion, i18n
- **UX**: Sticky concierge bar, booking modal, Paystack, video backgrounds, Bento gallery
- **Accessibility**: Skip to content, ARIA, keyboard support, focus styles
- **SEO**: Metadata, Open Graph, Twitter cards, Hotel schema, language alternates
- **Performance**: Video preload/posters, caching headers, lazy loading
- **Brand**: Primary/secondary colors, Cormorant + Inter, glassmorphic elements

---

## High Priority (Do Soon)

### 1. Replace Placeholder Contact Details
**Where:** `MobileNavbar.tsx`, `DesktopNav.tsx`, `Footer.tsx`, `app/page.tsx`, `layout.tsx` (schema)

- **Phone:** `+234XXXXXXXXXX` → real number (e.g. `+2348012345678`)
- **WhatsApp:** `234XXXXXXXXXX` → same number, no leading zero (e.g. `2348012345678`)
- **Schema:** Update `layout.tsx` Hotel schema `telephone` to match

**Why:** Direct dial and WhatsApp are core conversion; placeholders hurt trust.

---

### 2. Persist Bookings (Database)
**Current:** `/api/booking` only returns data; nothing is stored.

**Add:**
- Database (e.g. PostgreSQL + Prisma, or Supabase)
- Table: `bookings` (id, bookingRef, checkIn, checkOut, roomType, guests, name, email, phone, specialRequests, total, paymentMethod, status, createdAt)
- In `/api/booking`: insert row, then continue with Paystack or “pay on arrival” flow
- In `/api/paystack/verify`: update booking `status` to `paid` (or `confirmed`) when payment succeeds

**Why:** You need a record of every reservation and payment for operations and support.

---

### 3. Fix Video Filename Typo
**Where:** `app/page.tsx` — gallery item for Premium Room

- **Current:** `/experienceebomi/premuimroom.mp4`
- **Options:**
  - Rename file to `premiumroom.mp4` and update code to use it, or
  - Keep filename `premuimroom.mp4` and add a short comment in code so future edits don’t “fix” it and break the path

**Why:** Avoids 404s and confusion when someone renames the file later.

---

### 4. Environment and Paystack for Production
- **`.env.local`:** Create from `.env.example`; set `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`, and (if used) `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- **Production:** Use Paystack **live** keys and set `NEXT_PUBLIC_APP_URL` to `https://ebomisuites.com`
- **Callback:** Ensure `NEXT_PUBLIC_APP_URL` is correct so Paystack redirects to `https://ebomisuites.com/booking/payment/callback`

**Why:** Test mode is for development only; production needs live keys and correct URLs.

---

## Medium Priority (Next Phase)

### 5. Booking Confirmation and Notifications
- **Email:** After a booking is created (and after successful Paystack payment), send an email with:
  - Booking reference, dates, room type, total, and “next steps”
- **Options:** Resend, SendGrid, or a simple API route that uses Nodemailer + SMTP
- **Optional:** Admin email or Slack webhook for new bookings

**Why:** Guests expect confirmation; it reduces support and no-shows.

---

### 6. Centralise Content and Copy
- **Room types:** Titles, descriptions, and images are split between `page.tsx` (roomTypes, gallery) and `BookingModal` (room options). Consider a single source (e.g. `lib/rooms.ts` or CMS) for names, slugs, and default images.
- **Testimonials:** If they’re still placeholder, replace with real quotes and names (and photos if you use them).
- **Contact:** Keep phone, WhatsApp, and email in one config (e.g. `lib/site-config.ts`) and import everywhere.

**Why:** Easier to update content and keep booking form and marketing in sync.

---

### 7. Favicon and PWA
- **Favicon:** `layout.tsx` uses `ebomilogo.jpg`. Prefer a dedicated favicon (e.g. `favicon.ico` or `icon.png` in `/app` or `/public`) for better behaviour in tabs and bookmarks.
- **PWA (optional):** Add a web app manifest and service worker so the site can be “installed” and work better offline.

**Why:** Clear branding and a more app-like experience on mobile.

---

### 8. Error and Edge Cases
- **Booking API:** Return clear, user-facing error messages (e.g. “Invalid dates”) and use HTTP status codes consistently.
- **Paystack:** If initialization fails (e.g. network or invalid key), show a specific message and optionally a “Try again” or “Pay on arrival” option.
- **Payment callback:** If verification fails (e.g. reference not found), show a clear message and a link/button back to home or “Contact us”.

**Why:** Reduces confusion and support load when something goes wrong.

---

### 9. Video Performance and Accessibility
- **Experience EBOMI:** Four videos load on one page. Consider:
  - `preload="metadata"` (or `none`) for off-screen tiles; load video when the tile is near the viewport (Intersection Observer).
  - Poster images per video so users see a frame before playing.
- **Captions:** Add `<track>` for key videos (hero, booking section, experience) for accessibility and SEO.

**Why:** Better performance on slow connections and better accessibility.

---

### 10. Form Validation and i18n
- **BookingModal:** Validation messages (“Check-in date is required”, etc.) are hardcoded in English. Move them into `lib/translations.ts` and use `t('booking.validation.checkInRequired')` etc. so they follow the selected language.

**Why:** Matches the rest of the site’s multilingual experience.

---

## Lower Priority (Nice to Have)

### 11. Clean Up Unused Code
- **GalleryLightbox:** No longer used after switching to video gallery. Remove the component (or keep for a future “mixed” gallery) and any unused state (e.g. `lightboxOpen`, `lightboxIndex` if still present).
- **`isLoading`:** If it’s only used for a one-off delay, consider removing or tying it to real loading (e.g. hero video).

**Why:** Smaller bundle and less confusion for future changes.

---

### 12. Analytics and Monitoring
- **Analytics:** Add Google Analytics 4, Plausible, or similar (with Cookie Consent).
- **Errors:** Use Sentry (or similar) for runtime errors in production.

**Why:** Understand traffic and fix issues quickly.

---

### 13. Rate Limiting and Security
- **API routes:** Add rate limiting to `/api/booking` and `/api/paystack/initialize` to prevent abuse.
- **Paystack:** Verify webhook signatures if you add a webhook endpoint for payment events.

**Why:** Protects against spam and invalid requests.

---

### 14. Next.js and Dependencies
- **Next.js:** Upgrade from 14.2 when convenient (e.g. 14.2.x or 15.x) and test build and routes.
- **Dependencies:** Keep React, Framer Motion, and Tailwind updated for security and features.

**Why:** Security and access to framework improvements.

---

### 15. Room Images and Real Content
- **Rooms:** Replace Unsplash URLs with real photos of Deluxe, Executive, and Presidential rooms.
- **Gallery:** Experience EBOMI already uses your videos; ensure titles and any captions match the real spaces (Reception, Temple, Premium Room, Prayer Cubicles).

**Why:** Aligns the site with the actual product and builds trust.

---

## Quick Reference

| Area              | Action                                              |
|-------------------|-----------------------------------------------------|
| Contact           | Replace phone/WhatsApp/email placeholders           |
| Bookings          | Add DB + save booking + update status on payment     |
| Video path        | Fix or document `premuimroom.mp4`                   |
| Production        | Env vars, Paystack live keys, correct callback URL  |
| Emails            | Confirmation (and optional admin) after booking     |
| Content           | Centralise rooms/contact; real testimonials         |
| Favicon           | Use a proper favicon asset                           |
| Validation        | Translate booking error messages                    |
| Cleanup           | Remove or repurpose GalleryLightbox / unused state  |

---

If you tell me which area you want to tackle first (e.g. “contact details”, “database for bookings”, or “translated validation”), I can outline the exact code changes step by step.
