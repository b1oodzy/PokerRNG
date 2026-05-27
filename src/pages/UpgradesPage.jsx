import React, { useState } from 'react'
import { useStats } from '../context/StatsContext'
import { CHAPTERS } from '../data/constants'
import { formatNum } from '../utils/format'
import './UpgradesPage.css'

// ── Chapter upgrade data ──────────────────────────────────────────
const CHAPTER_UPGRADES = CHAPTERS.map((ch, i) => ({
  id:    ch.id,
  name:  ch.name,
  desc:  [
    'Roll a single card. Learn the basics.',
    'Draw two cards. Pairs and suited connectors emerge.',
    'Three-card flops unlock straights and flushes.',
    'Four-card hands — full poker tactics apply.',
    'Five cards. The complete game begins.',
  ][i],
  xpCost: 0,
}))

// ── Discard upgrade tiers (free for dev testing) ──────────────────
const DISCARD_TIERS = [
  { level: 1, label: '1 Discard',  coinCost: 0,  desc: 'Keep your best card, redraw the rest.' },
  { level: 2, label: '2 Discards', coinCost: 0,  desc: 'Two chances to improve your hand.' },
  { level: 3, label: '3 Discards', coinCost: 0,  desc: 'Master-level control over your draw.' },
]

// ── Roll speed upgrade tiers (free for dev testing) ───────────────
const SPEED_TIERS = [
  { level: 1, label: 'Fast',    coinCost: 0, desc: 'Auto-draw every 1.5 seconds.' },
  { level: 2, label: 'Faster',  coinCost: 0, desc: 'Auto-draw every 1 second.' },
  { level: 3, label: 'Instant', coinCost: 0, desc: 'Auto-draw at maximum speed.' },
]

// ── Sub-components ────────────────────────────────────────────────

function SectionHeader({ color, icon, title, subtitle }) {
  return (
    <div className="upgrades-section__header" style={{ '--accent': color }}>
      <div className="upgrades-section__icon">{icon}</div>
      <div>
        <div className="upgrades-section__title">{title}</div>
        <div className="upgrades-section__subtitle">{subtitle}</div>
      </div>
    </div>
  )
}

function ChapterSection({ activeChapter, setActiveChapter }) {
  const idx     = CHAPTERS.findIndex(ch => ch.id === activeChapter.id)
  const canPrev = idx > 0
  const canNext = idx < CHAPTERS.length - 1

  return (
    <div className="upgrades-section upgrades-section--purple">
      <SectionHeader
        color="#a855f7"
        icon="◈"
        title="Chapter Unlock"
        subtitle="Progress through the game — paid with XP"
      />

      <div className="chapter-selector">
        <button
          className="chapter-selector__arrow"
          onClick={() => canPrev && setActiveChapter(CHAPTERS[idx - 1])}
          disabled={!canPrev}
        >‹</button>

        <div className="chapter-selector__cards">
          {CHAPTERS.map((ch, i) => {
            const isActive = ch.id === activeChapter.id
            const upgrade  = CHAPTER_UPGRADES[i]
            return (
              <div
                key={ch.id}
                className={`chapter-card${isActive ? ' chapter-card--active' : ''}`}
                onClick={() => setActiveChapter(ch)}
              >
                <div className="chapter-card__name">{ch.name}</div>
                <div className="chapter-card__desc">{upgrade.desc}</div>
                <div className="chapter-card__cost">
                  <span className="chapter-card__cost-icon">★</span>
                  <span>{upgrade.xpCost === 0 ? 'Free' : formatNum(upgrade.xpCost) + ' XP'}</span>
                </div>
                {isActive && <div className="chapter-card__active-dot" />}
              </div>
            )
          })}
        </div>

        <button
          className="chapter-selector__arrow"
          onClick={() => canNext && setActiveChapter(CHAPTERS[idx + 1])}
          disabled={!canNext}
        >›</button>
      </div>

      <div className="upgrades-section__footnote">
        Currently free for development testing.
      </div>
    </div>
  )
}

function TierSection({ tiers, currentLevel, currencyIcon }) {
  return (
    <div className="tier-grid">
      {tiers.map(tier => {
        const owned  = currentLevel >= tier.level
        const isNext = currentLevel === tier.level - 1
        return (
          <div key={tier.level} className={`tier-card${owned ? ' tier-card--owned' : ''}${isNext ? ' tier-card--next' : ''}`}>
            <div className="tier-card__level">Tier {tier.level}</div>
            <div className="tier-card__label">{tier.label}</div>
            <div className="tier-card__desc">{tier.desc}</div>
            <button
              className="tier-card__btn"
              disabled={owned || !isNext}
            >
              {owned
                ? '✓ Owned'
                : tier.coinCost === 0
                  ? 'Free'
                  : <><span className="tier-card__btn-icon">{currencyIcon}</span>{formatNum(tier.coinCost)}</>
              }
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────

export default function UpgradesPage() {
  const { activeChapter, setActiveChapter } = useStats()

  // Stub state — not wired to game yet, just for design
  const [discardLevel, setDiscardLevel] = useState(0)
  const [speedLevel,   setSpeedLevel]   = useState(0)

  return (
    <div className="upgrades-page">

      {/* Chapter unlock */}
      <ChapterSection activeChapter={activeChapter} setActiveChapter={setActiveChapter} />

      {/* Discard upgrade */}
      <div className="upgrades-section upgrades-section--red">
        <SectionHeader
          color="#ef4444"
          icon="⟳"
          title="Discard"
          subtitle="Keep cards you like — redraw the rest · paid with Coins"
        />
        <TierSection
          tiers={DISCARD_TIERS}
          currentLevel={discardLevel}
          currencyIcon="$"
        />
        <div className="upgrades-section__footnote">Currently free for development testing.</div>
      </div>

      {/* Roll speed upgrade */}
      <div className="upgrades-section upgrades-section--blue">
        <SectionHeader
          color="#3b82f6"
          icon="⚡"
          title="Draw Speed"
          subtitle="Reduce the time between auto-draws · paid with Coins"
        />
        <TierSection
          tiers={SPEED_TIERS}
          currentLevel={speedLevel}
          currencyIcon="$"
        />
        <div className="upgrades-section__footnote">Currently free for development testing.</div>
      </div>
    </div>
  )
}