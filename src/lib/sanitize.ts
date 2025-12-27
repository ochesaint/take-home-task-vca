import DOMPurify from 'dompurify'
import type { FieldValues } from 'react-hook-form'

/**
 * Sanitizes input by stripping all HTML tags.
 * Use this for form inputs before submission to prevent XSS attacks.
 */
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}

/**
 * Sanitizes all string values in form data to prevent XSS attacks.
 */
export function sanitizeFormData<T extends FieldValues>(data: T): T {
  const sanitized = {} as T
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key]
      // Type-safe: TypeScript infers the correct type for each key
      // When value is a string, sanitizeInput returns string (matching T[typeof key])
      // When value is not a string, we keep it as-is
      sanitized[key] = (
        typeof value === 'string' ? sanitizeInput(value) : value
      ) as T[typeof key]
    }
  }
  return sanitized
}
