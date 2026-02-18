import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Board from './components/Board'
import Ranking from './components/Ranking'
import GameOverModal from './components/GameOverModal'
import HelpModal from './components/HelpModal'
import SettingsModal from './components/SettingsModal'
import LanguageSelector from './components/LanguageSelector'
import { getBoardConfig, DEFAULT_BOARD_ID } from './utils/boardConfigs'
import './App.css'

// Moviments possibles del cavall (en forma de L)
const KNIGHT_MOVES = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1]
]

function App() {
  const { t } = useTranslation()
  const [boardConfigId, setBoardConfigId] = useState(DEFAULT_BOARD_ID)
  const boardConfig = getBoardConfig(boardConfigId)
  const [board, setBoard] = useState(() => boardConfig.generate())
  const [knightPosition, setKnightPosition] = useState(null)
  const [turn, setTurn] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showRanking, setShowRanking] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [invalidMove, setInvalidMove] = useState(null)
  const [history, setHistory] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [messageKey, setMessageKey] = useState({ key: 'clickToPlace', params: {} })
  const [elapsedTime, setElapsedTime] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const startTimeRef = useRef(null)
  const timerRef = useRef(null)

  // Gestionar el cronòmetre
  useEffect(() => {
    if (startTimeRef.current && !gameOver) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameOver, knightPosition])

  // Formatar temps en mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Obtenir missatge traduït dinàmicament
  const getMessage = () => {
    const icons = {
      clickToPlace: '🎯',
      moveKnight: '🐴',
      invalidMove: '❌',
      turnMessage: '✨',
      gameEndSingle: '🏁',
      gameEnd: '🏁',
      undone: '⏪'
    }
    const icon = icons[messageKey.key] || ''
    return `${icon} ${t(`game.${messageKey.key}`, messageKey.params)}`
  }

  // Obtenir moviments vàlids des d'una posició
  const getValidMoves = useCallback((row, col, currentBoard) => {
    if (row === null || col === null) return []
    const rows = currentBoard.length
    const cols = currentBoard[0].length

    return KNIGHT_MOVES
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([r, c]) =>
        r >= 0 && r < rows &&
        c >= 0 && c < cols &&
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
    // No permetre clic a caselles bloquejades (null)
    if (board[row][col] === null) return

    // Primer moviment: col·locar el cavall
    if (knightPosition === null) {
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = 1
      setBoard(newBoard)
      setKnightPosition([row, col])
      setTurn(1)
      setHistory([{ board: board.map(r => [...r]), position: null, turn: 0 }])
      setMessageKey({ key: 'moveKnight', params: {} })

      // Iniciar cronòmetre
      startTimeRef.current = Date.now()
      setElapsedTime(0)

      if (checkGameOver(row, col, newBoard)) {
        const time = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setFinalTime(time)
        setElapsedTime(time)
        setGameOver(true)
        setMessageKey({ key: 'gameEndSingle', params: {} })
      }
      return
    }

    // Comprovar si és un moviment vàlid
    const [currentRow, currentCol] = knightPosition
    const validMoves = getValidMoves(currentRow, currentCol, board)
    const isValidMove = validMoves.some(([r, c]) => r === row && c === col)

    if (!isValidMove) {
      setInvalidMove([row, col])
      setMessageKey({ key: 'invalidMove', params: {} })
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
    setMessageKey({ key: 'turnMessage', params: { turn: newTurn } })

    if (checkGameOver(row, col, newBoard)) {
      const time = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setFinalTime(time)
      setElapsedTime(time)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setGameOver(true)
      setMessageKey({ key: 'gameEnd', params: { moves: newTurn } })
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
    setMessageKey(lastState.position ? { key: 'undone', params: {} } : { key: 'clickToPlace', params: {} })
    setMenuOpen(false)
  }

  // Reiniciar partida (amb el tauler actual)
  const handleRestart = () => {
    const config = getBoardConfig(boardConfigId)
    setBoard(config.generate())
    setKnightPosition(null)
    setTurn(0)
    setGameOver(false)
    setHistory([])
    setInvalidMove(null)
    setMessageKey({ key: 'clickToPlace', params: {} })
    setMenuOpen(false)
    // Reiniciar cronòmetre
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    startTimeRef.current = null
    setElapsedTime(0)
    setFinalTime(0)
  }

  // Aplicar nova configuració de tauler
  const handleApplySettings = (newBoardId) => {
    setBoardConfigId(newBoardId)
    const config = getBoardConfig(newBoardId)
    setBoard(config.generate())
    setKnightPosition(null)
    setTurn(0)
    setGameOver(false)
    setHistory([])
    setInvalidMove(null)
    setMessageKey({ key: 'clickToPlace', params: {} })
    setMenuOpen(false)
    // Reiniciar cronòmetre
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    startTimeRef.current = null
    setElapsedTime(0)
    setFinalTime(0)
  }

  // Tancar modal de fi de joc
  const handleCloseModal = () => {
    setGameOver(false)
  }

  // Obtenir moviments vàlids actuals
  const currentValidMoves = knightPosition ? getValidMoves(knightPosition[0], knightPosition[1], board) : []
  const canUndo = history.length > 0 && !gameOver

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          {/* Hamburguesa esquerra */}
          <button
            className="header-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* Títol centrat amb nom del tauler */}
          <div className="header-title">
            <span className="header-knight">♞</span>
            <h1>
              {t('game.title')}
              <span className="header-board-name"> — {t(`boards.${boardConfigId}`)}</span>
            </h1>
          </div>

          {/* Selector d'idioma a la dreta */}
          <div className="header-right">
            <LanguageSelector />
          </div>
        </div>

        {/* Menú desplegable */}
        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-language mobile-only-lang">
              <LanguageSelector />
            </div>
            <button onClick={() => { setShowSettings(true); setMenuOpen(false); }}>
              ⚙️ {t('buttons.settings')}
            </button>
            <button onClick={() => { setShowHelp(true); setMenuOpen(false); }}>
              ❓ {t('buttons.howToPlay')}
            </button>
            <button onClick={() => { setShowRanking(true); setMenuOpen(false); }}>
              🏆 {t('buttons.ranking')}
            </button>
            <button onClick={handleUndo} disabled={!canUndo}>
              ⏪ {t('buttons.undo')}
            </button>
            <button onClick={handleRestart}>
              🔄 {t('buttons.restart')}
            </button>
          </div>
        )}
      </header>

      <div className="game-info">
        <div className="turn-counter">
          <span className="turn-label">{t('game.turn')}</span>
          <span className="turn-number">{turn}</span>
          <span className="max-score">{t('game.maxScore', { max: boardConfig.totalCells })}</span>
          {knightPosition && (
            <>
              <span className="time-separator">|</span>
              <span className="time-icon">⏱️</span>
              <span className="time-value">{formatTime(elapsedTime)}</span>
            </>
          )}
        </div>
        <div className="message">{getMessage()}</div>
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

      {/* Controls desktop */}
      <div className="controls desktop-only">
        <button className="btn btn-settings" onClick={() => setShowSettings(true)}>
          ⚙️ {t('buttons.settings')}
        </button>
        <button className="btn btn-undo" onClick={handleUndo} disabled={!canUndo}>
          ⏪ {t('buttons.undo')}
        </button>
        <button className="btn btn-restart" onClick={handleRestart}>
          🔄 {t('buttons.restart')}
        </button>
        <button className="btn btn-help" onClick={() => setShowHelp(true)}>
          ❓ {t('buttons.howToPlay')}
        </button>
        <button className="btn btn-ranking" onClick={() => setShowRanking(true)}>
          🏆 {t('buttons.ranking')}
        </button>
      </div>

      {gameOver && (
        <GameOverModal
          score={turn}
          maxScore={boardConfig.totalCells}
          time={finalTime}
          boardConfigId={boardConfigId}
          onClose={handleCloseModal}
          onRestart={handleRestart}
        />
      )}

      {showRanking && (
        <Ranking
          currentBoardId={boardConfigId}
          onClose={() => setShowRanking(false)}
        />
      )}

      {showHelp && (
        <HelpModal
          maxScore={boardConfig.totalCells}
          onClose={() => setShowHelp(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          currentBoardId={boardConfigId}
          onApply={handleApplySettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
