"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getContactPhone, getContactWhatsApp } from "@/lib/site-config"

export default function MobileNavbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const handleCheckAvailability = () => {
    // Trigger booking modal - we'll use a custom event since this is a separate component
    window.dispatchEvent(new CustomEvent('openBookingModal'))
  }

  const handleDirectDial = () => {
    window.location.href = `tel:${getContactPhone()}`
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${getContactWhatsApp()}`, "_blank")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 md:hidden",
            "px-4 pb-4 pt-2"
          )}
        >
          <div className="glassmorphic-dark rounded-2xl px-4 py-3 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              {/* Check Availability Button */}
              <button
                onClick={handleCheckAvailability}
                className={cn(
                  "flex-1 px-4 py-3 rounded-xl",
                  "bg-primary text-white font-medium",
                  "hover:bg-primary/90 active:scale-95",
                  "transition-all duration-200",
                  "text-sm"
                )}
              >
                Check Availability
              </button>

              {/* Direct Dial Button */}
              <button
                onClick={handleDirectDial}
                className={cn(
                  "p-3 rounded-xl",
                  "bg-white/10 backdrop-blur-sm",
                  "hover:bg-white/20 active:scale-95",
                  "transition-all duration-200",
                  "flex items-center justify-center"
                )}
                aria-label="Direct dial"
              >
                <Phone className="w-5 h-5 text-white" />
              </button>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                className={cn(
                  "p-3 rounded-xl",
                  "bg-white/10 backdrop-blur-sm",
                  "hover:bg-white/20 active:scale-95",
                  "transition-all duration-200",
                  "flex items-center justify-center"
                )}
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
