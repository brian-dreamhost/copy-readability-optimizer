import { useState } from 'react';

const levelColors = {
  easy: 'bg-turtle/10',
  moderate: 'bg-tangerine/10',
  hard: 'bg-coral/10',
};

const levelLabels = {
  easy: { text: 'Easy', color: 'text-turtle' },
  moderate: { text: 'Moderate', color: 'text-tangerine' },
  hard: { text: 'Hard', color: 'text-coral' },
};

export default function HighlightedText({ analysis, onSentenceClick }) {
  const [hoveredSentence, setHoveredSentence] = useState(null);

  if (!analysis) return null;

  const { sentenceAnalysis } = analysis;

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Highlighted Output</h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-turtle/60" />
            <span className="text-galactic">Easy</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-tangerine/60" />
            <span className="text-galactic">Moderate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-coral/60" />
            <span className="text-galactic">Hard</span>
          </span>
        </div>
      </div>

      <div className="space-y-1 text-sm leading-relaxed">
        {sentenceAnalysis.map((sentence, idx) => {
          const issueCount =
            sentence.passives.length +
            sentence.jargon.length +
            (sentence.level !== 'easy' ? 1 : 0);

          return (
            <span
              key={idx}
              onClick={() => onSentenceClick(idx)}
              onMouseEnter={() => setHoveredSentence(idx)}
              onMouseLeave={() => setHoveredSentence(null)}
              className={`inline cursor-pointer rounded px-1 py-0.5 transition-all ${
                levelColors[sentence.level]
              } ${
                hoveredSentence === idx ? 'ring-1 ring-white/20' : ''
              }`}
            >
              {renderSentenceWithHighlights(sentence, analysis)}
              {hoveredSentence === idx && issueCount > 0 && (
                <span
                  className={`ml-1 inline-flex items-center px-1.5 py-0 rounded-full text-[10px] font-bold ${levelLabels[sentence.level].color} bg-abyss/80`}
                >
                  {issueCount} {issueCount === 1 ? 'issue' : 'issues'}
                </span>
              )}{' '}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function renderSentenceWithHighlights(sentence) {
  const text = sentence.text;
  const highlights = [];

  // Collect all highlights with their positions
  sentence.jargon.forEach((j) => {
    const idx = text.toLowerCase().indexOf(j.jargon.toLowerCase());
    if (idx >= 0) {
      highlights.push({
        start: idx,
        end: idx + j.jargon.length,
        type: 'jargon',
        className: 'underline decoration-tangerine decoration-wavy underline-offset-2',
      });
    }
  });

  sentence.passives.forEach((p) => {
    const idx = text.toLowerCase().indexOf(p.text.toLowerCase());
    if (idx >= 0) {
      highlights.push({
        start: idx,
        end: idx + p.text.length,
        type: 'passive',
        className: 'underline decoration-coral decoration-wavy underline-offset-2',
      });
    }
  });

  if (highlights.length === 0) {
    return <span className="text-cloudy">{text}</span>;
  }

  // Sort by start position
  highlights.sort((a, b) => a.start - b.start);

  const parts = [];
  let lastEnd = 0;

  highlights.forEach((h, i) => {
    if (h.start > lastEnd) {
      parts.push(
        <span key={`t-${i}`} className="text-cloudy">
          {text.substring(lastEnd, h.start)}
        </span>
      );
    }
    parts.push(
      <span key={`h-${i}`} className={`text-white ${h.className}`}>
        {text.substring(h.start, h.end)}
      </span>
    );
    lastEnd = h.end;
  });

  if (lastEnd < text.length) {
    parts.push(
      <span key="end" className="text-cloudy">
        {text.substring(lastEnd)}
      </span>
    );
  }

  return parts;
}
