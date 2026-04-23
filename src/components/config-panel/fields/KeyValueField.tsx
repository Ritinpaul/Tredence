// ─────────────────────────────────────────────────────────────
// KeyValueField.tsx — Addable key-value pair list
// ─────────────────────────────────────────────────────────────
import { Plus, Trash2 } from 'lucide-react'
import type { KeyValueFieldSchema } from '../../../types/forms'
import type { KeyValuePair } from '../../../types/workflow'

interface Props {
  field: KeyValueFieldSchema
  value: KeyValuePair[]
  onChange: (key: string, value: KeyValuePair[]) => void
}

function generateId() {
  return `kv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export function KeyValueField({ field, value, onChange }: Props) {
  function handleAdd() {
    onChange(field.key, [
      ...value,
      { id: generateId(), key: '', value: '' },
    ])
  }

  function handleRemove(id: string) {
    onChange(field.key, value.filter((p) => p.id !== id))
  }

  function handleChange(id: string, part: 'key' | 'value', text: string) {
    onChange(
      field.key,
      value.map((p) => (p.id === id ? { ...p, [part]: text } : p)),
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300">{field.label}</label>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300
                     transition-colors duration-150 px-2 py-1 rounded hover:bg-indigo-500/10"
        >
          <Plus size={11} />
          Add
        </button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-slate-600 italic border border-dashed border-slate-800 rounded-lg px-3 py-2 text-center">
          No fields yet. Click Add.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        {value.map((pair) => (
          <div key={pair.id} className="flex items-center gap-2">
            <input
              type="text"
              value={pair.key}
              placeholder={field.keyPlaceholder ?? 'key'}
              onChange={(e) => handleChange(pair.id, 'key', e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900/60
                         border border-slate-700/60 text-slate-100 placeholder:text-slate-600
                         outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30
                         transition-all duration-150"
            />
            <span className="text-slate-600 text-xs flex-shrink-0">:</span>
            <input
              type="text"
              value={pair.value}
              placeholder={field.valuePlaceholder ?? 'value'}
              onChange={(e) => handleChange(pair.id, 'value', e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900/60
                         border border-slate-700/60 text-slate-100 placeholder:text-slate-600
                         outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30
                         transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => handleRemove(pair.id)}
              className="flex-shrink-0 text-slate-600 hover:text-rose-400
                         transition-colors duration-150 p-1 rounded hover:bg-rose-500/10"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
