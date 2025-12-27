import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { server } from './mocks/server'

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Clear localStorage before each test to prevent state leakage
beforeEach(() => {
  localStorage.clear()
})

// Reset any request handlers between tests
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})

// Clean up after all tests are done
afterAll(() => server.close())
