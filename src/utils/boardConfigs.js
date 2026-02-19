// Configuració de taulers per al joc del Cavall
// Cada tauler defineix: type, rows, cols, totalCells, generate()
// generate() retorna una matriu 2D on null = casella bloquejada, 0 = casella jugable

function createFullBoard(rows, cols) {
  return Array(rows).fill(null).map(() => Array(cols).fill(0))
}

function createRingBoard(rows, cols, holeRows, holeCols) {
  const board = createFullBoard(rows, cols)
  const startRow = Math.floor((rows - holeRows) / 2)
  const startCol = Math.floor((cols - holeCols) / 2)
  for (let r = startRow; r < startRow + holeRows; r++) {
    for (let c = startCol; c < startCol + holeCols; c++) {
      board[r][c] = null
    }
  }
  return board
}

function createCrossBoard(size, cornerSize) {
  const board = createFullBoard(size, size)
  // Invalida els quatre blocs de cantonada
  for (let r = 0; r < cornerSize; r++) {
    for (let c = 0; c < cornerSize; c++) {
      board[r][c] = null // Superior esquerra
      board[r][size - 1 - c] = null // Superior dreta
      board[size - 1 - r][c] = null // Inferior esquerra
      board[size - 1 - r][size - 1 - c] = null // Inferior dreta
    }
  }
  return board
}

function createBridgeBoard_4x4_4x4_1x1() {
  // 4 files x 9 columnes: dos blocs 4x4 amb un pont 1x1 al mig
  const rows = 4, cols = 9
  const board = Array(rows).fill(null).map(() => Array(cols).fill(null))
  // Bloc esquerre: cols 0-3
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      board[r][c] = 0
    }
  }
  // Bloc dret: cols 5-8
  for (let r = 0; r < 4; r++) {
    for (let c = 5; c < 9; c++) {
      board[r][c] = 0
    }
  }
  // Pont: 1 casella a (1, 4)
  board[1][4] = 0
  return board
}

function createBridgeBoard_5x5_5x5_1x1() {
  // 5 files x 11 columnes: dos blocs 5x5 amb un pont 1x1
  const rows = 5, cols = 11
  const board = Array(rows).fill(null).map(() => Array(cols).fill(null))
  // Bloc esquerre: cols 0-4
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      board[r][c] = 0
    }
  }
  // Bloc dret: cols 6-10
  for (let r = 0; r < 5; r++) {
    for (let c = 6; c < 11; c++) {
      board[r][c] = 0
    }
  }
  // Pont: 1 casella a (2, 5) - fila central
  board[2][5] = 0
  return board
}

function createBridgeBoard_4x4_6x6_1x2() {
  // 6 files x 11 columnes: bloc 4x4 (centrat) + pont 1x2 + bloc 6x6
  const rows = 6, cols = 11
  const board = Array(rows).fill(null).map(() => Array(cols).fill(null))
  // Bloc esquerre 4x4: files 1-4, cols 0-3 (centrat verticalment)
  for (let r = 1; r < 5; r++) {
    for (let c = 0; c < 4; c++) {
      board[r][c] = 0
    }
  }
  // Bloc dret 6x6: files 0-5, cols 5-10
  for (let r = 0; r < 6; r++) {
    for (let c = 5; c < 11; c++) {
      board[r][c] = 0
    }
  }
  // Pont 1x2: files 2-3, col 4
  board[2][4] = 0
  board[3][4] = 0
  return board
}

function createBridgeBoard_triple_4x4() {
  // 4 files x 14 columnes: tres blocs 4x4 amb dos ponts 1x1
  const rows = 4, cols = 14
  const board = Array(rows).fill(null).map(() => Array(cols).fill(null))
  // Bloc 1: cols 0-3
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      board[r][c] = 0
    }
  }
  // Bloc 2: cols 5-8
  for (let r = 0; r < 4; r++) {
    for (let c = 5; c < 9; c++) {
      board[r][c] = 0
    }
  }
  // Bloc 3: cols 10-13
  for (let r = 0; r < 4; r++) {
    for (let c = 10; c < 14; c++) {
      board[r][c] = 0
    }
  }
  // Pont 1: (1, 4)
  board[1][4] = 0
  // Pont 2: (2, 9)
  board[2][9] = 0
  return board
}

