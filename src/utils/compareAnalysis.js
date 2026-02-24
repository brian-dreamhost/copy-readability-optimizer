// ============================================================
// Compare Analysis — uses CRO's full analysis engine for richer scoring
// ============================================================

/**
 * Calculate an overall improvement score from two CRO analyses.
 * Uses CRO's richer data (scores.overall, stats, gradeLevel) instead of raw Flesch.
 * Returns a percentage capped at ±100.
 */
export function calculateImprovementScore(beforeAnalysis, afterAnalysis) {
  if (!beforeAnalysis || !afterAnalysis) return 0;
  if (beforeAnalysis.totalWords === 0 || afterAnalysis.totalWords === 0) return 0;

  const weights = {
    overall: 0.30,
    readingEase: 0.20,
    gradeLevel: 0.15,
    passive: 0.15,
    adverbs: 0.10,
    avgSentence: 0.10,
  };

  let totalScore = 0;

  // CRO overall score: higher is better
  if (beforeAnalysis.scores.overall > 0) {
    const change = (afterAnalysis.scores.overall - beforeAnalysis.scores.overall) / beforeAnalysis.scores.overall;
    totalScore += change * weights.overall;
  }

  // Reading ease: higher is better
  if (beforeAnalysis.stats.readingEase > 0) {
    const change = (afterAnalysis.stats.readingEase - beforeAnalysis.stats.readingEase) / beforeAnalysis.stats.readingEase;
    totalScore += change * weights.readingEase;
  }

  // Grade level: lower is better (invert)
  if (beforeAnalysis.gradeLevel > 0) {
    const change = (beforeAnalysis.gradeLevel - afterAnalysis.gradeLevel) / beforeAnalysis.gradeLevel;
    totalScore += change * weights.gradeLevel;
  }

  // Passive voice: fewer is better (invert)
  if (beforeAnalysis.stats.passiveCount > 0) {
    const change = (beforeAnalysis.stats.passiveCount - afterAnalysis.stats.passiveCount) / beforeAnalysis.stats.passiveCount;
    totalScore += change * weights.passive;
  } else if (afterAnalysis.stats.passiveCount > 0) {
    totalScore -= weights.passive * 0.5;
  }

  // Adverbs: fewer is better (invert)
  if (beforeAnalysis.stats.adverbCount > 0) {
    const change = (beforeAnalysis.stats.adverbCount - afterAnalysis.stats.adverbCount) / beforeAnalysis.stats.adverbCount;
    totalScore += change * weights.adverbs;
  } else if (afterAnalysis.stats.adverbCount > 0) {
    totalScore -= weights.adverbs * 0.5;
  }

  // Avg sentence length: shorter is better (invert)
  if (beforeAnalysis.avgSentenceLength > 0) {
    const change = (beforeAnalysis.avgSentenceLength - afterAnalysis.avgSentenceLength) / beforeAnalysis.avgSentenceLength;
    totalScore += change * weights.avgSentence;
  }

  return Math.max(-100, Math.min(100, Math.round(totalScore * 100)));
}

/**
 * Grade level label.
 */
function gradeLevelLabel(grade) {
  if (grade <= 6) return 'Elementary';
  if (grade <= 8) return 'Middle School';
  if (grade <= 12) return 'High School';
  return 'College+';
}

/**
 * Generate a plain-language summary with benchmarks.
 */
export function generateSummary(beforeAnalysis, afterAnalysis, score) {
  if (!beforeAnalysis || !afterAnalysis) return '';
  if (beforeAnalysis.totalWords === 0 || afterAnalysis.totalWords === 0) {
    return 'Enter text in both fields to see a comparison.';
  }

  const observations = [];

  // Word count change
  const wordDiff = afterAnalysis.totalWords - beforeAnalysis.totalWords;
  if (wordDiff < -10) {
    observations.push('your revision is more concise');
  } else if (wordDiff > 10) {
    observations.push('your revision is longer');
  }

  // Grade level change with benchmark
  const gradeDiff = afterAnalysis.gradeLevel - beforeAnalysis.gradeLevel;
  if (Math.abs(gradeDiff) > 0.5) {
    const dir = gradeDiff < 0 ? 'dropped' : 'rose';
    observations.push(
      `grade level ${dir} from ${beforeAnalysis.gradeLevel} (${gradeLevelLabel(beforeAnalysis.gradeLevel)}) to ${afterAnalysis.gradeLevel} (${gradeLevelLabel(afterAnalysis.gradeLevel)})`
    );
  }

  // CRO overall score change
  const scoreDiff = afterAnalysis.scores.overall - beforeAnalysis.scores.overall;
  if (scoreDiff > 5) {
    observations.push(`overall readability score improved from ${beforeAnalysis.scores.overall} to ${afterAnalysis.scores.overall}`);
  } else if (scoreDiff < -5) {
    observations.push(`overall readability score dropped from ${beforeAnalysis.scores.overall} to ${afterAnalysis.scores.overall}`);
  }

  // Passive voice
  const passiveDiff = afterAnalysis.stats.passiveCount - beforeAnalysis.stats.passiveCount;
  if (passiveDiff < 0) {
    observations.push('uses more active voice');
  } else if (passiveDiff > 0) {
    observations.push('introduces more passive voice');
  }

  // Sentence length
  const sentDiff = afterAnalysis.avgSentenceLength - beforeAnalysis.avgSentenceLength;
  if (sentDiff < -3) {
    observations.push('uses shorter sentences');
  } else if (sentDiff > 3) {
    observations.push('has longer sentences');
  }

  if (observations.length === 0) {
    return 'The two versions are very similar in readability. The differences are minimal.';
  }

  // Build summary
  let summary =
    observations[0].charAt(0).toUpperCase() + observations[0].slice(1);
  if (observations.length > 1) {
    const rest = observations.slice(1);
    if (rest.length === 1) {
      summary += ' and ' + rest[0];
    } else {
      summary += ', ' + rest.slice(0, -1).join(', ') + ', and ' + rest[rest.length - 1];
    }
  }
  summary += '.';

  // Add verdict
  if (score > 5) {
    summary += ' Overall, this is a stronger version for a wider audience.';
  } else if (score < -5) {
    summary += ' Consider simplifying sentences and using more direct language.';
  } else {
    summary += ' The readability is roughly the same as the original.';
  }

  // Add benchmark tip
  if (afterAnalysis.gradeLevel > 8) {
    summary += ` Marketing copy works best at grade 6-8 — your "After" is at grade ${afterAnalysis.gradeLevel}.`;
  }

  return summary;
}

/**
 * Determine if a metric change is an improvement, regression, or neutral.
 */
export function getMetricDirection(key, before, after) {
  if (before === after) return 'neutral';

  switch (key) {
    case 'avgSentenceLength':
    case 'gradeLevel':
    case 'passiveCount':
    case 'adverbCount':
      return after < before ? 'improved' : 'worsened';
    case 'readingEase':
    case 'overallScore':
    case 'clarityScore':
    case 'scannabilityScore':
    case 'persuasionScore':
    case 'actionScore':
      return after > before ? 'improved' : 'worsened';
    default:
      return 'neutral';
  }
}
