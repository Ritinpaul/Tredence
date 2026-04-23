// ─────────────────────────────────────────────────────────────
// NodePalette.tsx  — Left sidebar with draggable node items
// ─────────────────────────────────────────────────────────────

import { WorkflowIcon } from 'lucide-react'
import { NODE_REGISTRY, NODE_PALETTE_ORDER } from '../../lib/nodeRegistry'
import { PaletteItem } from './PaletteItem'

export function NodePalette() {
  return (
    <aside className="flex flex-col w-64 min-w-[240px] h-full bg-[var(--color-surface-1)] border-r border-[var(--color-border)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-[var(--color-border)]">
        <WorkflowIcon size={18} className="text-indigo-400" />
        <div>
          <h2 className="text-sm font-bold text-slate-100">Node Palette</h2>
          <p className="text-xs text-slate-500">Drag onto canvas</p>
        </div>
      </div>

      {/* Node list */}
      <div className="flex flex-col gap-2 p-3">
        {NODE_PALETTE_ORDER.map((nodeType) => (
          <PaletteItem key={nodeType} entry={NODE_REGISTRY[nodeType]} />
        ))}
      </div>

      {/* Footer hint */}
      <div className="mt-auto px-4 py-3 border-t border-[var(--color-border)]">
        <p className="text-xs text-slate-600 text-center">
          Connect nodes by dragging from handle to handle
        </p>
      </div>
    </aside>
  )
}
