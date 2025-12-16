import { useState, useEffect } from 'react'
import './Ranking.css'

function Ranking({ onClose }) {
  const [rankings, setRankings] = useState([])

  useEffect(() => {
    const savedRankings = localStorage.getItem('knightTourRankings')
    if (savedRankings) {
      setRankings(JSON.parse(savedRankings))
    }
  }, [])

  const clearRankings = () => {
    if (window.confirm('Segur que vols esborrar tot el rànquing?')) {
      localStorage.removeItem('knightTourRankings')
      setRankings([])
    }
  }

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

        {rankings.length === 0 ? (
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
          {rankings.length > 0 && (
            <button className="btn btn-danger" onClick={clearRankings}>
              🗑️ Esborrar Rànquing
            </button>
          )}
          <button className="btn btn-primary" onClick={onClose}>
            Tancar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Ranking
