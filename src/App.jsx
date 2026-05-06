import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import GamePage from './pages/GamePage'
import StatsPage from './pages/StatsPage'
import { StatsProvider } from './context/StatsContext'
import './styles/App.css'
 
export default function App() {
  return (
    <StatsProvider>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">Poker RNG</div>
          <div className="nav-links">
            <NavLink to="/"      end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Game</NavLink>
            <NavLink to="/stats"     className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Stats</NavLink>
          </div>
        </nav>
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