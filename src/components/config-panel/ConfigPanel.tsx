// ─────────────────────────────────────────────────────────────
// ConfigPanel.tsx — Right-side node configuration panel
//
// Owns: form state, validation, save/cancel, dirty tracking.
// Delegates: field rendering to DynamicForm, automation to
//            AutomatedStepConfig.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import { Check, X, Settings, AlertCircle } from 'lucide-react'
import { NODE_REGISTRY } from '../../lib/nodeRegistry'
import { DynamicForm } from './DynamicForm'
import { AutomatedStepConfig } from './AutomatedStepConfig'
import {
  WorkflowNodeType,
  type WorkflowNode,
  type NodeData,
  type AutomatedNodeData,
} from '../../types/workflow'
import type { FormFieldSchema } from '../../types/forms'

// ── Props ──────────────────────────────────────────────────────
interface ConfigPanelProps {
  selectedNode: WorkflowNode | null
  onSave: (nodeId: string, newData: NodeData) => void
  onDeselect: () => void
}

// ── Validation ─────────────────────────────────────────────────
function validateFields(
  fields: FormFieldSchema[],
  values: Record<string, unknown>,
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    if (!field.required) continue
    const v = values[field.key]
    const isEmpty =
      v === undefined ||
      v === null ||
      v === '' ||
      (typeof v === 'string' && !v.trim())
    if (isEmpty) {
      errors[field.key] = `${field.label} is required`
    }
  }
  return errors
}

// ── Component ──────────────────────────────────────────────────
export function ConfigPanel({ selectedNode, onSave, onDeselect }: ConfigPanelProps) {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [actionError, setActionError] = useState<string | undefined>()

  // ── Re-initialize state when selected node changes ─────────
  useEffect(() => {
    if (!selectedNode) {
      setFormValues({})
      setErrors({})
      setIsDirty(false)
      setActionError(undefined)
      return
    }
    setFormValues({ ...selectedNode.data } as Record<string, unknown>)
    setErrors({})
    setIsDirty(false)
    setActionError(undefined)
  }, [selectedNode?.id]) // key on node id so switching nodes always resets

  // ── Handle field change ────────────────────────────────────
  const handleChange = useCallback((key: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
    setIsDirty(true)
    // Clear individual error when user starts editing
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  // ── Save ───────────────────────────────────────────────────
  function handleSave() {
    if (!selectedNode) return

    const entry = NODE_REGISTRY[selectedNode.type as WorkflowNodeType]
    const fieldErrors = validateFields(entry.fields, formValues)

    // Extra validation for Automated Step
    if (selectedNode.type === WorkflowNodeType.Automated) {
      const actionId = formValues['actionId'] as string | undefined
      if (!actionId) {
        setActionError('Please select an automation action')
        setErrors(fieldErrors)
        return
      }
    }
    setActionError(undefined)

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    onSave(selectedNode.id, formValues as NodeData)
    setIsDirty(false)
    setErrors({})
  }

  // ── Cancel / reset ─────────────────────────────────────────
  function handleCancel() {
    if (!selectedNode) return
    setFormValues({ ...selectedNode.data } as Record<string, unknown>)
    setErrors({})
    setIsDirty(false)
    setActionError(undefined)
  }

  // ── Empty state ────────────────────────────────────────────
  if (!selectedNode) {
    return (
      <aside
        className="w-80 flex-shrink-0 flex flex-col border-l border-[var(--color-border)]
                   bg-[var(--color-surface-1)]"
      >
        <div className="px-4 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-400">Configuration</h3>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-8 opacity-40">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Settings size={20} className="text-slate-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-400">No node selected</p>
            <p className="text-xs text-slate-600 mt-1">Click a node on the canvas to configure it</p>
          </div>
        </div>
      </aside>
    )
  }

  const nodeType = selectedNode.type as WorkflowNodeType
  const entry = NODE_REGISTRY[nodeType]
  const { Icon, label, colors } = entry
  const isAutomated = nodeType === WorkflowNodeType.Automated
  const hasErrors = Object.keys(errors).length > 0 || !!actionError

  return (
    <aside
      className="w-80 flex-shrink-0 flex flex-col border-l border-[var(--color-border)]
                 bg-[var(--color-surface-1)] overflow-hidden"
      style={{ animation: 'slideInRight 0.18s ease-out forwards' }}
    >
      {/* ── Panel Header ── */}
      <div className={`px-4 py-3.5 border-b border-[var(--color-border)] ${colors.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`rounded-lg p-1.5 ${colors.iconBg}`}>
              <Icon size={14} className={colors.iconColor} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">{label}</p>
              <p className={`text-sm font-semibold truncate max-w-[160px] ${colors.text}`}>
                {(formValues['title'] as string) || 'Untitled'}
              </p>
            </div>
          </div>
          <button
            onClick={onDeselect}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-700/50"
            title="Close panel"
          >
            <X size={14} />
          </button>
        </div>

        {/* Dirty / error indicator */}
        {isDirty && !hasErrors && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Unsaved changes
          </div>
        )}
        {hasErrors && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400">
            <AlertCircle size={11} />
            Fix errors before saving
          </div>
        )}
      </div>

      {/* ── Scrollable Form Body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isAutomated ? (
          <div className="flex flex-col gap-4">
            {/* Title field for automated step */}
            <DynamicForm
              fields={entry.fields}
              values={formValues}
              errors={errors}
              onChange={handleChange}
            />
            {/* Divider */}
            {entry.fields.length > 0 && (
              <div className="h-px bg-slate-800" />
            )}
            {/* Action selector + dynamic params */}
            <AutomatedStepConfig
              data={formValues as AutomatedNodeData}
              actionError={actionError}
              onChange={handleChange}
            />
          </div>
        ) : (
          <DynamicForm
            fields={entry.fields}
            values={formValues}
            errors={errors}
            onChange={handleChange}
          />
        )}
      </div>

      {/* ── Footer Save / Cancel ── */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-[var(--color-border)] flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty && !hasErrors}
          className={[
            'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
            'text-sm font-semibold transition-all duration-150',
            isDirty || hasErrors
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed',
          ].join(' ')}
        >
          <Check size={14} />
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={!isDirty}
          className={[
            'px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-150',
            isDirty
              ? 'border-slate-600 text-slate-300 hover:bg-slate-700/50'
              : 'border-slate-800 text-slate-600 cursor-not-allowed',
          ].join(' ')}
        >
          Reset
        </button>
      </div>
    </aside>
  )
}
