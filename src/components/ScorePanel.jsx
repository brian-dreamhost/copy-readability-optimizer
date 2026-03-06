import { memo } from 'react'

function getScoreColor(score) {
  if (score >= 80) return { ring: 'text-turtle', label: 'Excellent' };
  if (score >= 60) return { ring: 'text-azure', label: 'Good' };
  if (score >= 40) return { ring: 'text-tangerine', label: 'Needs Work' };
  return { ring: 'text-coral', label: 'Revise' };
}

function ScoreGauge({ label, score, size = 'normal' }) {
  const config = getScoreColor(score);
  const isLarge = size === 'large';
  const radius = isLarge ? 44 : 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = isLarge ? 108 : 72;
  const strokeWidth = isLarge ? 5 : 3.5;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="-rotate-90"
        >
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-metal/20"
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${config.ring} transition-all duration-700 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${isLarge ? 'text-2xl' : 'text-sm'} font-bold text-white`}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-[11px] text-galactic">{label}</span>
    </div>
  );
}

const ScorePanel = memo(function ScorePanel({ scores, platform, targets }) {
  if (!scores) return null;

  const overallConfig = getScoreColor(scores.overall);

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
      {/* Overall score — hero element */}
      <div className="flex flex-col items-center mb-5">
        <ScoreGauge label="Overall" score={scores.overall} size="large" />
        <span className={`text-xs font-medium mt-1 ${overallConfig.ring}`}>
          {getScoreLabel(scores.overall)}
        </span>
      </div>

      {/* Sub-scores — compact row */}
      <div className="flex justify-center gap-6">
        <ScoreGauge label="Clarity" score={scores.clarity} />
        <ScoreGauge label="Scannability" score={scores.scannability} />
        <ScoreGauge label="Persuasion" score={scores.persuasion} />
        <ScoreGauge label="Action" score={scores.action} />
      </div>

      {/* Targets — only if platform-specific */}
      {targets && (
        <div className="mt-5 pt-4 border-t border-metal/20">
          <div className="text-[10px] text-galactic uppercase tracking-wider font-medium mb-2">Targets for {targets.label}</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-metal/10 rounded-lg px-2.5 py-2 text-center">
              <div className="text-cloudy font-medium">Grade</div>
              <div className="text-white font-semibold">{targets.gradeMin}-{targets.gradeMax}</div>
            </div>
            <div className="bg-metal/10 rounded-lg px-2.5 py-2 text-center">
              <div className="text-cloudy font-medium">Sentence</div>
              <div className="text-white font-semibold">&le; {targets.sentenceMax}w</div>
            </div>
            <div className="bg-metal/10 rounded-lg px-2.5 py-2 text-center">
              <div className="text-cloudy font-medium">Paragraph</div>
              <div className="text-white font-semibold">&le; {targets.paraMax}s</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
})

export default ScorePanel

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent marketing copy';
  if (score >= 60) return 'Good, with room to improve';
  if (score >= 40) return 'Needs work — follow the suggestions';
  return 'Significant revision needed';
}
