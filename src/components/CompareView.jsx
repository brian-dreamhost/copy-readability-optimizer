import { useState, useCallback } from 'react';
import { analyzeText } from '../analysis.js';
import { computeDiff, getBeforeView, getAfterView } from '../utils/diff.js';
import {
  calculateImprovementScore,
  generateSummary,
} from '../utils/compareAnalysis.js';
import CompareDiffDisplay from './CompareDiffDisplay.jsx';
import CompareMetricsTable from './CompareMetricsTable.jsx';
import CompareImprovementSummary from './CompareImprovementSummary.jsx';
import ScorePanel from './ScorePanel.jsx';

const MAX_CHARS = 50000;

const SAMPLE_BEFORE = `Our company has been providing innovative solutions that are designed to help businesses achieve their goals for over 15 years. We are committed to delivering exceptional quality and our team of experienced professionals is dedicated to ensuring that every project is completed successfully and efficiently. Services are offered by us in a wide range of areas including web development, digital marketing, and brand strategy. It should be noted that our approach is fundamentally different from other agencies because we truly listen to our clients. Contact us today to learn more about how we can help your business grow and succeed in today's competitive marketplace.`;

const SAMPLE_AFTER = `We help businesses grow with web development, digital marketing, and brand strategy. For 15 years, our team has delivered results — not just promises. What makes us different? We listen first, then build. No cookie-cutter solutions. Every project starts with your goals and ends with measurable results. Ready to grow? Let's talk.`;

