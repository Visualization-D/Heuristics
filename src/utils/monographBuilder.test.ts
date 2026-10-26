import test from 'node:test';
import assert from 'node:assert/strict';
import { HEURISTICS_DATA } from '../data/heuristicsData';
import { evaluateAuditScorecard } from './heuristicEngine';
import { buildReadingMonograph } from './monographBuilder';

test('buildReadingMonograph extracts all 10 heuristics into complete reading chapters', () => {
  const monograph = buildReadingMonograph(HEURISTICS_DATA);

  assert.equal(monograph.title, 'Heuristics Renewed: 1994 to the Age of AI');
  assert.equal(monograph.chapters.length, 10);
  assert.equal(monograph.chapters[0].chapterNumber, '01');
  assert.equal(monograph.chapters[0].code, 'H01');
  assert.equal(monograph.chapters[9].chapterNumber, '10');
  assert.equal(monograph.chapters[9].code, 'H10');

  // Verify each chapter includes all pedagogical fields
  for (const ch of monograph.chapters) {
    assert.ok(ch.classicalTitle.length > 0);
    assert.ok(ch.aiEraTitle.length > 0);
    assert.ok(ch.normanFoundation.length > 0);
    assert.ok(ch.classicalPrinciple.length > 0);
    assert.ok(ch.aiTransformationThesis.length > 0);
    assert.ok(ch.failureMode.name.length > 0);
    assert.ok(ch.failureMode.remediation.length > 0);
    assert.equal(ch.auditRubric.length, 2);
  }
});

test('buildReadingMonograph embeds live audit report when provided', () => {
  const sampleResponses: Record<string, 0 | 1 | 2> = {};
  for (const h of HEURISTICS_DATA) {
    for (const item of h.checklistItems) {
      sampleResponses[item.id] = 2;
    }
  }
  sampleResponses['h03-c1'] = 0;
  sampleResponses['h03-c2'] = 0;

  const auditReport = evaluateAuditScorecard(sampleResponses, HEURISTICS_DATA);
  const monograph = buildReadingMonograph(HEURISTICS_DATA, auditReport);

  assert.ok(monograph.auditSummary);
  assert.equal(monograph.auditSummary.percentage, 90);
  assert.equal(monograph.auditSummary.maturityTier, 'Calibrated AI-Native');
  assert.equal(monograph.auditSummary.topVulnerabilities.length, 1);
  assert.equal(monograph.auditSummary.topVulnerabilities[0].heuristicCode, 'H03');
});
