// ─────────────────────────────────────────────────────────────
// NumberField.tsx
// ─────────────────────────────────────────────────────────────
import type { NumberFieldSchema } from '../../../types/forms'

interface Props {
  field: NumberFieldSchema
  value: number
  error?: string
  onChange: (key: string, value: number) => void
}

export function NumberField({ field, value, error, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-rose-400">*</span>}
      </label>
      <input
        type="number"
        value={value}
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.key, parseFloat(e.target.value) || 0)}
        className={[
          'w-full px-3 py-2 rounded-lg text-sm bg-slate-900/60 border',
          'text-slate-100 placeholder:text-slate-600',
          'outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-150',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          error
            ? 'border-rose-500/70 focus:border-rose-500'
            : 'border-slate-700/60 focus:border-indigo-500/70',
        ].join(' ')}
      />
      {field.hint && !error && (
        <p className="text-xs text-slate-500">{field.hint}</p>
      )}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}
