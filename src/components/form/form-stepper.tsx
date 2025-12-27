import { useTranslation } from 'react-i18next'

/**
 * Props for the FormStepper component.
 */
interface FormStepperProps {
  /** Current step (1-indexed) */
  currentStep: number
  /** Total number of steps */
  totalSteps: number
}

/**
 * Displays the current step progress indicator with accessibility support.
 */
export function FormStepper({ currentStep, totalSteps }: FormStepperProps) {
  const { t } = useTranslation()

  const stepLabel = t('onboarding.step', {
    current: currentStep,
    total: totalSteps,
  })

  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={stepLabel}
      className="text-primary mb-28 text-center text-lg"
    >
      {stepLabel}
    </div>
  )
}
