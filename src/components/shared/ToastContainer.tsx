// ─────────────────────────────────────────────────────────────
// ToastContainer.tsx — Fixed overlay for toast notifications
// ─────────────────────────────────────────────────────────────

import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import type { Toast } from '../../hooks/useToast'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const variantConfig = {
  success: {
    Icon: CheckCircle,
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-950/90',
    iconColor: 'text-emerald-400',
    text: 'text-emerald-100',
  },
  error: {
    Icon: XCircle,
    border: 'border-rose-500/40',
    bg: 'bg-rose-950/90',
    iconColor: 'text-rose-400',
    text: 'text-rose-100',
  },
  warning: {
    Icon: AlertTriangle,
    border: 'border-amber-500/40',
    bg: 'bg-amber-950/90',
    iconColor: 'text-amber-400',
    text: 'text-amber-100',
  },
  info: {
    Icon: Info,
    border: 'border-sky-500/40',
    bg: 'bg-sky-950/90',
    iconColor: 'text-sky-400',
    text: 'text-sky-100',
  },
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const cfg = variantConfig[toast.variant]
        return (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md
              shadow-xl shadow-black/40 pointer-events-auto
              ${cfg.bg} ${cfg.border}
              animate-[slideInRight_0.2s_ease-out_forwards]
            `}
            style={{ minWidth: '260px', maxWidth: '380px' }}
          >
            <cfg.Icon size={16} className={`flex-shrink-0 ${cfg.iconColor}`} />
            <span className={`text-sm font-medium flex-1 ${cfg.text}`}>{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
