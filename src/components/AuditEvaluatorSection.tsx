import React from 'react';
import { HEURISTICS_DATA, HeuristicDefinition } from '../data/heuristicsData';
import { AuditReport, evaluateAuditScorecard } from '../utils/heuristicEngine';
import { CheckCircle2, AlertTriangle, RotateCcw, Award } from 'lucide-react';

interface AuditEvaluatorSectionProps {
  responses: Record<string, 0 | 1 | 2>;
  activePreset: 'exemplary' | 'hybrid' | 'legacy' | 'custom';
  onSelectScore: (itemId: string, score: 0 | 1 | 2) => void;
  onResetPreset: (preset: 'exemplary' | 'hybrid' | 'legacy') => void;
  onInspectHeuristic: (heuristicId: number) => void;
}

export const AuditEvaluatorSection: React.FC<AuditEvaluatorSectionProps> = ({
  responses,
  activePreset,
  onSelectScore,
  onResetPreset,
  onInspectHeuristic
}) => {
  const report: AuditReport = evaluateAuditScorecard(responses, HEURISTICS_DATA);

  return (
    <section
      id="audit-evaluator"
      aria-labelledby="audit-heading"
      className="py-16 border-t border-stone-300"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-200">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-widest text-stone-500">
              04 · Interactive Diagnostic Instrument
            </div>
            <h2
              id="audit-heading"
              className="text-2xl sm:text-3xl font-serif-display font-semibold text-stone-900 mt-1 text-balance"
            >
              AI-Native Heuristic Audit & Readiness Scorecard
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
              Evaluate any generative or agentic interface against 20 empirical criteria derived from Nielsen & Norman’s updated paradigm. Score each criterion to compute your Gulf of Evaluation & Execution readiness.
            </p>
          </div>

          {/* Preset Loaders */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs text-stone-500 mr-1">Load Benchmark Profile:</span>
            {[
              { id: 'legacy' as const, label: 'Raw Chat Wrapper (30%)' },
              { id: 'hybrid' as const, label: 'Transitional Hybrid (65%)' },
              { id: 'exemplary' as const, label: 'Calibrated AI-Native (100%)' }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onResetPreset(preset.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 ${
                  activePreset === preset.id
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white border-stone-300 hover:border-stone-500 text-stone-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Asymmetric Audit Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Left 8 Columns: Criterion Rubric Matrix */}
          <div className="lg:col-span-8 space-y-4">
            {HEURISTICS_DATA.map((h: HeuristicDefinition) => (
              <div
                key={h.code}
                className="p-5 bg-white border border-stone-200 rounded-lg space-y-4"
              >
                <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tabular text-xs font-semibold text-amber-900">
                        {h.code}
                      </span>
                      <span className="text-stone-300" aria-hidden="true">·</span>
                      <h3 className="text-base font-serif-display font-semibold text-stone-900">
                        {h.classicalTitle}
                      </h3>
                    </div>
                    <div className="text-xs font-medium text-stone-600">
                      AI Paradigm: {h.aiEraTitle}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onInspectHeuristic(h.id)}
                    className="text-xs font-medium text-amber-900 hover:underline whitespace-nowrap shrink-0 mt-0.5"
                  >
                    Open in Lab →
                  </button>
                </div>

                <div className="space-y-3">
                  {h.checklistItems.map((item) => {
                    const currentVal = responses[item.id] ?? 0;
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#FBF9F5] border border-stone-200/80 rounded"
                      >
                        <div className="space-y-0.5 max-w-xl">
                          <div className="text-xs font-semibold text-stone-900">
                            {item.criterion}
                          </div>
                          <p className="text-xs text-stone-600">
                            {item.diagnosticQuestion}
                          </p>
                        </div>

                        <div
                          role="group"
                          aria-label={`Score for ${item.criterion}`}
                          className="flex items-center gap-1 p-1 bg-stone-200/70 rounded shrink-0"
                        >
                          {[
                            { val: 0 as const, label: '0 · Unmet' },
                            { val: 1 as const, label: '1 · Partial' },
                            { val: 2 as const, label: '2 · Exemplary' }
                          ].map((opt) => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => onSelectScore(item.id, opt.val)}
                              className={`px-2.5 py-1 text-xs font-mono-tabular font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                                currentVal === opt.val
                                  ? 'bg-stone-900 text-white shadow-xs'
                                  : 'text-stone-700 hover:text-stone-900'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right 4 Columns: Live Diagnostic Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 p-6 bg-white border border-stone-300 rounded-lg space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                Composite Audit Telemetry
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <div
                  data-testid="audit-score-percentage"
                  className="text-4xl font-serif-display font-bold text-stone-900 font-mono-tabular"
                >
                  {report.percentage}%
                </div>
                <span className="text-xs font-mono-tabular font-semibold text-stone-700">
                  {report.totalScore} / {report.maxPossibleScore} pts
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-amber-900">
                <Award className="w-4 h-4 shrink-0" />
                <span>Classification: {report.maturityTier}</span>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                Domain Cluster Readiness
              </h4>
              {report.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-stone-800">{cat.label}</span>
                    <span className="font-mono-tabular text-stone-600">
                      {cat.percentage}% ({cat.score}/{cat.maxScore})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 border border-stone-200 rounded-xs overflow-hidden">
                    <div
                      className="h-full bg-stone-800 transition-all duration-150"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Vulnerabilities & Remediations */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h4 className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                Priority Failure-Mode Remediations
              </h4>
              {report.topVulnerabilities.length === 0 ? (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded text-xs text-emerald-950">
                  All 10 heuristics meet or exceed calibrated AI-Native thresholds. Zero high-risk vulnerabilities flagged.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {report.topVulnerabilities.map((vuln) => (
                    <div
                      key={vuln.heuristicCode}
                      className="p-3 bg-[#FBF9F5] border border-stone-200 rounded text-xs space-y-1"
                    >
                      <div className="font-semibold text-stone-900">
                        {vuln.heuristicCode}: {vuln.failureModeName}
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {vuln.remediation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
