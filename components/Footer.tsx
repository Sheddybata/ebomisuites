"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"
import { getContactPhone, getContactEmail } from "@/lib/site-config"
import { cn } from "@/lib/utils"

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: t("nav.accommodations"), href: "#accommodations", key: "accommodations" },
    { label: t("nav.halls"), href: "#halls", key: "halls" },
    { label: t("nav.amenities"), href: "#amenities", key: "amenities" },
    { label: t("nav.gallery"), href: "#gallery", key: "gallery" },
    { label: t("nav.contact"), href: "#contact", key: "contact" },
  ]

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://facebook.com/ebomisuites", 
      label: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#166FE5]"
    },
    { 
      icon: Instagram, 
      href: "https://instagram.com/ebomisuites", 
      label: "Instagram",
      color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] hover:opacity-90"
    },
    { 
      icon: XIcon, 
      href: "https://x.com/ebomisuites", 
      label: "X (Twitter)",
      color: "bg-black hover:bg-gray-900"
    },
    { 
      icon: Linkedin, 
      href: "https://linkedin.com/company/ebomisuites", 
      label: "LinkedIn",
      color: "bg-[#0077B5] hover:bg-[#006399]"
    },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/ebomilogo.jpg"
                alt="EBOMI Suites & Towers"
                width={200}
                height={80}
                className="h-16 md:h-20 lg:h-24 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Experience quiet luxury in the heart of the city. Where sophistication meets unparalleled hospitality.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      "text-white shadow-lg",
                      social.color
                    )}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-secondary transition-colors text-sm"
                    aria-label={link.label}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-1 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-400 text-sm">
                  {t("location.address")}<br />
                  {t("location.city")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${getContactPhone()}`}
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                  aria-label="Call us"
                >
                  {getContactPhone()}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${getContactEmail()}`}
                  className="text-gray-400 hover:text-secondary transition-colors text-sm"
                  aria-label="Send email"
                >
                  {getContactEmail()}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} {t("footer.copyright")}
          </p>
          <div className="flex gap-6 text-sm">
            <button className="text-gray-400 hover:text-secondary transition-colors" aria-label={t("footer.privacy")}>
              {t("footer.privacy")}
            </button>
            <button className="text-gray-400 hover:text-secondary transition-colors" aria-label={t("footer.terms")}>
              {t("footer.terms")}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
