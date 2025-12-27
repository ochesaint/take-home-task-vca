import { apiPost } from '@/lib/api-client'
import { env } from '@/config/env'
import { Sentry } from '@/lib/sentry'
import {
  corporationValidationResponseSchema,
  profileSubmissionResponseSchema,
  type OnboardingFormData,
} from '../schemas/onboarding.schema'
import type { CorporationValidationResponse } from '../types/onboarding.types'

const API_BASE =
  env.VITE_ENVIRONMENT === 'development' ? '/api' : env.VITE_API_BASE_URL

/**
 * Validates a corporation number via the API.
 * Note: The API returns 404 for invalid corporation numbers,
 * but still provides a valid response body with validation details.
 */
export async function validateCorporationNumber(
  corporationNumber: string
): Promise<CorporationValidationResponse> {
  const url = `${API_BASE}/corporation-number/${corporationNumber}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()

    // API returns 404 for invalid numbers but with valid response body
    // Parse and return the response regardless of status code
    return corporationValidationResponseSchema.parse(data)
  } catch (error) {
    Sentry.captureException(error, {
      extra: { endpoint: `/corporation-number/${corporationNumber}` },
    })
    throw error
  }
}

/**
 * Submits the onboarding form data to the API.
 */
export async function submitOnboardingForm(
  data: OnboardingFormData
): Promise<void> {
  await apiPost('/profile-details/', data, profileSubmissionResponseSchema)
}
