// ─────────────────────────────────────────────────────────────
// ValidationBanner.tsx
// ─────────────────────────────────────────────────────────────

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import type { ValidationError, WorkflowNode } from '../../types/workflow'

interface ValidationBannerProps {
  errors: ValidationError[]
  nodes: WorkflowNode[]
  onSelectNode: (node: WorkflowNode | null) => void
}

export function ValidationBanner({ errors, nodes, onSelectNode }: ValidationBannerProps) {
  const { setCenter } = useReactFlow()

  if (errors.length === 0) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-full shadow-lg backdrop-blur flex items-center gap-2 text-xs font-semibold z-40 transform transition-all animate-in fade-in slide-in-from-bottom-4">
        <CheckCircle2 size={14} />
        Workflow validates successfully
      </div>
    )
  }

  const handleErrorClick = (error: ValidationError) => {
    if (!error.nodeId) return

    const node = nodes.find(n => n.id === error.nodeId)
    if (node) {
      // Select for config panel
      onSelectNode(node)
      // Center on canvas
      setCenter(node.position.x + 80, node.position.y + 20, { zoom: 1.5, duration: 600 })
    }
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-red-500/40 shadow-2xl rounded-xl w-full max-w-lg overflow-hidden flex flex-col z-40 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center gap-2">
        <AlertTriangle size={14} className="text-red-400" />
        <span className="text-xs font-bold text-red-100">
          {errors.length} Validation Error{errors.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="max-h-40 overflow-y-auto p-2">
        <div className="flex flex-col gap-1">
          {errors.map(err => (
            <button
              key={err.id}
              onClick={() => handleErrorClick(err)}
              className={[
                'w-full text-left flex items-start gap-2 px-3 py-2 rounded-lg text-xs transition-colors',
                err.nodeId 
                  ? 'hover:bg-slate-800 cursor-pointer group' 
                  : 'cursor-default'
              ].join(' ')}
            >
              <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-slate-300 block leading-tight">{err.message}</span>
                {err.nodeId && (
                  <span className="text-indigo-400 text-[10px] mt-1 block opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view node
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
