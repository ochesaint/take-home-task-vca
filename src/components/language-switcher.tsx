import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Supported language configuration.
 */
interface LanguageConfig {
  /** Language code (e.g., 'en', 'fr') */
  code: string
  /** Short label for buttons */
  label: string
  /** Full language name */
  name: string
}

/**
 * Available languages for the application.
 */
const LANGUAGES: readonly LanguageConfig[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
] as const

/**
 * Language switcher component with accessible buttons.
 * Updates the URL query parameter for bookmarking.
 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language?.split('-')[0] || 'en'

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    // Update URL without reload for bookmarking
    const url = new URL(window.location.href)
    url.searchParams.set('lang', langCode)
    window.history.replaceState({}, '', url.toString())
  }

  return (
    <div className="flex items-center gap-1">
      <Globe className="text-muted-foreground h-4 w-4" />
      <div className="flex rounded-md border">
        {LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={currentLang === lang.code ? 'default' : 'ghost'}
            size="sm"
            className="h-7 rounded-none px-2 text-xs first:rounded-l-md last:rounded-r-md"
            onClick={() => handleLanguageChange(lang.code)}
            aria-label={`Switch to ${lang.name}`}
            aria-pressed={currentLang === lang.code}
          >
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
