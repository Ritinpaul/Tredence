import type { NodeProps } from '@xyflow/react'
import { NODE_REGISTRY } from '../../../lib/nodeRegistry'
import { WorkflowNodeType, type EndNodeData } from '../../../types/workflow'
import { BaseNode } from './BaseNode'

type Props = NodeProps & {
  data: EndNodeData
  selected: boolean
}

export function EndNode({ data, selected }: Props) {
  const entry = NODE_REGISTRY[WorkflowNodeType.End]
  return (
    <BaseNode
      title={data.title || 'End'}
      Icon={entry.Icon}
      colors={entry.colors}
      selected={selected}
      hasError={data.hasError}
      errorMessage={data.errorMessage}
      shape="pill"
      showTargetHandle={true}
      showSourceHandle={false}
    >
      {data.summaryFlag && (
        <p className="text-xs text-rose-400/70 mt-0.5">📄 Summary report</p>
      )}
    </BaseNode>
  )
}
