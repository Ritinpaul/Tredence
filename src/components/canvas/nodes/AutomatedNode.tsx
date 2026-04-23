import type { NodeProps } from '@xyflow/react'
import { NODE_REGISTRY } from '../../../lib/nodeRegistry'
import { WorkflowNodeType, type AutomatedNodeData } from '../../../types/workflow'
import { BaseNode } from './BaseNode'

type Props = NodeProps & {
  data: AutomatedNodeData
  selected: boolean
}

export function AutomatedNode({ data, selected }: Props) {
  const entry = NODE_REGISTRY[WorkflowNodeType.Automated]
  return (
    <BaseNode
      title={data.title || 'Automated Step'}
      Icon={entry.Icon}
      colors={entry.colors}
      selected={selected}
      shape="pill"
    >
      {data.actionId && (
        <p className="text-xs text-violet-400/70 mt-0.5 capitalize">
          {data.actionId.replace(/_/g, ' ')}
        </p>
      )}
    </BaseNode>
  )
}
