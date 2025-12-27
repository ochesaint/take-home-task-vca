import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@/test/test-utils'
import { z } from 'zod'
import { useConfigurableForm } from '../use-configurable-form'
import type { FormConfig } from '../../types'

// Simple test schema
const testSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

type TestFormData = z.infer<typeof testSchema>

// Test form configuration
const testConfig: FormConfig<TestFormData> = {
  steps: [
    {
      id: 'step-1',
      title: 'Test Step',
      fields: [
        { name: 'name', type: 'text', label: 'Name' },
        { name: 'email', type: 'text', label: 'Email' },
      ],
    },
  ],
  schema: testSchema,
  defaultValues: { name: '', email: '' },
}

describe('useConfigurableForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('initializes with default values', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      expect(result.current.form.getValues()).toEqual({ name: '', email: '' })
    })

    it('exposes form instance', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      expect(result.current.form).toBeDefined()
      expect(result.current.form.register).toBeDefined()
      expect(result.current.form.handleSubmit).toBeDefined()
    })

    it('starts with isSubmitDisabled true when fields are empty', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      expect(result.current.isSubmitDisabled).toBe(true)
    })

    it('starts with isSubmitting false', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      expect(result.current.isSubmitting).toBe(false)
    })

    it('starts with isSuccess false', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      expect(result.current.isSuccess).toBe(false)
    })

    it('starts with no submitError', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      expect(result.current.submitError).toBeNull()
    })
  })

  describe('isSubmitDisabled', () => {
    it('is true when fields are empty', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      expect(result.current.isSubmitDisabled).toBe(true)
    })

    it('is false when all fields are filled with valid data', async () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      // Fill in valid values
      await act(async () => {
        result.current.form.setValue('name', 'John Doe')
        result.current.form.setValue('email', 'john@example.com')
        // Trigger validation
        await result.current.form.trigger()
      })

      await waitFor(() => {
        expect(result.current.isSubmitDisabled).toBe(false)
      })
    })

    it('is true when fields have validation errors', async () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      // Fill with invalid email
      await act(async () => {
        result.current.form.setValue('name', 'John')
        result.current.form.setValue('email', 'invalid-email')
        await result.current.form.trigger()
      })

      await waitFor(() => {
        expect(result.current.isSubmitDisabled).toBe(true)
      })
    })
  })

  describe('submission', () => {
    it('calls onSubmit with sanitized data on successful submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      // Fill form with valid data
      await act(async () => {
        result.current.form.setValue('name', 'John Doe')
        result.current.form.setValue('email', 'john@example.com')
      })

      // Submit
      await act(async () => {
        await result.current.handleSubmit()
      })

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
        })
      })
    })

    it('sets isSuccess to true after successful submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      // Fill and submit
      await act(async () => {
        result.current.form.setValue('name', 'John')
        result.current.form.setValue('email', 'john@example.com')
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('resets form after successful submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined)

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      // Fill and submit
      await act(async () => {
        result.current.form.setValue('name', 'John')
        result.current.form.setValue('email', 'john@example.com')
      })

      await act(async () => {
        await result.current.handleSubmit()
      })

      await waitFor(() => {
        expect(result.current.form.getValues()).toEqual({
          name: '',
          email: '',
        })
      })
    })

    it('sets submitError on failed submission', async () => {
      const error = new Error('Submission failed')
      const onSubmit = vi.fn().mockRejectedValue(error)

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      // Fill and submit
      await act(async () => {
        result.current.form.setValue('name', 'John')
        result.current.form.setValue('email', 'john@example.com')
      })

      await act(async () => {
        try {
          await result.current.handleSubmit()
        } catch {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.submitError).toEqual(error)
      })
    })
  })

  describe('error clearing', () => {
    it('clears submitError when user edits a field after error', async () => {
      const error = new Error('Submission failed')
      const onSubmit = vi.fn().mockRejectedValue(error)

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      // Fill and submit to get error
      await act(async () => {
        result.current.form.setValue('name', 'John')
        result.current.form.setValue('email', 'john@example.com')
      })

      await act(async () => {
        try {
          await result.current.handleSubmit()
        } catch {
          // Expected to throw
        }
      })

      // Verify error exists
      await waitFor(() => {
        expect(result.current.submitError).toEqual(error)
      })

      // Edit a field
      await act(async () => {
        result.current.form.setValue('name', 'Jane')
      })

      // Error should be cleared
      await waitFor(() => {
        expect(result.current.submitError).toBeNull()
      })
    })
  })

  describe('getFieldConfig', () => {
    it('returns field config when field exists', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      const fieldConfig = result.current.getFieldConfig('name')
      expect(fieldConfig).toEqual({
        name: 'name',
        type: 'text',
        label: 'Name',
      })
    })

    it('returns undefined when field does not exist', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      const fieldConfig = result.current.getFieldConfig('nonexistent' as 'name')
      expect(fieldConfig).toBeUndefined()
    })
  })

  describe('config passthrough', () => {
    it('returns the config object', () => {
      const onSubmit = vi.fn()

      const { result } = renderHook(() =>
        useConfigurableForm({ config: testConfig, onSubmit })
      )

      expect(result.current.config).toBe(testConfig)
    })
  })
})
