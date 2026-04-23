// ─────────────────────────────────────────────────────────────
// SelectField.tsx
// ─────────────────────────────────────────────────────────────
import type { SelectFieldSchema } from '../../../types/forms'

interface Props {
  field: SelectFieldSchema
  value: string
  error?: string
  onChange: (key: string, value: string) => void
}

export function SelectField({ field, value, error, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
        {field.label}
        {field.required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={[
            'w-full px-3 py-2 rounded-lg text-sm bg-slate-900/60 border appearance-none',
            'text-slate-100 outline-none',
            'focus:ring-2 focus:ring-indigo-500/50 transition-all duration-150',
            'cursor-pointer',
            error
              ? 'border-rose-500/70 focus:border-rose-500'
              : 'border-slate-700/60 focus:border-indigo-500/70',
            !value ? 'text-slate-500' : 'text-slate-100',
          ].join(' ')}
        >
          <option value="" disabled>
            {field.placeholder ?? `Select ${field.label.toLowerCase()}…`}
          </option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800 text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {field.hint && !error && (
        <p className="text-xs text-slate-500">{field.hint}</p>
      )}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}
