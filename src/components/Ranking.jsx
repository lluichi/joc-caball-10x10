import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { obtenirRanking } from '../utils/ranking'
import BOARD_CONFIGS from '../utils/boardConfigs'
import './Ranking.css'

function Ranking({ currentBoardId, onClose }) {
  const { t } = useTranslation()
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterBoard, setFilterBoard] = useState(currentBoardId || '')

  // Formatar temps en mm:ss
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const carregarRankings = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await obtenirRanking(filterBoard || undefined)
        setRankings(data)
      } catch {
        setError(t('ranking.loadError'))
      } finally {
        setLoading(false)
      }
    }
    carregarRankings()
  }, [t, filterBoard])

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}.`
  }

  const boardOptions = Object.keys(BOARD_CONFIGS)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal ranking-modal" onClick={e => e.stopPropagation()}>
        <h2>🏆 {t('ranking.title')} 🏆</h2>

        <div className="ranking-filter">
          <label htmlFor="ranking-board-filter">{t('ranking.filterBoard')}</label>
          <select
            id="ranking-board-filter"
            value={filterBoard}
            onChange={e => setFilterBoard(e.target.value)}
          >
            <option value="">{t('ranking.filterAll')}</option>
            {boardOptions.map(id => (
              <option key={id} value={id}>
                {t(`boards.${id}`)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="loading-rankings">{t('ranking.loading')}</p>
        ) : error ? (
          <p className="error-rankings">{error}</p>
        ) : rankings.length === 0 ? (
          <p className="no-rankings">{t('ranking.empty')}</p>
        ) : (
          <div className="ranking-list">
            {rankings.map((entry, index) => (
              <div key={index} className={`ranking-entry ${index < 3 ? 'top-three' : ''}`}>
                <span className="ranking-position">{getMedal(index)}</span>
                <span className="ranking-name">{entry.name}</span>
                <span className="ranking-score">{t('ranking.moves', { count: entry.score })}</span>
                <span className="ranking-time">⏱️ {formatTime(entry.time)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={onClose}>
            {t('buttons.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Ranking
