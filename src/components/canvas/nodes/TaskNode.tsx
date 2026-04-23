import type { NodeProps } from '@xyflow/react'
import { NODE_REGISTRY } from '../../../lib/nodeRegistry'
import { WorkflowNodeType, type TaskNodeData } from '../../../types/workflow'
import { BaseNode } from './BaseNode'

type Props = NodeProps & {
  data: TaskNodeData
  selected: boolean
}

export function TaskNode({ data, selected }: Props) {
  const entry = NODE_REGISTRY[WorkflowNodeType.Task]
  return (
    <BaseNode
      title={data.title || 'New Task'}
      Icon={entry.Icon}
      colors={entry.colors}
      selected={selected}
      hasError={data.hasError}
      errorMessage={data.errorMessage}
      shape="rect"
    >
      {data.assignee && (
        <p className="text-xs text-blue-400/70 mt-0.5 truncate">
          → {data.assignee}
        </p>
      )}
      {data.dueDate && (
        <p className="text-xs text-blue-400/60 mt-0.5">Due {data.dueDate}</p>
      )}
    </BaseNode>
  )
}
