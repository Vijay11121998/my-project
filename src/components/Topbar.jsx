import Icon from './Icon'

export default function Topbar({ mode, onModeChange, onRunAll, onReset, running, progress }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <span className="topbar__logo">◆</span>
        <span className="topbar__name">Flowforge</span>
        <span className="topbar__sub">AI Workflow Builder</span>
      </div>

      <div className="topbar__center">
        <span className="topbar__template-label">Template</span>
        <span className="topbar__template">Sell-Side Advisory</span>
      </div>

      <div className="topbar__actions">
        <div className="segmented">
          <button
            className={`segmented__btn ${mode === 'run' ? 'is-active' : ''}`}
            onClick={() => onModeChange('run')}
          >
            <Icon name="lock" size={13} /> Run
          </button>
          <button
            className={`segmented__btn ${mode === 'edit' ? 'is-active' : ''}`}
            onClick={() => onModeChange('edit')}
          >
            <Icon name="edit" size={13} /> Edit
          </button>
        </div>

        <button className="btn btn--ghost" onClick={onReset} disabled={running}>
          <Icon name="reset" size={14} /> Reset
        </button>

        <button className="btn btn--primary" onClick={onRunAll} disabled={running}>
          {running ? (
            <>
              <span className="spinner spinner--light" /> Running {progress}
            </>
          ) : (
            <>
              <Icon name="play" size={14} fill /> Run workflow
            </>
          )}
        </button>
      </div>
    </header>
  )
}
