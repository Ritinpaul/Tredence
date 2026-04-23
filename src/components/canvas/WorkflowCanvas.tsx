// ─────────────────────────────────────────────────────────────
// WorkflowCanvas.tsx  — React Flow canvas with full interactions
// ─────────────────────────────────────────────────────────────

import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
  MarkerType,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { StartNode } from './nodes/StartNode'
import { TaskNode } from './nodes/TaskNode'
import { ApprovalNode } from './nodes/ApprovalNode'
import { AutomatedNode } from './nodes/AutomatedNode'
import { EndNode } from './nodes/EndNode'
import { DRAG_TYPE, isWorkflowNodeType } from '../sidebar/PaletteItem'
import { NODE_REGISTRY } from '../../lib/nodeRegistry'
import { WorkflowNodeType, type WorkflowNode, type WorkflowEdge, type ValidationError } from '../../types/workflow'

// ── Node type map for React Flow ─────────────────────────────
const nodeTypes = {
  [WorkflowNodeType.Start]:     StartNode,
  [WorkflowNodeType.Task]:      TaskNode,
  [WorkflowNodeType.Approval]:  ApprovalNode,
  [WorkflowNodeType.Automated]: AutomatedNode,
  [WorkflowNodeType.End]:       EndNode,
} as const

// ── Edge defaults ─────────────────────────────────────────────
const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#4f5882', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#4f5882' },
}

// ── Props ─────────────────────────────────────────────────────
interface WorkflowCanvasProps {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void
  onConnect: (connection: Connection) => void
  onNodeSelect: (node: WorkflowNode | null) => void
  onAddNode: (node: WorkflowNode) => void
  errors?: ValidationError[]
}

let nodeIdCounter = 1
function generateNodeId(type: WorkflowNodeType) {
  return `${type}_${nodeIdCounter++}_${Date.now()}`
}

// ── Component ─────────────────────────────────────────────────
export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onAddNode,
  errors = [],
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  // Inject errors into nodes
  const nodesWithErrors = nodes.map(node => {
    const nodeError = errors.find(e => e.nodeId === node.id && e.severity === 'error')
    if (nodeError) {
      return {
        ...node,
        data: {
          ...node.data,
          hasError: true,
          errorMessage: nodeError.message
        }
      }
    }
    // ensure existing errors are cleared when resolved
    if (node.data.hasError) {
      return {
        ...node,
        data: {
          ...node.data,
          hasError: false,
          errorMessage: undefined
        }
      }
    }
    return node
  })

  // ── Drag over: allow drop ──────────────────────────────────
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // ── Drop: create node at cursor position ───────────────────
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const rawType = event.dataTransfer.getData(DRAG_TYPE)
      if (!isWorkflowNodeType(rawType)) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const entry = NODE_REGISTRY[rawType]
      const id = generateNodeId(rawType)

      const newNode: WorkflowNode = {
        id,
        type: rawType,
        position,
        data: { ...entry.defaultData },
      }

      onAddNode(newNode)
    },
    [screenToFlowPosition, onAddNode],
  )

  // ── Connection validation ──────────────────────────────────
  const isValidConnection = useCallback(
    (connection: Connection | WorkflowEdge) => {
      const sourceNode = nodes.find((n) => n.id === connection.source)
      const targetNode = nodes.find((n) => n.id === connection.target)

      if (!sourceNode || !targetNode) return false

      const sourceEntry = NODE_REGISTRY[sourceNode.type as WorkflowNodeType]
      const targetEntry = NODE_REGISTRY[targetNode.type as WorkflowNodeType]

      // Prevent self-loops
      if (connection.source === connection.target) return false

      // End node cannot be a source; Start node cannot be a target
      if (!sourceEntry.canBeSource) return false
      if (!targetEntry.canBeTarget) return false

      return true
    },
    [nodes],
  )

  // ── Node click → select ────────────────────────────────────
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: WorkflowNode) => {
      onNodeSelect(node)
    },
    [onNodeSelect],
  )

  // ── Pane click → deselect ──────────────────────────────────
  const handlePaneClick = useCallback(() => {
    onNodeSelect(null)
  }, [onNodeSelect])

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodesWithErrors}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        isValidConnection={isValidConnection}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        deleteKeyCode={['Delete', 'Backspace']}
        multiSelectionKeyCode="Shift"
        className="bg-[var(--color-canvas-bg)]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="#1e2235"
        />
        <Controls
          showInteractive={false}
          className="rounded-xl overflow-hidden"
        />
        <MiniMap
          nodeColor={(node) => {
            const entry = NODE_REGISTRY[node.type as WorkflowNodeType]
            const iconColorClass = entry?.colors.iconColor ?? ''
            // Map Tailwind color class to hex for MiniMap
            const colorMap: Record<string, string> = {
              'text-emerald-400': '#34d399',
              'text-blue-400':    '#60a5fa',
              'text-amber-400':   '#fbbf24',
              'text-violet-400':  '#a78bfa',
              'text-rose-400':    '#fb7185',
            }
            return colorMap[iconColorClass] ?? '#4f5882'
          }}
          maskColor="rgba(15,17,23,0.7)"
          style={{ borderRadius: 8 }}
        />

        {/* Empty state overlay */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-3 opacity-30">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="20" width="20" height="12" rx="4" stroke="#6366f1" strokeWidth="2" />
                <rect x="36" y="32" width="20" height="12" rx="4" stroke="#6366f1" strokeWidth="2" />
                <path d="M28 26 L36 38" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 2" />
              </svg>
              <p className="text-slate-300 text-sm font-medium">
                Drag nodes from the left panel to get started
              </p>
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  )
}
