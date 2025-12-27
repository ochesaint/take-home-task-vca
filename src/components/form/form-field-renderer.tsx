import { Controller, useFormContext } from 'react-hook-form'
import type { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Loader2, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { MaskedInput } from '@/components/ui/masked-input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FieldConfig } from './types'

/**
 * Props for the FieldWrapper component.
 */
interface FieldWrapperProps {
  /** Field name for ID generation */
  fieldName: string
  /** Field label (i18n key or text) */
  fieldLabel: string
  /** Translated error message to display */
  translatedError?: string
  /** Translation function */
  t: (key: string) => string
  /** Child input element */
  children: React.ReactNode
}

/**
 * Common wrapper for form fields with label and error display.
 * Provides consistent styling and accessibility attributes.
 *
 * @param props - Component props
 */
function FieldWrapper({
  fieldName,
  fieldLabel,
  translatedError,
  t,
  children,
}: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-normal" htmlFor={fieldName}>
        {t(fieldLabel)}
      </Label>
      {children}
      {translatedError && (
        <p
          id={`${fieldName}-error`}
          className="text-destructive text-sm"
          role="alert"
        >
          {translatedError}
        </p>
      )}
    </div>
  )
}

/**
 * Props for the ValidationIndicator component.
 */
interface ValidationIndicatorProps {
  /** Whether validation is currently running */
  isValidating: boolean
  /** Whether the field has an error */
  hasError: boolean
  /** Whether the field has been validated successfully (touched + no error) */
  isValid: boolean
  /** Whether to show the indicator */
  showIndicator: boolean
  /** Callback to clear the field value */
  onClear?: () => void
}

/**
 * Indicator for async validation state (loading, success, error).
 * Displays appropriate icons based on validation status.
 * The error icon is clickable to clear the field.
 *
 * @param props - Component props
 */
