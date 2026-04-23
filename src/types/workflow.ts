// ─────────────────────────────────────────────────────────────
// workflow.ts  — Core domain types for the HR Workflow Designer
// ─────────────────────────────────────────────────────────────

import type { Node, Edge } from '@xyflow/react'

// ── Node type enum ────────────────────────────────────────────
export const WorkflowNodeType = {
  Start: 'start',
  Task: 'task',
  Approval: 'approval',
  Automated: 'automated',
  End: 'end',
} as const

export type WorkflowNodeType = typeof WorkflowNodeType[keyof typeof WorkflowNodeType]

// ── Per-type NodeData shapes ──────────────────────────────────

export interface KeyValuePair {
  id: string
  key: string
  value: string
}

export type BaseNodeData = Record<string, unknown> & {
  hasError?: boolean
  errorMessage?: string
}

export type StartNodeData = BaseNodeData & {
  type: typeof WorkflowNodeType.Start
  title: string
  metadata: KeyValuePair[]
}

export type TaskNodeData = BaseNodeData & {
  type: typeof WorkflowNodeType.Task
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
}

export type ApprovalNodeData = BaseNodeData & {
  type: typeof WorkflowNodeType.Approval
  title: string
  approverRole: 'Manager' | 'HRBP' | 'Director' | ''
  autoApproveThreshold: number
}

export type AutomatedNodeData = BaseNodeData & {
  type: typeof WorkflowNodeType.Automated
  title: string
  actionId: string
  /** Dynamic param values keyed by param name */
  paramValues: Record<string, string>
}

export type EndNodeData = BaseNodeData & {
  type: typeof WorkflowNodeType.End
  title: string
  endMessage: string
  summaryFlag: boolean
}

// ── Discriminated union ───────────────────────────────────────
export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData

// ── Extended React Flow types ─────────────────────────────────
export type WorkflowNode = Node<NodeData, WorkflowNodeType>
export type WorkflowEdge = Edge

// ── Validation errors ─────────────────────────────────────────
export type ValidationSeverity = 'error' | 'warning'

export interface ValidationError {
  id: string                        // unique error id
  nodeId?: string                   // offending node (if applicable)
  edgeId?: string                   // offending edge (if applicable)
  message: string
  severity: ValidationSeverity
}
