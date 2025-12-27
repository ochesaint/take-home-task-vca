import type { Meta, StoryObj } from '@storybook/react'
import { OnboardingForm } from './onboarding-form'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta: Meta<typeof OnboardingForm> = {
  title: 'Onboarding/OnboardingForm',
  component: OnboardingForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      </I18nextProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const French: Story = {
  decorators: [
    (Story) => {
      i18n.changeLanguage('fr')
      return <Story />
    },
  ],
}
