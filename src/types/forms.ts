// ─────────────────────────────────────────────────────────────
// forms.ts  — Schema types for the dynamic form engine
// ─────────────────────────────────────────────────────────────

// ── Field types the form engine understands ───────────────────
export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'date'
  | 'boolean'
  | 'key-value'

export interface SelectOption {
  value: string
  label: string
}

// ── Base field schema ─────────────────────────────────────────
interface BaseFieldSchema {
  key: string          // maps to NodeData property name
  label: string
  required?: boolean
  placeholder?: string
  hint?: string
}

export interface TextFieldSchema extends BaseFieldSchema {
  type: 'text'
}

export interface TextareaFieldSchema extends BaseFieldSchema {
  type: 'textarea'
  rows?: number
}

export interface SelectFieldSchema extends BaseFieldSchema {
  type: 'select'
  options: SelectOption[]
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export interface DateFieldSchema extends BaseFieldSchema {
  type: 'date'
}

export interface BooleanFieldSchema extends BaseFieldSchema {
  type: 'boolean'
}

export interface KeyValueFieldSchema extends BaseFieldSchema {
  type: 'key-value'
  keyPlaceholder?: string
  valuePlaceholder?: string
}

// ── Union ─────────────────────────────────────────────────────
export type FormFieldSchema =
  | TextFieldSchema
  | TextareaFieldSchema
  | SelectFieldSchema
  | NumberFieldSchema
  | DateFieldSchema
  | BooleanFieldSchema
  | KeyValueFieldSchema

// ── Form state (generic record, typed at usage sites) ────────
export type FormValues = Record<string, unknown>
