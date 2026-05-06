import React from 'react'
import './ResultBanner.css'
 
export default function ResultBanner({ result }) {
  return (
    <div className="result-banner">
      <div className="result-banner__rank">
        {result ? result.rank : '—'}
      </div>
      <div className="result-banner__desc">
        {result ? result.desc : 'Roll to see your hand'}
      </div>
    </div>
  )
}