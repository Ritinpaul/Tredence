// ─────────────────────────────────────────────────────────────
// useSimulation.ts — Manages simulation state and API calls
// ─────────────────────────────────────────────────────────────
import { useState } from 'react'
import { simulateWorkflow } from '../api/client'
import { serializeWorkflow } from '../lib/serializer'
import type { AsyncState, SimulationResult } from '../types/api'
import type { WorkflowNode, WorkflowEdge } from '../types/workflow'

export function useSimulation() {
  const [state, setState] = useState<AsyncState<SimulationResult>>({ status: 'idle' })

  async function runSimulation(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
    setState({ status: 'loading' })
    try {
      const payload = serializeWorkflow(nodes, edges)
      const data = await simulateWorkflow(payload)
      setState({ status: 'success', data })
    } catch (err) {
      setState({ 
        status: 'error', 
        message: err instanceof Error ? err.message : 'Simulation failed' 
      })
    }
  }

  function clearSimulation() {
    setState({ status: 'idle' })
  }

  return {
    state,
    runSimulation,
    clearSimulation
  }
}
