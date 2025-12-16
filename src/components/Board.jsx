import Cell from './Cell'
import './Board.css'

function Board({ board, knightPosition, validMoves, invalidMove, onCellClick, isFirstMove }) {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const isKnight = knightPosition && knightPosition[0] === rowIndex && knightPosition[1] === colIndex
            const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex)
            const isInvalidMove = invalidMove && invalidMove[0] === rowIndex && invalidMove[1] === colIndex
            const isLight = (rowIndex + colIndex) % 2 === 0

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                isKnight={isKnight}
                isValidMove={isValidMove}
                isInvalidMove={isInvalidMove}
                isLight={isLight}
                isFirstMove={isFirstMove}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Board
