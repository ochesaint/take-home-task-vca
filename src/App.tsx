import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { ErrorBoundary } from '@/components/error-boundary'
import { LanguageSwitcher } from '@/components/language-switcher'
import { OnboardingForm } from '@/features/onboarding/components/onboarding-form'
import i18n from '@/lib/i18n'

/**
 * React Query client configuration.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

/**
 * Root application component.
 * Sets up providers for React Query, i18n, and error handling.
 */
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <div className="bg-background min-h-screen">
            <header className="fixed top-2 right-2 z-10 flex items-center gap-2 sm:top-4 sm:right-4">
              <LanguageSwitcher />
            </header>
            <main className="flex min-h-screen items-center justify-center bg-gray-200 px-4 py-8 sm:py-16">
              <OnboardingForm />
            </main>
          </div>
        </ErrorBoundary>
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default App
