// ─────────────────────────────────────────────────────────────
// PaletteItem.tsx  — Single draggable item in the sidebar
// ─────────────────────────────────────────────────────────────

import { type NodeRegistryEntry } from '../../lib/nodeRegistry'
import { WorkflowNodeType } from '../../types/workflow'

interface PaletteItemProps {
  entry: NodeRegistryEntry
}

export function PaletteItem({ entry }: PaletteItemProps) {
  const { Icon, label, description, colors, type } = entry

  function onDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData('application/workflow-node-type', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={[
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl',
        'border cursor-grab active:cursor-grabbing',
        'transition-all duration-150 hover:scale-[1.02]',
        'select-none',
        colors.bg,
        colors.border,
        'hover:brightness-125',
      ].join(' ')}
      title={`Drag ${label} onto canvas`}
    >
      {/* Icon */}
      <div className={`rounded-lg p-2 flex-shrink-0 ${colors.iconBg}`}>
        <Icon size={16} className={colors.iconColor} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${colors.text}`}>{label}</p>
        <p className="text-xs text-slate-400 truncate">{description}</p>
      </div>

      {/* Drag hint */}
      <div className="opacity-0 group-hover:opacity-60 transition-opacity">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-slate-400">
          <circle cx="3" cy="3" r="1.5" />
          <circle cx="9" cy="3" r="1.5" />
          <circle cx="3" cy="9" r="1.5" />
          <circle cx="9" cy="9" r="1.5" />
        </svg>
      </div>
    </div>
  )
}

// Exported constant for canvas drop handler to read
export const DRAG_TYPE = 'application/workflow-node-type'

// Type guard for node type string
export function isWorkflowNodeType(value: string): value is WorkflowNodeType {
  return Object.values(WorkflowNodeType).includes(value as WorkflowNodeType)
}
