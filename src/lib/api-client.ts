import { z } from 'zod'
import { Sentry } from '@/lib/sentry'

/**
 * API base URL.
 * Uses /api prefix which is proxied by Vite in development and Vercel in production.
 * This avoids CORS issues and provides a consistent API path.
 */
const API_BASE = '/api'

/**
 * Type-safe API request with Zod validation.
 * Validates response data at runtime for defense in depth.
 */
export async function apiRequest<T>(
  endpoint: string,
  schema: z.ZodSchema<T>,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    // Try to parse JSON response
    let data: unknown
    try {
      data = await response.json()
    } catch {
      // If JSON parsing fails, create error from status
      if (!response.ok) {
        const error = new Error(`API Error: ${response.status}`)
        Sentry.captureException(error, {
          extra: { status: response.status, endpoint },
        })
        throw error
      }
      data = {}
    }

    if (!response.ok) {
      const errorMessage =
        (data && typeof data === 'object' && 'message' in data
          ? String(data.message)
          : undefined) || `API Error: ${response.status}`
      const error = new Error(errorMessage)
      Sentry.captureException(error, {
        extra: { status: response.status, endpoint, responseData: data },
      })
      throw error
    }

    // Runtime validation of API response
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = new Error('API response validation failed')
      Sentry.captureException(validationError, {
        extra: { endpoint, zodErrors: error.issues },
      })
      throw validationError
    }
    throw error
  }
}

/**
 * POST request helper with type-safe body and response.
 */
export async function apiPost<TBody, TResponse>(
  endpoint: string,
  body: TBody,
  responseSchema: z.ZodSchema<TResponse>
): Promise<TResponse> {
  return apiRequest(endpoint, responseSchema, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * GET request helper with type-safe response.
 */
export async function apiGet<T>(
  endpoint: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  return apiRequest(endpoint, schema, { method: 'GET' })
}
