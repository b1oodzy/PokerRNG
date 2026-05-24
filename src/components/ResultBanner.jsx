import React from 'react'
import './ResultBanner.css'

export default function ResultBanner({ result }) {
  if (!result) return null

  return (
    <div className="result-banner result-banner--visible">
      <div className="result-banner__rank">{result.rank}</div>
      <div className="result-banner__desc">{result.desc}</div>
    </div>
  )
}