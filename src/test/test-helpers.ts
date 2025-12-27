import { beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'

/**
 * Common test setup utilities to reduce duplication across test files.
 */

/**
 * Sets up common beforeEach hooks for tests that need:
 * - localStorage cleared
 * - All mocks cleared
 */
export function setupCommonTestHooks() {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })
}

/**
 * Creates a mock fetch response factory.
 * Useful for API client tests.
 */
export function createMockFetchResponse<T = unknown>(
  data: T,
  options: {
    ok?: boolean
    status?: number
    statusText?: string
  } = {}
) {
  const { ok = true, status = 200, statusText = 'OK' } = options

  return {
    ok,
    status,
    statusText,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  } as Response
}

/**
 * Mocks globalThis.fetch with a response.
 * Returns the mock function for further assertions.
 */
export function mockFetch<T = unknown>(
  data: T,
  options?: { ok?: boolean; status?: number }
): Mock {
  const mockResponse = createMockFetchResponse(data, options)
  globalThis.fetch = vi
    .fn()
    .mockResolvedValue(mockResponse) as unknown as typeof fetch
  return globalThis.fetch as unknown as Mock
}

/**
 * Mocks globalThis.fetch to reject with an error.
 */
export function mockFetchError(error: Error): Mock {
  globalThis.fetch = vi.fn().mockRejectedValue(error) as unknown as typeof fetch
  return globalThis.fetch as unknown as Mock
}

/**
 * Creates env mock configuration.
 * Note: vi.mock() must be called at the top level of test files.
 * Use this to get the env config object for vi.mock().
 */
export function createMockEnv(
  overrides: Partial<{
    VITE_ENVIRONMENT: string
    VITE_API_BASE_URL: string
    VITE_SENTRY_DSN: string | undefined
  }> = {}
) {
  return {
    VITE_ENVIRONMENT: 'test',
    VITE_API_BASE_URL: 'https://api.test.com',
    VITE_SENTRY_DSN: undefined,
    ...overrides,
  }
}

/**
 * Creates Sentry mock functions.
 * Note: vi.mock() must be called at the top level of test files.
 * Use this to get the mock functions for vi.mock().
 */
export function createMockSentry() {
  const captureException = vi.fn()

  return {
    Sentry: {
      captureException,
    },
    captureException: vi.fn(),
    captureExceptionSync: vi.fn(),
  }
}

/**
 * Waits for a condition to be true.
 * Useful for async operations in tests.
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 1000
): Promise<void> {
  const start = Date.now()
  while (!condition()) {
    if (Date.now() - start > timeout) {
      throw new Error('Condition timeout')
    }
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
}
