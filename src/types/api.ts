// ─────────────────────────────────────────────────────────────
// api.ts  — Types for mock API requests and responses
// ─────────────────────────────────────────────────────────────

import type { WorkflowNode, WorkflowEdge } from './workflow'

// ── GET /automations ──────────────────────────────────────────
export type AutomationParamType = 'text' | 'select'

export interface AutomationParam {
  name: string
  label: string
  type: AutomationParamType
  required: boolean
  placeholder?: string
  options?: string[]   // only for type = 'select'
}

export interface AutomationAction {
  id: string
  label: string
  description: string
  icon: string         // lucide icon name (string)
  params: AutomationParam[]
}

// ── POST /simulate ────────────────────────────────────────────
export interface SimulationPayload {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export type StepStatus = 'pending' | 'running' | 'success' | 'error' | 'warning'

export interface SimulationStep {
  step: number
  nodeId: string
  nodeType: string
  title: string
  status: StepStatus
  description: string
  timestamp: string    // ISO 8601
}

export type SimulationStatus = 'success' | 'error' | 'warning'

export interface SimulationResult {
  status: SimulationStatus
  steps: SimulationStep[]
  errors?: string[]
  summary?: string
}

// ── API client state ──────────────────────────────────────────
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string }
