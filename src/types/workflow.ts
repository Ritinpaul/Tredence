// ─────────────────────────────────────────────────────────────
// workflow.ts  — Core domain types for the HR Workflow Designer
// ─────────────────────────────────────────────────────────────

import type { Node, Edge } from '@xyflow/react'

// ── Node type enum ────────────────────────────────────────────
export enum WorkflowNodeType {
  Start     = 'start',
  Task      = 'task',
  Approval  = 'approval',
  Automated = 'automated',
  End       = 'end',
}

// ── Per-type NodeData shapes ──────────────────────────────────

export interface KeyValuePair {
  id: string
  key: string
  value: string
}

export interface StartNodeData {
  type: WorkflowNodeType.Start
  title: string
  metadata: KeyValuePair[]
}

export interface TaskNodeData {
  type: WorkflowNodeType.Task
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
}

export interface ApprovalNodeData {
  type: WorkflowNodeType.Approval
  title: string
  approverRole: 'Manager' | 'HRBP' | 'Director' | ''
  autoApproveThreshold: number
}

export interface AutomatedNodeData {
  type: WorkflowNodeType.Automated
  title: string
  actionId: string
  /** Dynamic param values keyed by param name */
  paramValues: Record<string, string>
}

export interface EndNodeData {
  type: WorkflowNodeType.End
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
