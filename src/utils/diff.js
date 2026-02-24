// ============================================================
// Word-level diff with paragraph-aware LCS
// Fixes: O(n*m) perf on large texts, extra spaces, lost paragraphs
// ============================================================

const MAX_WORDS_PER_CHUNK = 1000;

/**
 * Compute LCS table for two word arrays.
 */
function lcsTable(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

/**
 * Backtrack through LCS table to produce diff ops.
 */
function backtrack(dp, a, b) {
  const result = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: 'equal', value: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'insert', value: b[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'delete', value: a[i - 1] });
      i--;
    }
  }

  return result;
}

/**
 * Split text into words (non-whitespace tokens).
 */
function getWords(text) {
  return text.match(/\S+/g) || [];
}

/**
 * Diff two word arrays using LCS.
 */
function diffWords(beforeWords, afterWords) {
  const dp = lcsTable(beforeWords, afterWords);
  return backtrack(dp, beforeWords, afterWords);
}

/**
 * Split text into paragraphs on double-newline boundaries.
 */
function splitParagraphs(text) {
  return text.split(/\n\s*\n/);
}

/**
 * Compute word-level diff between two texts, preserving paragraph structure.
 * Returns array of { type: 'equal' | 'insert' | 'delete' | 'break', value: string }.
 * 'break' ops represent paragraph boundaries.
 */
export function computeDiff(beforeText, afterText) {
  const beforeParas = splitParagraphs(beforeText);
  const afterParas = splitParagraphs(afterText);

  const beforeTotalWords = getWords(beforeText).length;
  const afterTotalWords = getWords(afterText).length;

  // If both texts are small enough, diff as a single block but still preserve breaks
  if (beforeTotalWords <= MAX_WORDS_PER_CHUNK && afterTotalWords <= MAX_WORDS_PER_CHUNK) {
    // If there's only one paragraph each, simple diff
    if (beforeParas.length <= 1 && afterParas.length <= 1) {
      return diffWords(getWords(beforeText), getWords(afterText));
    }

    // Multiple paragraphs: diff paragraph-by-paragraph using LCS alignment on paragraphs
    return diffParagraphAligned(beforeParas, afterParas);
  }

  // Large text: diff paragraph-by-paragraph
  return diffParagraphAligned(beforeParas, afterParas);
}

/**
 * Align paragraphs using LCS, then diff words within matched paragraphs.
 */
function diffParagraphAligned(beforeParas, afterParas) {
  // Build a paragraph-level LCS using normalized text comparison
  const bNorm = beforeParas.map((p) => p.trim());
  const aNorm = afterParas.map((p) => p.trim());

  const dp = lcsTable(bNorm, aNorm);
  const paraOps = backtrack(dp, bNorm, aNorm);

  const ops = [];
  let bIdx = 0;
  let aIdx = 0;

  for (let i = 0; i < paraOps.length; i++) {
    const paraOp = paraOps[i];

    if (i > 0) {
      ops.push({ type: 'break', value: '\n\n' });
    }

    if (paraOp.type === 'equal') {
      // Paragraphs match — diff words within them for fine-grained changes
      const bWords = getWords(beforeParas[bIdx]);
      const aWords = getWords(afterParas[aIdx]);
      const wordOps = diffWords(bWords, aWords);
      ops.push(...wordOps);
      bIdx++;
      aIdx++;
    } else if (paraOp.type === 'delete') {
      // Entire paragraph was removed
      const bWords = getWords(beforeParas[bIdx]);
      for (const w of bWords) {
        ops.push({ type: 'delete', value: w });
      }
      bIdx++;
    } else if (paraOp.type === 'insert') {
      // Entire paragraph was added
      const aWords = getWords(afterParas[aIdx]);
      for (const w of aWords) {
        ops.push({ type: 'insert', value: w });
      }
      aIdx++;
    }
  }

  return ops;
}

/**
 * Get the "before" view: equal + deleted words, with paragraph breaks.
 * Returns array of { text, highlighted, isBreak }.
 */
export function getBeforeView(ops) {
  return ops
    .filter((op) => op.type === 'equal' || op.type === 'delete' || op.type === 'break')
    .map((op) => ({
      text: op.value,
      highlighted: op.type === 'delete',
      isBreak: op.type === 'break',
    }));
}

/**
 * Get the "after" view: equal + inserted words, with paragraph breaks.
 * Returns array of { text, highlighted, isBreak }.
 */
export function getAfterView(ops) {
  return ops
    .filter((op) => op.type === 'equal' || op.type === 'insert' || op.type === 'break')
    .map((op) => ({
      text: op.value,
      highlighted: op.type === 'insert',
      isBreak: op.type === 'break',
    }));
}
