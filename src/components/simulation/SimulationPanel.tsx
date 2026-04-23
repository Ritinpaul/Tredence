// ─────────────────────────────────────────────────────────────
// SimulationPanel.tsx — Panel to display simulation logs
// ─────────────────────────────────────────────────────────────
import { X, PlayCircle, CheckCircle2, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import type { SimulationResult, AsyncState } from '../../types/api'

interface Props {
  state: AsyncState<SimulationResult>
  onClose: () => void
}

export function SimulationPanel({ state, onClose }: Props) {
  if (state.status === 'idle') return null

  const isRunning = state.status === 'loading'
  const isError = state.status === 'error' || (state.status === 'success' && state.data.status === 'error')
  const isSuccess = state.status === 'success' && state.data.status === 'success'

  return (
    <div className="absolute inset-x-0 bottom-0 h-1/2 md:h-1/3 bg-slate-900 border-t border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <PlayCircle size={16} className="text-blue-400 animate-pulse" />
          ) : isError ? (
            <AlertCircle size={16} className="text-rose-400" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400" />
          )}
          <h2 className="text-sm font-semibold text-slate-200">
            {isRunning ? 'Running Simulation...' : isError ? 'Simulation Failed' : 'Simulation Complete'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 font-mono text-xs">
        {state.status === 'loading' && (
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            Evaluating workflow payload against MSW backend...
          </div>
        )}

        {state.status === 'error' && (
          <div className="text-rose-400 bg-rose-950/20 p-4 rounded-lg border border-rose-900/50">
            System Error: {state.message}
          </div>
        )}

        {state.status === 'success' && (
          <div className="flex flex-col gap-3">
            {state.data.errors && state.data.errors.length > 0 && (
              <div className="text-rose-400 bg-rose-950/30 p-4 rounded-lg border border-rose-900/50 flex flex-col gap-1">
                <p className="font-bold text-sm mb-1">Validation Errors</p>
                {state.data.errors.map((err, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-rose-500">•</span>
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              {state.data.steps.map((step) => (
                <div key={step.step} className="flex items-start gap-4 p-3 rounded bg-slate-800/30 border border-slate-700/50">
                  <div className="text-slate-500 pt-0.5">
                    {step.status === 'success' ? (
                      <CheckCircle size={14} className="text-emerald-500" />
                    ) : step.status === 'error' ? (
                      <AlertCircle size={14} className="text-rose-500" />
                    ) : (
                      <Clock size={14} className="text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-bold text-indigo-300">Step {step.step}: {step.title}</span>
                      <span className="text-slate-600 text-[10px]">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="text-slate-400">[{step.nodeType}] {step.description}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {state.data.summary && (
              <div className={`mt-4 p-3 rounded border text-sm font-sans font-medium ${isSuccess ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400' : 'bg-rose-950/20 border-rose-900/50 text-rose-400'}`}>
                {state.data.summary}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
