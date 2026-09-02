/**
 * TRINITY ENGINE v1.0 - SSF 1.366 Core
 * Dartrainer OS - System obliczania formy
 * SSF = Skill Stability Factor - 1.366 to sweet spot pro
 */

export type ThrowRecord = {
  score: number;
  target: number;
  timestamp: number;
  isDouble: boolean;
}

export type TrinityStats = {
  avg: number;
  ssf: number;
  consistency: number;
  clutch: number;
  trinityScore: number;
}

const SSF_BASE = 1.366;

export function calculateSSF(throws: ThrowRecord[]): number {
  if (throws.length < 9) return 0;
  const last30 = throws.slice(-30);
  const mean = last30.reduce((a, b) => a + b.score, 0) / last30.length;
  const variance = last30.reduce((a, b) => a + Math.pow(b.score - mean, 2), 0) / last30.length;
  const stdDev = Math.sqrt(variance);
  const raw = mean / (stdDev + 1) * 0.45;
  return Math.min(2.5, Math.max(0, raw * SSF_BASE));
}

export function calculateTrinity(throws: ThrowRecord[]): TrinityStats {
  const avg = throws.reduce((a, b) => a + b.score, 0) / (throws.length || 1);
  const ssf = calculateSSF(throws);
  const consistency = Math.min(100, ssf * 45 + 20);
  const doubles = throws.filter(t => t.isDouble);
  const clutch = doubles.length ? (doubles.filter(d => d.score > 0).length / doubles.length) * 100 : 0;
  const trinityScore = (avg * ssf) / 3;
  return { avg: parseFloat(avg.toFixed(2)), ssf: parseFloat(ssf.toFixed(3)), consistency: Math.round(consistency), clutch: Math.round(clutch), trinityScore: parseFloat(trinityScore.toFixed(2)) };
}

export function getRank(trinityScore: number): string {
  if (trinityScore > 45) return "TRINITY ELITE";
  if (trinityScore > 35) return "MASTER";
  if (trinityScore > 25) return "DIAMOND";
  if (trinityScore > 15) return "PLATINUM";
  return "INITIATE";
}
