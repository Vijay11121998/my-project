import { useRef } from 'react'
import { TASK_TYPES, isTask } from '../data/taskTypes'
import Icon from './Icon'
import OutputView from './OutputView'

// Context-aware config for the selected node: inputs on the left half,
// output on the right half. Editable fields are always on; structural
// actions (delete) only appear in edit mode.
export default function RightPanel({ node, mode, upstream, onChange, onRun, onDelete }) {
  if (!node) {
    return (
      <aside className="panel panel--right">
        <div className="panel__header">Inspector</div>
        <div className="panel__empty">
          <div className="panel__empty-icon">
            <Icon name="arrowRight" size={22} />
          </div>
          <p>Select a node to configure its inputs and preview its output.</p>
        </div>
      </aside>
    )
  }

  const def = TASK_TYPES[node.data.kind]
  const status = node.data.status || 'idle'
  const acceptsInput = isTask(node.data.kind)
  const set = (patch) => onChange(node.id, patch)

  return (
    <aside className="panel panel--right">
      <div className="panel__header panel__header--node" style={{ '--accent': def.accent }}>
        <span className="panel__header-icon">
          <Icon name={def.icon} size={15} />
        </span>
        <span>{def.label}</span>
        {mode === 'edit' && (
          <button className="icon-btn icon-btn--danger" onClick={() => onDelete(node.id)} title="Delete node">
            <Icon name="trash" size={15} />
          </button>
        )}
      </div>

      <div className="panel__scroll">
        {/* ---------- INPUT SIDE ---------- */}
        <section className="inspect">
          <div className="inspect__tag inspect__tag--in">Input</div>

          <label className="field">
            <span className="field__label">Name</span>
            <input
              className="field__input"
              value={node.data.title || ''}
              placeholder={def.label}
              onChange={(e) => set({ title: e.target.value })}
            />
          </label>

          {node.data.kind === 'inputFile' ? (
            <FilePicker files={node.data.files} onPick={(patch) => set(patch)} />
          ) : (
            <label className="field">
              <span className="field__label">Instruction</span>
              <textarea
                className="field__input field__textarea"
                rows={5}
                value={node.data.instruction || ''}
                placeholder="Describe what this task should do…"
                onChange={(e) => set({ instruction: e.target.value })}
              />
            </label>
          )}

          {acceptsInput && (
            <div className="field">
              <span className="field__label">Upstream inputs</span>
              {upstream.length ? (
                <ul className="upstream">
                  {upstream.map((u) => (
                    <li key={u.id} className="upstream__item" style={{ '--accent': TASK_TYPES[u.kind].accent }}>
                      <Icon name={TASK_TYPES[u.kind].icon} size={13} />
                      <span>{u.title || TASK_TYPES[u.kind].label}</span>
                      <span className="upstream__kind">{TASK_TYPES[u.kind].outputLabel}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="field__hint">No connected inputs. Wire another node into this one.</p>
              )}
            </div>
          )}
        </section>

        {/* ---------- OUTPUT SIDE ---------- */}
        <section className="inspect">
          <div className="inspect__tag inspect__tag--out">Output · {def.outputLabel}</div>
          <OutputView node={node} status={status} onRun={() => onRun(node.id)} />
        </section>
      </div>
    </aside>
  )
}

function FilePicker({ files = [], onPick }) {
  // Opens the OS file manager via a hidden native file input with `multiple`.
  // No upload happens (no backend) — we just capture each chosen file's
  // name + size.
  const inputRef = useRef(null)

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []).map((f) => ({ name: f.name, size: f.size }))
    if (picked.length) {
      // Append, de-duping by name so re-selecting doesn't add copies.
      const merged = [...files]
      picked.forEach((p) => {
        if (!merged.some((m) => m.name === p.name)) merged.push(p)
      })
      onPick({ files: merged })
    }
    e.target.value = '' // allow re-selecting the same file(s)
  }

  return (
    <div className="field">
      <span className="field__label">Files</span>
      {files.length > 0 ? (
        <ul className="filelist">
          {files.map((f, i) => (
            <li key={i} className="filelist__item">
              <Icon name="file" size={14} />
              <span className="filelist__name">{f.name}</span>
              {f.size != null && <span className="filelist__size">{formatBytes(f.size)}</span>}
              <button
                className="filelist__remove"
                title="Remove file"
                onClick={() => onPick({ files: files.filter((_, j) => j !== i) })}
              >
                <Icon name="close" size={13} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="filepick filepick--clickable"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        >
          <Icon name="file" size={16} />
          <span className="filepick__name">Click to select files…</span>
        </div>
      )}
      <input ref={inputRef} type="file" multiple hidden onChange={handleFiles} />
      <button className="btn btn--ghost btn--block" onClick={() => inputRef.current?.click()}>
        <Icon name="plus" size={14} /> {files.length ? 'Select more files' : 'Select files'}
      </button>
    </div>
  )
}

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`
}
