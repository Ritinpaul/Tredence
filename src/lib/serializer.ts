// ─────────────────────────────────────────────────────────────
// serializer.ts — Prepares React Flow data for the API
// ─────────────────────────────────────────────────────────────
import type { WorkflowNode, WorkflowEdge } from '../types/workflow'
import type { SimulationPayload } from '../types/api'

// React Flow internal properties that should not be persisted
type ReactFlowInternals = {
  positionAbsolute?: unknown
  dragging?: boolean
  selected?: boolean
  measured?: unknown
}

export function serializeWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): SimulationPayload {
  // Strip out React Flow specific UI state before export/simulation
  const cleanedNodes = nodes.map((node) => {
    const { positionAbsolute, dragging, selected, measured, ...rest } =
      node as WorkflowNode & ReactFlowInternals
    void positionAbsolute
    void dragging
    void selected
    void measured
    return rest as WorkflowNode
  })

  return {
    nodes: cleanedNodes,
    edges,
  }
}
