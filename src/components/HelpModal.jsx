import './HelpModal.css'

function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal help-modal" onClick={e => e.stopPropagation()}>
        <h2>ℹ️ Com Jugar</h2>

        <div className="help-content">
          <div className="help-section">
            <h3>🎯 Objectiu</h3>
            <p>Visita el màxim nombre de caselles movent el cavall sense repetir cap casella.</p>
          </div>

          <div className="help-section">
            <h3>🐴 Moviment del Cavall</h3>
            <p>El cavall es mou en forma de <strong>L</strong>:</p>
            <ul>
              <li>2 caselles en una direcció + 1 casella perpendicular</li>
              <li>O 1 casella en una direcció + 2 caselles perpendiculars</li>
            </ul>
            <div className="knight-diagram">
              <div className="diagram-grid">
                {[...Array(25)].map((_, i) => {
                  const row = Math.floor(i / 5)
                  const col = i % 5
                  const isKnight = row === 2 && col === 2
                  const isValid = (
                    (row === 0 && col === 1) || (row === 0 && col === 3) ||
                    (row === 1 && col === 0) || (row === 1 && col === 4) ||
                    (row === 3 && col === 0) || (row === 3 && col === 4) ||
                    (row === 4 && col === 1) || (row === 4 && col === 3)
                  )
                  return (
                    <div
                      key={i}
                      className={`diagram-cell ${isKnight ? 'knight' : ''} ${isValid ? 'valid' : ''}`}
                    >
                      {isKnight && '♞'}
                      {isValid && '●'}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>🎨 Colors</h3>
            <div className="color-legend">
              <div className="legend-item">
                <span className="legend-color green"></span>
                <span>Moviments vàlids</span>
              </div>
              <div className="legend-item">
                <span className="legend-color red"></span>
                <span>Moviment invàlid</span>
              </div>
              <div className="legend-item">
                <span className="legend-color blue"></span>
                <span>Caselles visitades</span>
              </div>
              <div className="legend-item">
                <span className="legend-color gold"></span>
                <span>Posició del cavall</span>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>🏆 Puntuació</h3>
            <p>La puntuació és el nombre de caselles visitades. El màxim és <strong>100</strong> (totes les caselles!).</p>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose}>
          Entesos! 👍
        </button>
      </div>
    </div>
  )
}

export default HelpModal
