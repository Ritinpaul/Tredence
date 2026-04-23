// ─────────────────────────────────────────────────────────────
// handlers.ts — MSW Request Handlers
// ─────────────────────────────────────────────────────────────
import { http, HttpResponse, delay } from 'msw'
import { STATIC_AUTOMATION_ACTIONS } from '../components/config-panel/automationActions'
import type { SimulationPayload, SimulationResult, SimulationStep } from '../types/api'

export const handlers = [
  // ── GET /api/automations ────────────────────────────────────
  http.get('/api/automations', async () => {
    // Add artificial delay to simulate real network conditions
    await delay(600)
    return HttpResponse.json(STATIC_AUTOMATION_ACTIONS)
  }),

  // ── POST /api/simulate ──────────────────────────────────────
  http.post('/api/simulate', async ({ request }) => {
    await delay(1500) // Simulate processing time

    try {
      const payload = (await request.json()) as SimulationPayload
      const { nodes, edges } = payload

      const steps: SimulationStep[] = []
      let hasError = false
      const errors: string[] = []

      // Basic validation: Check if there's a start node
      const startNodes = nodes.filter((n) => n.type === 'start')
      if (startNodes.length === 0) {
        hasError = true
        errors.push('Workflow has no Start node.')
      } else if (startNodes.length > 1) {
        hasError = true
        errors.push('Workflow has multiple Start nodes. Only one is allowed.')
      } else {
        steps.push({
          step: 1,
          nodeId: startNodes[0].id,
          nodeType: 'start',
          title: startNodes[0].data.title || 'Start',
          status: 'success',
          description: 'Workflow initiated successfully.',
          timestamp: new Date().toISOString(),
        })
      }

      // Basic validation: Check if there's an end node
      const endNodes = nodes.filter((n) => n.type === 'end')
      if (endNodes.length === 0) {
        hasError = true
        errors.push('Workflow has no End node.')
      }

      // Check for unconnected nodes (except if canvas has only 1 node, but still invalid workflow)
      // We will just do a simple validation:
      if (!hasError && nodes.length > 1) {
        // Let's generate some mock steps based on the nodes
        nodes.forEach((node, index) => {
          if (node.type === 'start') return
          
          steps.push({
            step: steps.length + 1,
            nodeId: node.id,
            nodeType: String(node.type),
            title: String(node.data.title || node.type),
            status: 'success',
            description: `Executed ${node.type} logic perfectly.`,
            timestamp: new Date(Date.now() + index * 100).toISOString(),
          })
        })
      }

      if (hasError) {
        return HttpResponse.json<SimulationResult>(
          {
            status: 'error',
            steps,
            errors,
            summary: 'Simulation failed due to validation errors.',
          },
          { status: 400 }
        )
      }

      return HttpResponse.json<SimulationResult>({
        status: 'success',
        steps,
        summary: 'Simulation completed successfully. All nodes executed.',
      })
    } catch (e) {
      return HttpResponse.json<SimulationResult>(
        {
          status: 'error',
          steps: [],
          errors: ['Invalid JSON payload.'],
        },
        { status: 400 }
      )
    }
  }),
]
