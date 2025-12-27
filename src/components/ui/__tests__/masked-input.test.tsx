import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { MaskedInput } from '../masked-input'
import type { CustomMaskConfig } from '@/components/form/masks'

// Helper component to test controlled MaskedInput
function ControlledMaskedInput({
  initialValue = '',
  mask,
  onChangeCallback,
}: {
  initialValue?: string
  mask: string | CustomMaskConfig
  onChangeCallback?: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (newValue: string) => {
    setValue(newValue)
    onChangeCallback?.(newValue)
  }

  return <MaskedInput value={value} onChange={handleChange} mask={mask} />
}

describe('MaskedInput', () => {
  it('renders with formatted value', () => {
    const handleChange = vi.fn()

    render(
      <MaskedInput
        value="+12345678901"
        onChange={handleChange}
        mask="phone-ca"
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('+1 (234) 567-8901')
  })

  it('calls onChange with parsed raw value', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <ControlledMaskedInput mask="phone-ca" onChangeCallback={handleChange} />
    )

    const input = screen.getByRole('textbox')
    await user.type(input, '12345678901')

    // Should call onChange with raw value including +
    expect(handleChange).toHaveBeenLastCalledWith('+12345678901')
  })

  it('shows placeholder when empty', () => {
    render(
      <MaskedInput
        value=""
        onChange={vi.fn()}
        mask="phone-ca"
        showPlaceholder={true}
      />
    )

    expect(screen.getByText('+1 (XXX) XXX-XXXX')).toBeInTheDocument()
  })

  it('hides placeholder when showPlaceholder is false', () => {
    render(
      <MaskedInput
        value=""
        onChange={vi.fn()}
        mask="phone-ca"
        showPlaceholder={false}
      />
    )

    expect(screen.queryByText('+1 (XXX) XXX-XXXX')).not.toBeInTheDocument()
  })

  it('works with custom mask config', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    const customMask: CustomMaskConfig = {
      format: (raw) => (raw ? `(${raw})` : ''),
      parse: (formatted) => formatted.replace(/[()]/g, ''),
      placeholder: '(XXX)',
    }

    function ControlledCustomMask() {
      const [value, setValue] = useState('')
      return (
        <MaskedInput
          value={value}
          onChange={(v) => {
            setValue(v)
            handleChange(v)
          }}
          mask={customMask}
        />
      )
    }

    render(<ControlledCustomMask />)

    const input = screen.getByRole('textbox')
    await user.type(input, '123')

    expect(handleChange).toHaveBeenLastCalledWith('123')
    expect(input).toHaveValue('(123)')
  })

  it('applies formatted maxLength from mask', () => {
    render(<MaskedInput value="" onChange={vi.fn()} mask="phone-ca" />)

    const input = screen.getByRole('textbox')
    // Formatted length of '+1 (234) 567-8901' is 17 characters
    expect(input).toHaveAttribute('maxLength', '17')
  })

  it('handles blur event', async () => {
    const user = userEvent.setup()
    const handleBlur = vi.fn()

    render(
      <ControlledMaskedInput mask="phone-ca" initialValue="+12345678901" />
    )

    const input = screen.getByRole('textbox')

    // Add onBlur handler
    input.onblur = handleBlur

    await user.click(input)
    await user.tab()

    expect(handleBlur).toHaveBeenCalled()
  })

  it('passes through other input props', () => {
    render(
      <MaskedInput
        value=""
        onChange={vi.fn()}
        mask="phone-ca"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        data-testid="phone-input"
      />
    )

    const input = screen.getByTestId('phone-input')
    expect(input).toHaveAttribute('type', 'tel')
    expect(input).toHaveAttribute('inputmode', 'tel')
    expect(input).toHaveAttribute('autocomplete', 'tel')
  })
})
