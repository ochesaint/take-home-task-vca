import { http, HttpResponse } from 'msw'
import type { z } from 'zod'
import { profileSubmissionRequestSchema } from '@/features/onboarding/schemas/onboarding.schema'

// In tests/development, the API client uses /api prefix due to Vite proxy
// We need to handle both the proxy path and the full URL
// Use a default API base URL for tests to avoid importing env which uses import.meta.env
const API_BASE =
  process.env.VITE_API_BASE_URL ||
  'https://fe-hometask-api.qa.vault.tryvault.com'
const PROXY_BASE = '/api'

// Valid corporation numbers for testing
const VALID_CORPORATION_NUMBERS = [
  '826417395',
  '158739264',
  '123456789',
  '591863427',
  '312574689',
  '287965143',
  '265398741',
  '762354918',
  '468721395',
  '624719583',
] as const

/**
 * Type for profile submission request body.
 */
type ProfileSubmissionRequest = z.infer<typeof profileSubmissionRequestSchema>

/**
 * Type guard to check if an object is a valid profile submission request.
 */
function isProfileSubmissionRequest(
  body: unknown
): body is ProfileSubmissionRequest {
  return (
    typeof body === 'object' &&
    body !== null &&
    'firstName' in body &&
    'lastName' in body &&
    'phone' in body &&
    'corporationNumber' in body &&
    typeof body.firstName === 'string' &&
    typeof body.lastName === 'string' &&
    typeof body.phone === 'string' &&
    typeof body.corporationNumber === 'string'
  )
}

// Corporation validation handler factory
const createCorporationHandler = (basePath: string) =>
  http.get(`${basePath}/corporation-number/:number`, ({ params }) => {
    const { number } = params
    const corporationNumber =
      typeof number === 'string' ? number : String(number)
    const isValid = VALID_CORPORATION_NUMBERS.includes(
      corporationNumber as (typeof VALID_CORPORATION_NUMBERS)[number]
    )

    if (isValid) {
      return HttpResponse.json({
        corporationNumber,
        valid: true,
      })
    }

    return HttpResponse.json({
      valid: false,
      message: 'Invalid corporation number',
    })
  })

// Profile submission handler factory
const createProfileHandler = (basePath: string) =>
  http.post(`${basePath}/profile-details/`, async ({ request }) => {
    const body = await request.json()

    // Validate request body structure
    if (!isProfileSubmissionRequest(body)) {
      return HttpResponse.json(
        { message: 'Invalid request body structure' },
        { status: 400 }
      )
    }

    // Validate required fields
    const requiredFields: Array<keyof ProfileSubmissionRequest> = [
      'firstName',
      'lastName',
      'phone',
      'corporationNumber',
    ]
    for (const field of requiredFields) {
      if (!body[field]) {
        return HttpResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate phone number format
    if (!/^\+1[2-9]\d{9}$/.test(body.phone)) {
      return HttpResponse.json(
        { message: 'Invalid phone number' },
        { status: 400 }
      )
    }

    // Validate corporation number
    if (
      !VALID_CORPORATION_NUMBERS.includes(
        body.corporationNumber as (typeof VALID_CORPORATION_NUMBERS)[number]
      )
    ) {
      return HttpResponse.json(
        { message: 'Invalid corporation number' },
        { status: 400 }
      )
    }

    // Success
    return HttpResponse.json({}, { status: 200 })
  })

export const handlers = [
  // Handle both proxy path and full URL for corporation validation
  createCorporationHandler(PROXY_BASE),
  createCorporationHandler(API_BASE),

  // Handle both proxy path and full URL for profile submission
  createProfileHandler(PROXY_BASE),
  createProfileHandler(API_BASE),
]
