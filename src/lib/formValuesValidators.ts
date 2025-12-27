/**
 * Validates a Canadian phone number.
 * Accepts formats:
 * - +1XXXXXXXXXX (with country code, 11 digits)
 * - +XXXXXXXXXX (10 digits, assumes +1 prefix)
 * - XXXXXXXXXX (10 digits raw)
 *
 * Returns true if:
 * - Has exactly 10 digits (after removing +1 prefix if present)
 * - First digit of area code is 2-9 (not 0 or 1)
 */
export function isValidCanadianPhone(value: string): boolean {
  // Extract only digits
  const digits = value.replace(/\D/g, '')

  // Handle different formats:
  // - 11 digits starting with 1: +1 prefix included (e.g., "12345678901")
  // - 10 digits: just the phone number (e.g., "2345678901")
  let phoneDigits: string

  if (digits.length === 11 && digits.startsWith('1')) {
    // Remove the leading 1 (country code)
    phoneDigits = digits.slice(1)
  } else if (digits.length === 10) {
    phoneDigits = digits
  } else {
    // Invalid length
    return false
  }

  // Area code (first 3 digits) must start with 2-9
  const areaCodeFirstDigit = phoneDigits[0]
  if (!/[2-9]/.test(areaCodeFirstDigit)) {
    return false
  }

  return true
}
