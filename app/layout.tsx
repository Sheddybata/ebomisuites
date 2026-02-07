import type { Metadata } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { getContactPhone } from "@/lib/site-config"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { ToastProvider } from "@/contexts/ToastContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import SkipToContent from "@/components/SkipToContent"
import ReadingProgress from "@/components/ReadingProgress"
import ScrollToTop from "@/components/ScrollToTop"
import CookieConsent from "@/components/CookieConsent"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const cormorant = Cormorant_Garamond({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "EBOMI Suites and Towers | Luxury Hospitality in Jos, Nigeria",
  description: "Experience quiet luxury at EBOMI Suites and Towers. Sophisticated accommodations in an atmosphere of refined elegance. Located at No 1 Kashim Ibrahim St, Jos, Nigeria.",
  keywords: ["luxury hotel", "Jos Nigeria", "EBOMI Suites", "luxury accommodation", "boutique hotel", "Nigeria hospitality"],
  authors: [{ name: "EBOMI Suites and Towers" }],
  creator: "EBOMI Suites and Towers",
  publisher: "EBOMI Suites and Towers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ebomisuites.com"),
  alternates: {
    canonical: "/",
    languages: {
      'en': '/en',
      'ha': '/ha',
      'ig': '/ig',
      'yo': '/yo',
      'ff': '/ff',
      'ar': '/ar',
      'ja': '/ja',
      'zh': '/zh',
      'ko': '/ko',
      'hi': '/hi',
      'fr': '/fr',
      'es': '/es',
      'de': '/de',
      'pt': '/pt',
      'it': '/it',
      'ru': '/ru',
    },
  },
  openGraph: {
    title: "EBOMI Suites and Towers | Luxury Hospitality",
    description: "Experience quiet luxury at EBOMI Suites and Towers. Sophisticated accommodations in an atmosphere of refined elegance.",
    url: "https://ebomisuites.com",
    siteName: "EBOMI Suites and Towers",
    images: [
      {
        url: "/ebomi.jpg",
        width: 1200,
        height: 630,
        alt: "EBOMI Suites and Towers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EBOMI Suites and Towers | Luxury Hospitality",
    description: "Experience quiet luxury at EBOMI Suites and Towers.",
    images: ["/ebomi.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/ebomilogo.jpg",
    apple: "/ebomilogo.jpg",
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hotel",
              "name": "EBOMI Suites and Towers",
              "description": "Experience quiet luxury at EBOMI Suites and Towers. Sophisticated accommodations in an atmosphere of refined elegance.",
              "image": "https://ebomisuites.com/ebomi.jpg",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "No 1 Kashim Ibrahim St",
                "addressLocality": "Jos",
                "addressCountry": "NG",
              },
              "telephone": getContactPhone(),
              "url": "https://ebomisuites.com",
              "priceRange": "$$$",
              "starRating": {
                "@type": "Rating",
                "ratingValue": "5",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <LanguageProvider>
            <ToastProvider>
              <SkipToContent />
              <ReadingProgress />
              {children}
              <ScrollToTop />
              <CookieConsent />
            </ToastProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
