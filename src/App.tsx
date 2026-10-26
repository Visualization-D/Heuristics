/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  HEURISTICS_DATA,
  HeuristicCategory,
  EraMode,
  SimulationParameters
} from './data/heuristicsData';
import {
  filterHeuristics,
  computeSimulationDiagnostics,
  evaluateAuditScorecard
} from './utils/heuristicEngine';
import { buildReadingMonograph } from './utils/monographBuilder';
import { downloadMonographPdf } from './utils/pdfExporter';
import { HeuristicSimulatorStage } from './components/HeuristicSimulatorStage';
import { ParadigmShiftMatrix } from './components/ParadigmShiftMatrix';
import { AuditEvaluatorSection } from './components/AuditEvaluatorSection';
import { ReadingMonographSection } from './components/ReadingMonographSection';
import {
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Compass,
  Sliders,
  BookOpen,
  FileDown
} from 'lucide-react';

export default function App() {
  // Selected heuristic & filter states
  const [selectedHeuristicId, setSelectedHeuristicId] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<HeuristicCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [eraMode, setEraMode] = useState<EraMode>('comparative');

  // Simulation parameters per heuristic
  const [simParamsByHeuristic, setSimParamsByHeuristic] = useState<
    Record<number, SimulationParameters>
  >(() => {
    const initial: Record<number, SimulationParameters> = {};
    for (const h of HEURISTICS_DATA) {
      initial[h.id] = {
        autonomyLevel: h.keyTension.optimalEquilibrium,
        confidenceThreshold: 84,
        contextWindowDepth: 5,
        strictnessMode: 'strict'
      };
    }
    return initial;
  });

  // 20-Point Audit Scorecard responses (Default: Transitional Hybrid preset)
  const [activeAuditPreset, setActiveAuditPreset] = useState<'exemplary' | 'hybrid' | 'legacy' | 'custom'>('hybrid');
  const [auditResponses, setAuditResponses] = useState<Record<string, 0 | 1 | 2>>(() => {
    const initial: Record<string, 0 | 1 | 2> = {};
    HEURISTICS_DATA.forEach((h, idx) => {
      h.checklistItems.forEach((item, itemIdx) => {
        if (idx === 0 || idx === 4) {
          initial[item.id] = itemIdx === 0 ? 1 : 0; // Highlight H01 & H05 vulnerabilities initially
        } else {
          initial[item.id] = itemIdx === 0 ? 2 : 1;
        }
      });
    });
    return initial;
  });

  const filteredHeuristics = useMemo(
    () => filterHeuristics(HEURISTICS_DATA, activeCategory, searchQuery),
    [activeCategory, searchQuery]
  );

  const activeHeuristic = useMemo(
    () =>
      HEURISTICS_DATA.find((h) => h.id === selectedHeuristicId) ||
      filteredHeuristics[0] ||
      HEURISTICS_DATA[0],
    [selectedHeuristicId, filteredHeuristics]
  );

  const currentSimParams = simParamsByHeuristic[activeHeuristic.id] || {
    autonomyLevel: activeHeuristic.keyTension.optimalEquilibrium,
    confidenceThreshold: 84,
    contextWindowDepth: 5,
    strictnessMode: 'strict'
  };

  const diagnostics = useMemo(
    () => computeSimulationDiagnostics(activeHeuristic, currentSimParams),
    [activeHeuristic, currentSimParams]
  );

  const currentAuditReport = useMemo(
    () => evaluateAuditScorecard(auditResponses, HEURISTICS_DATA),
    [auditResponses]
  );

  const handleQuickDownloadPdf = () => {
    const monographDoc = buildReadingMonograph(HEURISTICS_DATA, currentAuditReport);
    downloadMonographPdf(monographDoc, { includeAuditAppendix: true });
  };

  const handleUpdateSimParams = (partial: Partial<SimulationParameters>) => {
    setSimParamsByHeuristic((prev) => ({
      ...prev,
      [activeHeuristic.id]: {
        ...prev[activeHeuristic.id],
        ...partial
      }
    }));
  };

  const handleSelectAuditScore = (itemId: string, score: 0 | 1 | 2) => {
    setActiveAuditPreset('custom');
    setAuditResponses((prev) => ({
      ...prev,
      [itemId]: score
    }));
  };

  const handleResetAuditPreset = (preset: 'exemplary' | 'hybrid' | 'legacy') => {
    setActiveAuditPreset(preset);
    const next: Record<string, 0 | 1 | 2> = {};
    HEURISTICS_DATA.forEach((h, idx) => {
      h.checklistItems.forEach((item, itemIdx) => {
        if (preset === 'exemplary') {
          next[item.id] = 2;
        } else if (preset === 'legacy') {
          next[item.id] = idx % 3 === 0 && itemIdx === 0 ? 1 : 0;
        } else {
          next[item.id] = itemIdx === 0 ? 2 : 1;
        }
      });
    });
    setAuditResponses(next);
  };

  const jumpToHeuristicInLab = (id: number) => {
    setSelectedHeuristicId(id);
    const el = document.getElementById('interactive-laboratory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-[#FBF9F5]/95 backdrop-blur-xs border-b border-stone-300">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-lg font-serif-display font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
        >
          Heuristics Renewed
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600"
        >
          <a
            href="#curatorial-overview"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Monograph
          </a>
          <a
            href="#interactive-laboratory"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Interactive Lab
          </a>
          <a
            href="#paradigm-matrix"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Paradigm Matrix
          </a>
          <a
            href="#audit-evaluator"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Audit Scorecard
          </a>
          <a
            href="#reading-monograph"
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            PDF Reader
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleQuickDownloadPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF Reader</span>
          </button>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Section 01: Institutional Hero & Conceptual Gulf Diagram */}
        <section
          id="curatorial-overview"
          aria-labelledby="hero-heading"
          className="pt-10 pb-14 border-b border-stone-300"
        >
          <div className="max-w-[1360px] mx-auto px-6">
            {/* Operational Utility Metadata Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-stone-200 text-xs text-stone-600">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-tabular uppercase tracking-wider text-stone-800 font-semibold">
                  HCI Curatorial Monograph &amp; Live Sandbox
                </span>
                <span aria-hidden="true">·</span>
                <span>Jakob Nielsen (1994) &amp; Don Norman (1988)</span>
                <span aria-hidden="true">·</span>
                <span>10 Canonical Principles</span>
              </div>
              <a
                href="https://www.nngroup.com/articles/ten-usability-heuristics/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-amber-900 hover:underline whitespace-nowrap shrink-0"
              >
                <span>NN/g Canonical Reference</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 2-Column Hero Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left 7 Columns: Editorial Thesis */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-xs font-mono-tabular uppercase tracking-widest text-amber-900 font-semibold">
                    01 · From Deterministic WIMP to Probabilistic Agency
                  </div>
                  <h1
                    id="hero-heading"
                    className="text-3xl sm:text-5xl font-serif-display font-semibold text-stone-900 tracking-tight leading-[1.12] text-balance"
                  >
                    The Ten Usability Heuristics in the Age of Artificial Intelligence
                  </h1>
                  <p className="text-base text-stone-700 leading-relaxed max-w-2xl first-letter:text-4xl first-letter:font-serif-display first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900">
                    For thirty years, Jakob Nielsen’s 10 Usability Heuristics and Don Norman’s Gulfs of Execution and Evaluation governed deterministic graphical user interfaces—where clicking a button executed a predictable, binary state change. In probabilistic AI systems, the interface is no longer a static tool; it is an epistemic collaborator whose reasoning, confidence, and agency must be continuously negotiated.
                  </p>
                </div>

                {/* Primary Hero Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="#interactive-laboratory"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-xs font-medium rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Explore the 10 Interactive Simulators</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#reading-monograph"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 text-stone-800 text-xs font-medium rounded-md hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-900" />
                    <span>Read &amp; Export PDF Monograph</span>
                  </a>
                </div>
              </div>

              {/* Right 5 Columns: Interactive SVG Architectural Diagram of Norman's Two Gulfs */}
              <div className="lg:col-span-5 bg-white border border-stone-300 rounded-lg p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500 block">
                      Fig. 1 · Architectural Blueprint
                    </span>
                    <h2 className="text-sm font-serif-display font-semibold text-stone-900">
                      Norman’s Action Cycle: 1994 vs. 2026 Shift
                    </h2>
                  </div>
                  <span className="font-mono-tabular text-xs text-amber-900 font-medium">
                    Active: {activeHeuristic.code}
                  </span>
                </div>

                {/* Custom Precision Vector Blueprint Diagram */}
                <div className="my-4">
                  <svg
                    viewBox="0 0 420 210"
                    className="w-full h-auto bg-[#FBF9F5] border border-stone-200 rounded p-2"
                    role="img"
                    aria-label="Diagram comparing Don Norman's Gulf of Execution and Gulf of Evaluation between 1994 deterministic interfaces and 2026 probabilistic AI systems"
                  >
                    {/* Subtle Blueprint Grid */}
                    <defs>
                      <pattern id="archival-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="#E7E2D8"
                          strokeWidth="0.7"
                        />
                      </pattern>
                    </defs>
                    <rect width="420" height="210" fill="url(#archival-grid)" />

                    {/* Left Node: Human Intent */}
                    <rect
                      x="16"
                      y="62"
                      width="96"
                      height="86"
                      rx="6"
                      fill="#FFFFFF"
                      stroke="#1C1917"
                      strokeWidth="1.5"
                    />
                    <text x="64" y="92" textAnchor="middle" className="text-[10px] font-bold fill-stone-900">
                      HUMAN INTENT
                    </text>
                    <text x="64" y="108" textAnchor="middle" className="text-[8px] fill-stone-600">
                      Mental Model
                    </text>
                    <text x="64" y="122" textAnchor="middle" className="text-[8px] fill-amber-900 font-medium">
                      Goal Formulation
                    </text>

                    {/* Top Bridge: Gulf of Execution */}
                    <path
                      d="M 118 82 C 175 34, 245 34, 302 82"
                      fill="none"
                      stroke="#9A3412"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <rect x="145" y="18" width="130" height="36" rx="4" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
                    <text x="210" y="33" textAnchor="middle" className="text-[9px] font-bold fill-amber-950">
                      GULF OF EXECUTION
                    </text>
                    <text x="210" y="46" textAnchor="middle" className="text-[7.5px] fill-stone-700">
                      1994: Menus → 2026: Semantic Steer
                    </text>

                    {/* Right Node: System World */}
                    <rect
                      x="308"
                      y="62"
                      width="96"
                      height="86"
                      rx="6"
                      fill="#1C1917"
                      stroke="#1C1917"
                      strokeWidth="1.5"
                    />
                    <text x="356" y="92" textAnchor="middle" className="text-[10px] font-bold fill-white">
                      AI SYSTEM STATE
                    </text>
                    <text x="356" y="108" textAnchor="middle" className="text-[8px] fill-stone-300">
                      Stochastic Weights
                    </text>
                    <text x="356" y="122" textAnchor="middle" className="text-[8px] fill-amber-300">
                      Tool &amp; RAG Grounding
                    </text>

                    {/* Bottom Bridge: Gulf of Evaluation */}
                    <path
                      d="M 302 128 C 245 176, 175 176, 118 128"
                      fill="none"
                      stroke="#1E3A8A"
                      strokeWidth="2"
                    />
                    <rect x="140" y="156" width="140" height="36" rx="4" fill="#F8FAFC" stroke="#1E3A8A" strokeWidth="1" />
                    <text x="210" y="171" textAnchor="middle" className="text-[9px] font-bold fill-slate-900">
                      GULF OF EVALUATION
                    </text>
                    <text x="210" y="184" textAnchor="middle" className="text-[7.5px] fill-stone-700">
                      1994: % Bar → 2026: Provenance Trace
                    </text>
                  </svg>
                </div>

                <p className="text-xs font-serif-display italic text-stone-600">
                  Fig. 1 — In classical GUIs, execution was syntactic and evaluation was binary. In AI systems, execution is semantic intent and evaluation requires inspecting reasoning provenance.
                </p>
              </div>
            </div>

            {/* 4-Column Quantitative Shift Strip Below Hero Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 pt-8 border-t border-stone-200">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                  Primary Interaction Unit
                </div>
                <div className="text-lg font-serif-display font-semibold text-stone-900 mt-1">
                  Command Click → Intent &amp; Steer
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Users shift from atomic point-and-click actions to delegating and supervising multi-step trajectories.
                </p>
              </div>

              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                  System State Nature
                </div>
                <div className="text-lg font-serif-display font-semibold text-stone-900 mt-1">
                  100% Deterministic → Calibrated CI
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Outputs carry epistemic uncertainty that must be communicated via grounding citations and confidence thresholds.
                </p>
              </div>

              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                  Error Taxonomy Shift
                </div>
                <div className="text-lg font-serif-display font-semibold text-stone-900 mt-1">
                  Syntax Slips → Automation Bias
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  Fluent prose masks factual drift; error prevention requires inline claim verification and dry-run sandboxes.
                </p>
              </div>

              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                  Minimalist Imperative
                </div>
                <div className="text-lg font-serif-display font-semibold text-stone-900 mt-1">
                  Pixel Economy → Anti-Slop Signal
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  When generating 1,000 words costs 0.2 seconds, usability demands ruthless compression and progressive disclosure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Interactive Heuristic Laboratory (Two-Zone Sandbox Layout) */}
        <section
          id="interactive-laboratory"
          aria-labelledby="lab-heading"
          className="py-16"
        >
          <div className="max-w-[1360px] mx-auto px-6">
            {/* Section Title & Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-300">
              <div>
                <div className="text-xs font-mono-tabular uppercase tracking-widest text-stone-500">
                  02 · Interactive Usability Workbench
                </div>
                <h2
                  id="lab-heading"
                  className="text-2xl sm:text-3xl font-serif-display font-semibold text-stone-900 mt-1 text-balance"
                >
                  Comparative Heuristic Simulation Laboratory
                </h2>
                <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                  Select any of the 10 heuristics below to test its 1994 deterministic implementation against its 2026 AI-native transformation in real time.
                </p>
              </div>

              {/* Era Mode Segmented Control */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <span className="text-xs font-medium text-stone-600">Viewport Lens:</span>
                <div
                  role="group"
                  aria-label="Era Comparison Mode"
                  className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-lg"
                >
                  {[
                    { id: 'classical' as const, label: '1994 Classical Only' },
                    { id: 'comparative' as const, label: 'Side-by-Side (1994 vs 2026)' },
                    { id: 'ai-native' as const, label: '2026 AI-Native Only' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setEraMode(mode.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        eraMode === mode.id
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-stone-200">
              {/* Category Filter Buttons */}
              <div
                role="group"
                aria-label="Filter heuristics by cognitive domain"
                className="flex flex-wrap items-center gap-1.5"
              >
                {[
                  { id: 'all' as const, label: 'All 10 Heuristics' },
                  { id: 'feedback-state' as const, label: 'Feedback & State' },
                  { id: 'agency-control' as const, label: 'Agency & Control' },
                  { id: 'cognition-clarity' as const, label: 'Cognition & Clarity' },
                  { id: 'error-resilience' as const, label: 'Error & Resilience' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.id);
                      const matching = filterHeuristics(HEURISTICS_DATA, cat.id, searchQuery);
                      if (matching.length > 0 && !matching.some((m) => m.id === selectedHeuristicId)) {
                        setSelectedHeuristicId(matching[0].id);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      activeCategory === cat.id
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  aria-label="Search heuristics by title, concept, or failure mode"
                  placeholder="Filter by heuristic or concept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-md text-xs text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* 10-Heuristic Index Selector Rail */}
            <div
              role="tablist"
              aria-label="Ten Usability Heuristics Selector"
              className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 py-5"
            >
              {filteredHeuristics.length === 0 ? (
                <div className="col-span-full p-6 bg-white border border-stone-200 rounded-lg text-center space-y-2">
                  <div className="text-sm font-medium text-stone-800">
                    No heuristics match "{searchQuery}"
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 bg-stone-900 text-white text-xs font-medium rounded"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredHeuristics.map((h) => {
                  const isSelected = h.id === activeHeuristic.id;
                  return (
                    <button
                      key={h.code}
                      role="tab"
                      aria-selected={isSelected}
                      type="button"
                      onClick={() => setSelectedHeuristicId(h.id)}
                      className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`font-mono-tabular text-xs font-bold ${
                            isSelected ? 'text-amber-300' : 'text-amber-900'
                          }`}
                        >
                          {h.code}
                        </span>
                        <span
                          className={`text-[10px] font-mono-tabular ${
                            isSelected ? 'text-stone-300' : 'text-stone-400'
                          }`}
                        >
                          1994
                        </span>
                      </div>
                      <div className="mt-2 text-xs font-medium leading-snug line-clamp-2">
                        {h.classicalTitle}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Active Heuristic Workbench: 12-Column Asymmetric Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4 items-start">
              {/* Left 8 Columns: Interactive Stage & Live Controls */}
              <div className="lg:col-span-8 space-y-6">
                {/* Active Specimen Header Card */}
                <div className="p-6 bg-white border border-stone-300 rounded-lg space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tabular font-semibold text-amber-900">
                        {activeHeuristic.code} · {activeHeuristic.accessionNumber}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{activeHeuristic.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeHeuristic.gulfShift.gulfType}</span>
                    </div>
                    <a
                      href={activeHeuristic.nngUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-stone-600 hover:text-stone-900 underline whitespace-nowrap shrink-0"
                    >
                      <span>NN/g Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                      1994 Classical Formulation: {activeHeuristic.classicalTitle}
                    </div>
                    <h3
                      data-testid="active-heuristic-title"
                      className="text-2xl sm:text-3xl font-serif-display font-semibold text-stone-900 text-balance"
                    >
                      {activeHeuristic.aiEraTitle}
                    </h3>
                  </div>

                  <p className="text-sm text-stone-700 leading-relaxed">
                    {activeHeuristic.aiTransformationThesis}
                  </p>
                </div>

                {/* Live Interactive Simulation Stage */}
                <HeuristicSimulatorStage
                  heuristic={activeHeuristic}
                  eraMode={eraMode}
                  params={currentSimParams}
                  onUpdateParams={handleUpdateSimParams}
                />
              </div>

              {/* Right 4 Columns: Museum Accession Monograph & Real-Time Gulf Telemetry */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Live Gulf & Equilibrium Diagnostic Panel */}
                <div className="p-6 bg-white border border-stone-300 rounded-lg space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                        Real-Time Cognitive Telemetry
                      </div>
                      <h4 className="text-base font-serif-display font-semibold text-stone-900">
                        Norman Gulf Equilibrium
                      </h4>
                    </div>
                    <span
                      data-testid="simulation-equilibrium-score"
                      className="text-2xl font-mono-tabular font-bold text-stone-900"
                    >
                      {diagnostics.overallEquilibriumScore}/100
                    </span>
                  </div>

                  {/* Semantic Status Banner (Explicit Icon + Text Label, never color alone) */}
                  <div
                    className={`p-3 rounded border text-xs flex items-start gap-2.5 ${
                      diagnostics.statusState === 'NOMINAL'
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : diagnostics.statusState === 'ELEVATED_RISK'
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                        : 'bg-red-50/70 border-red-300 text-red-950'
                    }`}
                  >
                    {diagnostics.statusState === 'NOMINAL' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <div className="font-mono-tabular font-bold">
                        {diagnostics.statusState === 'NOMINAL' && '● NOMINAL EQUILIBRIUM'}
                        {diagnostics.statusState === 'ELEVATED_RISK' && '▲ ELEVATED FRICTION'}
                        {diagnostics.statusState === 'CRITICAL_DRIFT' && '■ CRITICAL EPISTEMIC DRIFT'}
                      </div>
                      <p className="leading-relaxed">{diagnostics.statusSummary}</p>
                    </div>
                  </div>

                  {/* 4 Telemetry Bars */}
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-stone-700">Gulf of Evaluation Clarity</span>
                        <span className="font-mono-tabular font-semibold text-stone-900">
                          {diagnostics.gulfOfEvaluationScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 border border-stone-200 rounded-xs overflow-hidden">
                        <div
                          className="h-full bg-stone-800 transition-all duration-150"
                          style={{ width: `${diagnostics.gulfOfEvaluationScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-stone-700">Gulf of Execution Agency</span>
                        <span className="font-mono-tabular font-semibold text-stone-900">
                          {diagnostics.gulfOfExecutionScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 border border-stone-200 rounded-xs overflow-hidden">
                        <div
                          className="h-full bg-stone-800 transition-all duration-150"
                          style={{ width: `${diagnostics.gulfOfExecutionScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-stone-700">Hallucination / Slip Exposure</span>
                        <span className="font-mono-tabular font-semibold text-amber-900">
                          {diagnostics.hallucinationRiskPercent}% Risk
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 border border-stone-200 rounded-xs overflow-hidden">
                        <div
                          className="h-full bg-amber-800 transition-all duration-150"
                          style={{ width: `${diagnostics.hallucinationRiskPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Archival Accession Metadata & Failure Mode Card */}
                <div className="p-6 bg-white border border-stone-300 rounded-lg space-y-4">
                  <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500 border-b border-stone-200 pb-2">
                    Archival Accession Monograph
                  </div>

                  <dl className="divide-y divide-stone-200 text-xs">
                    <div className="py-2.5">
                      <dt className="font-mono-tabular text-stone-500 uppercase">Norman Cognitive Foundation</dt>
                      <dd className="text-stone-900 font-medium mt-1 leading-relaxed">
                        {activeHeuristic.normanConcept}
                      </dd>
                    </div>

                    <div className="py-2.5">
                      <dt className="font-mono-tabular text-stone-500 uppercase">1994 Canonical Rule</dt>
                      <dd className="text-stone-700 mt-1 leading-relaxed">
                        {activeHeuristic.classicalPrinciple}
                      </dd>
                    </div>

                    <div className="py-2.5">
                      <dt className="font-mono-tabular text-amber-900 uppercase font-semibold">
                        AI-Era Failure Mode: {activeHeuristic.failureMode.name}
                      </dt>
                      <dd className="text-stone-700 mt-1 leading-relaxed">
                        {activeHeuristic.failureMode.symptom}
                      </dd>
                    </div>

                    <div className="py-2.5">
                      <dt className="font-mono-tabular text-stone-500 uppercase">Architectural Remediation</dt>
                      <dd className="text-stone-900 font-medium mt-1 leading-relaxed">
                        {activeHeuristic.failureMode.remediation}
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Section 03: Complete 10-Heuristic Paradigm Shift Concordance Matrix */}
        <ParadigmShiftMatrix
          selectedHeuristicId={activeHeuristic.id}
          onSelectHeuristic={jumpToHeuristicInLab}
        />

        {/* Section 04: Interactive AI-Native Heuristic Audit & Scorecard */}
        <AuditEvaluatorSection
          responses={auditResponses}
          activePreset={activeAuditPreset}
          onSelectScore={handleSelectAuditScore}
          onResetPreset={handleResetAuditPreset}
          onInspectHeuristic={jumpToHeuristicInLab}
        />

        {/* Section 05: Complete Reading Monograph & Printable PDF Syllabus */}
        <ReadingMonographSection auditReport={currentAuditReport} />
      </main>

      {/* Quiet Archival Footer */}
      <footer className="py-10 bg-[#F4F0E8] border-t border-stone-300 text-xs text-stone-600">
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-serif-display font-semibold text-stone-900">
              Heuristics Renewed: 1994 to the Age of AI
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Grounded in Jakob Nielsen’s 10 Usability Heuristics &amp; Don Norman’s Action Cycle</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://www.nngroup.com/articles/ten-usability-heuristics/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 underline whitespace-nowrap"
            >
              NN/g Ten Usability Heuristics
            </a>
            <a href="#top" className="hover:text-stone-900 underline whitespace-nowrap">
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
