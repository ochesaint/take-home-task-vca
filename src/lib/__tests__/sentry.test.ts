import { describe, it, expect, vi } from 'vitest'
import { initSentry, captureException, captureExceptionSync } from '../sentry'
import { setupCommonTestHooks } from '@/test/test-helpers'

describe('sentry', () => {
  setupCommonTestHooks()

  describe('initSentry', () => {
    it('should not throw when called', () => {
      expect(() => initSentry()).not.toThrow()
    })

    it('should not initialize when DSN is not provided', () => {
      vi.doMock('../config/env', () => ({
        env: {
          VITE_SENTRY_DSN: undefined,
          VITE_ENVIRONMENT: 'test',
        },
      }))
      expect(() => initSentry()).not.toThrow()
    })
  })

  describe('captureException', () => {
    it('should log to console when Sentry is not configured', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.doMock('../config/env', () => ({
        env: {
          VITE_SENTRY_DSN: undefined,
          VITE_ENVIRONMENT: 'test',
        },
      }))

      const error = new Error('Test error')
      await captureException(error)

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle errors gracefully', async () => {
      const error = new Error('Test error')
      await expect(captureException(error)).resolves.not.toThrow()
    })
  })

  describe('captureExceptionSync', () => {
    it('should call captureException asynchronously without throwing', () => {
      const error = new Error('Test error')
      expect(() =>
        captureExceptionSync(error, { extra: { test: 'data' } })
      ).not.toThrow()
    })
  })
})
