import { env } from '@/config/env'

/**
 * PII fields to scrub from error reports for PIPEDA compliance.
 * These fields will be redacted before sending to Sentry.
 */
const PII_FIELDS = ['firstName', 'lastName', 'phone', 'corporationNumber']

/**
 * Cached Sentry module reference for lazy loading.
 */
let sentryModule: typeof import('@sentry/react') | null = null

/**
 * Promise that resolves when Sentry is initialized.
 */
let sentryInitPromise: Promise<void> | null = null

/**
 * Lazily loads and returns the Sentry module.
 * This enables code splitting so Sentry is not included in the initial bundle.
 *
 * @returns Promise resolving to the Sentry module
 */
async function getSentry(): Promise<typeof import('@sentry/react')> {
  if (sentryModule) {
    return sentryModule
  }
  sentryModule = await import('@sentry/react')
  return sentryModule
}

/**
 * Initializes Sentry error monitoring with PII scrubbing for PIPEDA compliance.
 * Lazily loads Sentry to reduce initial bundle size.
 */
export function initSentry(): void {
  if (!env.VITE_SENTRY_DSN) {
    return
  }

  // Start loading Sentry in the background
  sentryInitPromise = getSentry().then((Sentry) => {
    Sentry.init({
      dsn: env.VITE_SENTRY_DSN,
      environment: env.VITE_ENVIRONMENT,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          // Mask all text for privacy
          maskAllText: true,
          maskAllInputs: true,
        }),
      ],
      tracesSampleRate: env.VITE_ENVIRONMENT === 'production' ? 0.1 : 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // Scrub PII from error reports (PIPEDA compliance)
      beforeSend(event) {
        if (event.extra) {
          PII_FIELDS.forEach((field) => {
            if (event.extra?.[field]) {
              event.extra[field] = '[REDACTED]'
            }
          })
        }
        return event
      },

      // Scrub PII from breadcrumbs
      beforeBreadcrumb(breadcrumb) {
        if (breadcrumb.data) {
          PII_FIELDS.forEach((field) => {
            if (breadcrumb.data?.[field]) {
              breadcrumb.data[field] = '[REDACTED]'
            }
          })
        }
        return breadcrumb
      },
    })
  })
}

/**
 * Captures an exception and sends it to Sentry.
 * Safe to call even if Sentry is not yet initialized or DSN is not configured.
 */
export async function captureException(
  error: unknown,
  context?: { extra?: Record<string, unknown> }
): Promise<void> {
  if (!env.VITE_SENTRY_DSN) {
    // Log to console in development when Sentry is not configured
    console.error('[Sentry disabled]', error, context)
    return
  }

  // Wait for Sentry to be initialized
  if (sentryInitPromise) {
    await sentryInitPromise
  }

  const Sentry = await getSentry()
  Sentry.captureException(error, context)
}

/**
 * Synchronous wrapper for captureException.
 * Use this when you can't await (e.g., in class components).
 */
export function captureExceptionSync(
  error: unknown,
  context?: { extra?: Record<string, unknown> }
): void {
  void captureException(error, context)
}

/**
 * @deprecated Use captureException or captureExceptionSync instead.
 * This export is kept for backwards compatibility but will be removed in a future version.
 */
export const Sentry = {
  captureException: captureExceptionSync,
}
