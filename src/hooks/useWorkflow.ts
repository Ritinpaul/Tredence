// ─────────────────────────────────────────────────────────────
// useWorkflow.ts  — Central state management for nodes + edges
//                   + undo/redo integration (Phase 6.2)
// ─────────────────────────────────────────────────────────────

import { useCallback, useState, useEffect } from 'react'
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'
import { type WorkflowNode, type WorkflowEdge, type NodeData, type ValidationError } from '../types/workflow'
import { validateWorkflow } from '../lib/validator'
import { useUndoRedo } from './useUndoRedo'

// ── Demo initial state ────────────────────────────────────────
const INITIAL_NODES: WorkflowNode[] = []
const INITIAL_EDGES: WorkflowEdge[] = []

// ── Hook ─────────────────────────────────────────────────────
export function useWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(INITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(INITIAL_EDGES)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const { pushSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo(
    nodes,
    edges,
    (n) => setNodes(n),
    (e) => setEdges(e),
  )

  // ── Debounced Validation ───────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      const newErrors = validateWorkflow(nodes, edges)
      setErrors(newErrors)
    }, 300)
    return () => clearTimeout(timer)
  }, [nodes, edges])

  // ── Add a new node ─────────────────────────────────────────
  const addNode = useCallback((node: WorkflowNode) => {
    pushSnapshot()
    setNodes((prev) => [...prev, node])
  }, [setNodes, pushSnapshot])

  // ── Connect two nodes ──────────────────────────────────────
  const onConnect = useCallback((connection: Connection) => {
    pushSnapshot()
    setEdges((prev) =>
      addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: '#4f5882', strokeWidth: 2 },
        },
        prev,
      ),
    )
  }, [setEdges, pushSnapshot])

  // ── Update a node's data (after form save) ─────────────────
  const updateNodeData = useCallback(
    (nodeId: string, newData: NodeData) => {
      pushSnapshot()
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, data: newData } : n,
        ),
      )
    },
    [setNodes, pushSnapshot],
  )

  // ── Clear the whole canvas ────────────────────────────────
  const clearCanvas = useCallback(() => {
    pushSnapshot()
    setNodes([])
    setEdges([])
  }, [setNodes, setEdges, pushSnapshot])

  // ── Load a saved workflow (import) ────────────────────────
  const loadWorkflow = useCallback(
    (importedNodes: WorkflowNode[], importedEdges: WorkflowEdge[]) => {
      pushSnapshot()
      setNodes(importedNodes)
      setEdges(importedEdges)
    },
    [setNodes, setEdges, pushSnapshot],
  )

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange: onNodesChange as (changes: NodeChange<WorkflowNode>[]) => void,
    onEdgesChange: onEdgesChange as (changes: EdgeChange<WorkflowEdge>[]) => void,
    onConnect,
    addNode,
    updateNodeData,
    clearCanvas,
    loadWorkflow,
    errors,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
