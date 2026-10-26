import { HEURISTICS_DATA, HeuristicCategory, HeuristicDefinition, SimulationParameters } from '../data/heuristicsData';

export interface SimulationDiagnostics {
  gulfOfEvaluationScore: number; // 0-100 (Higher = narrower gulf / better clarity)
  gulfOfExecutionScore: number;  // 0-100 (Higher = narrower gulf / better agency)
  hallucinationRiskPercent: number; // 0-100
  cognitiveLoadIndex: number; // 0-100
  overallEquilibriumScore: number; // 0-100
  statusState: 'NOMINAL' | 'ELEVATED_RISK' | 'CRITICAL_DRIFT';
  statusSummary: string;
}

export interface AuditItemResponse {
  itemId: string;
  score: 0 | 1 | 2; // 0 = Unmet (Classical/Broken), 1 = Partial, 2 = Exemplary AI-Native
}

export interface AuditReport {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  maturityTier: 'Legacy Deterministic' | 'Transitional Hybrid' | 'Calibrated AI-Native';
  categoryBreakdown: {
    category: HeuristicCategory;
    label: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  topVulnerabilities: {
    heuristicCode: string;
    heuristicTitle: string;
    failureModeName: string;
    remediation: string;
  }[];
}

/**
 * Filters heuristics by category and search query.
 */
export function filterHeuristics(
  heuristics: HeuristicDefinition[],
  category: HeuristicCategory | 'all',
  searchQuery: string
): HeuristicDefinition[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return heuristics.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;

    if (!normalizedQuery) return true;

    return (
      item.code.toLowerCase().includes(normalizedQuery) ||
      item.classicalTitle.toLowerCase().includes(normalizedQuery) ||
      item.aiEraTitle.toLowerCase().includes(normalizedQuery) ||
      item.normanConcept.toLowerCase().includes(normalizedQuery) ||
      item.failureMode.name.toLowerCase().includes(normalizedQuery)
    );
  });
}

/**
 * Computes real-time usability diagnostics for a given heuristic and user-adjusted simulation parameters.
 */
export function computeSimulationDiagnostics(
  heuristic: HeuristicDefinition,
  params: SimulationParameters
): SimulationDiagnostics {
  const { autonomyLevel, confidenceThreshold, contextWindowDepth, strictnessMode } = params;

  const strictnessBonus = strictnessMode === 'strict' ? 14 : strictnessMode === 'balanced' ? 7 : -8;

  // Distance from heuristic's optimal equilibrium
  const equilibriumDelta = Math.abs(autonomyLevel - heuristic.keyTension.optimalEquilibrium);
  const equilibriumPenalty = Math.round(equilibriumDelta * 0.65);

  // Gulf of Evaluation Clarity: improves with higher confidence threshold, appropriate context depth, and strictness
  const rawEvaluation =
    48 +
    Math.round((confidenceThreshold - 50) * 0.7) +
    Math.min(contextWindowDepth * 2, 16) +
    strictnessBonus -
    Math.round(equilibriumPenalty * 0.4);

  const gulfOfEvaluationScore = Math.max(12, Math.min(99, rawEvaluation));

  // Gulf of Execution Agency: peaks near optimal equilibrium, degrades if autonomy is 100% unchecked or 0% manual
  const rawExecution =
    88 -
    equilibriumPenalty +
    (strictnessMode === 'balanced' ? 6 : strictnessMode === 'strict' ? 2 : -6) +
    Math.min(contextWindowDepth, 8);

  const gulfOfExecutionScore = Math.max(15, Math.min(99, rawExecution));

  // Hallucination / Slip Risk: increases when autonomy is high but confidence threshold & strictness are low
  const rawRisk =
    Math.round(autonomyLevel * 0.55) -
    Math.round((confidenceThreshold - 50) * 0.85) -
    strictnessBonus +
    (contextWindowDepth < 3 ? 12 : 0);

  const hallucinationRiskPercent = Math.max(2, Math.min(96, rawRisk));

  // Cognitive Load Index: spikes if context depth is excessive (>8) or autonomy is too low (<25)
  const rawCognitiveLoad =
    32 +
    (contextWindowDepth > 7 ? (contextWindowDepth - 7) * 9 : 0) +
    (autonomyLevel < 30 ? (30 - autonomyLevel) * 0.8 : 0) +
    (autonomyLevel > 85 ? (autonomyLevel - 85) * 1.1 : 0);

  const cognitiveLoadIndex = Math.max(14, Math.min(95, Math.round(rawCognitiveLoad)));

  const overallEquilibriumScore = Math.round(
    gulfOfEvaluationScore * 0.4 +
      gulfOfExecutionScore * 0.4 +
      (100 - hallucinationRiskPercent) * 0.2
  );

  let statusState: SimulationDiagnostics['statusState'] = 'NOMINAL';
  let statusSummary = 'Calibrated Human-AI Equilibrium: Both Gulfs are bridged with verifiable provenance.';

  if (hallucinationRiskPercent >= 45 || overallEquilibriumScore < 55) {
    statusState = 'CRITICAL_DRIFT';
    statusSummary = `Critical Drift Detected: ${heuristic.failureMode.name} likely under current autonomy/threshold balance.`;
  } else if (hallucinationRiskPercent >= 25 || overallEquilibriumScore < 74) {
    statusState = 'ELEVATED_RISK';
    statusSummary = 'Elevated Friction: Adjust confidence threshold or steering autonomy to tighten the Gulf of Evaluation.';
  }

  return {
    gulfOfEvaluationScore,
    gulfOfExecutionScore,
    hallucinationRiskPercent,
    cognitiveLoadIndex,
    overallEquilibriumScore,
    statusState,
    statusSummary
  };
}

