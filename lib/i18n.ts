export type Language = 'en' | 'ha' | 'ig' | 'yo' | 'ff' | 'ar' | 'ja' | 'zh' | 'ko' | 'hi' | 'fr' | 'es' | 'de' | 'pt' | 'it' | 'ru'

export const languages: { code: Language; name: string; nativeName: string; flagCode: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flagCode: 'GB' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flagCode: 'NG' },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flagCode: 'NG' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flagCode: 'NG' },
  { code: 'ff', name: 'Fulani', nativeName: 'Fulfulde', flagCode: 'NG' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flagCode: 'SA' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flagCode: 'JP' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flagCode: 'CN' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flagCode: 'KR' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flagCode: 'IN' },
  { code: 'fr', name: 'French', nativeName: 'Français', flagCode: 'FR' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flagCode: 'ES' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flagCode: 'DE' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flagCode: 'PT' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flagCode: 'IT' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flagCode: 'RU' },
]

export const defaultLanguage: Language = 'en'
