// ─────────────────────────────────────────────────────────────
// DateField.tsx
// ─────────────────────────────────────────────────────────────
import type { DateFieldSchema } from '../../../types/forms'

interface Props {
  field: DateFieldSchema
  value: string
  error?: string
  onChange: (key: string, value: string) => void
}

export function DateField({ field, value, error, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-rose-400">*</span>}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        className={[
          'w-full px-3 py-2 rounded-lg text-sm bg-slate-900/60 border',
          'text-slate-100 placeholder:text-slate-600',
          'outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-150',
          '[color-scheme:dark]',
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
