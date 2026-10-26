import test from 'node:test';
import assert from 'node:assert/strict';
import { HEURISTICS_DATA } from '../data/heuristicsData';
import {
  filterHeuristics,
  computeSimulationDiagnostics,
  evaluateAuditScorecard
} from './heuristicEngine';

test('HEURISTICS_DATA contains all 10 canonical Nielsen/Norman heuristics', () => {
  assert.equal(HEURISTICS_DATA.length, 10);
  assert.equal(HEURISTICS_DATA[0].code, 'H01');
  assert.equal(HEURISTICS_DATA[9].code, 'H10');
});

test('filterHeuristics filters accurately by category and search query', () => {
  const feedbackItems = filterHeuristics(HEURISTICS_DATA, 'feedback-state', '');
  assert.equal(feedbackItems.length, 2); // H01 and H10

  const searchUndo = filterHeuristics(HEURISTICS_DATA, 'all', 'rollback');
  assert.equal(searchUndo.length, 1);
  assert.equal(searchUndo[0].code, 'H03');
});

test('computeSimulationDiagnostics rewards calibrated equilibrium and flags critical drift', () => {
  const h01 = HEURISTICS_DATA[0];

  const calibrated = computeSimulationDiagnostics(h01, {
    autonomyLevel: h01.keyTension.optimalEquilibrium,
    confidenceThreshold: 88,
    contextWindowDepth: 5,
    strictnessMode: 'strict'
  });

  const reckless = computeSimulationDiagnostics(h01, {
    autonomyLevel: 98,
    confidenceThreshold: 52,
    contextWindowDepth: 1,
    strictnessMode: 'permissive'
  });

  assert.equal(calibrated.statusState, 'NOMINAL');
  assert.ok(calibrated.overallEquilibriumScore > reckless.overallEquilibriumScore);
  assert.ok(reckless.hallucinationRiskPercent > calibrated.hallucinationRiskPercent);
  assert.equal(reckless.statusState, 'CRITICAL_DRIFT');
});

test('evaluateAuditScorecard calculates percentage, maturity tier, and top vulnerabilities', () => {
  const allExemplary: Record<string, 0 | 1 | 2> = {};
  for (const h of HEURISTICS_DATA) {
    for (const item of h.checklistItems) {
      allExemplary[item.id] = 2;
    }
  }

  const fullReport = evaluateAuditScorecard(allExemplary);
  assert.equal(fullReport.percentage, 100);
  assert.equal(fullReport.maturityTier, 'Calibrated AI-Native');
  assert.equal(fullReport.topVulnerabilities.length, 0);

  // Degrade H01 and H05 to 0
  const partialResponses = { ...allExemplary };
  partialResponses['h01-c1'] = 0;
  partialResponses['h01-c2'] = 0;
  partialResponses['h05-c1'] = 0;
  partialResponses['h05-c2'] = 0;

  const degradedReport = evaluateAuditScorecard(partialResponses);
  assert.equal(degradedReport.percentage, 80);
  assert.equal(degradedReport.topVulnerabilities.length, 2);
  assert.equal(degradedReport.topVulnerabilities[0].heuristicCode, 'H01');
});
