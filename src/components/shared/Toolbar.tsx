// ─────────────────────────────────────────────────────────────
// Toolbar.tsx  — Top application bar with branding and actions
// Phase 6: Added Import/Export, Undo/Redo
// ─────────────────────────────────────────────────────────────

import { Workflow, Trash2, Play, Download, Upload, Undo2, Redo2 } from 'lucide-react'
import type { ValidationError } from '../../types/workflow'

interface ToolbarProps {
  nodeCount: number
  edgeCount: number
  onClear: () => void
  onSimulate: () => void
  isSimulating: boolean
  errors?: ValidationError[]
  onExport: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}

export function Toolbar({
  nodeCount,
  edgeCount,
  onClear,
  onSimulate,
  isSimulating,
  errors = [],
  onExport,
  onImport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const hasCriticalErrors = errors.some((e) => e.severity === 'error')

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-1)] flex-shrink-0 z-20 relative">
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

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center rounded-lg border border-slate-700 overflow-hidden">
            <button
              id="btn-undo"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300
                         bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)]
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-150 border-r border-slate-700"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={12} />
            </button>
            <button
              id="btn-redo"
              onClick={onRedo}
              disabled={!canRedo}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300
                         bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)]
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-150"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={12} />
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-slate-700" />

          {/* Import */}
          <label
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       text-slate-300 border border-slate-700 bg-[var(--color-surface-2)]
                       hover:bg-[var(--color-surface-3)] transition-all duration-150 cursor-pointer"
            title="Import workflow from JSON"
          >
            <Upload size={12} />
            Import
            <input type="file" accept=".json" className="hidden" onChange={onImport} />
          </label>

          {/* Export — only when there's something */}
          {(nodeCount > 0 || edgeCount > 0) && (
            <button
              id="btn-export"
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         text-slate-300 border border-slate-700 bg-[var(--color-surface-2)]
                         hover:bg-[var(--color-surface-3)] transition-all duration-150"
              title="Export workflow to JSON"
            >
              <Download size={12} />
              Export
            </button>
          )}

          {/* Divider */}
          {nodeCount > 0 && <div className="w-px h-4 bg-slate-700" />}

          {/* Simulate */}
          {nodeCount > 0 && (
            <button
              id="btn-simulate"
              onClick={onSimulate}
              disabled={isSimulating || hasCriticalErrors}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                         text-emerald-400 border border-emerald-500/40 bg-emerald-950/40
                         hover:bg-emerald-950/70 hover:border-emerald-500/70
                         disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:text-slate-400 disabled:border-slate-700 disabled:bg-slate-800
                         transition-all duration-150 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              title={hasCriticalErrors ? 'Fix validation errors first' : 'Run workflow simulation (Ctrl+Enter)'}
            >
              <Play size={12} className={isSimulating ? 'animate-pulse' : ''} />
              {isSimulating ? 'Simulating...' : 'Simulate'}
            </button>
          )}

          {/* Clear */}
          {(nodeCount > 0 || edgeCount > 0) && (
            <button
              id="btn-clear"
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
      </div>
    </header>
  )
}
