import { TASK_TYPES, LIBRARY_ORDER } from '../data/taskTypes'
import Icon from './Icon'

// Library of draggable tools. Disabled in run mode (template is locked).
export default function LeftPanel({ mode }) {
  const locked = mode === 'run'
  const tasks = LIBRARY_ORDER.filter((k) => TASK_TYPES[k].family === 'task')
  const utils = LIBRARY_ORDER.filter((k) => TASK_TYPES[k].family === 'utility')

  const onDragStart = (e, kind) => {
    e.dataTransfer.setData('application/workflow-node', kind)
    e.dataTransfer.effectAllowed = 'move'
  }

  const renderGroup = (label, kinds) => (
    <div className="library__group">
      <div className="library__group-label">{label}</div>
      {kinds.map((kind) => {
        const def = TASK_TYPES[kind]
        return (
          <div
            key={kind}
            className={`tool ${locked ? 'tool--locked' : ''}`}
            draggable={!locked}
            onDragStart={(e) => onDragStart(e, kind)}
            style={{ '--accent': def.accent }}
            title={locked ? 'Switch to Edit mode to add nodes' : def.summary}
          >
            <span className="tool__icon">
              <Icon name={def.icon} size={16} />
            </span>
            <div className="tool__text">
              <div className="tool__label">{def.label}</div>
              <div className="tool__summary">{def.summary}</div>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <aside className="panel panel--left">
      <div className="panel__header">
        <span>Library</span>
      </div>
      <div className="panel__scroll">
        {locked && (
          <div className="library__locked-note">
            <Icon name="lock" size={13} />
            Template locked. Switch to Edit mode to change the canvas.
          </div>
        )}
        {renderGroup('AI tasks', tasks)}
        {renderGroup('Utilities', utils)}
      </div>
    </aside>
  )
}
