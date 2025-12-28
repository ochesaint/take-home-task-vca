import type { Preview } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from '../src/lib/i18n'
import '../src/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
      </QueryClientProvider>
    ),
  ],
}

export default preview
