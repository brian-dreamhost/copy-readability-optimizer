import { useState, useCallback } from 'react';
import { analyzeText } from './analysis.js';
import { platforms } from './data/platforms.js';
import { PLATFORM_TARGETS } from './analysis.js';
import Header from './components/Header.jsx';
import PlatformSelector from './components/PlatformSelector.jsx';
import Editor from './components/Editor.jsx';
import HighlightedText from './components/HighlightedText.jsx';
import IssueSidebar from './components/IssueSidebar.jsx';
import ScorePanel from './components/ScorePanel.jsx';
import StatsBar from './components/StatsBar.jsx';
import PlatformCard from './components/PlatformCard.jsx';
import KeywordDensity from './components/KeywordDensity.jsx';
import CompareView from './components/CompareView.jsx';
import Footer from './components/Footer.jsx';

// Map CRO platform selector values to platform card IDs for auto-highlighting
const PLATFORM_HIGHLIGHT_MAP = {
  general: [],
  blog: ['meta-title', 'meta-description'],
  email: ['email-subject'],
  social: ['tweet', 'instagram-caption', 'facebook-post', 'linkedin-post', 'pinterest-description'],
  landing: ['meta-title', 'meta-description'],
  ad: ['google-ads-headline', 'google-ads-description'],
};

export default function App() {
  const [mode, setMode] = useState('analyze');
  const [text, setText] = useState('');
  const [platform, setPlatform] = useState('general');
  const [analysis, setAnalysis] = useState(null);
  const [issues, setIssues] = useState([]);

  const handleAnalyze = useCallback(() => {
    if (!text.trim()) return;
    const result = analyzeText(text, platform);
    setAnalysis(result);
    setIssues(result ? result.issues.map((i) => ({ ...i })) : []);
  }, [text, platform]);

  const handleToggleFixed = useCallback((id) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, fixed: !issue.fixed } : issue
      )
    );
  }, []);

  const handleSentenceClick = useCallback(
    (sentenceIndex) => {
      // Scroll to the first issue related to this sentence
      const relatedIssue = issues.find(
        (i) => i.sentenceIndex === sentenceIndex
      );
      if (relatedIssue) {
        const el = document.getElementById(`issue-sidebar`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    [issues]
  );

  // Called from CompareView "View full analysis" button
  const handleSwitchToAnalyze = useCallback(
    (afterText) => {
      setText(afterText);
      setMode('analyze');
      // Auto-analyze the text
      const result = analyzeText(afterText, platform);
      setAnalysis(result);
      setIssues(result ? result.issues.map((i) => ({ ...i })) : []);
    },
    [platform]
  );

  const highlightedPlatformIds = PLATFORM_HIGHLIGHT_MAP[platform] || [];
  const charCount = text.length;

  return (
    <div className="min-h-screen bg-abyss bg-glow bg-grid">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 animate-fadeIn">
        <Header />

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 bg-oblivion border border-metal/20 rounded-xl p-1 w-fit">
          <button
            onClick={() => setMode('analyze')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              mode === 'analyze'
                ? 'bg-azure text-white'
                : 'text-galactic hover:text-cloudy'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Analyze
          </button>
          <button
            onClick={() => setMode('compare')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              mode === 'compare'
                ? 'bg-azure text-white'
                : 'text-galactic hover:text-cloudy'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Compare
          </button>
        </div>

        <PlatformSelector value={platform} onChange={setPlatform} />

        {mode === 'analyze' ? (
          <>
            {/* Main layout */}
            {!analysis ? (
              /* Pre-analysis: full-width editor */
              <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-6">
                <Editor
                  text={text}
                  setText={setText}
                  onAnalyze={handleAnalyze}
                  isAnalyzed={false}
                />
              </div>
            ) : (
              /* Post-analysis: split layout */
              <div className="space-y-6">
                {/* Stats bar */}
                <StatsBar analysis={analysis} />

                {/* Main content area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left column: Editor + Highlighted text */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Collapsible editor */}
                    <details className="card-gradient border border-metal/20 rounded-2xl">
                      <summary className="p-4 cursor-pointer text-sm font-semibold text-white flex items-center gap-2 select-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-galactic"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        Edit Your Copy
                        <span className="text-xs text-galactic font-normal ml-auto">
                          Click to expand
                        </span>
                      </summary>
                      <div className="p-4 pt-0">
                        <Editor
                          text={text}
                          setText={setText}
                          onAnalyze={handleAnalyze}
                          isAnalyzed={true}
                        />
                      </div>
                    </details>

                    {/* Highlighted output */}
                    <HighlightedText
                      analysis={analysis}
                      onSentenceClick={handleSentenceClick}
                    />
                  </div>

                  {/* Right column: Issues + Scores */}
                  <div className="lg:col-span-5 space-y-6" id="issue-sidebar">
                    <ScorePanel scores={analysis.scores} />
                    <IssueSidebar
                      issues={issues}
                      onToggleFixed={handleToggleFixed}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Platform Character Limits — always visible when there's text */}
            {text.trim() && (
              <section className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cloudy">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  Platform Character Limits
                  {highlightedPlatformIds.length > 0 && (
                    <span className="text-xs text-azure font-normal ml-2">
                      Showing relevant platforms for {PLATFORM_TARGETS[platform]?.label}
                    </span>
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {platforms.map((p) => (
                    <PlatformCard
                      key={p.id}
                      platform={p}
                      charCount={charCount}
                      text={text}
                      highlighted={highlightedPlatformIds.includes(p.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Keyword Density — always visible when there's text */}
            {text.trim() && (
              <section className="mt-6">
                <KeywordDensity text={text} />
              </section>
            )}
          </>
        ) : (
          <CompareView
            platform={platform}
            onSwitchToAnalyze={handleSwitchToAnalyze}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}
