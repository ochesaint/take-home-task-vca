import { useTranslation } from 'react-i18next'

export function ExampleI18n() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('app.title')}</h2>
      <p>{t('app.description')}</p>
      <div className="space-x-2">
        <button
          onClick={() => changeLanguage('en')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('es')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Español
        </button>
      </div>
    </div>
  )
}

