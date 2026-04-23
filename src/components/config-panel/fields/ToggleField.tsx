// ─────────────────────────────────────────────────────────────
// ToggleField.tsx — Boolean flip switch
// ─────────────────────────────────────────────────────────────
import type { BooleanFieldSchema } from '../../../types/forms'

interface Props {
  field: BooleanFieldSchema
  value: boolean
  onChange: (key: string, value: boolean) => void
}

export function ToggleField({ field, value, onChange }: Props) {
  const id = `toggle-${field.key}`
  return (
    <div className="flex items-center justify-between py-1">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-300 cursor-pointer select-none"
      >
        {field.label}
        {field.hint && (
          <span className="block text-xs text-slate-500 font-normal mt-0.5">{field.hint}</span>
        )}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={value}
        type="button"
        onClick={() => onChange(field.key, !value)}
        className={[
          'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full',
          'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50',
          value ? 'bg-indigo-600' : 'bg-slate-700',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm',
            'transition-transform duration-200',
            value ? 'translate-x-4' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
    </div>
  )
}
