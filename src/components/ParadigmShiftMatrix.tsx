import React from 'react';
import { HEURISTICS_DATA, HeuristicDefinition } from '../data/heuristicsData';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

interface ParadigmShiftMatrixProps {
  selectedHeuristicId: number;
  onSelectHeuristic: (id: number) => void;
}

export const ParadigmShiftMatrix: React.FC<ParadigmShiftMatrixProps> = ({
  selectedHeuristicId,
  onSelectHeuristic
}) => {
  return (
    <section
      id="paradigm-matrix"
      aria-labelledby="matrix-heading"
      className="py-16 border-t border-stone-300 bg-[#F7F4EE]"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-300">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-widest text-stone-500">
              03 · Architectural Concordance (1994 → 2026)
            </div>
            <h2
              id="matrix-heading"
              className="text-2xl sm:text-3xl font-serif-display font-semibold text-stone-900 mt-1 text-balance"
            >
              The Complete 10-Heuristic Paradigm Shift Matrix
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
              How Don Norman’s Gulfs of Execution and Evaluation and Jakob Nielsen’s 10 Heuristics evolve when software shifts from deterministic command execution to probabilistic agency.
            </p>
          </div>
          <a
            href="https://www.nngroup.com/articles/ten-usability-heuristics/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 underline whitespace-nowrap shrink-0"
          >
            <span>Reference: Nielsen Norman Group Canonical 10 Heuristics</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Full-Width Comparative Concordance Table */}
        <div className="mt-8 overflow-x-auto bg-white border border-stone-300 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-300 bg-[#FBF9F5] text-[11px] font-mono-tabular uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">1994 Classical Heuristic</th>
                <th className="py-3.5 px-4">2026 AI-Native Paradigm</th>
                <th className="py-3.5 px-4">Primary Cognitive Gulf</th>
                <th className="py-3.5 px-4">Classical vs. AI Telemetry</th>
                <th className="py-3.5 px-4 text-right">Laboratory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {HEURISTICS_DATA.map((h: HeuristicDefinition) => {
                const isSelected = h.id === selectedHeuristicId;
                return (
                  <tr
                    key={h.code}
                    className={`transition-colors ${
                      isSelected ? 'bg-amber-50/50' : 'hover:bg-stone-50'
                    }`}
                  >
                    <td className="py-4 px-4 font-mono-tabular font-semibold text-amber-900 whitespace-nowrap">
                      {h.code}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-serif-display font-semibold text-stone-900 text-sm">
                        {h.classicalTitle}
                      </div>
                      <div className="text-stone-500 mt-0.5">{h.categoryLabel}</div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-semibold text-stone-900">
                        {h.aiEraTitle}
                      </div>
                      <div className="text-stone-600 mt-0.5 line-clamp-2">
                        Failure Risk: {h.failureMode.name}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-mono-tabular text-stone-700">
                      {h.gulfShift.gulfType}
                    </td>
                    <td className="py-4 px-4 font-mono-tabular">
                      <div className="text-stone-500">
                        1994: {h.metrics.classicalBaseline}
                      </div>
                      <div className="text-stone-900 font-medium mt-0.5">
                        2026: {h.metrics.aiTarget}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onSelectHeuristic(h.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          isSelected
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                        }`}
                      >
                        <span>{isSelected ? 'Active in Lab' : 'Simulate'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
