// ─────────────────────────────────────────────────────────────
// nodeRegistry.ts  — Central config for all node types
//
// This is the key architectural pattern:
// Add a new workflow node type by adding ONE entry here.
// The canvas, sidebar, and form engine are all driven by this.
// ─────────────────────────────────────────────────────────────

import {
  PlayCircle,
  ClipboardList,
  ShieldCheck,
  Zap,
  FlagTriangleRight,
  type LucideIcon,
} from 'lucide-react'

import type { FormFieldSchema } from '../types/forms'
import {
  WorkflowNodeType,
  type StartNodeData,
  type TaskNodeData,
  type ApprovalNodeData,
  type AutomatedNodeData,
  type EndNodeData,
  type NodeData,
} from '../types/workflow'

// ── Per-node registry entry ───────────────────────────────────
export interface NodeRegistryEntry {
  type: WorkflowNodeType
  label: string
  description: string       // shown in sidebar palette
  Icon: LucideIcon
  /** Tailwind color classes for the node card */
  colors: {
    bg: string
    border: string
    selectedBorder: string
    iconBg: string
    iconColor: string
    text: string
    handle: string
  }
  defaultData: NodeData
  fields: FormFieldSchema[]
  /** Can this node type be a connection target? */
  canBeTarget: boolean
  /** Can this node type be a connection source? */
  canBeSource: boolean
}

// ── Registry map ──────────────────────────────────────────────
export const NODE_REGISTRY: Record<WorkflowNodeType, NodeRegistryEntry> = {
  [WorkflowNodeType.Start]: {
    type: WorkflowNodeType.Start,
    label: 'Start',
    description: 'Workflow entry point',
    Icon: PlayCircle,
    colors: {
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-700/60',
      selectedBorder: 'border-emerald-400',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      text: 'text-emerald-100',
      handle: '!bg-emerald-500',
    },
    defaultData: {
      type: WorkflowNodeType.Start,
      title: 'Start',
      metadata: [],
    } satisfies StartNodeData,
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Start',
      },
      {
        key: 'metadata',
        label: 'Metadata',
        type: 'key-value',
        keyPlaceholder: 'key',
        valuePlaceholder: 'value',
      },
    ],
    canBeTarget: false,
    canBeSource: true,
  },

  [WorkflowNodeType.Task]: {
    type: WorkflowNodeType.Task,
    label: 'Task',
    description: 'Human task (collect docs, fill form)',
    Icon: ClipboardList,
    colors: {
      bg: 'bg-blue-950/60',
      border: 'border-blue-700/60',
      selectedBorder: 'border-blue-400',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
      text: 'text-blue-100',
      handle: '!bg-blue-500',
    },
    defaultData: {
      type: WorkflowNodeType.Task,
      title: 'New Task',
      description: '',
      assignee: '',
      dueDate: '',
      customFields: [],
    } satisfies TaskNodeData,
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Task name',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'What needs to be done?',
        rows: 3,
      },
      {
        key: 'assignee',
        label: 'Assignee',
        type: 'text',
        placeholder: 'e.g. hr@company.com',
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        type: 'date',
      },
      {
        key: 'customFields',
        label: 'Custom Fields',
        type: 'key-value',
        keyPlaceholder: 'Field name',
        valuePlaceholder: 'Value',
      },
    ],
    canBeTarget: true,
    canBeSource: true,
  },

  [WorkflowNodeType.Approval]: {
    type: WorkflowNodeType.Approval,
    label: 'Approval',
    description: 'Manager or HR approval gate',
    Icon: ShieldCheck,
    colors: {
      bg: 'bg-amber-950/60',
      border: 'border-amber-700/60',
      selectedBorder: 'border-amber-400',
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
      text: 'text-amber-100',
      handle: '!bg-amber-500',
    },
    defaultData: {
      type: WorkflowNodeType.Approval,
      title: 'Approval',
      approverRole: '',
      autoApproveThreshold: 0,
    } satisfies ApprovalNodeData,
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Approval step name',
      },
      {
        key: 'approverRole',
        label: 'Approver Role',
        type: 'select',
        required: true,
        options: [
          { value: 'Manager', label: 'Manager' },
          { value: 'HRBP', label: 'HR Business Partner' },
          { value: 'Director', label: 'Director' },
        ],
      },
      {
        key: 'autoApproveThreshold',
        label: 'Auto-Approve Threshold (days)',
        type: 'number',
        min: 0,
        max: 365,
        hint: 'Auto-approve after N days. 0 = manual only.',
      },
    ],
    canBeTarget: true,
    canBeSource: true,
  },

  [WorkflowNodeType.Automated]: {
    type: WorkflowNodeType.Automated,
    label: 'Automated Step',
    description: 'System action (email, PDF, webhook)',
    Icon: Zap,
    colors: {
      bg: 'bg-violet-950/60',
      border: 'border-violet-700/60',
      selectedBorder: 'border-violet-400',
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
      text: 'text-violet-100',
      handle: '!bg-violet-500',
    },
    defaultData: {
      type: WorkflowNodeType.Automated,
      title: 'Automated Step',
      actionId: '',
      paramValues: {},
    } satisfies AutomatedNodeData,
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'Step name',
      },
      // actionId and paramValues are handled specially in ConfigPanel
      // because they require API data — not static schema
    ],
    canBeTarget: true,
    canBeSource: true,
  },

  [WorkflowNodeType.End]: {
    type: WorkflowNodeType.End,
    label: 'End',
    description: 'Workflow completion point',
    Icon: FlagTriangleRight,
    colors: {
      bg: 'bg-rose-950/60',
      border: 'border-rose-700/60',
      selectedBorder: 'border-rose-400',
      iconBg: 'bg-rose-500/20',
      iconColor: 'text-rose-400',
      text: 'text-rose-100',
      handle: '!bg-rose-500',
    },
    defaultData: {
      type: WorkflowNodeType.End,
      title: 'End',
      endMessage: 'Workflow completed.',
      summaryFlag: false,
    } satisfies EndNodeData,
    fields: [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        placeholder: 'End',
      },
      {
        key: 'endMessage',
        label: 'Completion Message',
        type: 'textarea',
        placeholder: 'Workflow completed successfully.',
        rows: 2,
      },
      {
        key: 'summaryFlag',
        label: 'Generate Summary Report',
        type: 'boolean',
      },
    ],
    canBeTarget: true,
    canBeSource: false,
  },
}

// ── Ordered list for sidebar palette ─────────────────────────
export const NODE_PALETTE_ORDER: WorkflowNodeType[] = [
  WorkflowNodeType.Start,
  WorkflowNodeType.Task,
  WorkflowNodeType.Approval,
  WorkflowNodeType.Automated,
  WorkflowNodeType.End,
]
