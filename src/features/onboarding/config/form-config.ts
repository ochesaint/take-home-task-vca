import type { FormConfig } from '@/components/form'
import {
  onboardingSchema,
  type OnboardingFormData,
} from '../schemas/onboarding.schema'
import {
  CORP_NUMBER_LENGTH,
  MAX_NAME_LENGTH,
} from '@/features/onboarding/config/constants.ts'

/**
 * Configuration for the onboarding form.
 * Defines all fields, validation, and form behavior.
 */
export const onboardingFormConfig: FormConfig<OnboardingFormData> = {
  steps: [
    {
      id: 'personal-details',
      title: 'onboarding.title',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          label: 'onboarding.fields.firstName',
          grid: 'half',
          maxLength: MAX_NAME_LENGTH,
          autoComplete: 'given-name',
          autoFocus: true,
        },
        {
          name: 'lastName',
          type: 'text',
          label: 'onboarding.fields.lastName',
          grid: 'half',
          maxLength: MAX_NAME_LENGTH,
          autoComplete: 'family-name',
        },
        {
          name: 'phone',
          type: 'phone',
          label: 'onboarding.fields.phone',
          grid: 'full',
          autoComplete: 'tel',
          mask: 'phone-ca',
        },
        {
          name: 'corporationNumber',
          type: 'number',
          label: 'onboarding.fields.corporationNumber',
          grid: 'full',
          maxLength: CORP_NUMBER_LENGTH,
          asyncValidation: {
            showIndicator: true,
          },
        },
      ],
    },
  ],
  schema: onboardingSchema,
  defaultValues: {
    firstName: '',
    lastName: '',
    phone: '',
    corporationNumber: '',
  },
  submitButton: {
    label: 'onboarding.submit',
    loadingLabel: 'onboarding.submitting',
  },
}
