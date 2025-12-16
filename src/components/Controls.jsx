import './Controls.css'

function Controls({ onUndo, onRestart, onShowRanking, canUndo }) {
  return (
    <div className="controls">
      <button
        className="btn btn-undo"
        onClick={onUndo}
        disabled={!canUndo}
      >
        ⏪ Desfer
      </button>
      <button
        className="btn btn-restart"
        onClick={onRestart}
      >
        🔄 Reiniciar
      </button>
      <button
        className="btn btn-ranking"
        onClick={onShowRanking}
      >
        🏆 Rànquing
      </button>
    </div>
  )
}

export default Controls