function ValidationIndicator({
  isValidating,
  hasError,
  isValid,
  showIndicator,
  onClear,
}: ValidationIndicatorProps) {
  if (!showIndicator) return null

  // Don't show anything if not validating and no result yet
  if (!isValidating && !hasError && !isValid) return null

  return (
    <div className="absolute top-1/2 right-3 -translate-y-1/2">
      {isValidating && (
        <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
      )}
      {!isValidating && isValid && <Check className="h-4 w-4 text-green-600" />}
      {!isValidating && hasError && (
        <button
          type="button"
          onClick={onClear}
          className="text-destructive hover:text-destructive/80 cursor-pointer"
          aria-label="Clear field"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

/**
 * Props for the FormFieldRenderer component.
 */
interface FormFieldRendererProps<T extends FieldValues> {
  /** Field configuration */
  field: FieldConfig<T>
}

/**
 * Renders a form field based on its configuration.
 * Handles different field types with consistent styling and error display.
 * For number fields with async validation, uses React Hook Form's built-in
 * async validation via Controller.rules.validate.
 */
export function FormFieldRenderer<T extends FieldValues>({
  field,
}: FormFieldRendererProps<T>) {
  const { t } = useTranslation()
  const {
    register,
    control,
    formState: { errors, isValidating, touchedFields, dirtyFields },
  } = useFormContext<T>()

  const fieldError = errors[field.name]
  const errorMessage = fieldError?.message as string | undefined
  const hasError = !!errorMessage
  const isTouched = !!(touchedFields as Record<string, boolean>)[
    String(field.name)
  ]
  const isDirty = !!(dirtyFields as Record<string, boolean>)[String(field.name)]

  // Translate error message if it's an i18n key
  const translatedError = errorMessage
    ? t(errorMessage, { max: 50 })
    : undefined

  // Path<T> is a string literal type, convert to string for DOM attributes
  const fieldName = String(field.name)

  // Determine if we should show async validation indicator
  const showValidationIndicator =
    field.type === 'number' && !!field.asyncValidation?.showIndicator

  // For validation indicator: field is valid if touched, dirty, and no error
  const isFieldValid = isTouched && isDirty && !hasError && !isValidating

  // Render based on field type
  switch (field.type) {
    case 'text': {
      const textMask = field.mask
      if (textMask) {
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <FieldWrapper
                fieldName={fieldName}
                fieldLabel={field.label}
                translatedError={translatedError}
                t={t}
              >
                <MaskedInput
                  id={fieldName}
                  value={controllerField.value || ''}
                  onChange={controllerField.onChange}
                  onBlur={controllerField.onBlur}
                  mask={textMask}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  autoFocus={field.autoFocus}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${fieldName}-error` : undefined}
                  className={cn(
                    'h-12 rounded-xl border-gray-200',
                    hasError && 'border-destructive'
                  )}
                />
              </FieldWrapper>
            )}
          />
        )
      }

      return (
        <FieldWrapper
          fieldName={fieldName}
          fieldLabel={field.label}
          translatedError={translatedError}
          t={t}
        >
          <Input
            id={fieldName}
            {...register(field.name)}
            placeholder={field.placeholder || ''}
            maxLength={field.maxLength}
            autoComplete={field.autoComplete}
            autoFocus={field.autoFocus}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${fieldName}-error` : undefined}
            className={cn(
              'h-12 rounded-xl border-gray-200',
              hasError && 'border-destructive'
            )}
          />
        </FieldWrapper>
      )
    }

    case 'number': {
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => {
            // Filter to only allow numeric input
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const numericValue = e.target.value.replace(/\D/g, '')
              controllerField.onChange(numericValue)
            }

            // Clear handler for the X button
            const handleClear = () => {
              controllerField.onChange('')
            }

            return (
              <FieldWrapper
                fieldName={fieldName}
                fieldLabel={field.label}
                translatedError={translatedError}
                t={t}
              >
                <div className="relative">
                  {field.mask ? (
                    <MaskedInput
                      id={fieldName}
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                      onBlur={controllerField.onBlur}
                      mask={field.mask}
                      placeholder={field.placeholder}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={field.autoComplete}
                      autoFocus={field.autoFocus}
                      aria-invalid={hasError}
                      aria-describedby={
                        hasError ? `${fieldName}-error` : undefined
                      }
                      className={cn(
                        'h-12 rounded-xl border-gray-200',
                        hasError && 'border-destructive',
                        showValidationIndicator && 'pr-10'
                      )}
                    />
                  ) : (
                    <Input
                      id={fieldName}
                      value={controllerField.value || ''}
                      onChange={handleChange}
                      onBlur={controllerField.onBlur}
                      placeholder={field.placeholder || ''}
                      maxLength={field.maxLength}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={field.autoComplete}
                      autoFocus={field.autoFocus}
                      aria-invalid={hasError}
                      aria-describedby={
                        hasError ? `${fieldName}-error` : undefined
                      }
                      className={cn(
                        'h-12 rounded-xl border-gray-200',
                        hasError && 'border-destructive',
                        showValidationIndicator && 'pr-10'
                      )}
                    />
                  )}
                  <ValidationIndicator
                    isValidating={isValidating}
                    hasError={hasError}
                    isValid={isFieldValid}
                    showIndicator={showValidationIndicator}
                    onClear={handleClear}
                  />
                </div>
              </FieldWrapper>
            )
          }}
        />
      )
    }

    case 'phone': {
      const phoneMask = field.mask
      if (phoneMask) {
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <FieldWrapper
                fieldName={fieldName}
                fieldLabel={field.label}
                translatedError={translatedError}
                t={t}
              >
                <MaskedInput
                  id={fieldName}
                  value={controllerField.value || ''}
                  onChange={controllerField.onChange}
                  onBlur={controllerField.onBlur}
                  mask={phoneMask}
                  type="tel"
                  inputMode="tel"
                  autoComplete={field.autoComplete || 'tel'}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? `${fieldName}-error` : undefined}
                  className={cn(hasError && 'border-destructive')}
                />
              </FieldWrapper>
            )}
          />
        )
      }

      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <FieldWrapper
              fieldName={fieldName}
              fieldLabel={field.label}
              translatedError={translatedError}
              t={t}
            >
              <PhoneInput
                id={fieldName}
                value={controllerField.value}
                onChange={controllerField.onChange}
                onBlur={controllerField.onBlur}
                autoComplete={field.autoComplete || 'tel'}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${fieldName}-error` : undefined}
                className={cn(hasError && 'border-destructive')}
              />
            </FieldWrapper>
          )}
        />
      )
    }

    default: {
      // Exhaustive check - TypeScript will error if we miss a field type
      const _exhaustiveCheck: never = field
      return _exhaustiveCheck
    }
  }
}
