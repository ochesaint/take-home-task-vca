import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ExampleForm } from './ExampleForm'

expect.extend(toHaveNoViolations)

describe('ExampleForm', () => {
  it('renders form fields', () => {
    render(<ExampleForm />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
  })

  it('shows validation errors', async () => {
    const user = userEvent.setup()
    render(<ExampleForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await user.click(submitButton)

    expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument()
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<ExampleForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

