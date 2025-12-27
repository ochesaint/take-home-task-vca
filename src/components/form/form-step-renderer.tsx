import type { FieldValues } from 'react-hook-form'
import type { FormStepConfig, FieldConfig } from './types'
import { FormFieldRenderer } from './form-field-renderer'

/**
 * Props for the FormStepRenderer component.
 */
interface FormStepRendererProps<T extends FieldValues> {
  /** Step configuration */
  step: FormStepConfig<T>
}

/**
 * Renders all fields for a single form step with grid layout support.
 * Automatically groups half-width fields into rows.
 */
export function FormStepRenderer<T extends FieldValues>({
  step,
}: FormStepRendererProps<T>) {
  // Group fields into rows based on grid configuration
  const rows: FieldConfig<T>[][] = []
  let currentRow: FieldConfig<T>[] = []

  for (const field of step.fields) {
    if (field.grid === 'half') {
      currentRow.push(field)
      if (currentRow.length === 2) {
        rows.push(currentRow)
        currentRow = []
      }
    } else {
      // Full width field
      if (currentRow.length > 0) {
        rows.push(currentRow)
        currentRow = []
      }
      rows.push([field])
    }
  }

  // Push any remaining half-width fields
  if (currentRow.length > 0) {
    rows.push(currentRow)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {rows.map((row, rowIndex) => {
        if (row.length === 1) {
          const field = row[0]
          return <FormFieldRenderer key={String(field.name)} field={field} />
        }

        return (
          <div
            key={`row-${rowIndex}`}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {row.map((field) => (
              <FormFieldRenderer key={String(field.name)} field={field} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
