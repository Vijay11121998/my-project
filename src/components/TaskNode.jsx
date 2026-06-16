import { Handle, Position } from '@xyflow/react'
import { TASK_TYPES, isTask } from '../data/taskTypes'
import Icon from './Icon'

// A single canvas node. Left handle = input side, right handle = output side.
// Status badge reflects mock-run state (idle / running / done).
export default function TaskNode({ id, data, selected }) {
  const def = TASK_TYPES[data.kind]
  const status = data.status || 'idle'
  const showInput = isTask(data.kind) // utilities are pure sources

  return (
    <div
      className={`node node--${def.family} ${selected ? 'node--selected' : ''} node--${status}`}
      style={{ '--accent': def.accent }}
    >
      {showInput && (
        <Handle type="target" position={Position.Left} className="node__handle" />
      )}

      <div className="node__head">
        <span className="node__icon">
          <Icon name={def.icon} size={16} />
        </span>
        <div className="node__head-text">
          <div className="node__title">{data.title || def.label}</div>
          <div className="node__type">{def.label}</div>
        </div>
        <StatusDot status={status} />
      </div>

      <div className="node__body">
        {data.kind === 'inputFile' ? (
          <span className={`node__chip ${data.fileName ? '' : 'node__chip--empty'}`}>
            <Icon name="file" size={12} />
            {data.fileName || 'No file'}
          </span>
        ) : (
          <p className="node__instruction">
            {data.instruction ? data.instruction : <span className="node__muted">No instruction yet</span>}
          </p>
        )}
      </div>

      <div className="node__foot">
        <span className="node__out-label">{def.outputLabel}</span>
        {status === 'done' && <Icon name="check" size={13} className="node__out-check" />}
      </div>

      <Handle type="source" position={Position.Right} className="node__handle" />
    </div>
  )
}

function StatusDot({ status }) {
  if (status === 'running') return <span className="node__status node__status--running" />
  if (status === 'done') return <span className="node__status node__status--done" />
  return <span className="node__status node__status--idle" />
}
