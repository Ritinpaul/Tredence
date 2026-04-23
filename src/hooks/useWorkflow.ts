// ─────────────────────────────────────────────────────────────
// useWorkflow.ts  — Central state management for nodes + edges
// ─────────────────────────────────────────────────────────────

import { useCallback } from 'react'
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'
import { type WorkflowNode, type WorkflowEdge, type NodeData } from '../types/workflow'

// ── Demo initial state ────────────────────────────────────────
const INITIAL_NODES: WorkflowNode[] = []
const INITIAL_EDGES: WorkflowEdge[] = []

// ── Hook ─────────────────────────────────────────────────────
export function useWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(INITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState<WorkflowEdge>(INITIAL_EDGES)

  // ── Add a new node ─────────────────────────────────────────
  const addNode = useCallback((node: WorkflowNode) => {
    setNodes((prev) => [...prev, node])
  }, [setNodes])

  // ── Connect two nodes ──────────────────────────────────────
  const onConnect = useCallback((connection: Connection) => {
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
  }, [setEdges])

  // ── Update a node's data (after form save) ─────────────────
  const updateNodeData = useCallback(
    (nodeId: string, newData: NodeData) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, data: newData } : n,
        ),
      )
    },
    [setNodes],
  )

  // ── Clear the whole canvas ────────────────────────────────
  const clearCanvas = useCallback(() => {
    setNodes([])
    setEdges([])
  }, [setNodes, setEdges])

  // ── Load a saved workflow (import) ────────────────────────
  const loadWorkflow = useCallback(
    (importedNodes: WorkflowNode[], importedEdges: WorkflowEdge[]) => {
      setNodes(importedNodes)
      setEdges(importedEdges)
    },
    [setNodes, setEdges],
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
  }
}
