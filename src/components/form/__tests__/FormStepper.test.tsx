import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { FormStepper } from '../form-stepper'

describe('FormStepper', () => {
  it('displays the current step and total steps', () => {
    render(<FormStepper currentStep={1} totalSteps={5} />)

    // Should show step indicator text
    expect(screen.getByText(/step.*1.*5/i)).toBeInTheDocument()
  })

  it('has progressbar role with correct aria attributes', () => {
    render(<FormStepper currentStep={2} totalSteps={5} />)

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toBeInTheDocument()
    expect(progressbar).toHaveAttribute('aria-valuenow', '2')
    expect(progressbar).toHaveAttribute('aria-valuemin', '1')
    expect(progressbar).toHaveAttribute('aria-valuemax', '5')
  })

  it('updates when step changes', () => {
    const { rerender } = render(<FormStepper currentStep={1} totalSteps={5} />)

    expect(screen.getByText(/step.*1.*5/i)).toBeInTheDocument()

    rerender(<FormStepper currentStep={3} totalSteps={5} />)

    expect(screen.getByText(/step.*3.*5/i)).toBeInTheDocument()
  })

  it('handles single step forms', () => {
    render(<FormStepper currentStep={1} totalSteps={1} />)

    expect(screen.getByText(/step.*1.*1/i)).toBeInTheDocument()
  })
})
