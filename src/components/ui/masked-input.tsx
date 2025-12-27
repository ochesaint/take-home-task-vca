import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { MaskConfig } from '@/components/form/masks'
import {
  formatWithMask,
  parseWithMask,
  getMaskPlaceholder,
  getMaskMaxLength,
} from '@/components/form/masks'

/**
 * Props for the MaskedInput component.
 */
interface MaskedInputProps extends Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value' | 'maxLength'
> {
  /** Current value in raw format */
  value: string
  /** Callback when value changes (receives raw value) */
  onChange: (value: string) => void
  /** Mask configuration - preset name or custom mask config */
  mask: MaskConfig
  /** Whether to show placeholder when empty */
  showPlaceholder?: boolean
}

/**
 * Generic masked input component that applies formatting based on mask configuration.
 * Handles format/parse logic to keep raw value separate from display value.
 */
const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      className,
      value,
      onChange,
      mask,
      showPlaceholder = true,
      onBlur,
      ...props
    },
    ref
  ) => {
    /**
     * Handles input changes, parsing formatted input back to raw value.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      const rawValue = parseWithMask(input, mask)
      onChange(rawValue)
    }

    /**
     * Handles blur event, ensuring value is properly formatted.
     */
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Re-format on blur to ensure consistent formatting
      const rawValue = parseWithMask(e.target.value, mask)
      const formatted = formatWithMask(rawValue, mask)
      if (formatted !== e.target.value) {
        // Update the input if formatting changed
        e.target.value = formatted
      }
      onBlur?.(e)
    }

    const displayValue = formatWithMask(value, mask)
    const placeholder = showPlaceholder ? getMaskPlaceholder(mask) : undefined
    const rawMaxLength = getMaskMaxLength(mask)

    // Calculate formatted maxLength by formatting a max-length raw value
    // This ensures the input allows enough space for the formatted version
    const formattedMaxLength = rawMaxLength
      ? formatWithMask('9'.repeat(rawMaxLength), mask).length
      : undefined

    return (
      <div className="relative">
        <Input
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={formattedMaxLength}
          className={cn('h-12 rounded-xl border-gray-200', className)}
          {...props}
        />
        {!value && showPlaceholder && placeholder && (
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
            {placeholder}
          </span>
        )}
      </div>
    )
  }
)

MaskedInput.displayName = 'MaskedInput'

export { MaskedInput }
