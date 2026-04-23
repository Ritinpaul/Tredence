import type { NodeProps } from '@xyflow/react'
import { NODE_REGISTRY } from '../../../lib/nodeRegistry'
import { WorkflowNodeType, type ApprovalNodeData } from '../../../types/workflow'
import { BaseNode } from './BaseNode'

type Props = NodeProps & {
  data: ApprovalNodeData
  selected: boolean
}

export function ApprovalNode({ data, selected }: Props) {
  const entry = NODE_REGISTRY[WorkflowNodeType.Approval]
  return (
    <BaseNode
      title={data.title || 'Approval'}
      Icon={entry.Icon}
      colors={entry.colors}
      selected={selected}
      hasError={data.hasError}
      errorMessage={data.errorMessage}
      shape="diamond"
    >
      {data.approverRole && (
        <p className="text-xs text-amber-400/70 mt-0.5">
          {data.approverRole}
          {data.autoApproveThreshold > 0 && ` · auto ${data.autoApproveThreshold}d`}
        </p>
      )}
    </BaseNode>
  )
}
