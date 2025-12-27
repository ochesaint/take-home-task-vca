import { z } from 'zod'
import { validateCorporationNumber } from '../services/onboarding.api'
import {
  CORP_NUMBER_LENGTH,
  MAX_NAME_LENGTH,
} from '@/features/onboarding/config/constants.ts'
import { isValidCanadianPhone } from '@/lib/formValuesValidators.ts'

/**
 * Corporation number must be exactly 9 digits.
 */
const corporationNumberRegex = new RegExp(`^\\d{${CORP_NUMBER_LENGTH}}$`)

/**
 * Cache for corporation number validation results.
 * Prevents duplicate API calls for the same value.
 */
const corporationValidationCache = new Map<string, boolean>()

/**
 * Track in-flight validation requests.
 * Prevents concurrent requests for the same value.
 */
const pendingValidations = new Map<string, Promise<boolean>>()

/**
 * Validates corporation number with caching and deduplication.
 * - Returns cached result if available
 * - Waits for pending request if one exists
 * - Only makes new API call if neither cached nor pending
 */
async function validateCorporationWithCache(value: string): Promise<boolean> {
  // Check cache first
  if (corporationValidationCache.has(value)) {
    return corporationValidationCache.get(value)!
  }

  // Check if there's already a pending request for this value
  if (pendingValidations.has(value)) {
    return pendingValidations.get(value)!
  }

  // Create the validation promise
  const validationPromise = (async () => {
    try {
      const result = await validateCorporationNumber(value)
      // Cache the result
      corporationValidationCache.set(value, result.valid)
      return result.valid
    } catch {
      // Don't cache errors - allow retry
      return false
    } finally {
      // Clean up pending state
      pendingValidations.delete(value)
    }
  })()

  // Track as pending
  pendingValidations.set(value, validationPromise)

  return validationPromise
}

/**
 * Zod schema for the onboarding form.
 * Uses async refinement for corporation number backend validation.
 */
export const onboardingSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'onboarding.errors.firstNameRequired')
    .max(MAX_NAME_LENGTH, 'onboarding.errors.maxLength'),
  lastName: z
    .string()
    .trim()
    .min(1, 'onboarding.errors.lastNameRequired')
    .max(MAX_NAME_LENGTH, 'onboarding.errors.maxLength'),
  phone: z
    .string()
    .trim()
    .min(1, 'onboarding.errors.phoneRequired')
    .refine(isValidCanadianPhone, {
      message: 'onboarding.errors.invalidPhone',
    }),
  corporationNumber: z
    .string()
    .trim()
    .min(1, 'onboarding.errors.corporationNumberRequired')
    .length(CORP_NUMBER_LENGTH, 'onboarding.errors.corporationLength')
    .regex(corporationNumberRegex, 'onboarding.errors.corporationDigitsOnly')
    .refine(
      async (value) => {
        // Only validate if we have exactly CORP_NUMBER_LENGTH digits
        if (
          value.length !== CORP_NUMBER_LENGTH ||
          !corporationNumberRegex.test(value)
        ) {
          return true // Let previous validations handle format errors
        }
        return validateCorporationWithCache(value)
      },
      { message: 'onboarding.errors.invalidCorporation' }
    ),
})

/**
 * Schema for corporation validation API response.
 */
export const corporationValidationResponseSchema = z.object({
  corporationNumber: z.string().optional(),
  valid: z.boolean(),
  message: z.string().optional(),
})

/**
 * Schema for profile submission request.
 */
export const profileSubmissionRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  corporationNumber: z.string(),
})

/**
 * Schema for profile submission response (just success status).
 */
export const profileSubmissionResponseSchema = z.object({
  message: z.string().optional(),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
