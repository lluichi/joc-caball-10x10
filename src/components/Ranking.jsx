import { useState, useEffect } from 'react'
import { obtenirRanking } from '../utils/ranking'
import './Ranking.css'

function Ranking({ onClose }) {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const carregarRankings = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await obtenirRanking()
        setRankings(data)
      } catch {
        setError('Error carregant els rankings')
      } finally {
        setLoading(false)
      }
    }
    carregarRankings()
  }, [])

  const getMedal = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}.`
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal ranking-modal" onClick={e => e.stopPropagation()}>
        <h2>🏆 Millors Jugadors 🏆</h2>

        {loading ? (
          <p className="loading-rankings">Carregant...</p>
        ) : error ? (
          <p className="error-rankings">{error}</p>
        ) : rankings.length === 0 ? (
          <p className="no-rankings">Encara no hi ha puntuacions!</p>
        ) : (
          <div className="ranking-list">
            {rankings.map((entry, index) => (
              <div key={index} className={`ranking-entry ${index < 3 ? 'top-three' : ''}`}>
                <span className="ranking-position">{getMedal(index)}</span>
                <span className="ranking-name">{entry.name}</span>
                <span className="ranking-score">{entry.score} moviments</span>
              </div>
            ))}
          </div>
        )}

        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={onClose}>
            Tancar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Ranking