/**
 * Evaluates a complete 20-criterion AI-Era Heuristic Scorecard and returns structured diagnostics.
 */
export function evaluateAuditScorecard(
  responses: Record<string, 0 | 1 | 2>,
  heuristics: HeuristicDefinition[] = HEURISTICS_DATA
): AuditReport {
  let totalScore = 0;
  let maxPossibleScore = 0;

  const categoryTotals: Record<
    HeuristicCategory,
    { label: string; score: number; maxScore: number }
  > = {
    'feedback-state': { label: 'Feedback & State', score: 0, maxScore: 0 },
    'agency-control': { label: 'Agency & Control', score: 0, maxScore: 0 },
    'cognition-clarity': { label: 'Cognition & Clarity', score: 0, maxScore: 0 },
    'error-resilience': { label: 'Error & Resilience', score: 0, maxScore: 0 }
  };

  const heuristicScores: { heuristic: HeuristicDefinition; ratio: number }[] = [];

  for (const h of heuristics) {
    let hScore = 0;
    let hMax = 0;

    for (const item of h.checklistItems) {
      const userChoice = responses[item.id] ?? 0;
      const itemPoints = userChoice * item.weight;
      const itemMax = 2 * item.weight;

      hScore += itemPoints;
      hMax += itemMax;
      totalScore += itemPoints;
      maxPossibleScore += itemMax;

      categoryTotals[h.category].score += itemPoints;
      categoryTotals[h.category].maxScore += itemMax;
    }

    heuristicScores.push({
      heuristic: h,
      ratio: hMax > 0 ? hScore / hMax : 0
    });
  }

  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  let maturityTier: AuditReport['maturityTier'] = 'Legacy Deterministic';
  if (percentage >= 78) {
    maturityTier = 'Calibrated AI-Native';
  } else if (percentage >= 45) {
    maturityTier = 'Transitional Hybrid';
  }

  const categoryBreakdown = (Object.keys(categoryTotals) as HeuristicCategory[]).map((cat) => {
    const entry = categoryTotals[cat];
    return {
      category: cat,
      label: entry.label,
      score: entry.score,
      maxScore: entry.maxScore,
      percentage: entry.maxScore > 0 ? Math.round((entry.score / entry.maxScore) * 100) : 0
    };
  });

  const topVulnerabilities = heuristicScores
    .filter((entry) => entry.ratio < 0.75)
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, 3)
    .map(({ heuristic }) => ({
      heuristicCode: heuristic.code,
      heuristicTitle: heuristic.aiEraTitle,
      failureModeName: heuristic.failureMode.name,
      remediation: heuristic.failureMode.remediation
    }));

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    maturityTier,
    categoryBreakdown,
    topVulnerabilities
  };
}
