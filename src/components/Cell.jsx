import './Cell.css'

function Cell({ value, isBlocked, isKnight, isValidMove, isInvalidMove, isLight, isFirstMove, onClick }) {
  if (isBlocked) {
    return <div className="cell cell-blocked" />
  }

  let className = 'cell'
  className += isLight ? ' cell-light' : ' cell-dark'

  if (isKnight) {
    className += ' cell-knight'
  } else if (isInvalidMove) {
    className += ' cell-invalid'
  } else if (isValidMove) {
    className += ' cell-valid'
  } else if (value > 0) {
    className += ' cell-visited'
  } else if (isFirstMove) {
    className += ' cell-available'
  }

  return (
    <div className={className} onClick={onClick}>
      {isKnight && <span className="knight">♞</span>}
      {!isKnight && value > 0 && <span className="cell-number">{value}</span>}
      {isValidMove && !isKnight && <span className="valid-indicator">●</span>}
    </div>
  )
}

export default Cell
