// ─────────────────────────────────────────────────────────────
// DynamicForm.tsx — Schema-driven form renderer
//
// THE ARCHITECTURE SHOWCASE:
// Renders correct field component for any FormFieldSchema array.
// No node-type-specific code here — just schema → UI.
// ─────────────────────────────────────────────────────────────

import type { FormFieldSchema } from '../../types/forms'
import type { KeyValuePair } from '../../types/workflow'
import { TextField } from './fields/TextField'
import { TextareaField } from './fields/TextareaField'
import { SelectField } from './fields/SelectField'
import { NumberField } from './fields/NumberField'
import { DateField } from './fields/DateField'
import { ToggleField } from './fields/ToggleField'
import { KeyValueField } from './fields/KeyValueField'

interface Props {
  fields: FormFieldSchema[]
  values: Record<string, unknown>
  errors: Record<string, string>
  onChange: (key: string, value: unknown) => void
}

export function DynamicForm({ fields, values, errors, onChange }: Props) {
  if (fields.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => {
        const error = errors[field.key]

        switch (field.type) {
          case 'text':
            return (
              <TextField
                key={field.key}
                field={field}
                value={(values[field.key] as string) ?? ''}
                error={error}
                onChange={onChange}
              />
            )

          case 'textarea':
            return (
              <TextareaField
                key={field.key}
                field={field}
                value={(values[field.key] as string) ?? ''}
                error={error}
                onChange={onChange}
              />
            )

          case 'select':
            return (
              <SelectField
                key={field.key}
                field={field}
                value={(values[field.key] as string) ?? ''}
                error={error}
                onChange={onChange}
              />
            )

          case 'number':
            return (
              <NumberField
                key={field.key}
                field={field}
                value={(values[field.key] as number) ?? 0}
                error={error}
                onChange={onChange}
              />
            )

          case 'date':
            return (
              <DateField
                key={field.key}
                field={field}
                value={(values[field.key] as string) ?? ''}
                error={error}
                onChange={onChange}
              />
            )

          case 'boolean':
            return (
              <ToggleField
                key={field.key}
                field={field}
                value={(values[field.key] as boolean) ?? false}
                onChange={onChange}
              />
            )

          case 'key-value':
            return (
              <KeyValueField
                key={field.key}
                field={field}
                value={(values[field.key] as KeyValuePair[]) ?? []}
                onChange={onChange}
              />
            )
        }
      })}
    </div>
  )
}
