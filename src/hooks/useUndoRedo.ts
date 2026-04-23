// ─────────────────────────────────────────────────────────────
// useUndoRedo.ts — History stack for undo/redo (Phase 6.2)
// ─────────────────────────────────────────────────────────────

import { useCallback, useRef, useState } from 'react'
import type { WorkflowNode, WorkflowEdge } from '../types/workflow'

interface Snapshot {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

const MAX_HISTORY = 50

export function useUndoRedo(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  setNodes: (nodes: WorkflowNode[]) => void,
  setEdges: (edges: WorkflowEdge[]) => void,
) {
  const [past, setPast] = useState<Snapshot[]>([])
  const [future, setFuture] = useState<Snapshot[]>([])

  // Use a ref to avoid stale closures in push
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes
  const edgesRef = useRef(edges)
  edgesRef.current = edges

  const pushSnapshot = useCallback(() => {
    const snap: Snapshot = {
      nodes: nodesRef.current,
      edges: edgesRef.current,
    }
    setPast((prev) => {
      const next = [...prev, snap]
      return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next
    })
    // Any new action clears the redo stack
    setFuture([])
  }, [])

  const undo = useCallback(() => {
    setPast((prev) => {
      if (prev.length === 0) return prev
      const last = prev[prev.length - 1]
      const newPast = prev.slice(0, prev.length - 1)
      // Save current state to future
      setFuture((f) => [
        ...f,
        { nodes: nodesRef.current, edges: edgesRef.current },
      ])
      setNodes(last.nodes)
      setEdges(last.edges)
      return newPast
    })
  }, [setNodes, setEdges])

  const redo = useCallback(() => {
    setFuture((prev) => {
      if (prev.length === 0) return prev
      const next = prev[prev.length - 1]
      const newFuture = prev.slice(0, prev.length - 1)
      setPast((p) => [
        ...p,
        { nodes: nodesRef.current, edges: edgesRef.current },
      ])
      setNodes(next.nodes)
      setEdges(next.edges)
      return newFuture
    })
  }, [setNodes, setEdges])

  return {
    pushSnapshot,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }
}
