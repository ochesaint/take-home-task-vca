import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

/**
 * Success message displayed after successful form submission.
 * Shows a confirmation card with a checkmark icon.
 */
export function SuccessMessage() {
  const { t } = useTranslation()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-green-800 dark:text-green-200">
          {t('onboarding.success.title')}
        </CardTitle>
        <CardDescription>{t('onboarding.success.message')}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  )
}
