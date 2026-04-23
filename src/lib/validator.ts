// ─────────────────────────────────────────────────────────────
// validator.ts  — Workflow graph validation logic (Phase 5)
// ─────────────────────────────────────────────────────────────

import type { WorkflowNode, WorkflowEdge, ValidationError } from '../types/workflow'
import { WorkflowNodeType } from '../types/workflow'

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationError[] {
  const errors: ValidationError[] = []

  errors.push(...validateHasOneStart(nodes))
  errors.push(...validateAtLeastOneEnd(nodes))
  errors.push(...validateNoOrphanNodes(nodes, edges))
  errors.push(...validateNoCycles(nodes, edges))
  errors.push(...validateNodeConfigs(nodes))

  return errors
}

// ── Validation Rules ──────────────────────────────────────────

function validateHasOneStart(nodes: WorkflowNode[]): ValidationError[] {
  const startNodes = nodes.filter(n => n.type === WorkflowNodeType.Start)
  if (startNodes.length === 0) {
    return [{ id: 'err-no-start', message: 'Workflow must have a Start node', severity: 'error' }]
  }
  if (startNodes.length > 1) {
    return startNodes.slice(1).map(n => ({
      id: `err-multiple-start-${n.id}`,
      nodeId: n.id,
      message: 'Workflow can only have one Start node',
      severity: 'error'
    }))
  }
  return []
}

function validateAtLeastOneEnd(nodes: WorkflowNode[]): ValidationError[] {
  const endNodes = nodes.filter(n => n.type === WorkflowNodeType.End)
  if (endNodes.length === 0) {
    return [{ id: 'err-no-end', message: 'Workflow must have at least one End node', severity: 'error' }]
  }
  return []
}

function validateNoOrphanNodes(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationError[] {
  const errors: ValidationError[] = []

  // Create fast sets for incoming and outgoing connections
  const incoming = new Set(edges.map(e => e.target))
  const outgoing = new Set(edges.map(e => e.source))

  for (const node of nodes) {
    if (node.type === WorkflowNodeType.Start) {
      if (!outgoing.has(node.id)) {
        errors.push({ id: `err-orphan-start-${node.id}`, nodeId: node.id, message: 'Start node must connect to another node', severity: 'error' })
      }
    } else if (node.type === WorkflowNodeType.End) {
      if (!incoming.has(node.id)) {
        errors.push({ id: `err-orphan-end-${node.id}`, nodeId: node.id, message: 'End node must have an incoming connection', severity: 'error' })
      }
    } else {
      if (!incoming.has(node.id)) {
        errors.push({ id: `err-no-incoming-${node.id}`, nodeId: node.id, message: 'Node is missing an incoming connection', severity: 'error' })
      }
      if (!outgoing.has(node.id)) {
        errors.push({ id: `err-no-outgoing-${node.id}`, nodeId: node.id, message: 'Node is missing an outgoing connection', severity: 'error' })
      }
    }
  }

  return errors
}

function validateNoCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Build adjacency list
  const adj: Record<string, string[]> = {}
  for (const node of nodes) {
    adj[node.id] = []
  }
  for (const edge of edges) {
    if (adj[edge.source]) {
      adj[edge.source].push(edge.target)
    }
  }

  // State: 0 = unvisited, 1 = visiting, 2 = visited
  const state: Record<string, number> = {}
  for (const node of nodes) {
    state[node.id] = 0
  }

  let hasCycle = false
  for (const node of nodes) {
    if (state[node.id] === 0) {
      if (dfsCycle(node.id, adj, state)) {
        hasCycle = true
        break
      }
    }
  }

  if (hasCycle) {
    errors.push({ id: 'err-cycle-detected', message: 'Workflow contains a cycle (infinite loop detected)', severity: 'error' })
  }

  return errors
}

function dfsCycle(nodeId: string, adj: Record<string, string[]>, state: Record<string, number>): boolean {
  state[nodeId] = 1 // Visiting
  for (const neighbor of adj[nodeId] || []) {
    if (state[neighbor] === 1) return true
    if (state[neighbor] === 0 && dfsCycle(neighbor, adj, state)) return true
  }
  state[nodeId] = 2 // Visited
  return false
}

function validateNodeConfigs(nodes: WorkflowNode[]): ValidationError[] {
  const errors: ValidationError[] = []

  for (const node of nodes) {
    if (node.data.type === WorkflowNodeType.Automated) {
      if (!node.data.actionId) {
        errors.push({ id: `err-automated-no-action-${node.id}`, nodeId: node.id, message: 'Automated step requires an action to be selected', severity: 'error' })
      }
    }
    if (node.data.type === WorkflowNodeType.Task) {
      if (!node.data.assignee) {
        errors.push({ id: `err-task-no-assignee-${node.id}`, nodeId: node.id, message: 'Task node is missing an assignee', severity: 'error' })
      }
    }
    if (node.data.type === WorkflowNodeType.Approval) {
      if (!node.data.approverRole) {
        errors.push({ id: `err-approval-no-role-${node.id}`, nodeId: node.id, message: 'Approval node is missing an approver role', severity: 'error' })
      }
    }
  }

  return errors
}
