function getScoreColor(score) {
  if (score >= 80) return { ring: 'text-turtle', bg: 'text-turtle', label: 'Excellent' };
  if (score >= 60) return { ring: 'text-azure', bg: 'text-azure', label: 'Good' };
  if (score >= 40) return { ring: 'text-tangerine', bg: 'text-tangerine', label: 'Needs Work' };
  return { ring: 'text-coral', bg: 'text-coral', label: 'Revise' };
}

function ScoreGauge({ label, score, size = 'normal' }) {
  const config = getScoreColor(score);
  const isLarge = size === 'large';
  const radius = isLarge ? 44 : 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = isLarge ? 108 : 80;
  const strokeWidth = isLarge ? 5 : 4;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="-rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-metal/20"
          />
          {/* Score arc */}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`${isLarge ? 'text-2xl' : 'text-lg'} font-bold text-white`}
          >
            {score}
          </span>
        </div>
      </div>
      <span
        className={`text-xs font-medium ${isLarge ? 'text-sm' : 'text-xs'} text-galactic`}
      >
        {label}
      </span>
    </div>
  );
}

export default function ScorePanel({ scores }) {
  if (!scores) return null;

  const overallConfig = getScoreColor(scores.overall);

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
      <h2 className="text-sm font-semibold text-white mb-4">Scores</h2>

      {/* Overall score */}
      <div className="flex flex-col items-center mb-6">
        <ScoreGauge label="Overall" score={scores.overall} size="large" />
        <span className={`text-xs font-medium mt-1 ${overallConfig.bg}`}>
          {getScoreLabel(scores.overall)}
        </span>
      </div>

      {/* Individual scores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
        <ScoreGauge label="Clarity" score={scores.clarity} />
        <ScoreGauge label="Scannability" score={scores.scannability} />
        <ScoreGauge label="Persuasion" score={scores.persuasion} />
        <ScoreGauge label="Action" score={scores.action} />
      </div>

      {/* Score breakdown */}
      <div className="mt-6 space-y-2">
        <ScoreBar label="Clarity" score={scores.clarity} weight="40%" />
        <ScoreBar label="Scannability" score={scores.scannability} weight="25%" />
        <ScoreBar label="Persuasion" score={scores.persuasion} weight="20%" />
        <ScoreBar label="Action" score={scores.action} weight="15%" />
      </div>
    </div>
  );
}

function ScoreBar({ label, score, weight }) {
  const { bg } = getScoreColor(score);
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-galactic w-20 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-metal/20 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            score >= 80
              ? 'bg-turtle'
              : score >= 60
                ? 'bg-azure'
                : score >= 40
                  ? 'bg-tangerine'
                  : 'bg-coral'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-[10px] ${bg} w-6 text-right`}>{score}</span>
      <span className="text-[10px] text-galactic/60 w-7">{weight}</span>
    </div>
  );
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent marketing copy';
  if (score >= 60) return 'Good, with room to improve';
  if (score >= 40) return 'Needs work — follow the suggestions';
  return 'Significant revision needed';
}
