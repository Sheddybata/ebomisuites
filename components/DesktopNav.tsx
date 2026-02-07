"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Phone, MessageCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { getContactPhone, getContactWhatsApp } from "@/lib/site-config"
import LanguageSwitcher from "./LanguageSwitcher"
import { cn } from "@/lib/utils"

export default function DesktopNav() {
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: t("nav.accommodations"), href: "#accommodations", key: "accommodations" },
    { label: t("nav.amenities"), href: "#amenities", key: "amenities" },
    { label: t("nav.gallery"), href: "#gallery", key: "gallery" },
    { label: t("nav.contact"), href: "#contact", key: "contact" },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="text-2xl md:text-3xl font-serif font-light"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={cn(isScrolled ? "text-primary" : "text-white")}>
              EBOMI
            </span>
            <span className={cn(isScrolled ? "text-secondary" : "text-secondary")}>
              {" "}Suites
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors",
                  "hover:text-primary",
                  isScrolled ? "text-gray-700" : "text-white"
                )}
                aria-label={item.label}
              >
                {item.label}
              </button>
            ))}
            <LanguageSwitcher isScrolled={isScrolled} />
            <button
              onClick={() => {
                const bookingSection = document.getElementById("booking-section")
                bookingSection?.scrollIntoView({ behavior: "smooth" })
              }}
              className={cn(
                "px-6 py-2.5 rounded-lg",
                "bg-primary text-white font-medium",
                "hover:bg-primary/90 transition-all duration-300",
                "shadow-md hover:shadow-lg"
              )}
              aria-label={t("nav.bookNow")}
            >
              {t("nav.bookNow")}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2",
              isScrolled ? "text-gray-700" : "text-white"
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4 bg-white/95 backdrop-blur-md rounded-lg mt-2 px-4">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left text-gray-700 hover:text-primary transition-colors py-2"
                    aria-label={item.label}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="py-2">
                  <LanguageSwitcher isScrolled={true} />
                </div>
                <button
                  onClick={() => {
                    const bookingSection = document.getElementById("booking-section")
                    bookingSection?.scrollIntoView({ behavior: "smooth" })
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                  aria-label={t("nav.bookNow")}
                >
                  {t("nav.bookNow")}
                </button>
                <div className="flex gap-4 pt-4 border-t">
                  <a
                    href={`tel:${getContactPhone()}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${getContactWhatsApp()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
