import { useState } from 'react';

export default function StatsBar({ analysis }) {
  if (!analysis) return null;
  const [expanded, setExpanded] = useState(false);

  const primary = [
    { label: 'Words', value: analysis.totalWords },
    { label: 'Grade Level', value: analysis.gradeLevel },
    { label: 'Avg Sentence', value: `${analysis.avgSentenceLength} words` },
    { label: 'Reading Time', value: `${analysis.readingTime} min` },
  ];

  const secondary = [
    { label: 'Characters', value: analysis.stats.charCount?.toLocaleString() ?? '—' },
    { label: 'Sentences', value: analysis.totalSentences },
    { label: 'Reading Ease', value: analysis.stats.readingEase ?? '—' },
    { label: 'Speaking Time', value: `${analysis.stats.speakingTime ?? '—'} min` },
    { label: 'No Spaces', value: analysis.stats.charNoSpaces?.toLocaleString() ?? '—' },
    { label: 'Power Words', value: `${analysis.stats.powerWordPercent}%` },
  ];

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4">
      <div className="grid grid-cols-4 gap-4">
        {primary.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center gap-0.5">
            <span className="text-white font-semibold text-sm">{stat.value}</span>
            <span className="text-galactic text-[10px] uppercase tracking-wide">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-4 pt-4 border-t border-metal/15 animate-fadeIn">
          {secondary.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center gap-0.5">
              <span className="text-white font-semibold text-xs">{stat.value}</span>
              <span className="text-galactic text-[10px] uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="mx-auto mt-3 flex items-center gap-1 text-[11px] text-galactic hover:text-cloudy transition-colors cursor-pointer"
      >
        {expanded ? 'Less' : 'More stats'}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>
  );
}
