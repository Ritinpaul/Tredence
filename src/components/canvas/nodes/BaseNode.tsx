// ─────────────────────────────────────────────────────────────
// BaseNode.tsx  — Shared node shell used by all 5 node types
// ─────────────────────────────────────────────────────────────

import { type LucideIcon, AlertTriangle } from 'lucide-react'
import { Handle, Position } from '@xyflow/react'

interface BaseNodeProps {
  title: string
  Icon: LucideIcon
  colors: {
    bg: string
    border: string
    selectedBorder: string
    iconBg: string
    iconColor: string
    text: string
    handle: string
  }
  selected: boolean
  hasError?: boolean
  errorMessage?: string
  shape?: 'pill' | 'rect' | 'diamond'
  showTargetHandle?: boolean
  showSourceHandle?: boolean
  children?: React.ReactNode
}

export function BaseNode({
  title,
  Icon,
  colors,
  selected,
  hasError = false,
  errorMessage,
  shape = 'rect',
  showTargetHandle = true,
  showSourceHandle = true,
  children,
}: BaseNodeProps) {
  const borderClass = hasError
    ? 'border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.35)]'
    : selected
      ? `${colors.selectedBorder} shadow-[0_0_0_2px_rgba(99,102,241,0.35)]`
      : colors.border

  const radiusClass =
    shape === 'pill' ? 'rounded-full px-5' :
    shape === 'diamond' ? 'rounded-xl rotate-45' :
    'rounded-xl'

  return (
    <div
      className={[
        'relative flex items-center gap-3 min-w-[160px] px-4 py-3',
        'border-2 backdrop-blur-sm cursor-pointer select-none',
        'transition-all duration-150',
        colors.bg,
        borderClass,
        radiusClass,
        'node-enter',
      ].join(' ')}
    >
      {/* Target handle (left) */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
          className={[
            'w-3 h-3 rounded-full border-2 border-slate-900',
            'transition-transform hover:scale-125',
            colors.handle,
          ].join(' ')}
        />
      )}

      {/* Icon */}
      <div className={`rounded-lg p-1.5 flex-shrink-0 ${colors.iconBg}`}>
        <Icon size={16} className={colors.iconColor} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${colors.text}`}>
          {title}
        </p>
        {children}
      </div>

      {/* Error indicator */}
      {hasError && (
        <div
          title={errorMessage || "Node has configuration errors"}
          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 animate-pulse"
        >
          <AlertTriangle size={11} className="text-white" />
        </div>
      )}

      {/* Source handle (right) */}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Right}
          className={[
            'w-3 h-3 rounded-full border-2 border-slate-900',
            'transition-transform hover:scale-125',
            colors.handle,
          ].join(' ')}
        />
      )}
    </div>
  )
}
