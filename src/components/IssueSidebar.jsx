import { memo, useState } from 'react'

const typeConfig = {
  'sentence-length': { label: 'Long Sentence' },
  'passive-voice': { label: 'Passive Voice' },
  jargon: { label: 'Jargon' },
  'paragraph-length': { label: 'Long Paragraph' },
  adverbs: { label: 'Adverb Overuse' },
  'power-words': { label: 'Low Power Words' },
  cta: { label: 'Missing CTA' },
  'grade-level': { label: 'Reading Level' },
};

const severityBadge = {
  high: 'bg-coral/15 text-coral',
  medium: 'bg-tangerine/15 text-tangerine',
  low: 'bg-azure/15 text-azure',
};

const IssueSidebar = memo(function IssueSidebar({ issues, onToggleFixed }) {
  const [showAll, setShowAll] = useState(false);

  if (!issues || issues.length === 0) {
    return (
      <div className="card-gradient border border-metal/20 rounded-2xl p-6 text-center">
        <div className="text-turtle mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <p className="text-cloudy text-sm">No issues found! Your copy looks great.</p>
      </div>
    );
  }

  const fixedCount = issues.filter((i) => i.fixed).length;
  const unfixed = issues.filter((i) => !i.fixed);
  const fixed = issues.filter((i) => i.fixed);
  const visibleIssues = showAll ? unfixed : unfixed.slice(0, 3);
  const hiddenCount = unfixed.length - 3;

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-metal/20">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            {unfixed.length} {unfixed.length === 1 ? 'issue' : 'issues'} found
          </h2>
          {fixedCount > 0 && (
            <span className="text-xs text-turtle">{fixedCount} fixed</span>
          )}
        </div>
      </div>

      <div className="divide-y divide-metal/10">
        {visibleIssues.map((issue) => {
          const config = typeConfig[issue.type] || { label: issue.type };
          return (
            <div key={issue.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white">{config.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${severityBadge[issue.severity]}`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-xs text-galactic mb-1 italic line-clamp-1">
                    &ldquo;{issue.text}&rdquo;
                  </p>
                  <p className="text-xs text-cloudy leading-relaxed">{issue.message}</p>
                </div>
                <button
                  onClick={() => onToggleFixed(issue.id)}
                  title={issue.fixed ? 'Mark as unresolved' : 'Mark as fixed'}
                  className={`flex-shrink-0 w-5 h-5 rounded border transition-colors cursor-pointer flex items-center justify-center ${
                    issue.fixed
                      ? 'bg-turtle/20 border-turtle text-turtle'
                      : 'border-metal/40 text-transparent hover:border-metal/60'
                  }`}
                >
                  {issue.fixed && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more / less toggle */}
      {hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 text-xs text-galactic hover:text-cloudy transition-colors border-t border-metal/10 cursor-pointer"
        >
          {showAll ? 'Show less' : `Show ${hiddenCount} more issue${hiddenCount === 1 ? '' : 's'}`}
        </button>
      )}

      {/* Fixed issues — collapsed */}
      {fixed.length > 0 && (
        <details className="border-t border-metal/20">
          <summary className="p-3 text-xs text-galactic cursor-pointer hover:text-cloudy select-none">
            {fixed.length} resolved issue{fixed.length === 1 ? '' : 's'}
          </summary>
          <div className="divide-y divide-metal/10 opacity-40">
            {fixed.map((issue) => {
              const config = typeConfig[issue.type] || { label: issue.type };
              return (
                <div key={issue.id} className="px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-galactic">{config.label}</span>
                  <button
                    onClick={() => onToggleFixed(issue.id)}
                    title="Mark as unresolved"
                    className="flex-shrink-0 w-5 h-5 rounded border bg-turtle/20 border-turtle text-turtle flex items-center justify-center cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
})

export default IssueSidebar
