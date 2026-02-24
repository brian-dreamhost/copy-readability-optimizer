// ============================================================
// Copy Readability Optimizer — Analysis Engine
// All analysis logic is purely client-side.
// ============================================================

// ---- Jargon dictionary: word/phrase → plain-language alternative ----
export const JARGON_MAP = {
  'synergy': 'teamwork',
  'leverage': 'use',
  'utilize': 'use',
  'optimize': 'improve',
  'scalable': 'grows with you',
  'disrupt': 'change',
  'innovative': 'new',
  'cutting-edge': 'modern',
  'best-in-class': 'top-quality',
  'world-class': 'top-quality',
  'paradigm': 'model',
  'ecosystem': 'network',
  'holistic': 'complete',
  'robust': 'strong',
  'seamless': 'smooth',
  'turnkey': 'ready-to-use',
  'empower': 'help',
  'bandwidth': 'capacity',
  'circle back': 'follow up',
  'deep dive': 'closer look',
  'move the needle': 'make a difference',
  'low-hanging fruit': 'easy wins',
  'at the end of the day': 'ultimately',
  'take it to the next level': 'improve',
  'think outside the box': 'be creative',
  'game-changer': 'breakthrough',
  'next-generation': 'newer',
  'state-of-the-art': 'modern',
  'mission-critical': 'essential',
  'value-add': 'benefit',
  'stakeholder': 'people involved',
  'synergize': 'work together',
  'actionable': 'practical',
  'deliverables': 'results',
  'ideate': 'brainstorm',
  'pivot': 'shift',
  'value proposition': 'key benefit',
  'core competency': 'strength',
  'touch base': 'check in',
  'drill down': 'look deeper',
  'streamline': 'simplify',
  'incentivize': 'encourage',
  'onboarding': 'setup',
  'pain point': 'problem',
  'reach out': 'contact',
  'wheelhouse': 'area of expertise',
};

// Multi-word jargon phrases (sorted longest-first for greedy matching)
const JARGON_PHRASES = Object.keys(JARGON_MAP)
  .filter((k) => k.includes(' '))
  .sort((a, b) => b.length - a.length);

const JARGON_SINGLE_WORDS = Object.keys(JARGON_MAP).filter(
  (k) => !k.includes(' ')
);

// ---- Power words ----
export const POWER_WORDS = new Set([
  'free', 'proven', 'secret', 'instant', 'guaranteed', 'exclusive',
  'now', 'easy', 'discover', 'save', 'new', 'you', 'because',
  'results', 'simple', 'fast', 'limited', 'bonus', 'premium',
  'essential', 'powerful', 'amazing', 'unlock', 'boost', 'transform',
  'ultimate', 'effortless', 'remarkable', 'revolutionary', 'unbeatable',
]);

// ---- CTA phrases ----
const CTA_PHRASES = [
  'sign up', 'buy now', 'get started', 'learn more', 'try free',
  'contact us', 'subscribe', 'download', 'order now', 'claim',
  'start now', 'join now', 'join today', 'start today', 'get it now',
  'try it free', 'shop now', 'book now', 'register', 'apply now',
  'get yours', 'grab yours', 'start your free', 'try it now',
  'get started today', 'sign up free', 'claim your',
];

// ---- Platform targets ----
export const PLATFORM_TARGETS = {
  general: { label: 'General', gradeMin: 7, gradeMax: 10, sentenceMax: 25, paraMax: 4 },
  blog: { label: 'Blog Post', gradeMin: 8, gradeMax: 10, sentenceMax: 25, paraMax: 4 },
  email: { label: 'Email', gradeMin: 6, gradeMax: 8, sentenceMax: 20, paraMax: 3 },
  social: { label: 'Social Media', gradeMin: 5, gradeMax: 7, sentenceMax: 15, paraMax: 2 },
  landing: { label: 'Landing Page', gradeMin: 7, gradeMax: 9, sentenceMax: 20, paraMax: 3 },
  ad: { label: 'Ad Copy', gradeMin: 5, gradeMax: 7, sentenceMax: 12, paraMax: 1 },
};

// ============================================================
// Utility: syllable counting (vowel-group heuristic)
// ============================================================
export function countSyllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 2) return 1;

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  // Subtract silent-e at end
  if (word.endsWith('e') && !word.endsWith('le') && count > 1) {
    count--;
  }

  // Common adjustments
  if (word.endsWith('ed') && count > 1 && !word.endsWith('ted') && !word.endsWith('ded')) {
    count--;
  }

  return Math.max(1, count);
}

