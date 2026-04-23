// ─────────────────────────────────────────────────────────────
// client.ts — API Client Wrappers
// ─────────────────────────────────────────────────────────────
import type { AutomationAction, SimulationPayload, SimulationResult } from '../types/api'

export async function fetchAutomations(): Promise<AutomationAction[]> {
  const response = await fetch('/api/automations')
  if (!response.ok) {
    throw new Error(`Failed to fetch automations: ${response.statusText}`)
  }
  return response.json()
}

export async function simulateWorkflow(payload: SimulationPayload): Promise<SimulationResult> {
  const response = await fetch('/api/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  
  if (!response.ok && response.status !== 400) {
    throw new Error(`Simulation request failed: ${response.statusText}`)
  }
  
  return response.json()
}
