import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { SuccessMessage } from '../success-message'

describe('SuccessMessage', () => {
  it('should render success message with title and description', () => {
    render(<SuccessMessage />)

    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(
      screen.getByText('Your information has been submitted successfully.')
    ).toBeInTheDocument()
  })

  it('should display checkmark icon', () => {
    const { container } = render(<SuccessMessage />)
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should render in a card container', () => {
    const { container } = render(<SuccessMessage />)
    const card = container.querySelector('[data-slot="card"]')
    expect(card).toBeInTheDocument()
  })
})
