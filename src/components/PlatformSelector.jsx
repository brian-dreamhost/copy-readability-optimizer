import { PLATFORM_TARGETS } from '../analysis.js';

const platforms = Object.entries(PLATFORM_TARGETS);

export default function PlatformSelector({ value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm text-galactic mb-2 font-medium">
        Content Type
      </label>
      <div className="flex flex-wrap gap-2">
        {platforms.map(([key, target]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              value === key
                ? 'bg-azure text-white'
                : 'bg-oblivion border border-metal/30 text-cloudy hover:text-white hover:border-metal/50'
            }`}
          >
            {target.label}
          </button>
        ))}
      </div>
    </div>
  );
}
