import { useTranslation } from 'react-i18next'
import './HelpModal.css'

function HelpModal({ maxScore, onClose }) {
  const { t } = useTranslation()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal help-modal" onClick={e => e.stopPropagation()}>
        <h2>ℹ️ {t('help.title')}</h2>

        <div className="help-content">
          <div className="help-section">
            <h3>🎯 {t('help.objective')}</h3>
            <p>{t('help.objectiveText')}</p>
          </div>

          <div className="help-section">
            <h3>🐴 {t('help.movement')}</h3>
            <p>{t('help.movementText')}</p>
            <ul>
              <li>{t('help.movementOption1')}</li>
              <li>{t('help.movementOption2')}</li>
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
            <h3>🎨 {t('help.colors')}</h3>
            <div className="color-legend">
              <div className="legend-item">
                <span className="legend-color green"></span>
                <span>{t('help.validMoves')}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color red"></span>
                <span>{t('help.invalidMove')}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color blue"></span>
                <span>{t('help.visitedCells')}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color gold"></span>
                <span>{t('help.knightPosition')}</span>
              </div>
            </div>
          </div>

          <div className="help-section">
            <h3>🏆 {t('help.scoring')}</h3>
            <p>{t('help.scoringText', { max: maxScore })}</p>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose}>
          {t('buttons.understood')} 👍
        </button>
      </div>
    </div>
  )
}

export default HelpModal
