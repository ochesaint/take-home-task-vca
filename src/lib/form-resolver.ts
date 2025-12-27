import { zodResolver as baseZodResolver } from '@hookform/resolvers/zod'
import type { FieldValues, Resolver } from 'react-hook-form'
import type { ZodSchema } from 'zod'

/**
 * Type-safe wrapper for zodResolver that handles the generic type incompatibility
 * between @hookform/resolvers and react-hook-form with Zod v4.
 *
 * @see https://github.com/react-hook-form/resolvers/issues/800
 * @see https://github.com/colinhacks/zod/issues/3891
 */
export function createZodResolver<T extends FieldValues>(
  schema: ZodSchema<T>
): Resolver<T> {
  // Type assertion is required due to generic inference issues between
  // @hookform/resolvers, react-hook-form, and Zod v4.
  // The runtime behavior is correct - only the types don't align.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return baseZodResolver(schema as any) as Resolver<T>
}
