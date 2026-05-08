import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import GamePage from './pages/GamePage'
import StatsPage from './pages/StatsPage'
import { StatsProvider } from './context/StatsContext'
import { useStats } from './context/StatsContext'
import { CHAPTERS } from './data/constants'
import './styles/App.css'
 
function Nav() {
  const { activeChapter, setActiveChapter } = useStats()
 
  return (
    <nav className="nav">
      <div className="nav-logo">Poker RNG</div>
      <div className="nav-chapters">
        {CHAPTERS.map(ch => (
          <button
            key={ch.id}
            className={`nav-chapter${activeChapter.id === ch.id ? ' nav-chapter--active' : ''}`}
            onClick={() => setActiveChapter(ch)}
          >
            {ch.name}
          </button>
        ))}
      </div>
      <div className="nav-links">
        <NavLink to="/"      end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Game</NavLink>
        <NavLink to="/stats"     className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Stats</NavLink>
      </div>
    </nav>
  )
}
 
export default function App() {
  return (
    <StatsProvider>
      <div className="app">
        <Nav />
        <main className="main">
          <Routes>
            <Route path="/"      element={<GamePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </StatsProvider>
  )
}