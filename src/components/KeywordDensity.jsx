import { useState } from 'react'
import { calculateKeywordDensity, getKeywordDensityRecommendation } from '../analysis.js'

export default function KeywordDensity({ text }) {
  const [keyword, setKeyword] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const { count, density } = calculateKeywordDensity(text, keyword)
  const recommendation = getKeywordDensityRecommendation(density)

  const colorMap = {
    turtle: 'text-turtle',
    tangerine: 'text-tangerine',
    coral: 'text-coral',
    galactic: 'text-galactic',
  }

  const bgColorMap = {
    turtle: 'bg-turtle/10 border-turtle/30',
    tangerine: 'bg-tangerine/10 border-tangerine/30',
    coral: 'bg-coral/10 border-coral/30',
    galactic: 'bg-metal/10 border-metal/30',
  }

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
        aria-expanded={isExpanded}
      >
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cloudy">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          Keyword Density
        </h2>
        <div className={`text-galactic flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 animate-fadeIn">
          <div className="border-t border-metal/20 pt-4">
            <label htmlFor="keyword-input" className="block text-sm font-medium text-cloudy mb-2">
              Target keyword or phrase
            </label>
            <input
              id="keyword-input"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., content marketing"
              className="w-full bg-midnight/80 border border-metal/30 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:border-azure transition-colors"
            />

            {keyword.trim() && text.trim() && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl border p-3 ${bgColorMap[recommendation.color]}`}>
                    <div className="text-xs text-galactic uppercase tracking-wide font-medium">Occurrences</div>
                    <div className={`text-2xl font-bold mt-0.5 ${colorMap[recommendation.color]}`}>{count}</div>
                  </div>
                  <div className={`rounded-xl border p-3 ${bgColorMap[recommendation.color]}`}>
                    <div className="text-xs text-galactic uppercase tracking-wide font-medium">Density</div>
                    <div className={`text-2xl font-bold mt-0.5 ${colorMap[recommendation.color]}`}>{density}%</div>
                  </div>
                </div>

                <div className={`rounded-lg border p-3 ${bgColorMap[recommendation.color]}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-sm font-medium ${colorMap[recommendation.color]}`}>
                      {recommendation.label}
                    </span>
                    {recommendation.color === 'turtle' && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-turtle">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-cloudy text-xs leading-snug">{recommendation.description}</p>
                </div>

                <div className="text-xs text-galactic">
                  Ideal keyword density for SEO is between 1-3%. This ensures your content is relevant without appearing spammy to search engines.
                </div>
              </div>
            )}

            {keyword.trim() && !text.trim() && (
              <p className="text-galactic text-sm mt-3">Enter text above to analyze keyword density.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
