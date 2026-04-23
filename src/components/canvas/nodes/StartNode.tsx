import type { NodeProps } from '@xyflow/react'
import { NODE_REGISTRY } from '../../../lib/nodeRegistry'
import { WorkflowNodeType, type StartNodeData } from '../../../types/workflow'
import { BaseNode } from './BaseNode'

type Props = NodeProps & {
  data: StartNodeData
  selected: boolean
}

export function StartNode({ data, selected }: Props) {
  const entry = NODE_REGISTRY[WorkflowNodeType.Start]
  return (
    <BaseNode
      title={data.title || 'Start'}
      Icon={entry.Icon}
      colors={entry.colors}
      selected={selected}
      hasError={data.hasError}
      errorMessage={data.errorMessage}
      shape="pill"
      showTargetHandle={false}
      showSourceHandle={true}
    >
      {data.metadata.length > 0 && (
        <p className="text-xs text-emerald-400/70 mt-0.5">
          {data.metadata.length} metadata field{data.metadata.length > 1 ? 's' : ''}
        </p>
      )}
    </BaseNode>
  )
}
