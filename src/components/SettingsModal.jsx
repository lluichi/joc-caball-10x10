import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BOARD_TYPES, getBoardsByType, getBoardConfig } from '../utils/boardConfigs'
import './SettingsModal.css'

function SettingsModal({ currentBoardId, onApply, onClose }) {
  const { t } = useTranslation()
  const currentConfig = getBoardConfig(currentBoardId)
  const [selectedType, setSelectedType] = useState(currentConfig.type)
  const [selectedBoardId, setSelectedBoardId] = useState(currentBoardId)

  const availableBoards = getBoardsByType(selectedType)

  const handleTypeChange = (e) => {
    const newType = e.target.value
    setSelectedType(newType)
    // Seleccionar el primer tauler del nou tipus
    const boards = getBoardsByType(newType)
    if (boards.length > 0) {
      setSelectedBoardId(boards[0].id)
    }
  }

  const handleSizeChange = (e) => {
    setSelectedBoardId(e.target.value)
  }

  const handleApply = () => {
    onApply(selectedBoardId)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
        <h2>{t('settings.title')}</h2>
        <p className="settings-description">{t('settings.description')}</p>

        <div className="settings-form">
          <div className="settings-field">
            <label htmlFor="board-type">{t('settings.boardType')}</label>
            <select
              id="board-type"
              value={selectedType}
              onChange={handleTypeChange}
            >
              {BOARD_TYPES.map(type => (
                <option key={type} value={type}>
                  {t(`boardTypes.${type}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-field">
            <label htmlFor="board-size">{t('settings.boardSize')}</label>
            <select
              id="board-size"
              value={selectedBoardId}
              onChange={handleSizeChange}
            >
              {availableBoards.map(board => (
                <option key={board.id} value={board.id}>
                  {t(`boards.${board.id}`)} ({board.totalCells})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={handleApply}>
            {t('settings.accept')}
          </button>
          <button className="btn btn-danger" onClick={onClose}>
            {t('settings.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
