const typeConfig = {
  'sentence-length': {
    label: 'Long Sentence',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </svg>
    ),
  },
  'passive-voice': {
    label: 'Passive Voice',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  jargon: {
    label: 'Jargon',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  'paragraph-length': {
    label: 'Long Paragraph',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
      </svg>
    ),
  },
  adverbs: {
    label: 'Adverb Overuse',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
  },
  'power-words': {
    label: 'Low Power Words',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  cta: {
    label: 'Missing CTA',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
      </svg>
    ),
  },
  'grade-level': {
    label: 'Reading Level',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
};

const severityColors = {
  high: 'border-coral/40 bg-coral/5',
  medium: 'border-tangerine/40 bg-tangerine/5',
  low: 'border-azure/40 bg-azure/5',
};

const severityBadge = {
  high: 'bg-coral/20 text-coral',
  medium: 'bg-tangerine/20 text-tangerine',
  low: 'bg-azure/20 text-azure',
};

export default function IssueSidebar({ issues, onToggleFixed }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="card-gradient border border-metal/20 rounded-2xl p-6 text-center">
        <div className="text-turtle mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <p className="text-cloudy text-sm">No issues found! Your copy looks great.</p>
      </div>
    );
  }

  const fixedCount = issues.filter((i) => i.fixed).length;

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-metal/20">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            Issues ({issues.length - fixedCount} remaining)
          </h2>
          {fixedCount > 0 && (
            <span className="text-xs text-turtle">
              {fixedCount} fixed
            </span>
          )}
        </div>
        {/* Issue type summary */}
        <div className="flex flex-wrap gap-2 mt-2">
          {summarizeIssues(issues).map(({ type, count }) => (
            <span
              key={type}
              className="text-[10px] px-2 py-0.5 rounded-full bg-oblivion border border-metal/20 text-galactic"
            >
              {typeConfig[type]?.label || type}: {count}
            </span>
          ))}
        </div>
      </div>

      <div className="max-h-[500px] lg:max-h-[600px] overflow-y-auto custom-scrollbar divide-y divide-metal/10">
        {issues.map((issue) => {
          const config = typeConfig[issue.type] || {
            label: issue.type,
            icon: null,
          };
          return (
            <div
              key={issue.id}
              className={`p-4 transition-colors ${
                issue.fixed ? 'opacity-40' : ''
              } ${severityColors[issue.severity]}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5 text-galactic">
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white">
                      {config.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        severityBadge[issue.severity]
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-xs text-galactic mb-1.5 italic truncate">
                    &ldquo;{issue.text}&rdquo;
                  </p>
                  <p className="text-xs text-cloudy leading-relaxed">
                    {issue.message}
                  </p>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function summarizeIssues(issues) {
  const counts = {};
  issues.forEach((i) => {
    counts[i.type] = (counts[i.type] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}
