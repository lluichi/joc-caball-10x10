# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Knight's Tour (El Passeig del Cavall) - A React-based interactive chess puzzle game where players move a knight on a 10x10 board, visiting as many squares as possible without repeating any.

## Commands

```bash
npm run dev      # Start development server (localhost:5173)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

**Tech Stack:** React 19 + Vite 7, no state management library (uses React hooks)

**Game State:** All game logic lives in `App.jsx` using useState/useCallback hooks:
- `board`: 10x10 array tracking visit order (0 = unvisited, 1-100 = turn number)
- `knightPosition`: Current [row, col] coordinates
- `history`: Stack of previous states for undo functionality
- `KNIGHT_MOVES`: L-shaped movement offsets (8 possible moves)

**Component Structure:**
- `App.jsx` - Game logic, state management, and layout
- `Board.jsx` - Renders 10x10 grid, passes props to cells
- `Cell.jsx` - Individual cell with visual states (knight, valid move, invalid move, visited)
- `GameOverModal.jsx` - End game dialog with score saving
- `Ranking.jsx` - TOP 10 leaderboard (localStorage key: `knightTourRankings`)
- `HelpModal.jsx` - Game instructions

**Styling:** Each component has its own CSS file. Responsive design with mobile hamburger menu.

**Data Persistence:** Rankings stored in localStorage as JSON array of `{name, score}` objects.

## Language

UI text and comments are in Catalan.
