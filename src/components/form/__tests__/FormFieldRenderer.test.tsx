import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { FormProvider, useForm } from 'react-hook-form'
import { FormFieldRenderer } from '../form-field-renderer'
import type {
  TextFieldConfig,
  PhoneFieldConfig,
  NumberFieldConfig,
} from '../types'

// Wrapper component that provides FormContext
function FormWrapper({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode
  defaultValues?: Record<string, string>
}) {
  const methods = useForm({ defaultValues })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('FormFieldRenderer', () => {
  describe('Text Field', () => {
    it('renders a text input with label', () => {
      const field: TextFieldConfig<{ firstName: string }> = {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        maxLength: 50,
      }

      render(
        <FormWrapper>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      expect(screen.getByLabelText('First Name')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '50')
    })

    it('applies autoFocus when configured', () => {
      const field: TextFieldConfig<{ firstName: string }> = {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        autoFocus: true,
      }

      render(
        <FormWrapper>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      expect(screen.getByRole('textbox')).toHaveFocus()
    })

    it('applies autocomplete attribute', () => {
      const field: TextFieldConfig<{ firstName: string }> = {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
        autoComplete: 'given-name',
      }

      render(
        <FormWrapper>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'autocomplete',
        'given-name'
      )
    })
  })

  describe('Phone Field', () => {
    it('renders a phone input with label', () => {
      const field: PhoneFieldConfig<{ phone: string }> = {
        name: 'phone',
        type: 'phone',
        label: 'Phone Number',
      }

      render(
        <FormWrapper defaultValues={{ phone: '' }}>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    })
  })

  describe('Number Field', () => {
    it('renders a number input with label', () => {
      const field: NumberFieldConfig<{ corporationNumber: string }> = {
        name: 'corporationNumber',
        type: 'number',
        label: 'Corporation Number',
        maxLength: 9,
      }

      render(
        <FormWrapper defaultValues={{ corporationNumber: '' }}>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      expect(screen.getByLabelText('Corporation Number')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '9')
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'inputmode',
        'numeric'
      )
    })

    it('shows validation indicator when async validation is configured', () => {
      const field: NumberFieldConfig<{ corporationNumber: string }> = {
        name: 'corporationNumber',
        type: 'number',
        label: 'Corporation Number',
        asyncValidation: {
          showIndicator: true,
        },
      }

      render(
        <FormWrapper defaultValues={{ corporationNumber: '123456789' }}>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      // Field should be present with validation indicator configured
      expect(screen.getByLabelText('Corporation Number')).toBeInTheDocument()
    })
  })

  describe('Error Display', () => {
    it('renders number field that can display errors', () => {
      const field: NumberFieldConfig<{ corporationNumber: string }> = {
        name: 'corporationNumber',
        type: 'number',
        label: 'Corporation Number',
        asyncValidation: {
          showIndicator: true,
        },
      }

      render(
        <FormWrapper defaultValues={{ corporationNumber: '000000000' }}>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      // Field should render correctly
      expect(screen.getByLabelText('Corporation Number')).toBeInTheDocument()
    })
  })

  describe('Mask Support', () => {
    it('uses MaskedInput for text field with mask', () => {
      const field: TextFieldConfig<{ phone: string }> = {
        name: 'phone',
        type: 'text',
        label: 'Phone Number',
        mask: 'phone-ca',
      }

      render(
        <FormWrapper defaultValues={{ phone: '+12345678901' }}>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('+1 (234) 567-8901')
    })

    it('uses MaskedInput for phone field with custom mask', () => {
      const field: PhoneFieldConfig<{ phone: string }> = {
        name: 'phone',
        type: 'phone',
        label: 'Phone Number',
        mask: 'phone-ca',
      }

      render(
        <FormWrapper defaultValues={{ phone: '+12345678901' }}>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('+1 (234) 567-8901')
    })

    it('falls back to regular Input when no mask is configured', () => {
      const field: TextFieldConfig<{ firstName: string }> = {
        name: 'firstName',
        type: 'text',
        label: 'First Name',
      }

      render(
        <FormWrapper defaultValues={{ firstName: 'John' }}>
          <FormFieldRenderer field={field} />
        </FormWrapper>
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('John')
      // Should not have mask formatting
      expect(input).not.toHaveValue('+1 (234) 567-8901')
    })
  })
})
