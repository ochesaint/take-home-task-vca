import type { ReactNode } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import type { ZodSchema } from 'zod'
import type { MaskConfig } from './masks'

/**
 * Supported field types in the configurable form system.
 * Extend this union to add new field types.
 */
export type FieldType = 'text' | 'phone' | 'number'

/**
 * Base configuration shared by all field types.
 */
interface BaseFieldConfig<T extends FieldValues> {
  /** Field name - must match a key in the form schema */
  name: Path<T>
  /** Display label (can be i18n key) */
  label: string
  /** Placeholder text */
  placeholder?: string
  /** Grid layout - 'half' for 2 columns, 'full' for full width */
  grid?: 'full' | 'half'
  /** HTML autocomplete attribute */
  autoComplete?: string
  /** Whether this field should be focused on mount */
  autoFocus?: boolean
  /** Input mask configuration - preset name or custom mask config */
  mask?: MaskConfig
}

/**
 * Text field configuration.
 */
export interface TextFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  type: 'text'
  /** Maximum character length */
  maxLength?: number
}

/**
 * Number field configuration (for numeric-only inputs like corporation number).
 */
export interface NumberFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  type: 'number'
  /** Maximum character length */
  maxLength?: number
  /** Async validation UI configuration (actual validation is in Zod schema) */
  asyncValidation?: {
    /** Whether to show validation state indicator (loading/success/error) */
    showIndicator?: boolean
  }
}

/**
 * Phone field configuration.
 */
export interface PhoneFieldConfig<
  T extends FieldValues,
> extends BaseFieldConfig<T> {
  type: 'phone'
}

/**
 * Union of all field configurations.
 * Add new field config types here when extending.
 */
export type FieldConfig<T extends FieldValues> =
  | TextFieldConfig<T>
  | NumberFieldConfig<T>
  | PhoneFieldConfig<T>

/**
 * Configuration for a single form step.
 */
export interface FormStepConfig<T extends FieldValues> {
  /** Unique step identifier */
  id: string
  /** Step title (can be i18n key) */
  title: string
  /** Fields in this step */
  fields: FieldConfig<T>[]
}

/**
 * Complete form configuration.
 */
export interface FormConfig<T extends FieldValues> {
  /** Form steps */
  steps: FormStepConfig<T>[]
  /** Zod validation schema */
  schema: ZodSchema<T>
  /** Default values for the form */
  defaultValues: T
  /** Submit button configuration */
  submitButton?: {
    /** Button text (can be i18n key) */
    label: string
    /** Loading text (can be i18n key) */
    loadingLabel?: string
  }
}

/**
 * Props for the ConfigurableForm component.
 */
export interface ConfigurableFormProps<T extends FieldValues> {
  /** Form configuration */
  config: FormConfig<T>
  /** Form submission handler */
  onSubmit: (data: T) => Promise<void>
  /** Component to render on success */
  successComponent?: ReactNode
  /** Total steps to show in stepper (can be more than config.steps.length for multi-page wizards) */
  totalSteps?: number
  /** Current step offset for multi-page wizards */
  stepOffset?: number
  /** Custom class name for the form container */
  className?: string
}
