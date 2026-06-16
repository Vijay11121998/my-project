import Icon from './Icon'
import { buildDownload, downloadOutput } from '../lib/downloadOutput'

// Renders the mock output for a node, or a run prompt / spinner if it hasn't
// been generated yet. One renderer per task kind.
export default function OutputView({ node, status, onRun }) {
  const output = node.data.output

  if (status === 'running') {
    return (
      <div className="output output--running">
        <span className="spinner" />
        <span>Generating {node.data.kind}…</span>
      </div>
    )
  }

  if (!output) {
    return (
      <div className="output output--empty">
        <p>No output yet.</p>
        <button className="btn btn--primary" onClick={onRun}>
          <Icon name="play" size={14} fill /> Run this node
        </button>
      </div>
    )
  }

  const downloadable = buildDownload(output)

  return (
    <div className="output">
      {output.type === 'report' && <ReportOut o={output} />}
      {output.type === 'artifact' && <ArtifactOut o={output} />}
      {output.type === 'grid' && <GridOut o={output} />}
      {output.type === 'chat' && <ChatOut o={output} />}
      {output.type === 'instruction' && <InstructionOut o={output} />}
      {output.type === 'inputFile' && <FileOut o={output} />}
      <div className="output__actions">
        {downloadable && (
          <button
            className="btn btn--primary btn--block"
            onClick={() => downloadOutput(output)}
            title={`Download ${downloadable.filename}`}
          >
            <Icon name="download" size={14} /> Download {downloadable.filename.split('.').pop().toUpperCase()}
          </button>
        )}
        <button className="btn btn--ghost btn--block" onClick={onRun}>
          <Icon name="reset" size={13} /> Re-run
        </button>
      </div>
    </div>
  )
}

function ReportOut({ o }) {
  return (
    <div className="doc">
      <div className="doc__meta">
        <span>{o.wordCount.toLocaleString()} words</span>
      </div>
      {o.sections.map((s) => (
        <div key={s.heading} className="doc__section">
          <h4>{s.heading}</h4>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  )
}

function ArtifactOut({ o }) {
  return (
    <div className="artifact-out">
      <div className="artifact-out__file">
        <Icon name="artifact" size={20} />
        <div>
          <div className="artifact-out__name">{o.fileName}</div>
          <div className="artifact-out__meta">
            {o.format} · {o.sizeKb} KB
          </div>
        </div>
      </div>
      <div className="artifact-out__slides">
        {o.slides.map((s, i) => (
          <div key={i} className="slide-thumb">
            <span className="slide-thumb__num">{i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GridOut({ o }) {
  return (
    <div className="grid-out">
      <table>
        <thead>
          <tr>
            {o.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {o.rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className={j === o.columns.length - 1 ? 'grid-out__score' : ''}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChatOut({ o }) {
  return (
    <div className="chat-out">
      {o.contextSources?.length > 0 && (
        <div className="chat-out__context">
          Context: {o.contextSources.join(', ')}
        </div>
      )}
      {o.messages.map((m, i) => (
        <div key={i} className={`bubble bubble--${m.role}`}>
          {m.text}
        </div>
      ))}
      <div className="chat-out__compose">
        <input placeholder="Ask a follow-up…" disabled />
        <button className="btn btn--primary btn--sm" disabled>
          Send
        </button>
      </div>
    </div>
  )
}

function InstructionOut({ o }) {
  return <div className="instruction-out">“{o.text}”</div>
}

function FileOut({ o }) {
  if (!o.files?.length) {
    return (
      <div className="file-out file-out--empty">
        <Icon name="file" size={18} />
        <span>No files selected</span>
      </div>
    )
  }
  return (
    <div className="file-out-list">
      {o.files.map((f, i) => (
        <div key={i} className="file-out">
          <Icon name="file" size={16} />
          <span>{f.name}</span>
        </div>
      ))}
    </div>
  )
}
