"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { languages } from "@/lib/i18n"
import FlagIcon from "./FlagIcon"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  isScrolled?: boolean
}

export default function LanguageSwitcher({ isScrolled = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = languages.find(l => l.code === language) || languages[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "transition-all duration-300 text-sm font-medium",
          isScrolled
            ? "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
            : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
        )}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FlagIcon countryCode={currentLang.flagCode} className="w-5 h-4 object-cover rounded flex-shrink-0" />
        <Globe className="w-4 h-4 hidden sm:block" />
        <span className="hidden sm:inline truncate max-w-[100px]">{currentLang.nativeName}</span>
        <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px] max-w-[250px] z-50"
          >
            <div className="py-1 max-h-[400px] overflow-y-auto custom-scrollbar">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3",
                    "hover:bg-gray-50 transition-colors",
                    language === lang.code && "bg-primary/5"
                  )}
                  role="option"
                  aria-selected={language === lang.code}
                >
                  <FlagIcon countryCode={lang.flagCode} className="w-6 h-4 object-cover rounded flex-shrink-0 border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{lang.nativeName}</div>
                    <div className="text-xs text-gray-500 truncate">{lang.name}</div>
                  </div>
                  {language === lang.code && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