function isComplexWord(word) {
  return countSyllables(word) >= 3;
}

// ============================================================
// Text splitting helpers
// ============================================================
function splitSentences(text) {
  // Split on sentence-ending punctuation followed by space or end
  const raw = text.match(/[^.!?]*[.!?]+[\s]?|[^.!?]+$/g) || [];
  return raw.map((s) => s.trim()).filter((s) => s.length > 0);
}

function splitParagraphs(text) {
  return text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
}

function getWords(text) {
  return text.match(/[a-zA-Z'-]+/g) || [];
}

// ============================================================
// Grade level (Flesch-Kincaid)
// ============================================================
export function fleschKincaidGrade(totalWords, totalSentences, totalSyllables) {
  if (totalSentences === 0 || totalWords === 0) return 0;
  const grade =
    0.39 * (totalWords / totalSentences) +
    11.8 * (totalSyllables / totalWords) -
    15.59;
  return Math.max(0, Math.min(20, grade));
}

// ============================================================
// Flesch Reading Ease
// ============================================================
export function fleschReadingEase(totalWords, totalSentences, totalSyllables) {
  if (totalWords === 0 || totalSentences === 0) return 0;
  const ease = 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
  return Math.max(0, Math.min(100, Math.round(ease * 10) / 10));
}

// ============================================================
// Keyword density
// ============================================================
export function calculateKeywordDensity(text, keyword) {
  if (!text || !keyword || !keyword.trim()) return { count: 0, density: 0 };

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase().trim();
  const words = getWords(text);

  if (words.length === 0) return { count: 0, density: 0 };

  let count = 0;
  let pos = 0;
  while (true) {
    pos = lowerText.indexOf(lowerKeyword, pos);
    if (pos === -1) break;
    count++;
    pos += lowerKeyword.length;
  }

  const keywordWordCount = lowerKeyword.split(/\s+/).length;
  const density = (keywordWordCount * count) / words.length * 100;

  return {
    count,
    density: Math.round(density * 100) / 100,
  };
}

export function getKeywordDensityRecommendation(density) {
  if (density === 0) return { label: 'Not found', description: 'Your keyword does not appear in the text.', color: 'galactic' };
  if (density < 0.5) return { label: 'Low', description: 'Consider using your keyword more frequently for better SEO relevance.', color: 'tangerine' };
  if (density <= 3) return { label: 'Ideal', description: 'Good keyword density. Natural usage that search engines prefer.', color: 'turtle' };
  if (density <= 5) return { label: 'High', description: 'Approaching keyword stuffing. Consider reducing frequency for a more natural tone.', color: 'tangerine' };
  return { label: 'Too High', description: 'This may be flagged as keyword stuffing by search engines. Reduce usage significantly.', color: 'coral' };
}

// ============================================================
// Passive voice detection
// ============================================================
function findPassiveVoice(sentence) {
  const results = [];
  // Pattern: (be-verb) + optional adverb + past participle
  const pattern =
    /\b(is|are|was|were|been|being|be|am|has been|have been|had been|will be|would be|could be|should be|might be|must be|shall be)\s+(\w+ly\s+)?(\w+(?:ed|en|wn|nt|ght))\b/gi;
  let match;
  while ((match = pattern.exec(sentence)) !== null) {
    // Filter out false positives where the word is an adjective (interested, excited, etc.)
    const participle = match[3].toLowerCase();
    const falsePositives = new Set([
      'interested', 'excited', 'concerned', 'used', 'supposed',
      'allowed', 'pleased', 'satisfied', 'tired', 'bored',
      'married', 'divorced', 'limited', 'required', 'needed',
    ]);
    if (!falsePositives.has(participle)) {
      results.push({
        text: match[0],
        index: match.index,
      });
    }
  }
  return results;
}

// ============================================================
// Jargon detection
// ============================================================
function findJargon(text) {
  const results = [];
  const lower = text.toLowerCase();

  // Check multi-word phrases first
  for (const phrase of JARGON_PHRASES) {
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let match;
    while ((match = regex.exec(lower)) !== null) {
      results.push({
        text: text.substring(match.index, match.index + match[0].length),
        jargon: phrase,
        alternative: JARGON_MAP[phrase],
        index: match.index,
      });
    }
  }

  // Check single words
  for (const word of JARGON_SINGLE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    while ((match = regex.exec(lower)) !== null) {
      // Make sure this position isn't already covered by a phrase match
      const alreadyCovered = results.some(
        (r) => match.index >= r.index && match.index < r.index + r.text.length
      );
      if (!alreadyCovered) {
        results.push({
          text: text.substring(match.index, match.index + match[0].length),
          jargon: word,
          alternative: JARGON_MAP[word],
          index: match.index,
        });
      }
    }
  }

  return results;
}

// ============================================================
// Adverb detection
// ============================================================
function findAdverbs(text) {
  const results = [];
  // Common false-positive -ly words that are not adverbs
  const falsePositives = new Set([
    'only', 'early', 'family', 'friendly', 'lovely', 'likely',
    'daily', 'weekly', 'monthly', 'yearly', 'costly', 'ugly',
    'holy', 'lonely', 'silly', 'supply', 'reply', 'apply',
    'fly', 'july', 'italy', 'rally', 'ally', 'belly', 'bully',
    'jelly', 'lily', 'rely', 'multiply', 'comply',
  ]);
  const regex = /\b(\w+ly)\b/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const word = match[1].toLowerCase();
    if (!falsePositives.has(word) && word.length > 3) {
      results.push({
        text: match[1],
        index: match.index,
      });
    }
  }
  return results;
}

// ============================================================
// CTA detection
// ============================================================
function hasCTA(text) {
  const lower = text.toLowerCase().trim();
  // Check last ~200 chars of the text
  const tail = lower.slice(-200);
  for (const phrase of CTA_PHRASES) {
    if (tail.includes(phrase)) return true;
  }
  return false;
}

// ============================================================
// Power word counting
// ============================================================
function countPowerWords(words) {
  return words.filter((w) => POWER_WORDS.has(w.toLowerCase())).length;
}

// ============================================================
// Main analysis function
// ============================================================
export function analyzeText(text, platform = 'general') {
  if (!text || !text.trim()) {
    return null;
  }

  const targets = PLATFORM_TARGETS[platform];
  const issues = [];
  let issueId = 0;

  // Basic stats
  const words = getWords(text);
  const totalWords = words.length;
  const sentences = splitSentences(text);
  const totalSentences = sentences.length;
  const paragraphs = splitParagraphs(text);
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const gradeLevel = fleschKincaidGrade(totalWords, totalSentences, totalSyllables);
  const readingEase = fleschReadingEase(totalWords, totalSentences, totalSyllables);
  const avgSentenceLength = totalSentences > 0 ? totalWords / totalSentences : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(totalWords / 238));
  const speakingTimeMinutes = Math.max(1, Math.ceil(totalWords / 130));
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;

  // ---- Sentence-level analysis ----
  const sentenceAnalysis = sentences.map((sentence) => {
    const sentWords = getWords(sentence);
    const wordCount = sentWords.length;
    const complexWords = sentWords.filter(isComplexWord);
    const complexCount = complexWords.length;

    // Determine difficulty level
    let level = 'easy';
    if (wordCount > 25 || complexCount >= 3) {
      level = 'hard';
    } else if (wordCount > 14 || complexCount >= 1) {
      level = 'moderate';
    }

    // Passive voice in this sentence
    const passives = findPassiveVoice(sentence);

    // Jargon in this sentence
    const jargon = findJargon(sentence);

    // Adverbs in this sentence
    const adverbs = findAdverbs(sentence);

    return {
      text: sentence,
      wordCount,
      complexCount,
      complexWords: complexWords.map((w) => w.toLowerCase()),
      level,
      passives,
      jargon,
      adverbs,
    };
  });

  // ---- Generate issues ----

  // 1. Hard/moderate sentences
  sentenceAnalysis.forEach((s, idx) => {
    if (s.level === 'hard') {
      const midpoint = Math.floor(s.wordCount / 2);
      const sentWords = getWords(s.text);
      const splitWord = sentWords[midpoint] || sentWords[sentWords.length - 1];
      issues.push({
        id: issueId++,
        type: 'sentence-length',
        severity: 'high',
        sentenceIndex: idx,
        text: s.text.length > 80 ? s.text.substring(0, 80) + '...' : s.text,
        message: `This sentence has ${s.wordCount} words and ${s.complexCount} complex word${s.complexCount !== 1 ? 's' : ''}. For ${targets.label.toLowerCase()} copy, aim for under ${targets.sentenceMax} words. Consider splitting after "${splitWord}."`,
        fixed: false,
      });
    } else if (s.wordCount > targets.sentenceMax && s.level === 'moderate') {
      issues.push({
        id: issueId++,
        type: 'sentence-length',
        severity: 'medium',
        sentenceIndex: idx,
        text: s.text.length > 80 ? s.text.substring(0, 80) + '...' : s.text,
        message: `This sentence has ${s.wordCount} words. For ${targets.label.toLowerCase()} copy, try to keep sentences under ${targets.sentenceMax} words.`,
        fixed: false,
      });
    }
  });

  // 2. Passive voice
  sentenceAnalysis.forEach((s, idx) => {
    s.passives.forEach((p) => {
      issues.push({
        id: issueId++,
        type: 'passive-voice',
        severity: 'medium',
        sentenceIndex: idx,
        text: p.text,
        message: `"${p.text}" uses passive voice. Active voice is more direct and persuasive. Try rewriting with the subject performing the action.`,
        fixed: false,
      });
    });
  });

  // 3. Jargon
  sentenceAnalysis.forEach((s, idx) => {
    s.jargon.forEach((j) => {
      issues.push({
        id: issueId++,
        type: 'jargon',
        severity: 'medium',
        sentenceIndex: idx,
        text: j.text,
        message: `"${j.text}" is marketing jargon. Try "${j.alternative}" instead — it's clearer and more relatable.`,
        fixed: false,
      });
    });
  });

  // 4. Paragraph length
  paragraphs.forEach((para, idx) => {
    const paraSentences = splitSentences(para);
    if (paraSentences.length > targets.paraMax) {
      issues.push({
        id: issueId++,
        type: 'paragraph-length',
        severity: 'low',
        paragraphIndex: idx,
        text: para.length > 80 ? para.substring(0, 80) + '...' : para,
        message: `This paragraph has ${paraSentences.length} sentences. For ${targets.label.toLowerCase()} readability, keep paragraphs to ${targets.paraMax} sentence${targets.paraMax > 1 ? 's' : ''}. Break it up to improve scannability.`,
        fixed: false,
      });
    }
  });

  // 5. Adverb overuse
  const allAdverbs = sentenceAnalysis.flatMap((s) => s.adverbs);
  const adverbPercent = totalWords > 0 ? (allAdverbs.length / totalWords) * 100 : 0;
  if (adverbPercent > 3 && allAdverbs.length > 2) {
    issues.push({
      id: issueId++,
      type: 'adverbs',
      severity: 'low',
      text: allAdverbs.slice(0, 5).map((a) => a.text).join(', '),
      message: `You have ${allAdverbs.length} adverbs (${adverbPercent.toFixed(1)}% of words). Strong marketing copy uses specific details instead. Example: Replace "runs extremely fast" with "runs in under 2 seconds."`,
      fixed: false,
    });
  }

  // 6. Power word density
  const powerWordCount = countPowerWords(words);
  const powerWordPercent = totalWords > 0 ? (powerWordCount / totalWords) * 100 : 0;
  if (powerWordPercent < 2 && totalWords > 20) {
    const unused = [...POWER_WORDS]
      .filter((w) => !words.map((x) => x.toLowerCase()).includes(w))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    issues.push({
      id: issueId++,
      type: 'power-words',
      severity: 'low',
      text: `${powerWordPercent.toFixed(1)}% power word density`,
      message: `Your copy has ${powerWordPercent.toFixed(1)}% power words. Marketing copy typically benefits from 2-5%. Consider adding words like: ${unused.join(', ')}.`,
      fixed: false,
    });
  }

  // 7. CTA presence
  const ctaPresent = hasCTA(text);
  if (!ctaPresent && totalWords > 20) {
    issues.push({
      id: issueId++,
      type: 'cta',
      severity: 'medium',
      text: 'No call-to-action found',
      message: "Your copy doesn't end with a clear call-to-action. Consider adding one like \"Get started today\" or \"Try it free.\"",
      fixed: false,
    });
  }

  // 8. Grade level check
  if (gradeLevel > targets.gradeMax + 2) {
    issues.push({
      id: issueId++,
      type: 'grade-level',
      severity: 'high',
      text: `Grade ${gradeLevel.toFixed(1)} reading level`,
      message: `Your copy reads at grade ${gradeLevel.toFixed(1)} level. For ${targets.label.toLowerCase()}, aim for grade ${targets.gradeMin}-${targets.gradeMax}. Use shorter sentences and simpler words.`,
      fixed: false,
    });
  } else if (gradeLevel > targets.gradeMax) {
    issues.push({
      id: issueId++,
      type: 'grade-level',
      severity: 'medium',
      text: `Grade ${gradeLevel.toFixed(1)} reading level`,
      message: `Your copy reads at grade ${gradeLevel.toFixed(1)} level. For ${targets.label.toLowerCase()}, aim for grade ${targets.gradeMin}-${targets.gradeMax}.`,
      fixed: false,
    });
  }

  // ---- Calculate scores (0-100) ----

  // Clarity (40% weight): grade level, passive voice, sentence length
  const totalPassives = sentenceAnalysis.reduce((sum, s) => sum + s.passives.length, 0);
  const passiveRatio = totalSentences > 0 ? totalPassives / totalSentences : 0;
  const gradeScore = Math.max(0, 100 - Math.abs(gradeLevel - targets.gradeMin) * 8);
  const passiveScore = Math.max(0, 100 - passiveRatio * 200);
  const sentLenScore = Math.max(0, 100 - Math.max(0, avgSentenceLength - targets.sentenceMax) * 5);
  const clarityScore = Math.round(gradeScore * 0.4 + passiveScore * 0.3 + sentLenScore * 0.3);

  // Scannability (25% weight): paragraph length, sentence variation
  const longParagraphs = paragraphs.filter(
    (p) => splitSentences(p).length > targets.paraMax
  ).length;
  const paraScore = Math.max(
    0,
    100 - (paragraphs.length > 0 ? (longParagraphs / paragraphs.length) * 100 : 0)
  );
  const sentLengths = sentenceAnalysis.map((s) => s.wordCount);
  const sentVariation =
    sentLengths.length > 1
      ? Math.min(
          100,
          (standardDeviation(sentLengths) / Math.max(1, average(sentLengths))) * 100
        )
      : 50;
  const shortSentRatio = sentenceAnalysis.filter((s) => s.wordCount <= 10).length / Math.max(1, totalSentences);
  const shortSentScore = Math.min(100, shortSentRatio * 200);
  const scannabilityScore = Math.round(paraScore * 0.4 + sentVariation * 0.3 + shortSentScore * 0.3);

  // Persuasion (20% weight): power word density, emotional language
  const powerScore = Math.min(100, powerWordPercent * 25);
  const jargonCount = sentenceAnalysis.reduce((sum, s) => sum + s.jargon.length, 0);
  const jargonPenalty = Math.min(50, jargonCount * 10);
  const persuasionScore = Math.round(Math.max(0, powerScore - jargonPenalty));

  // Action (15% weight): CTA presence, verb usage
  const ctaScore = ctaPresent ? 100 : 20;
  const actionVerbs = words.filter((w) => {
    const lower = w.toLowerCase();
    return ['get', 'start', 'try', 'build', 'create', 'grow', 'boost', 'save', 'learn', 'discover', 'join', 'claim', 'grab', 'unlock', 'transform', 'upgrade', 'choose', 'pick', 'find', 'make'].includes(lower);
  }).length;
  const verbScore = Math.min(100, (actionVerbs / Math.max(1, totalWords)) * 500);
  const actionScore = Math.round(ctaScore * 0.6 + verbScore * 0.4);

  // Overall weighted score
  const overallScore = Math.round(
    clarityScore * 0.4 +
    scannabilityScore * 0.25 +
    persuasionScore * 0.2 +
    actionScore * 0.15
  );

  // Sort issues by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    text,
    totalWords,
    totalSentences,
    totalParagraphs: paragraphs.length,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    gradeLevel: Math.round(gradeLevel * 10) / 10,
    readingTime: readingTimeMinutes,
    sentenceAnalysis,
    issues,
    scores: {
      clarity: Math.min(100, Math.max(0, clarityScore)),
      scannability: Math.min(100, Math.max(0, scannabilityScore)),
      persuasion: Math.min(100, Math.max(0, persuasionScore)),
      action: Math.min(100, Math.max(0, actionScore)),
      overall: Math.min(100, Math.max(0, overallScore)),
    },
    stats: {
      powerWordCount,
      powerWordPercent: Math.round(powerWordPercent * 10) / 10,
      passiveCount: totalPassives,
      jargonCount: sentenceAnalysis.reduce((sum, s) => sum + s.jargon.length, 0),
      adverbCount: allAdverbs.length,
      adverbPercent: Math.round(adverbPercent * 10) / 10,
      ctaPresent,
      charCount,
      charNoSpaces,
      speakingTime: speakingTimeMinutes,
      readingEase: Math.round(readingEase * 10) / 10,
    },
    platform,
  };
}

// ---- Math helpers ----
function average(arr) {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

function standardDeviation(arr) {
  const avg = average(arr);
  const squareDiffs = arr.map((v) => Math.pow(v - avg, 2));
  return Math.sqrt(average(squareDiffs));
}
