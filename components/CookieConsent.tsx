"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Cookie } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"

export default function CookieConsent() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className={cn(
          "max-w-4xl mx-auto",
          "bg-white rounded-2xl shadow-2xl",
          "border border-gray-200",
          "p-6 md:p-8"
        )}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cookie Consent
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                By clicking "Accept All", you consent to our use of cookies. You can manage your preferences at any time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className={cn(
                    "px-6 py-2.5 rounded-lg",
                    "bg-primary text-white font-medium",
                    "hover:bg-primary/90 transition-colors"
                  )}
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className={cn(
                    "px-6 py-2.5 rounded-lg",
                    "bg-gray-100 text-gray-900 font-medium",
                    "hover:bg-gray-200 transition-colors"
                  )}
                >
                  Decline
                </button>
                <a
                  href="/privacy"
                  className={cn(
                    "px-6 py-2.5 rounded-lg",
                    "text-gray-600 font-medium",
                    "hover:text-gray-900 transition-colors",
                    "text-center sm:text-left"
                  )}
                >
                  Learn More
                </a>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
