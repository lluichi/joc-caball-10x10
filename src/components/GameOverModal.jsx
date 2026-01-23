import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { obtenirRanking, guardarRanking } from '../utils/ranking'
import './GameOverModal.css'

function GameOverModal({ score, time, onClose, onRestart }) {
  const { t } = useTranslation()

  // Formatar temps en mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
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

    const success = await guardarRanking(playerName.trim(), score, time)

    if (success) {
      setHasSaved(true)
    } else {
      setError(t('gameOver.saveError'))
    }

    setSaving(false)
  }

  const getMessage = () => {
    if (score === 100) return `🎉 ${t('gameOver.perfect')} 🎉`
    if (score >= 80) return `🌟 ${t('gameOver.excellent')}`
    if (score >= 60) return `💪 ${t('gameOver.great')}`
    if (score >= 40) return `👍 ${t('gameOver.good')}`
    if (score >= 20) return `🎯 ${t('gameOver.ok')}`
    return `🐴 ${t('gameOver.keepTrying')}`
  }

  return (
    <div className="modal-overlay">
      <div className="modal game-over-modal">
        <h2>🏁 {t('gameOver.title')} 🏁</h2>

        <div className="score-display">
          <span className="score-label">{t('gameOver.score')}</span>
          <span className="score-value">{score}</span>
          <span className="score-max">/ 100</span>
        </div>

        <div className="time-display">
          <span className="time-icon">⏱️</span>
          <span className="time-label">{t('gameOver.time')}</span>
          <span className="time-value">{formatTime(time)}</span>
        </div>

        <p className="score-message">{getMessage()}</p>

        {isTopPlayer && !hasSaved && (
          <div className="top-player-section">
            <p className="congrats">
              🎊 {t('gameOver.topPlayer')} 🎊
              <br />
              <span className="position-text">{t('gameOver.position', { position })}</span>
            </p>
            <div className="name-input-container">
              <input
                type="text"
                className="name-input"
                placeholder={t('gameOver.enterName')}
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
                {saving ? `⏳ ${t('buttons.saving')}` : `💾 ${t('buttons.save')}`}
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}

        {hasSaved && (
          <p className="saved-message">✅ {t('gameOver.saved')}</p>
        )}

        <div className="modal-buttons">
          <button className="btn btn-restart-modal" onClick={onRestart}>
            🔄 {t('buttons.playAgain')}
          </button>
          <button className="btn btn-close" onClick={onClose}>
            👋 {t('buttons.exit')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal
