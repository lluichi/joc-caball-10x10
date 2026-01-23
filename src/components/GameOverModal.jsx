import { useState, useEffect } from 'react'
import { obtenirRanking, guardarRanking } from '../utils/ranking'
import './GameOverModal.css'

function GameOverModal({ score, onClose, onRestart }) {
  const [playerName, setPlayerName] = useState('')
  const [isTopPlayer, setIsTopPlayer] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)
  const [position, setPosition] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const comprovarPosicio = async () => {
      const rankings = await obtenirRanking()

      // Comprovar si el jugador està entre els 100 millors
      if (rankings.length < 100 || score > rankings[rankings.length - 1].score) {
        setIsTopPlayer(true)
        // Calcular la posició
        const pos = rankings.findIndex(r => score > r.score)
        setPosition(pos === -1 ? rankings.length + 1 : pos + 1)
      }
    }
    comprovarPosicio()
  }, [score])

  const handleSave = async () => {
    if (!playerName.trim()) return

    setSaving(true)
    setError(null)

    const success = await guardarRanking(playerName.trim(), score)

    if (success) {
      setHasSaved(true)
    } else {
      setError('Error guardant la puntuació. Torna-ho a provar.')
    }

    setSaving(false)
  }

  const getMessage = () => {
    if (score === 100) return "🎉 INCREÏBLE! Has completat tot el taulell! 🎉"
    if (score >= 80) return "🌟 Fantàstic! Gairebé perfecte!"
    if (score >= 60) return "💪 Molt bona partida!"
    if (score >= 40) return "👍 Bé! Pots millorar!"
    if (score >= 20) return "🎯 No està malament!"
    return "🐴 Continua practicant!"
  }

  return (
    <div className="modal-overlay">
      <div className="modal game-over-modal">
        <h2>🏁 Fi de la Partida! 🏁</h2>

        <div className="score-display">
          <span className="score-label">Puntuació:</span>
          <span className="score-value">{score}</span>
          <span className="score-max">/ 100</span>
        </div>

        <p className="score-message">{getMessage()}</p>

        {isTopPlayer && !hasSaved && (
          <div className="top-player-section">
            <p className="congrats">
              🎊 Felicitats! Estàs en el TOP 100! 🎊
              <br />
              <span className="position-text">Posició: {position}è</span>
            </p>
            <div className="name-input-container">
              <input
                type="text"
                className="name-input"
                placeholder="Escriu el teu nom..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                autoFocus
                disabled={saving}
              />
              <button
                className="btn btn-save"
                onClick={handleSave}
                disabled={!playerName.trim() || saving}
              >
                {saving ? '⏳ Guardant...' : '💾 Guardar'}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}

        {hasSaved && (
          <p className="saved-message">✅ Puntuació guardada!</p>
        )}

        <div className="modal-buttons">
          <button className="btn btn-restart-modal" onClick={onRestart}>
            🔄 Tornar a Jugar
          </button>
          <button className="btn btn-close" onClick={onClose}>
            👋 Sortir
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal
