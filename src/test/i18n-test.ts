import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// Import actual translation files to avoid duplication
import enTranslations from '../../public/locales/en/translation.json'

// Use actual translation files for testing
// This ensures tests use the same translations as the application
const resources = {
  en: {
    translation: enTranslations,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
