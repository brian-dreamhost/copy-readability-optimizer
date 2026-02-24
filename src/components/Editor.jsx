const SAMPLE_TEXT = `Are you tired of spending countless hours trying to figure out the best way to optimize your website's content for search engines and social media platforms?

Our innovative, cutting-edge platform leverages state-of-the-art technology to help you create content that is seamlessly integrated with your overall marketing strategy. The holistic approach we take ensures that every piece of content is carefully crafted to move the needle.

We utilize a robust ecosystem of tools that are designed to synergize with your existing workflow. Your brand's message will be amplified across all channels.

Content that connects with readers is written simply. Short sentences work. They build rhythm. They create momentum.

Get started today — try it free for 14 days.`;

export default function Editor({ text, setText, onAnalyze, isAnalyzed }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <label
          htmlFor="copy-input"
          className="text-sm font-medium text-cloudy"
        >
          Paste your marketing copy
        </label>
        <button
          onClick={() => setText(SAMPLE_TEXT)}
          className="text-xs text-galactic hover:text-azure transition-colors cursor-pointer"
        >
          Load sample text
        </button>
      </div>
      <textarea
        id="copy-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your marketing copy here..."
        className="flex-1 min-h-[300px] lg:min-h-[400px] w-full bg-oblivion border border-metal/30 rounded-xl p-4 text-white text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss placeholder:text-galactic/60"
      />
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-galactic">
          {text.length > 0
            ? `${text.split(/\s+/).filter(Boolean).length} words`
            : 'Start typing or paste your copy'}
        </span>
        <button
          onClick={onAnalyze}
          disabled={!text.trim()}
          className="bg-azure text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-azure-hover focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
            />
          </svg>
          {isAnalyzed ? 'Re-analyze' : 'Analyze Copy'}
        </button>
      </div>
    </div>
  );
}
