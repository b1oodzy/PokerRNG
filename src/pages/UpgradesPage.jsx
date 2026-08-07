import React from 'react'
import { useStats } from '../context/StatsContext'
import { CHAPTERS } from '../data/constants'
import { formatNum } from '../utils/format'
import './UpgradesPage.css'

// ── Upgrade Data ─────────────────────────────────────────────────────────────

const CARD_TIERS = [
  { level: 1, label: '1 Card',  xpCost: 0 },
  { level: 2, label: '2 Cards', xpCost: 500 },
  { level: 3, label: '3 Cards', xpCost: 12000 },
  { level: 4, label: '4 Cards', xpCost: 400000 },
  { level: 5, label: '5 Cards', xpCost: 10000000 },
  { level: 6, label: '6 Cards', xpCost: 200000000 },
]

const DISCARD_TIERS = [
  { level: 1, label: '1 Discard',  coinCost: 12500 },
  { level: 2, label: '2 Discards', coinCost: 400000 },
  { level: 3, label: '3 Discards', coinCost: 10000000 },
]

// ── Sub-components ──────────────────────────────────────────────────────────

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

function ChapterSection({ activeChapter, setActiveChapter, isChapterUnlocked }) {
  const idx     = CHAPTERS.findIndex(ch => ch.id === activeChapter.id)
  const canPrev = idx > 0 && isChapterUnlocked(CHAPTERS[idx - 1].id)
  const canNext = idx < CHAPTERS.length - 1 && isChapterUnlocked(CHAPTERS[idx + 1].id)

  return (
    <div className="upgrades-section upgrades-section--purple">
      <SectionHeader
        color="#a855f7"
        icon="◈"
        title="Chapter Selection"
        subtitle="Chapters unlock automatically by getting all combinations in the previous chapter and owning enough cards."
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
            const unlocked = isChapterUnlocked(ch.id)
            
            return (
              <div
                key={ch.id}
                className={`chapter-card${isActive ? ' chapter-card--active' : ''}${!unlocked ? ' chapter-card--locked' : ''}`}
                onClick={() => unlocked && setActiveChapter(ch)}
              >
                <div className="chapter-card__name">{ch.name}</div>
                <div className="chapter-card__cost">
                  {unlocked 
                    ? <span>Unlocked</span> 
                    : <><span className="chapter-card__cost-icon">🔒</span><span>Locked</span></>}
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
    </div>
  )
}

function TierSection({ tiers, currentLevel, currencyIcon, onBuy, userBal, costKey, accent }) {
  return (
    <div className="tier-grid" style={{ '--tier-accent': accent }}>
      {tiers.map(tier => {
        const owned  = currentLevel >= tier.level
        const isNext = currentLevel === tier.level - 1
        const cost   = tier[costKey]
        const canAfford = userBal >= cost

        return (
          <div key={tier.level} className={`tier-card${owned ? ' tier-card--owned' : ''}${isNext ? ' tier-card--next' : ''}`}>
            <div className="tier-card__level">Tier {tier.level}</div>
            <div className="tier-card__label">{tier.label}</div>
            <button
              className="tier-card__btn"
              disabled={owned || !isNext || (!owned && !canAfford)}
              onClick={() => onBuy(tier)}
            >
              {owned
                ? '✓ Owned'
                : cost === 0
                  ? 'Free'
                  : <><span className="tier-card__btn-icon">{currencyIcon}</span>{formatNum(cost)}</>
              }
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function UpgradesPage() {
  const { 
    activeChapter, setActiveChapter, isChapterUnlocked,
    unlockedCards, setUnlockedCards, 
    discardLevel, setDiscardLevel, 
    xp, setXp, 
    coins, setCoins 
  } = useStats()

  function buyCard(tier) {
    if (xp >= tier.xpCost && unlockedCards === tier.level - 1) {
      setXp(x => x - tier.xpCost)
      setUnlockedCards(tier.level)
    }
  }

  function buyDiscard(tier) {
    if (coins >= tier.coinCost && discardLevel === tier.level - 1) {
      setCoins(c => c - tier.coinCost)
      setDiscardLevel(tier.level)
    }
  }

  return (
    <div className="upgrades-page">
      <ChapterSection 
        activeChapter={activeChapter} 
        setActiveChapter={setActiveChapter} 
        isChapterUnlocked={isChapterUnlocked} 
      />

      {/* Cards unlock */}
      <div className="upgrades-section upgrades-section--blue">
        <SectionHeader
          color="#3b82f6"
          icon="🃏"
          title="Additional Cards"
          subtitle="Increase the maximum cards you can hold · paid with XP"
        />
        <TierSection
          tiers={CARD_TIERS}
          currentLevel={unlockedCards}
          currencyIcon="★"
          onBuy={buyCard}
          userBal={xp}
          costKey="xpCost"
          accent="#3b82f6"
        />
      </div>

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
          onBuy={buyDiscard}
          userBal={coins}
          costKey="coinCost"
          accent="#ef4444"
        />
      </div>
    </div>
  )
}