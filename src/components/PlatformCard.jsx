import { useState } from 'react'
import PlatformIcon from './PlatformIcon.jsx'
import TruncationPreview from './TruncationPreview.jsx'

export default function PlatformCard({ platform, charCount, text, highlighted }) {
  const [expanded, setExpanded] = useState(false)

  const { id, name, limit, optimal } = platform
  const percentage = limit > 0 ? Math.min((charCount / limit) * 100, 100) : 0
  const overLimit = charCount > limit
  const overBy = charCount - limit

  // Determine color: green (under), yellow (>80% or over optimal), red (over limit)
  let barColor = 'bg-turtle'
  let textColor = 'text-turtle'
  let statusLabel = 'Under limit'

  if (overLimit) {
    barColor = 'bg-coral'
    textColor = 'text-coral'
    statusLabel = `Over by ${overBy.toLocaleString()}`
  } else if (percentage > 80) {
    barColor = 'bg-tangerine'
    textColor = 'text-tangerine'
    statusLabel = 'Approaching limit'
  }

  // Check optimal range
  let optimalLabel = null
  if (optimal && charCount > 0) {
    if (charCount >= optimal.min && charCount <= optimal.max) {
      optimalLabel = { text: 'Optimal length', color: 'text-turtle' }
    } else if (charCount < optimal.min) {
      optimalLabel = { text: `${optimal.min - charCount} more for optimal`, color: 'text-galactic' }
    } else if (charCount > optimal.max && !overLimit) {
      optimalLabel = { text: 'Above optimal range', color: 'text-tangerine' }
    }
  }

  return (
    <div className={`card-gradient border rounded-xl overflow-hidden transition-all duration-200 ${highlighted ? 'border-azure/50 ring-1 ring-azure/20' : 'border-metal/20'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss rounded-xl"
        aria-expanded={expanded}
        aria-label={`${name}: ${charCount} of ${limit} characters. Click to ${expanded ? 'hide' : 'show'} truncation preview.`}
      >
        <div className="text-cloudy flex-shrink-0">
          <PlatformIcon platformId={id} className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-white truncate">{name}</span>
            <span className={`text-xs font-medium ${textColor} flex-shrink-0 ml-2`}>
              {charCount > 0 ? `${charCount.toLocaleString()} / ${limit.toLocaleString()}` : `0 / ${limit.toLocaleString()}`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-metal/30 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ${barColor}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {/* Status labels */}
          <div className="flex items-center justify-between mt-1">
            {charCount > 0 ? (
              <span className={`text-xs ${textColor}`}>{statusLabel}</span>
            ) : (
              <span className="text-xs text-galactic">No text entered</span>
            )}
            {optimalLabel && (
              <span className={`text-xs ${optimalLabel.color}`}>{optimalLabel.text}</span>
            )}
            {optimal && charCount === 0 && (
              <span className="text-xs text-galactic">Optimal: {optimal.min}-{optimal.max}</span>
            )}
          </div>
        </div>

        {/* Expand chevron */}
        <div className={`text-galactic flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {/* Expanded truncation preview */}
      {expanded && (
        <div className="px-4 pb-4 animate-fadeIn">
          <div className="border-t border-metal/20 pt-3 mt-1">
            <div className="text-xs text-galactic mb-2 font-medium uppercase tracking-wide">Truncation Preview</div>
            <TruncationPreview text={text} platform={platform} />
          </div>
        </div>
      )}
    </div>
  )
}
