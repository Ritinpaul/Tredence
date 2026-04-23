// ─────────────────────────────────────────────────────────────
// App.tsx  — Root layout: Toolbar | Sidebar | Canvas | ConfigPanel
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'

import { useWorkflow } from './hooks/useWorkflow'
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas'
import { NodePalette } from './components/sidebar/NodePalette'
import { Toolbar } from './components/shared/Toolbar'
import { ConfigPanel } from './components/config-panel/ConfigPanel'
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
  } = useWorkflow()

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)

  function handleNodeSelect(node: WorkflowNode | null) {
    setSelectedNode(node)
  }

  function handleSave(nodeId: string, newData: NodeData) {
    updateNodeData(nodeId, newData)
    // Update the local selected node reference so panel reflects new title etc.
    setSelectedNode((prev) =>
      prev?.id === nodeId ? { ...prev, data: newData } : prev,
    )
  }

  function handleDeselect() {
    setSelectedNode(null)
  }

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* ── Top bar ── */}
        <Toolbar
          nodeCount={nodes.length}
          edgeCount={edges.length}
          onClear={clearCanvas}
        />

        {/* ── Main content ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <NodePalette />

          {/* Canvas */}
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeSelect={handleNodeSelect}
            onAddNode={addNode}
          />

          {/* Right config panel — always present for layout stability */}
          <ConfigPanel
            selectedNode={selectedNode}
            onSave={handleSave}
            onDeselect={handleDeselect}
          />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
