"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Language, defaultLanguage } from "@/lib/i18n"
import { getTranslation } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get language from localStorage or browser preference
    const savedLang = localStorage.getItem('language') as Language | null
    const validLanguages: Language[] = ['en', 'ha', 'ig', 'yo', 'ff', 'ar', 'ja', 'zh', 'ko', 'hi', 'fr', 'es', 'de', 'pt', 'it', 'ru']
    if (savedLang && validLanguages.includes(savedLang)) {
      setLanguageState(savedLang)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0]
      const langMap: Record<string, Language> = {
        'ha': 'ha', 'ig': 'ig', 'yo': 'yo', 'ff': 'ff',
        'ar': 'ar', 'ja': 'ja', 'zh': 'zh', 'ko': 'ko', 'hi': 'hi',
        'fr': 'fr', 'es': 'es', 'de': 'de', 'pt': 'pt', 'it': 'it', 'ru': 'ru'
      }
      if (langMap[browserLang]) {
        setLanguageState(langMap[browserLang])
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string) => {
    if (!mounted) return key
    return getTranslation(language, key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
