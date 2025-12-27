import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FieldValues } from 'react-hook-form'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormStepper } from './form-stepper'
import { FormStepRenderer } from './form-step-renderer'
import { useConfigurableForm } from '@/components/form/hooks'
import type { ConfigurableFormProps } from './types'
import { cn } from '@/lib/utils'

/**
 * Configurable form component that renders fields based on configuration.
 * Supports multi-step forms and async validation.
 *
 * Uses the useConfigurableForm hook for all form logic.
 */
export function ConfigurableForm<T extends FieldValues>({
  config,
  onSubmit,
  successComponent,
  totalSteps,
  stepOffset = 0,
  className,
}: ConfigurableFormProps<T>) {
  const { t } = useTranslation()

  const {
    form,
    handleSubmit,
    isSubmitting,
    isSuccess,
    submitError,
    isSubmitDisabled,
  } = useConfigurableForm({ config, onSubmit })

  // Show success component if submission succeeded
  if (isSuccess && successComponent) {
    return <>{successComponent}</>
  }

  // For now, we only support single-step forms (first step)
  const currentStep = config.steps[0]
  const displayStep = 1 + stepOffset
  const displayTotalSteps = totalSteps || config.steps.length

  const submitButtonLabel = config.submitButton?.label || 'onboarding.submit'
  const submitButtonLoadingLabel =
    config.submitButton?.loadingLabel || 'onboarding.submitting'

  return (
    <FormProvider {...form}>
      <div className={cn('w-full max-w-xl', className)}>
        <FormStepper currentStep={displayStep} totalSteps={displayTotalSteps} />

        <Card className="rounded-2xl border-gray-200 p-4 shadow-sm sm:rounded-3xl sm:p-8">
          <CardContent className="p-0">
            <h1 className="mb-6 text-center text-2xl font-normal tracking-tight sm:mb-8 sm:text-3xl">
              {t(currentStep.title)}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <FormStepRenderer step={currentStep} />

              {submitError && (
                <p className="text-destructive text-sm" role="alert">
                  {submitError instanceof Error
                    ? submitError.message
                    : t('common.error')}
                </p>
              )}

              <Button
                type="submit"
                className="mt-2 h-12 w-full rounded-xl bg-black text-sm font-normal hover:bg-gray-900 sm:h-14 sm:rounded-2xl sm:text-base"
                disabled={isSubmitDisabled}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t(submitButtonLoadingLabel)}
                  </>
                ) : (
                  <>
                    {t(submitButtonLabel)}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  )
}