export default function CompareView({ platform, onSwitchToAnalyze }) {
  const [beforeText, setBeforeText] = useState('');
  const [afterText, setAfterText] = useState('');
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCompare = useCallback(() => {
    if (!beforeText.trim() || !afterText.trim()) return;

    const beforeAnalysis = analyzeText(beforeText, platform);
    const afterAnalysis = analyzeText(afterText, platform);

    const diffOps = computeDiff(beforeText, afterText);
    const beforeView = getBeforeView(diffOps);
    const afterView = getAfterView(diffOps);

    const improvementScore = calculateImprovementScore(
      beforeAnalysis,
      afterAnalysis
    );
    const summary = generateSummary(
      beforeAnalysis,
      afterAnalysis,
      improvementScore
    );

    setResults({
      beforeAnalysis,
      afterAnalysis,
      beforeView,
      afterView,
      improvementScore,
      summary,
    });
  }, [beforeText, afterText, platform]);

  const handleLoadExample = useCallback(() => {
    setBeforeText(SAMPLE_BEFORE);
    setAfterText(SAMPLE_AFTER);
    setResults(null);
  }, []);

  const handleReset = useCallback(() => {
    setBeforeText('');
    setAfterText('');
    setResults(null);
    setCopied(false);
  }, []);

  const handleViewFullAnalysis = useCallback(() => {
    if (results?.afterAnalysis) {
      onSwitchToAnalyze(afterText);
    }
  }, [results, afterText, onSwitchToAnalyze]);

  const handleCopyResults = useCallback(async () => {
    if (!results) return;
    const { beforeAnalysis, afterAnalysis, improvementScore, summary } = results;
    const lines = [
      '=== Copy Comparison Results ===',
      '',
      `Improvement Score: ${improvementScore > 0 ? '+' : ''}${improvementScore}%`,
      '',
      'Metric Changes:',
      `  Words: ${beforeAnalysis.totalWords} → ${afterAnalysis.totalWords} (${afterAnalysis.totalWords - beforeAnalysis.totalWords > 0 ? '+' : ''}${afterAnalysis.totalWords - beforeAnalysis.totalWords})`,
      `  Sentences: ${beforeAnalysis.totalSentences} → ${afterAnalysis.totalSentences}`,
      `  Avg Sentence Length: ${beforeAnalysis.avgSentenceLength} → ${afterAnalysis.avgSentenceLength} words`,
      `  Grade Level: ${beforeAnalysis.gradeLevel} → ${afterAnalysis.gradeLevel}`,
      `  Reading Ease: ${beforeAnalysis.stats.readingEase} → ${afterAnalysis.stats.readingEase}`,
      `  Passive Voice: ${beforeAnalysis.stats.passiveCount} → ${afterAnalysis.stats.passiveCount}`,
      `  Adverbs: ${beforeAnalysis.stats.adverbCount} → ${afterAnalysis.stats.adverbCount}`,
      `  CRO Score: ${beforeAnalysis.scores.overall} → ${afterAnalysis.scores.overall}`,
      '',
      'Summary:',
      summary,
    ];
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [results]);

  const canCompare = beforeText.trim() && afterText.trim();

  // Top 3 issues from the After analysis
  const topAfterIssues = results?.afterAnalysis?.issues?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Input Area */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
          {/* Before textarea */}
          <div>
            <label
              htmlFor="compare-before"
              className="flex items-center gap-2 mb-2"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-coral/20 text-coral text-xs font-bold">
                B
              </span>
              <span className="text-sm font-semibold text-cloudy uppercase tracking-wide">
                Before
              </span>
              {beforeText.length > 0 && (
                <span className="text-xs text-galactic ml-auto">
                  {beforeText.length.toLocaleString()}/{MAX_CHARS.toLocaleString()} chars
                </span>
              )}
            </label>
            <textarea
              id="compare-before"
              value={beforeText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setBeforeText(e.target.value);
                }
              }}
              placeholder="Paste your original copy here..."
              rows={8}
              className="w-full bg-oblivion border border-metal/30 rounded-xl px-4 py-3 text-white text-[15px] placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss resize-y transition-colors"
            />
          </div>

          {/* After textarea */}
          <div>
            <label
              htmlFor="compare-after"
              className="flex items-center gap-2 mb-2"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-turtle/20 text-turtle text-xs font-bold">
                A
              </span>
              <span className="text-sm font-semibold text-cloudy uppercase tracking-wide">
                After
              </span>
              {afterText.length > 0 && (
                <span className="text-xs text-galactic ml-auto">
                  {afterText.length.toLocaleString()}/{MAX_CHARS.toLocaleString()} chars
                </span>
              )}
            </label>
            <textarea
              id="compare-after"
              value={afterText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setAfterText(e.target.value);
                }
              }}
              placeholder="Paste your revised copy here..."
              rows={8}
              className="w-full bg-oblivion border border-metal/30 rounded-xl px-4 py-3 text-white text-[15px] placeholder:text-galactic focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss resize-y transition-colors"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className="bg-azure text-white font-semibold rounded-lg px-8 py-3 hover:bg-azure-hover focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Compare
          </button>

          <button
            onClick={handleLoadExample}
            className="border border-metal/40 text-cloudy font-medium rounded-lg px-6 py-3 hover:border-metal/60 hover:text-white focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Load Example
          </button>

          {(beforeText || afterText) && (
            <button
              onClick={handleReset}
              className="text-galactic font-medium rounded-lg px-6 py-3 hover:text-coral focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Reset
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      {results && (
        <div className="space-y-8 animate-fadeIn">
          {/* Improvement Summary */}
          <section>
            <CompareImprovementSummary
              improvementScore={results.improvementScore}
              summary={results.summary}
            />
          </section>

          {/* Diff Display */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-azure">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Changes Detected
            </h2>
            <CompareDiffDisplay
              beforeView={results.beforeView}
              afterView={results.afterView}
            />
          </section>

          {/* Metrics Table */}
          <section>
            <CompareMetricsTable
              beforeAnalysis={results.beforeAnalysis}
              afterAnalysis={results.afterAnalysis}
            />
          </section>

          {/* "After" Deep Dive */}
          <section className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-5 lg:p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-turtle">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              &quot;After&quot; Version — Deep Dive
            </h3>

            <ScorePanel scores={results.afterAnalysis.scores} />

            {/* Top issues */}
            {topAfterIssues.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-semibold text-cloudy">
                  Top Issues to Address
                </h4>
                {topAfterIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="bg-oblivion border border-metal/20 rounded-lg p-3 text-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          issue.severity === 'high'
                            ? 'bg-coral'
                            : issue.severity === 'medium'
                              ? 'bg-tangerine'
                              : 'bg-azure'
                        }`}
                      />
                      <span className="text-cloudy font-medium capitalize">
                        {issue.type.replace(/-/g, ' ')}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          issue.severity === 'high'
                            ? 'bg-coral/10 text-coral'
                            : issue.severity === 'medium'
                              ? 'bg-tangerine/10 text-tangerine'
                              : 'bg-azure/10 text-azure'
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-galactic">{issue.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* View full analysis button */}
            <button
              onClick={handleViewFullAnalysis}
              className="mt-4 text-sm text-azure hover:text-white transition-colors font-medium flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View full analysis in Analyze tab
            </button>
          </section>

          {/* Actions row */}
          <section className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleCopyResults}
              className="flex items-center gap-2 border border-metal/40 text-cloudy font-medium rounded-lg px-5 py-2.5 hover:border-metal/60 hover:text-white focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss transition-colors"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-turtle">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy Results
                </>
              )}
            </button>
          </section>
        </div>
      )}

      {/* Empty state */}
      {!results && (
        <div className="card-gradient border border-metal/20 rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-azure/10 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-azure">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">
            Compare two versions of your copy
          </h3>
          <p className="text-galactic max-w-md mx-auto mb-4">
            Paste your original and revised copy above, then click
            &quot;Compare&quot; to see word-level changes, readability
            improvements, and full CRO scoring.
          </p>
          <button
            onClick={handleLoadExample}
            className="text-azure hover:text-white transition-colors text-sm font-medium"
          >
            Or try the example to see how it works
          </button>
        </div>
      )}
    </div>
  );
}
