// ─────────────────────────────────────────────────────────────
// Toolbar.tsx  — Top application bar with branding and actions
// ─────────────────────────────────────────────────────────────

import { Workflow, Trash2 } from 'lucide-react'

interface ToolbarProps {
  nodeCount: number
  edgeCount: number
  onClear: () => void
}

export function Toolbar({ nodeCount, edgeCount, onClear }: ToolbarProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-1)] flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
          <Workflow size={16} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100 leading-none">HR Workflow Designer</h1>
          <p className="text-xs text-slate-500 mt-0.5">Visual workflow builder</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            <span className="text-slate-300 font-semibold">{nodeCount}</span> nodes
          </span>
          <span className="text-slate-700">·</span>
          <span>
            <span className="text-slate-300 font-semibold">{edgeCount}</span> edges
          </span>
        </div>

        {/* Clear button */}
        {(nodeCount > 0 || edgeCount > 0) && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       text-rose-400 border border-rose-500/30 bg-rose-950/30
                       hover:bg-rose-950/60 hover:border-rose-500/60
                       transition-all duration-150"
            title="Clear canvas"
          >
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>
    </header>
  )
}
