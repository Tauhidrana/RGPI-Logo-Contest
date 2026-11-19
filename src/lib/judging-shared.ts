import type { ScoringWeights } from "./types";

export const SCORING_CRITERIA = ["creativity", "theme", "simplicity", "color_typography", "required_text"] as const;

/** Weighted average on a 1–10 scale, rounded to 2 decimals. */
export function computeTotal(
  s: Record<(typeof SCORING_CRITERIA)[number], number>,
  weights: ScoringWeights
): number {
  const sum = SCORING_CRITERIA.reduce((acc, k) => acc + s[k] * weights[k], 0);
  const wsum = SCORING_CRITERIA.reduce((acc, k) => acc + weights[k], 0) || 100;
  return Math.round((sum / wsum) * 100) / 100;
}
