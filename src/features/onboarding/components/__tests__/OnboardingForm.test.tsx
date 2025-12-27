import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@/test/test-utils.tsx'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { OnboardingForm } from '../onboarding-form.tsx'

expect.extend(toHaveNoViolations)

describe('OnboardingForm', () => {
  it('renders all form fields', () => {
    render(<OnboardingForm />)

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/corporation number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('shows validation errors on blur for empty required fields', async () => {
    const user = userEvent.setup()
    render(<OnboardingForm />)

    const firstNameInput = screen.getByLabelText(/first name/i)
    await user.click(firstNameInput)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
    })
  })

  it('validates phone number format on form submit', async () => {
    const user = userEvent.setup()
    render(<OnboardingForm />)

    // Fill name fields
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')

    // Type an incomplete phone number
    const phoneInput = screen.getByLabelText(/phone number/i)
    fireEvent.change(phoneInput, { target: { value: '+1123' } })
    fireEvent.blur(phoneInput)

    // Submit form to trigger all validations
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      // Should show validation error for invalid phone
      expect(
        screen.getByText(/must be a valid canadian phone number/i)
      ).toBeInTheDocument()
    })
  })

  it('accepts valid Canadian phone number', async () => {
    const user = userEvent.setup()
    render(<OnboardingForm />)

    // Fill in required fields first to avoid other validation errors
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')

    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '3062776103')
    await user.tab()

    // Give time for validation to complete
    await waitFor(
      () => {
        const phoneError = screen.queryByText(
          /must be a valid canadian phone number/i
        )
        expect(phoneError).not.toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  it('validates corporation number length on submit', async () => {
    const user = userEvent.setup()
    render(<OnboardingForm />)

    // Fill other required fields
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')

    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '3062776103')

    // Type short corporation number using fireEvent for controlled input
    const corpInput = screen.getByLabelText(/corporation number/i)
    fireEvent.change(corpInput, { target: { value: '123' } })
    fireEvent.blur(corpInput)

    // Submit form to trigger validation
    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      // Should show length validation error
      expect(
        screen.getByText(/corporation number must be 9 digits/i)
      ).toBeInTheDocument()
    })
  })

  it('shows corporation number input with correct maxLength', () => {
    render(<OnboardingForm />)

    const corpInput = screen.getByLabelText(/corporation number/i)
    expect(corpInput).toHaveAttribute('maxlength', '9')
  })

  it('shows invalid corporation error for bad number', async () => {
    render(<OnboardingForm />)

    const corpInput = screen.getByLabelText(/corporation number/i)

    // Use fireEvent to directly set the value for controlled inputs
    // This simulates the user typing a full corporation number
    fireEvent.input(corpInput, { target: { value: '000000000' } })
    fireEvent.blur(corpInput)

    // Wait for async validation error
    await waitFor(
      () => {
        expect(
          screen.getByText(/invalid corporation number/i)
        ).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  })

  it('has maxLength attribute on name inputs', () => {
    render(<OnboardingForm />)

    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)

    expect(firstNameInput).toHaveAttribute('maxlength', '50')
    expect(lastNameInput).toHaveAttribute('maxlength', '50')
  })

  describe('Accessibility (AODA Compliance)', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<OnboardingForm />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('has accessible form structure', () => {
      render(<OnboardingForm />)

      // All inputs have associated labels
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/corporation number/i)).toBeInTheDocument()

      // Submit button is accessible
      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeInTheDocument()
    })

    it('shows error messages with proper role on submit', async () => {
      const user = userEvent.setup()
      render(<OnboardingForm />)

      // Submit empty form to trigger validation
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Error messages should have role="alert"
        const errorMessages = screen.getAllByRole('alert')
        expect(errorMessages.length).toBeGreaterThan(0)
      })
    })
  })
})
