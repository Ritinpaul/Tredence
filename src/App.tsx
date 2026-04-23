// ─────────────────────────────────────────────────────────────
// App.tsx  — Root layout: Toolbar | Sidebar | Canvas | ConfigPanel
// Phase 6: Undo/Redo, Toasts, Keyboard shortcuts, Import/Export
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'

import { useWorkflow } from './hooks/useWorkflow'
import { useSimulation } from './hooks/useSimulation'
import { useToast } from './hooks/useToast'
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas'
import { NodePalette } from './components/sidebar/NodePalette'
import { Toolbar } from './components/shared/Toolbar'
import { ConfigPanel } from './components/config-panel/ConfigPanel'
import { SimulationPanel } from './components/simulation/SimulationPanel'
import { ValidationBanner } from './components/shared/ValidationBanner'
import { ToastContainer } from './components/shared/ToastContainer'
import { serializeWorkflow } from './lib/serializer'
import { type WorkflowNode, type NodeData } from './types/workflow'

export default function App() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
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
  } = useWorkflow()

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const { toasts, addToast, removeToast } = useToast()
  const { state: simulationState, runSimulation, clearSimulation } = useSimulation()

  // ── Node selection ─────────────────────────────────────────
  function handleNodeSelect(node: WorkflowNode | null) {
    setSelectedNode(node)
  }

  function handleDeselect() {
    setSelectedNode(null)
  }

  // ── Config panel save ──────────────────────────────────────
  function handleSave(nodeId: string, newData: NodeData) {
    updateNodeData(nodeId, newData)
    setSelectedNode((prev) =>
      prev?.id === nodeId ? { ...prev, data: newData } : prev,
    )
    addToast('Node configuration saved', 'success')
  }

  // ── Simulate ───────────────────────────────────────────────
  async function handleSimulate() {
    await runSimulation(nodes, edges)
    // Toast is shown reactively via simulationState in useEffect below
  }

  // Show toast when simulation finishes
  useEffect(() => {
    if (simulationState.status === 'success') {
      addToast('Simulation completed successfully', 'success')
    } else if (simulationState.status === 'error') {
      addToast(`Simulation failed: ${simulationState.message ?? 'Unknown error'}`, 'error')
    }
  // We only want to run this when status changes, not on every addToast re-render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationState.status])

  // ── Export ─────────────────────────────────────────────────
  function handleExport() {
    const payload = serializeWorkflow(nodes, edges)
    const jsonStr = JSON.stringify(payload, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hr-workflow-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    addToast(`Exported ${nodes.length} nodes, ${edges.length} edges`, 'success')
  }

  // ── Import ─────────────────────────────────────────────────
  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (!json.nodes || !Array.isArray(json.nodes)) throw new Error('Missing nodes array')
        if (!json.edges || !Array.isArray(json.edges)) throw new Error('Missing edges array')

        loadWorkflow(json.nodes, json.edges)
        setSelectedNode(null)
        addToast(`Imported ${json.nodes.length} nodes, ${json.edges.length} edges`, 'success')
      } catch (err) {
        addToast(
          err instanceof Error ? `Import failed: ${err.message}` : 'Invalid workflow JSON file',
          'error',
        )
      }
    }
    reader.readAsText(file)
    // Allow re-importing the same file
    event.target.value = ''
  }

  // ── Keyboard shortcuts ─────────────────────────────────────
  const hasCriticalErrors = errors.some((e) => e.severity === 'error')

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when typing in an input/textarea
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'Escape') {
        setSelectedNode(null)
        return
      }

      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (canUndo) undo()
        return
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        ((e.shiftKey && e.key.toLowerCase() === 'z') || e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault()
        if (canRedo) redo()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (nodes.length > 0 && !hasCriticalErrors && simulationState.status !== 'loading') {
          void handleSimulate()
        }
        return
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canUndo, canRedo, undo, redo, nodes.length, hasCriticalErrors, simulationState.status],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // ── Render ─────────────────────────────────────────────────
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen overflow-hidden relative bg-[var(--color-bg)]">
        {/* Mobile Disclaimer */}
        <div className="flex md:hidden flex-col items-center justify-center p-8 h-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-6 border border-indigo-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-400"
            >
              <rect width="18" height="12" x="3" y="4" rx="2" />
              <line x1="2" x2="22" y1="20" y2="20" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Desktop Required</h2>
          <p className="text-sm text-slate-400 max-w-[280px]">
            The HR Workflow Designer canvas requires a larger screen to build and connect nodes.
            Please open this application on a desktop or laptop.
          </p>
        </div>

        {/* Desktop UI */}
        <div className="hidden md:flex flex-col h-full w-full">
          <Toolbar
            nodeCount={nodes.length}
            edgeCount={edges.length}
            onClear={clearCanvas}
            onSimulate={handleSimulate}
            isSimulating={simulationState.status === 'loading'}
            errors={errors}
            onExport={handleExport}
            onImport={handleImport}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          <div className="flex flex-1 overflow-hidden relative">
            <NodePalette />

            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeSelect={handleNodeSelect}
              onAddNode={addNode}
              errors={errors}
            />

            <ConfigPanel
              selectedNode={selectedNode}
              onSave={handleSave}
              onDeselect={handleDeselect}
            />

            <ValidationBanner
              errors={errors}
              nodes={nodes}
              onSelectNode={handleNodeSelect}
            />
          </div>

          <SimulationPanel state={simulationState} onClose={clearSimulation} />
        </div>

        {/* Toast overlay — always visible, even on mobile */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ReactFlowProvider>
  )
}
