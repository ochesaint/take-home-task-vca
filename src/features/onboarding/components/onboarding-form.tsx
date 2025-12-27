import { ConfigurableForm } from '@/components/form'
import { SuccessMessage } from './success-message'
import { onboardingFormConfig } from '../config/form-config'
import { submitOnboardingForm } from '../services/onboarding.api'
import type { OnboardingFormData } from '../schemas/onboarding.schema'

/**
 * Main onboarding form component.
 * Uses the configurable form system for a clean, maintainable implementation.
 */
export function OnboardingForm() {
  const handleSubmit = async (data: OnboardingFormData) => {
    await submitOnboardingForm(data)
  }

  return (
    <ConfigurableForm
      config={onboardingFormConfig}
      onSubmit={handleSubmit}
      successComponent={<SuccessMessage />}
      totalSteps={5}
    />
  )
}
