import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import GamePage from './pages/GamePage'
import StatsPage from './pages/StatsPage'
import { StatsProvider } from './context/StatsContext'
import { useStats } from './context/StatsContext'
import { CHAPTERS } from './data/constants'
import './styles/App.css'
 
const CoinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7.5" fill="#c9a84c" stroke="#a07830" strokeWidth="1"/>
    <text x="8" y="12" textAnchor="middle" fontSize="9" fontWeight="900" fill="#a07830" fontFamily="sans-serif">$</text>
  </svg>
)

const XpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon
      points="8,1 10.2,5.8 15.5,6.6 11.7,10.3 12.6,15.5 8,13 3.4,15.5 4.3,10.3 0.5,6.6 5.8,5.8"
      fill="#3b82f6" stroke="#1d4ed8" strokeWidth="0.8"
    />
  </svg>
)

function Nav() {
  const { activeChapter, setActiveChapter, coins, xp } = useStats()

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
      <div className="nav-economy">
        <div className="nav-economy__item">
          <CoinIcon />
          <span className="nav-economy__value">{coins.toLocaleString()}</span>
        </div>
        <div className="nav-economy__item">
          <XpIcon />
          <span className="nav-economy__value">{xp.toLocaleString()}</span>
        </div>
      </div>
      <div className="nav-links">
        <NavLink to="/"     end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Game</NavLink>
        <NavLink to="/stats"    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Stats</NavLink>
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