function countCells(generateFn) {
  const board = generateFn()
  let count = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell !== null) count++
    }
  }
  return count
}

// Definició de tots els taulers
const BOARD_CONFIGS = {
  // Clàssic
  classic_5x5: {
    type: 'classic', rows: 5, cols: 5,
    generate: () => createFullBoard(5, 5)
  },
  classic_8x8: {
    type: 'classic', rows: 8, cols: 8,
    generate: () => createFullBoard(8, 8)
  },
  classic_8x10: {
    type: 'classic', rows: 8, cols: 10,
    generate: () => createFullBoard(8, 10)
  },
  classic_10x10: {
    type: 'classic', rows: 10, cols: 10,
    generate: () => createFullBoard(10, 10)
  },
  classic_10x12: {
    type: 'classic', rows: 10, cols: 12,
    generate: () => createFullBoard(10, 12)
  },
  classic_12x12: {
    type: 'classic', rows: 12, cols: 12,
    generate: () => createFullBoard(12, 12)
  },
  // L'Anell
  anell_8x8_h2x2: {
    type: 'anell', rows: 8, cols: 8,
    generate: () => createRingBoard(8, 8, 2, 2)
  },
  anell_10x10_h4x4: {
    type: 'anell', rows: 10, cols: 10,
    generate: () => createRingBoard(10, 10, 4, 4)
  },
  anell_10x12_h4x6: {
    type: 'anell', rows: 10, cols: 12,
    generate: () => createRingBoard(10, 12, 4, 6)
  },
  anell_12x12_h6x6: {
    type: 'anell', rows: 12, cols: 12,
    generate: () => createRingBoard(12, 12, 6, 6)
  },
  // La Creu
  creu_7x7_e2x2: {
    type: 'creu', rows: 7, cols: 7,
    generate: () => createCrossBoard(7, 2)
  },
  creu_10x10_e3x3: {
    type: 'creu', rows: 10, cols: 10,
    generate: () => createCrossBoard(10, 3)
  },
  creu_13x13_e4x4: {
    type: 'creu', rows: 13, cols: 13,
    generate: () => createCrossBoard(13, 4)
  },
  // El Pont
  pont_4x4_4x4_1x1: {
    type: 'pont', rows: 4, cols: 9,
    generate: createBridgeBoard_4x4_4x4_1x1
  },
  pont_5x5_5x5_1x1: {
    type: 'pont', rows: 5, cols: 11,
    generate: createBridgeBoard_5x5_5x5_1x1
  },
  pont_4x4_6x6_1x2: {
    type: 'pont', rows: 6, cols: 11,
    generate: createBridgeBoard_4x4_6x6_1x2
  },
  pont_triple_4x4: {
    type: 'pont', rows: 4, cols: 14,
    generate: createBridgeBoard_triple_4x4
  }
}

// Calcular totalCells per a cada configuració
for (const [key, config] of Object.entries(BOARD_CONFIGS)) {
  config.id = key
  config.totalCells = countCells(config.generate)
}

// Tipus de tauler amb les seves opcions de mida
export const BOARD_TYPES = ['classic', 'anell', 'creu', 'pont']

export function getBoardsByType(type) {
  return Object.values(BOARD_CONFIGS).filter(c => c.type === type)
}

export function getBoardConfig(id) {
  return BOARD_CONFIGS[id] || BOARD_CONFIGS.classic_10x10
}

export const DEFAULT_BOARD_ID = 'classic_10x10'

export default BOARD_CONFIGS
