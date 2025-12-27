/**
 * Mask system for input formatting.
 * Supports both reusable presets and custom mask configurations.
 */

/**
 * Mask function that formats a raw value for display.
 */
export type MaskFormatFunction = (raw: string) => string

/**
 * Mask function that parses a formatted value back to raw format.
 */
export type MaskParseFunction = (formatted: string) => string

/**
 * Custom mask configuration with format/parse functions.
 */
export interface CustomMaskConfig {
  /** Format function to convert raw value to display format */
  format: MaskFormatFunction
  /** Parse function to convert display format back to raw value */
  parse: MaskParseFunction
  /** Placeholder text to show when empty */
  placeholder?: string
  /** Maximum length of raw value */
  maxLength?: number
}

/**
 * Mask configuration - either a preset name or custom config.
 */
export type MaskConfig = string | CustomMaskConfig

/**
 * Mask registry entry containing format/parse functions.
 */
interface MaskRegistryEntry {
  format: MaskFormatFunction
  parse: MaskParseFunction
  placeholder?: string
  maxLength?: number
}

/**
 * Registry of reusable mask presets.
 */
const maskRegistry: Record<string, MaskRegistryEntry> = {
  /**
   * Canadian phone number mask: +1 (XXX) XXX-XXXX
   * Raw format: +1XXXXXXXXXX
   */
  'phone-ca': {
    format: (raw: string): string => {
      // Remove all non-digits except leading +
      const digits = raw.replace(/[^\d]/g, '')

      if (digits.length === 0) return ''
      if (digits.length <= 1) return `+${digits}`
      if (digits.length <= 4)
        return `+${digits.slice(0, 1)} (${digits.slice(1)}`
      if (digits.length <= 7)
        return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`
    },
    parse: (formatted: string): string => {
      const digits = formatted.replace(/[^\d]/g, '')
      if (digits.length === 0) return ''
      return `+${digits.slice(0, 11)}` // Max 11 digits (+1 + 10 digits)
    },
    placeholder: '+1 (XXX) XXX-XXXX',
    maxLength: 11,
  },

  /**
   * Credit card mask: XXXX XXXX XXXX XXXX
   * Raw format: XXXXXXXXXXXXXXXX (16 digits)
   */
  'credit-card': {
    format: (raw: string): string => {
      const digits = raw.replace(/\D/g, '')
      const groups = digits.match(/.{1,4}/g)
      if (!groups) return digits
      return groups.join(' ').slice(0, 19) // 16 digits + 3 spaces
    },
    parse: (formatted: string): string => {
      return formatted.replace(/\D/g, '').slice(0, 16)
    },
    placeholder: 'XXXX XXXX XXXX XXXX',
    maxLength: 16,
  },

  /**
   * Canadian postal code mask: X9X 9X9
   * Raw format: X9X9X9 (6 characters)
   */
  'postal-code-ca': {
    format: (raw: string): string => {
      const cleaned = raw
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase()
        .slice(0, 6)
      if (cleaned.length <= 3) return cleaned
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
    },
    parse: (formatted: string): string => {
      return formatted
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase()
        .slice(0, 6)
    },
    placeholder: 'X9X 9X9',
    maxLength: 6,
  },

  /**
   * Date mask: MM/DD/YYYY
   * Raw format: MMDDYYYY (8 digits)
   */
  date: {
    format: (raw: string): string => {
      const digits = raw.replace(/\D/g, '').slice(0, 8)
      if (digits.length <= 2) return digits
      if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
    },
    parse: (formatted: string): string => {
      return formatted.replace(/\D/g, '').slice(0, 8)
    },
    placeholder: 'MM/DD/YYYY',
    maxLength: 8,
  },
}

/**
 * Gets a mask configuration from the registry or returns custom config.
 *
 * @param mask - Mask preset name or custom mask config
 * @returns Mask registry entry or custom config
 * @throws Error if preset name not found
 */
export function getMaskConfig(
  mask: MaskConfig
): MaskRegistryEntry | CustomMaskConfig {
  if (typeof mask === 'string') {
    const preset = maskRegistry[mask]
    if (!preset) {
      throw new Error(`Mask preset "${mask}" not found in registry`)
    }
    return preset
  }
  return mask
}

/**
 * Formats a value using the specified mask.
 *
 * @param value - Raw value to format
 * @param mask - Mask configuration
 * @returns Formatted value
 */
export function formatWithMask(value: string, mask: MaskConfig): string {
  const config = getMaskConfig(mask)
  return config.format(value)
}

/**
 * Parses a formatted value using the specified mask.
 *
 * @param formatted - Formatted value to parse
 * @param mask - Mask configuration
 * @returns Raw value
 */
export function parseWithMask(formatted: string, mask: MaskConfig): string {
  const config = getMaskConfig(mask)
  return config.parse(formatted)
}

/**
 * Gets the placeholder for a mask.
 *
 * @param mask - Mask configuration
 * @returns Placeholder text or undefined
 */
export function getMaskPlaceholder(mask: MaskConfig): string | undefined {
  const config = getMaskConfig(mask)
  return config.placeholder
}

/**
 * Gets the maximum length for a mask.
 *
 * @param mask - Mask configuration
 * @returns Maximum length or undefined
 */
export function getMaskMaxLength(mask: MaskConfig): number | undefined {
  const config = getMaskConfig(mask)
  return config.maxLength
}

/**
 * Registers a new mask preset in the registry.
 * Useful for adding custom masks that should be reusable.
 *
 * @param name - Preset name
 * @param config - Mask configuration
 */
export function registerMaskPreset(
  name: string,
  config: MaskRegistryEntry
): void {
  maskRegistry[name] = config
}

/**
 * Gets all registered mask preset names.
 *
 * @returns Array of preset names
 */
export function getRegisteredMaskPresets(): string[] {
  return Object.keys(maskRegistry)
}
