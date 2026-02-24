export default function CompareDiffDisplay({ beforeView, afterView }) {
  // Add type info to views for rendering
  const beforeWithType = beforeView.map((seg) => ({
    ...seg,
    type: seg.highlighted ? 'delete' : 'equal',
  }));
  const afterWithType = afterView.map((seg) => ({
    ...seg,
    type: seg.highlighted ? 'insert' : 'equal',
  }));

  // Join non-break, non-highlighted words with spaces; highlighted words get space before
  function renderView(segments) {
    const elements = [];
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.isBreak) {
        elements.push(<span key={i}><br /><br /></span>);
        continue;
      }
      // Add space before word unless it's the first word or follows a break
      const prevSeg = i > 0 ? segments[i - 1] : null;
      const needsSpace = i > 0 && !prevSeg?.isBreak;

      if (seg.highlighted) {
        elements.push(
          <span key={i}>
            {needsSpace ? ' ' : ''}
            <span
              className={
                seg.type === 'delete'
                  ? 'bg-coral/20 text-coral line-through decoration-coral/60 rounded px-0.5'
                  : 'bg-turtle/20 text-turtle rounded px-0.5'
              }
            >
              {seg.text}
            </span>
          </span>
        );
      } else {
        elements.push(
          <span key={i}>
            {needsSpace ? ' ' : ''}
            {seg.text}
          </span>
        );
      }
    }
    return elements;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Before panel */}
      <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-coral/20 text-coral text-xs font-bold">
            B
          </span>
          <h3 className="text-sm font-semibold text-cloudy uppercase tracking-wide">
            Before
          </h3>
        </div>
        <div className="text-cloudy leading-relaxed text-[15px] max-h-80 overflow-y-auto custom-scrollbar">
          {renderView(beforeWithType)}
        </div>
      </div>

      {/* After panel */}
      <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-turtle/20 text-turtle text-xs font-bold">
            A
          </span>
          <h3 className="text-sm font-semibold text-cloudy uppercase tracking-wide">
            After
          </h3>
        </div>
        <div className="text-cloudy leading-relaxed text-[15px] max-h-80 overflow-y-auto custom-scrollbar">
          {renderView(afterWithType)}
        </div>
      </div>
    </div>
  );
}
