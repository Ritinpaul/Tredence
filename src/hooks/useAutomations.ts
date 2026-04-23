// ─────────────────────────────────────────────────────────────
// useAutomations.ts
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { fetchAutomations } from '../api/client'
import type { AutomationAction, AsyncState } from '../types/api'

export function useAutomations() {
  const [state, setState] = useState<AsyncState<AutomationAction[]>>({ status: 'idle' })

  useEffect(() => {
    let mounted = true

    async function load() {
      setState({ status: 'loading' })
      try {
        const data = await fetchAutomations()
        if (mounted) setState({ status: 'success', data })
      } catch (err) {
        if (mounted) {
          setState({ 
            status: 'error', 
            message: err instanceof Error ? err.message : 'Failed to fetch automations' 
          })
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return state
}
