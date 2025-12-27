import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { apiRequest, apiPost, apiGet } from '../api-client'
import { Sentry } from '../sentry'
import {
  setupCommonTestHooks,
  mockFetch,
  mockFetchError,
} from '@/test/test-helpers'

vi.mock('../sentry', () => ({
  Sentry: {
    captureException: vi.fn(),
  },
  captureException: vi.fn(),
  captureExceptionSync: vi.fn(),
}))

vi.mock('../config/env', () => ({
  env: {
    VITE_ENVIRONMENT: 'test',
    VITE_API_BASE_URL: 'https://api.test.com',
  },
}))

describe('api-client', () => {
  setupCommonTestHooks()

  describe('apiRequest', () => {
    const testSchema = z.object({ id: z.string(), name: z.string() })

    it('should return validated data on successful request', async () => {
      const mockData = { id: '1', name: 'Test' }
      mockFetch(mockData)

      const result = await apiRequest('/test', testSchema)
      expect(result).toEqual(mockData)
    })

    it('should throw error on non-ok response', async () => {
      mockFetch({ message: 'Not found' }, { ok: false, status: 404 })

      await expect(apiRequest('/test', testSchema)).rejects.toThrow()
      expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('should handle JSON parse failure', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      }
      globalThis.fetch = vi
        .fn()
        .mockResolvedValue(mockResponse) as unknown as typeof fetch

      await expect(apiRequest('/test', testSchema)).rejects.toThrow()
      expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('should throw validation error on invalid response', async () => {
      mockFetch({ invalid: 'data' })

      await expect(apiRequest('/test', testSchema)).rejects.toThrow(
        'API response validation failed'
      )
      expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('should handle network errors', async () => {
      mockFetchError(new Error('Network error'))

      await expect(apiRequest('/test', testSchema)).rejects.toThrow(
        'Network error'
      )
    })
  })

  describe('apiPost', () => {
    const responseSchema = z.object({ success: z.boolean() })

    it('should send POST request with body', async () => {
      const mockResponse = { success: true }
      const mockFn = mockFetch(mockResponse)

      const result = await apiPost('/test', { data: 'test' }, responseSchema)
      expect(result).toEqual(mockResponse)
      expect(mockFn).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ data: 'test' }),
        })
      )
    })
  })

  describe('apiGet', () => {
    const responseSchema = z.object({ data: z.string() })

    it('should send GET request', async () => {
      const mockResponse = { data: 'test' }
      const mockFn = mockFetch(mockResponse)

      const result = await apiGet('/test', responseSchema)
      expect(result).toEqual(mockResponse)
      expect(mockFn).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      )
    })
  })
})
