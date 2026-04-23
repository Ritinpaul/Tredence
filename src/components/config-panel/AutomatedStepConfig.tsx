// ─────────────────────────────────────────────────────────────
// AutomatedStepConfig.tsx — Special config section for the
// Automated node: action dropdown + dynamic param fields.
// ─────────────────────────────────────────────────────────────

import { Zap, Loader2, AlertCircle } from 'lucide-react'
import type { AutomatedNodeData } from '../../types/workflow'
import { useAutomations } from '../../hooks/useAutomations'

interface Props {
  data: AutomatedNodeData
  actionError?: string
  onChange: (key: string, value: unknown) => void
}

export function AutomatedStepConfig({ data, actionError, onChange }: Props) {
  const automationsState = useAutomations()

  if (automationsState.status === 'loading') {
    return (
      <div className="flex items-center justify-center py-8 text-slate-500 gap-2 text-sm border-t border-slate-800 pt-4">
        <Loader2 size={16} className="animate-spin" />
        Loading actions...
      </div>
    )
  }

  if (automationsState.status === 'error') {
    return (
      <div className="flex items-center justify-center py-8 text-rose-400 gap-2 text-sm border-t border-slate-800 pt-4">
        <AlertCircle size={16} />
        {automationsState.message}
      </div>
    )
  }

  const actions = automationsState.status === 'success' ? automationsState.data : []
  const selectedAction = actions.find((a) => a.id === data.actionId) ?? null

  function handleActionChange(actionId: string) {
    // Changing action resets all param values
    onChange('actionId', actionId)
    onChange('paramValues', {})
  }

  function handleParamChange(paramName: string, value: string) {
    onChange('paramValues', { ...data.paramValues, [paramName]: value })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Action selector */}
      <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-4">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
          Automation Action <span className="text-rose-400">*</span>
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionChange(action.id)}
              className={[
                'flex items-start gap-3 px-3 py-2.5 rounded-xl text-left border transition-all duration-150',
                data.actionId === action.id
                  ? 'bg-violet-950/60 border-violet-500/70 ring-1 ring-violet-500/30'
                  : 'bg-slate-900/40 border-slate-700/40 hover:border-slate-600/60 hover:bg-slate-800/40',
              ].join(' ')}
            >
              <Zap
                size={14}
                className={data.actionId === action.id ? 'text-violet-400 mt-0.5' : 'text-slate-500 mt-0.5'}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${data.actionId === action.id ? 'text-violet-200' : 'text-slate-300'}`}>
                  {action.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
        {actionError && (
          <p className="text-xs text-rose-400">{actionError}</p>
        )}
      </div>

      {/* Dynamic param fields for selected action */}
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Action Parameters
          </p>
          {selectedAction.params.map((param) => {
            const currentValue = data.paramValues[param.name] ?? ''

            if (param.type === 'select' && param.options) {
              return (
                <div key={param.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    {param.label}
                    {param.required && <span className="text-rose-400">*</span>}
                  </label>
                  <div className="relative">
                    <select
                      value={currentValue}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/60 border
                                 border-slate-700/60 text-slate-100 appearance-none
                                 outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30
                                 transition-all duration-150"
                    >
                      <option value="">Select {param.label.toLowerCase()}…</option>
                      {param.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-800">
                          {opt}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div key={param.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  {param.label}
                  {param.required && <span className="text-rose-400">*</span>}
                </label>
                <input
                  type="text"
                  value={currentValue}
                  placeholder={param.placeholder ?? `Enter ${param.label.toLowerCase()}`}
                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900/60
                             border border-slate-700/60 text-slate-100 placeholder:text-slate-600
                             outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30
                             transition-all duration-150"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
