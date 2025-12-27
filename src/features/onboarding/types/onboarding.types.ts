import type { z } from 'zod'
import type { corporationValidationResponseSchema } from '../schemas/onboarding.schema'

export type CorporationValidationResponse = z.infer<
  typeof corporationValidationResponseSchema
>
