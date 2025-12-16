import { useState, useCallback } from 'react'
import Board from './components/Board'
import Controls from './components/Controls'
import Ranking from './components/Ranking'
import GameOverModal from './components/GameOverModal'
import './App.css'

// Moviments possibles del cavall (en forma de L)
const KNIGHT_MOVES = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1]
]

const BOARD_SIZE = 10

function App() {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)))
  const [knightPosition, setKnightPosition] = useState(null)
  const [turn, setTurn] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showRanking, setShowRanking] = useState(false)
  const [invalidMove, setInvalidMove] = useState(null)
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState("🎯 Clica una casella per col·locar el cavall!")

  // Obtenir moviments vàlids des d'una posició
  const getValidMoves = useCallback((row, col, currentBoard) => {
    if (row === null || col === null) return []

    return KNIGHT_MOVES
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([r, c]) =>
        r >= 0 && r < BOARD_SIZE &&
        c >= 0 && c < BOARD_SIZE &&
        currentBoard[r][c] === 0
      )
  }, [])

  // Comprovar si el joc ha acabat
  const checkGameOver = useCallback((row, col, currentBoard) => {
    const validMoves = getValidMoves(row, col, currentBoard)
    return validMoves.length === 0
  }, [getValidMoves])

  // Gestionar clic a una casella
  const handleCellClick = (row, col) => {
    if (gameOver) return

    // Primer moviment: col·locar el cavall
    if (knightPosition === null) {
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = 1
      setBoard(newBoard)
      setKnightPosition([row, col])
      setTurn(1)
      setHistory([{ board: board.map(r => [...r]), position: null, turn: 0 }])
      setMessage("🐴 Mou el cavall en L! Les caselles verdes són vàlides.")

      if (checkGameOver(row, col, newBoard)) {
        setGameOver(true)
        setMessage("🏁 Joc acabat! Has fet 1 moviment.")
      }
      return
    }

    // Comprovar si és un moviment vàlid
    const [currentRow, currentCol] = knightPosition
    const validMoves = getValidMoves(currentRow, currentCol, board)
    const isValidMove = validMoves.some(([r, c]) => r === row && c === col)

    if (!isValidMove) {
      // Moviment invàlid - mostrar feedback vermell
      setInvalidMove([row, col])
      setMessage("❌ Moviment no vàlid! El cavall es mou en L.")
      setTimeout(() => setInvalidMove(null), 500)
      return
    }

    // Moviment vàlid
    const newTurn = turn + 1
    const newBoard = board.map(r => [...r])
    newBoard[row][col] = newTurn

    setHistory([...history, { board: board.map(r => [...r]), position: knightPosition, turn }])
    setBoard(newBoard)
    setKnightPosition([row, col])
    setTurn(newTurn)
    setMessage(`✨ Torn ${newTurn} - Molt bé! Continua!`)

    if (checkGameOver(row, col, newBoard)) {
      setGameOver(true)
      setMessage(`🏁 Joc acabat! Has fet ${newTurn} moviments.`)
    }
  }

  // Desfer últim moviment
  const handleUndo = () => {
    if (history.length === 0 || gameOver) return

    const lastState = history[history.length - 1]
    setBoard(lastState.board)
    setKnightPosition(lastState.position)
    setTurn(lastState.turn)
    setHistory(history.slice(0, -1))
    setMessage(lastState.position ? `⏪ Torn ${lastState.turn} - Moviment desfet!` : "🎯 Clica una casella per col·locar el cavall!")
  }

  // Reiniciar partida
  const handleRestart = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)))
    setKnightPosition(null)
    setTurn(0)
    setGameOver(false)
    setHistory([])
    setInvalidMove(null)
    setMessage("🎯 Clica una casella per col·locar el cavall!")
  }

  // Tancar modal de fi de joc
  const handleCloseModal = () => {
    setGameOver(false)
  }

  // Obtenir moviments vàlids actuals
  const currentValidMoves = knightPosition ? getValidMoves(knightPosition[0], knightPosition[1], board) : []

  return (
    <div className="app">
      <header className="header">
        <h1>🐴 El Passeig del Cavall 🐴</h1>
        <p className="subtitle">Mou el cavall per tot el taulell sense repetir caselles!</p>
      </header>

      <div className="game-info">
        <div className="turn-counter">
          <span className="turn-label">Torn:</span>
          <span className="turn-number">{turn}</span>
          <span className="max-score">/ 100</span>
        </div>
        <div className="message">{message}</div>
      </div>

      <div className="game-container">
        <Board
          board={board}
          knightPosition={knightPosition}
          validMoves={currentValidMoves}
          invalidMove={invalidMove}
          onCellClick={handleCellClick}
          isFirstMove={knightPosition === null}
        />
      </div>

      <Controls
        onUndo={handleUndo}
        onRestart={handleRestart}
        onShowRanking={() => setShowRanking(true)}
        canUndo={history.length > 0 && !gameOver}
      />

      {gameOver && (
        <GameOverModal
          score={turn}
          onClose={handleCloseModal}
          onRestart={handleRestart}
        />
      )}

      {showRanking && (
        <Ranking
          onClose={() => setShowRanking(false)}
        />
      )}
    </div>
  )
}

export default App
