import { describe, it, expect } from 'vitest'
import {
  formatWithMask,
  parseWithMask,
  getMaskPlaceholder,
  getMaskMaxLength,
  registerMaskPreset,
  getRegisteredMaskPresets,
  type CustomMaskConfig,
} from '../masks'

describe('masks', () => {
  describe('phone-ca mask', () => {
    it('formats phone numbers correctly', () => {
      expect(formatWithMask('', 'phone-ca')).toBe('')
      expect(formatWithMask('+1', 'phone-ca')).toBe('+1')
      expect(formatWithMask('+12', 'phone-ca')).toBe('+1 (2')
      expect(formatWithMask('+1234', 'phone-ca')).toBe('+1 (234')
      expect(formatWithMask('+1234567', 'phone-ca')).toBe('+1 (234) 567')
      expect(formatWithMask('+12345678901', 'phone-ca')).toBe(
        '+1 (234) 567-8901'
      )
    })

    it('parses formatted phone numbers correctly', () => {
      expect(parseWithMask('', 'phone-ca')).toBe('')
      expect(parseWithMask('+1 (234) 567-8901', 'phone-ca')).toBe(
        '+12345678901'
      )
      expect(parseWithMask('+1 (234) 567', 'phone-ca')).toBe('+1234567')
      expect(parseWithMask('+12345678901', 'phone-ca')).toBe('+12345678901')
    })

    it('returns correct placeholder', () => {
      expect(getMaskPlaceholder('phone-ca')).toBe('+1 (XXX) XXX-XXXX')
    })

    it('returns correct max length', () => {
      expect(getMaskMaxLength('phone-ca')).toBe(11)
    })
  })

  describe('credit-card mask', () => {
    it('formats credit card numbers correctly', () => {
      expect(formatWithMask('', 'credit-card')).toBe('')
      expect(formatWithMask('1234', 'credit-card')).toBe('1234')
      expect(formatWithMask('1234567890123456', 'credit-card')).toBe(
        '1234 5678 9012 3456'
      )
    })

    it('parses formatted credit card numbers correctly', () => {
      expect(parseWithMask('1234 5678 9012 3456', 'credit-card')).toBe(
        '1234567890123456'
      )
      expect(parseWithMask('1234', 'credit-card')).toBe('1234')
    })

    it('limits to 16 digits', () => {
      expect(parseWithMask('1234 5678 9012 3456 7890', 'credit-card')).toBe(
        '1234567890123456'
      )
    })
  })

  describe('postal-code-ca mask', () => {
    it('formats Canadian postal codes correctly', () => {
      expect(formatWithMask('', 'postal-code-ca')).toBe('')
      expect(formatWithMask('K1A', 'postal-code-ca')).toBe('K1A')
      expect(formatWithMask('K1A0B6', 'postal-code-ca')).toBe('K1A 0B6')
      expect(formatWithMask('k1a0b6', 'postal-code-ca')).toBe('K1A 0B6')
    })

    it('parses formatted postal codes correctly', () => {
      expect(parseWithMask('K1A 0B6', 'postal-code-ca')).toBe('K1A0B6')
      expect(parseWithMask('k1a0b6', 'postal-code-ca')).toBe('K1A0B6')
    })
  })

  describe('date mask', () => {
    it('formats dates correctly', () => {
      expect(formatWithMask('', 'date')).toBe('')
      expect(formatWithMask('12', 'date')).toBe('12')
      expect(formatWithMask('1231', 'date')).toBe('12/31')
      expect(formatWithMask('12312024', 'date')).toBe('12/31/2024')
    })

    it('parses formatted dates correctly', () => {
      expect(parseWithMask('12/31/2024', 'date')).toBe('12312024')
      expect(parseWithMask('12/31', 'date')).toBe('1231')
    })
  })

  describe('custom mask config', () => {
    it('works with custom mask configuration', () => {
      const customMask: CustomMaskConfig = {
        format: (raw) => `(${raw})`,
        parse: (formatted) => formatted.replace(/[()]/g, ''),
        placeholder: '(XXX)',
        maxLength: 10,
      }

      expect(formatWithMask('123', customMask)).toBe('(123)')
      expect(parseWithMask('(123)', customMask)).toBe('123')
      expect(getMaskPlaceholder(customMask)).toBe('(XXX)')
      expect(getMaskMaxLength(customMask)).toBe(10)
    })
  })

  describe('mask registry', () => {
    it('allows registering new mask presets', () => {
      const initialCount = getRegisteredMaskPresets().length

      registerMaskPreset('test-mask', {
        format: (raw) => raw.toUpperCase(),
        parse: (formatted) => formatted.toLowerCase(),
        placeholder: 'TEST',
        maxLength: 5,
      })

      expect(getRegisteredMaskPresets().length).toBe(initialCount + 1)
      expect(formatWithMask('hello', 'test-mask')).toBe('HELLO')
      expect(parseWithMask('WORLD', 'test-mask')).toBe('world')
    })

    it('throws error for unknown preset', () => {
      expect(() => formatWithMask('test', 'unknown-mask')).toThrow(
        'Mask preset "unknown-mask" not found in registry'
      )
    })
  })
})
