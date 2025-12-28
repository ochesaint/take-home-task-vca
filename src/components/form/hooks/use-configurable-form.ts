import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import type { FieldValues, Path, DefaultValues } from 'react-hook-form'
import { createZodResolver } from '@/lib/form-resolver'
import type { FormConfig, FieldConfig } from '../types'
import { sanitizeFormData } from '@/lib/sanitize'

/**
 * Finds a field config by name across all steps.
 *
 * @template T - Form data type
 * @param config - Form configuration
 * @param fieldName - Field name to find
 * @returns Field configuration or undefined if not found
 */
function findFieldConfig<T extends FieldValues>(
  config: FormConfig<T>,
  fieldName: Path<T>
): FieldConfig<T> | undefined {
  for (const step of config.steps) {
    const field = step.fields.find((f) => f.name === fieldName)
    if (field) return field
  }
  return undefined
}

/**
 * Options for the useConfigurableForm hook.
 */
interface UseConfigurableFormOptions<T extends FieldValues> {
  /** Form configuration */
  config: FormConfig<T>
  /** Submit handler */
  onSubmit: (data: T) => Promise<void>
}

/**
 * Generic hook for configurable forms.
 * Integrates React Hook Form, Zod validation, and submission.
 * Handles error clearing when user edits fields after a submit error.
 */
export function useConfigurableForm<T extends FieldValues>({
  config,
  onSubmit,
}: UseConfigurableFormOptions<T>) {
  const form = useForm<T>({
    resolver: createZodResolver(config.schema),
    defaultValues: config.defaultValues as DefaultValues<T>,
    mode: 'onBlur',
  })

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data: T) => {
      const sanitizedData = sanitizeFormData(data)
      await onSubmit(sanitizedData)
    },
    onSuccess: () => {
      form.reset()
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    await submitMutation.mutateAsync(data)
  })

  // Check if form is valid and complete
  const { errors, isValidating } = form.formState
  const hasErrors = Object.keys(errors).length > 0

  // Watch all field values to check if form is filled
  // eslint-disable-next-line react-hooks/incompatible-library
  const values = form.watch()
  const allFieldsFilled = Object.values(values).every(
    (v) => v && String(v).trim().length > 0
  )

  // Clear submit error when user starts editing after an error
  const previousValuesRef = useRef<string>('')
  useEffect(() => {
    const currentValuesString = JSON.stringify(values)
    if (
      submitMutation.error &&
      previousValuesRef.current !== currentValuesString
    ) {
      submitMutation.reset()
    }
    previousValuesRef.current = currentValuesString
  }, [values, submitMutation])

  // Determine if submit button should be disabled
  const isSubmitDisabled =
    hasErrors || !allFieldsFilled || submitMutation.isPending || isValidating

  return {
    form,
    handleSubmit,
    isSubmitting: submitMutation.isPending,
    isValidating,
    isSuccess: submitMutation.isSuccess,
    submitError: submitMutation.error,
    isSubmitDisabled,
    config,
    /** Helper to get field config by name */
    getFieldConfig: (fieldName: Path<T>) => findFieldConfig(config, fieldName),
  }
}

/**
 * Return type for the useConfigurableForm hook.
 */
export type UseConfigurableFormReturn<T extends FieldValues> = ReturnType<
  typeof useConfigurableForm<T>
>
