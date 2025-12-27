import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

/**
 * Props for the ErrorFallback component.
 */
interface ErrorFallbackProps {
  /** The error that occurred */
  error?: Error
  /** Optional callback to reset the error state */
  resetError?: () => void
}

/**
 * Fallback UI displayed when an error is caught by the Error Boundary.
 * Provides user-friendly error message with retry option.
 */
export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const { t } = useTranslation()

  const handleReload = () => {
    if (resetError) {
      resetError()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive h-6 w-6" />
          </div>
          <CardTitle>{t('common.somethingWentWrong')}</CardTitle>
          <CardDescription>
            {error?.message || t('common.error')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={handleReload}>{t('common.tryAgain')}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
