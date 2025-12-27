import * as React from 'react'
import { MaskedInput } from '@/components/ui/masked-input'
import { cn } from '@/lib/utils'

/**
 * Props for the PhoneInput component.
 */
interface PhoneInputProps extends Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value'
> {
  /** Current phone number value in raw format (+1XXXXXXXXXX) */
  value: string
  /** Callback when value changes */
  onChange: (value: string) => void
}

/**
 * Phone input with Canadian number formatting.
 * Automatically formats as +1 (XXX) XXX-XXXX.
 *
 * This component now uses the configurable mask system internally
 * while maintaining backward compatibility with the existing API.
 */
const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, onBlur, ...props }, ref) => {
    const handleChange = (rawValue: string) => {
      // If user is typing and there's no +1, add it
      let processedValue = rawValue
      if (rawValue.length > 0 && !rawValue.startsWith('+')) {
        // User started typing without +1, prepend it
        const digits = rawValue.replace(/[^\d]/g, '')
        if (digits.length > 0 && !digits.startsWith('1')) {
          processedValue = '+1' + digits
        } else if (digits.startsWith('1')) {
          processedValue = '+' + digits
        }
      }

      // Ensure value starts with +1 if it has any digits
      if (processedValue && !processedValue.startsWith('+')) {
        const digits = processedValue.replace(/[^\d]/g, '')
        if (digits.length > 0) {
          processedValue = '+1' + digits
        }
      }

      onChange(processedValue)
    }

    return (
      <MaskedInput
        ref={ref}
        type="tel"
        inputMode="tel"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        mask="phone-ca"
        className={cn(className)}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
