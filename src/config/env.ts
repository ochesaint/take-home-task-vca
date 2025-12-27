import { z } from 'zod'

/**
 * Environment variable schema with runtime validation.
 * Validates and provides type-safe access to environment variables.
 */
const envSchema = z.object({
  /** Base URL for API requests */
  VITE_API_BASE_URL: z
    .string()
    .url()
    .default('https://fe-hometask-api.qa.vault.tryvault.com'),
  /** Sentry DSN for error tracking (optional) */
  VITE_SENTRY_DSN: z.string().optional(),
  /** Current environment (development, staging, production) */
  VITE_ENVIRONMENT: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
})

/**
 * Validated environment variables.
 * Parsed and type-safe for use throughout the application.
 */
export const env = envSchema.parse(import.meta.env)

/**
 * Type definition for environment variables.
 */
export type Env = z.infer<typeof envSchema>
