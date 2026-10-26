import React, { useState } from 'react';
import { EraMode, HeuristicDefinition, SimulationParameters } from '../data/heuristicsData';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Sliders,
  FileCheck,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ArrowRight,
  Check,
  X,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface HeuristicSimulatorStageProps {
  heuristic: HeuristicDefinition;
  eraMode: EraMode;
  params: SimulationParameters;
  onUpdateParams: (partial: Partial<SimulationParameters>) => void;
}

export const HeuristicSimulatorStage: React.FC<HeuristicSimulatorStageProps> = ({
  heuristic,
  eraMode,
  params,
  onUpdateParams
}) => {
  // Interactive states across the 10 heuristics
  // H01: System status / reasoning trace state
  const [h01Running, setH01Running] = useState(false);
  const [h01Progress, setH01Progress] = useState(74);
  const [h01ExpandedTrace, setH01ExpandedTrace] = useState(true);

  // H02: Semantic intent mapping state
  const [h02LegacyDept, setH02LegacyDept] = useState('CAR_04');
  const [h02NaturalInput, setH02NaturalInput] = useState(
    'Compare readmission risk for post-op cardiac patients over 65'
  );
  const [h02RemovedChip, setH02RemovedChip] = useState<string | null>(null);

  // H03: User control, steering & granular rollback
  const [h03Paused, setH03Paused] = useState(false);
  const [h03SteerNote, setH03SteerNote] = useState('Preserve legacy API v1 endpoints');
  const [h03DiffStates, setH03DiffStates] = useState<Record<string, 'staged' | 'accepted' | 'reverted'>>({
    diff1: 'staged',
    diff2: 'staged',
    diff3: 'staged'
  });

  // H04: Consistency & Schema contracts
  const [h04SchemaLock, setH04SchemaLock] = useState(true);
  const [h04SampleRun, setH04SampleRun] = useState(1);

  // H05: Error prevention & Hallucination guardrails
  const [h05VerifiedCitation, setH05VerifiedCitation] = useState(false);
  const [h05DryRunExecuted, setH05DryRunExecuted] = useState(false);

  // H06: Recognition over recall
  const [h06ActiveLens, setH06ActiveLens] = useState<'counterarguments' | 'quantify' | 'simplify'>('counterarguments');
  const [h06PinnedDocs, setH06PinnedDocs] = useState<string[]>([
    'Nielsen_1994_CHI.pdf',
    'Norman_Design_Everyday_Things.pdf'
  ]);

  // H07: Flexibility & Efficiency
  const [h07AudienceDepth, setH07AudienceDepth] = useState<'executive' | 'technical' | 'regulatory'>('technical');
  const [h07Compression, setH07Compression] = useState(75);

  // H08: Aesthetic & Minimalist Design (Signal-to-Noise)
  const [h08SignalOnly, setH08SignalOnly] = useState(true);
  const [h08ShowEvidence, setH08ShowEvidence] = useState(false);

  // H09: Error Recognition, Diagnosis & Scoped Repair
  const [h09SpanRepaired, setH09SpanRepaired] = useState(false);

  // H10: Help, Documentation & Capability Boundaries
  const [h10ActiveExemplar, setH10ActiveExemplar] = useState<'clinical' | 'financial' | 'code'>('clinical');

  const showClassical = eraMode === 'classical' || eraMode === 'comparative';
  const showAiNative = eraMode === 'ai-native' || eraMode === 'comparative';

  const renderClassicalPanel = () => {
    switch (heuristic.id) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                 FileTransfer_Dialog.exe (1994 WIMP)
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Deterministic I/O</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded">
              <div className="flex justify-between text-xs font-medium text-stone-800 mb-2">
                <span>Copying `quarterly_ledger.db` to Volume B...</span>
                <span className="font-mono-tabular">{h01Progress}%</span>
              </div>
              <div className="w-full h-4 bg-white border border-stone-400 p-0.5">
                <div
                  className="h-full bg-stone-800 transition-all duration-150"
                  style={{ width: `${h01Progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-stone-600">
                <span className="font-mono-tabular">Bytes: 1,482,240 / 2,000,000</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setH01Progress((p) => (p >= 100 ? 25 : Math.min(100, p + 25)))}
                    className="px-2.5 py-1 bg-white border border-stone-400 text-stone-900 text-xs font-medium hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0"
                  >
                    Step +25% Byte Block
                  </button>
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Known file size divided by bytes transferred yields an exact, deterministic completion percentage. Zero epistemic ambiguity.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                Rigid Schema Query Builder (1994)
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">System-Oriented Taxonomy</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded space-y-3">
              <div>
                <label htmlFor="legacy-dept-select" className="block text-xs font-medium text-stone-700 mb-1">
                  SELECT DEPT_CODE_ID (Required System Code):
                </label>
                <select
                  id="legacy-dept-select"
                  value={h02LegacyDept}
                  onChange={(e) => setH02LegacyDept(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-400 text-xs font-mono-tabular text-stone-900"
                >
                  <option value="CAR_04">DEPT_CODE: CAR_04 (Thoracic/Cardiac)</option>
                  <option value="NEU_09">DEPT_CODE: NEU_09 (Neurology)</option>
                  <option value="ONC_02">DEPT_CODE: ONC_02 (Oncology)</option>
                </select>
              </div>
              <div className="text-xs font-mono-tabular bg-white p-2 border border-stone-300 text-stone-700">
                WHERE `dept_id` = '{h02LegacyDept}' AND `age_yr` &gt;= 65 AND `readmit_30d` = TRUE
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Users must translate their real-world clinical question into rigid database column names and dropdown codes.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                Linear Command History Stack (1994)
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">LIFO Undo Stack</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded space-y-3">
              <div className="text-xs text-stone-700 font-medium">
                Last Action: Formatted Table Border (1 Atomic Mutation)
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setH03DiffStates({ diff1: 'reverted', diff2: 'staged', diff3: 'staged' })
                  }
                  className="px-3 py-1.5 bg-white border border-stone-400 text-xs font-medium text-stone-900 hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0"
                >
                  Undo (Ctrl+Z)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setH03DiffStates({ diff1: 'accepted', diff2: 'staged', diff3: 'staged' })
                  }
                  className="px-3 py-1.5 bg-white border border-stone-400 text-xs font-medium text-stone-900 hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0"
                >
                  Redo (Ctrl+Y)
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Binary, single-step Undo/Redo works when the user performs one discrete action at a time.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                OS Menu Bar Standard (1994)
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Static Layout Convention</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded space-y-3">
              <div className="flex items-center gap-4 px-3 py-1.5 bg-white border border-stone-400 text-xs font-medium text-stone-800">
                <span className="underline">F</span>ile
                <span><span className="underline">E</span>dit</span>
                <span><span className="underline">V</span>iew</span>
                <span><span className="underline">W</span>indow</span>
                <span><span className="underline">H</span>elp</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setH04SampleRun((r) => r + 1)}
                  className="px-3 py-1 bg-white border border-stone-400 text-xs text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setH04SampleRun((r) => r + 1)}
                  className="px-3 py-1 bg-stone-800 text-white text-xs"
                >
                  OK (Enter)
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Predictability comes from fixed spatial placement: File/Edit on top-left, OK/Cancel at bottom-right.
            </p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                Syntactic Input Mask & Confirmation Modal
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Deterministic Constraint</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded space-y-3">
              <div className="text-xs text-stone-800 font-medium">
                Confirm Permanent Record Deletion
              </div>
              <p className="text-xs text-stone-600">
                Are you sure you want to delete `Production_Cluster_01`? This operation cannot be undone.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setH05DryRunExecuted(true)}
                  className="px-3 py-1.5 bg-red-800 text-white text-xs font-medium hover:bg-red-900 transition-colors whitespace-nowrap shrink-0"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setH05DryRunExecuted(false)}
                  className="px-3 py-1.5 bg-white border border-stone-400 text-stone-800 text-xs font-medium whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Stops physical slips with a confirmation box, though users often develop habit-blindness and click Confirm automatically.
            </p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                CLI Recall vs. GUI Font Toolbar
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Visible Option Set</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded space-y-3">
              <div className="text-xs text-stone-600">
                Instead of memorizing `groff -ms -Tps`, GUI toolbars made formatting options visibly recognizable:
              </div>
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 border border-stone-300">
                <span className="px-2 py-1 border border-stone-300 text-xs font-serif font-bold">B</span>
                <span className="px-2 py-1 border border-stone-300 text-xs font-serif italic">I</span>
                <span className="px-2 py-1 border border-stone-300 text-xs underline">U</span>
                <span className="px-2 py-1 border border-stone-300 text-xs font-mono-tabular">12pt</span>
                <span className="px-2 py-1 border border-stone-300 text-xs">Align Left</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Visual icons and menus place knowledge in the world so users recognize options by sight.
            </p>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                Static Keyboard Accelerators
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Fixed Hotkey Bindings</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-700">Export Selection as PostScript</span>
                <kbd className="font-mono-tabular text-stone-900 bg-white px-1.5 py-0.5 border border-stone-300">
                  Ctrl+Shift+E
                </kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="text-stone-700">Repeat Last Filter Macro</span>
                <kbd className="font-mono-tabular text-stone-900 bg-white px-1.5 py-0.5 border border-stone-300">
                  F4
                </kbd>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Accelerators speed up physical menu traversal via memorized keystrokes.
            </p>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                Visual Chrome Decluttering (1994)
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Spatial Economy</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded space-y-2">
              <div className="text-xs font-medium text-stone-800">
                Removing 3D Bevels & Redundant Banner Text
              </div>
              <p className="text-xs text-stone-600">
                In static dialogs, minimalism meant stripping away ornamental borders, background textures, and secondary fields that competed with the primary CTA.
              </p>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                Syntactic Form Validation Banner
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Deterministic Exception</span>
            </div>
            <div className="p-4 bg-red-50/70 border border-red-300 rounded space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-900">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Invalid Fiscal Date Format (Error 422)</span>
              </div>
              <p className="text-xs text-red-800">
                The value `2026/14/01` is not a valid ISO-8601 date. Please enter the date as `YYYY-MM-DD` (e.g., `2026-10-25`).
              </p>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Clear, human-readable error message explaining exact syntax rule violated and how to fix it.
            </p>
          </div>
        );

      case 10:
      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-stone-600">
                Indexed F1 Help Manual (1994)
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Static Procedural Tree</span>
            </div>
            <div className="p-4 bg-stone-100 border border-stone-300 rounded space-y-2 text-xs">
              <div className="font-semibold text-stone-800">Manual Topic #402: Configuring Pivot Columns</div>
              <ol className="list-decimal list-inside space-y-1 text-stone-700">
                <li>Select the Data menu from the top bar.</li>
                <li>Choose Pivot Table Report...</li>
                <li>Drag field headers into the Column area box.</li>
              </ol>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              <strong>Classical Mechanism:</strong> Deterministic software has a fixed feature set, so static step-by-step manuals remain 100% accurate.
            </p>
          </div>
        );
    }
  };

  const renderAiNativePanel = () => {
    switch (heuristic.id) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Epistemic Reasoning & Confidence Telemetry (AI Era)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setH01ExpandedTrace(!h01ExpandedTrace)}
                  className="px-2.5 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded transition-colors whitespace-nowrap shrink-0"
                >
                  {h01ExpandedTrace ? 'Collapse Trace' : 'Inspect Reasoning Trace'}
                </button>
                <button
                  type="button"
                  onClick={() => setH01Running(!h01Running)}
                  className="px-2.5 py-1 text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 rounded transition-colors whitespace-nowrap shrink-0"
                >
                  {h01Running ? 'Pause Synthesis' : 'Simulate Step'}
                </button>
              </div>
            </div>

            {h01ExpandedTrace && (
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-900">
                    1. Retrieved 3 peer-reviewed clinical cohorts (2023–2026)
                  </span>
                  <span className="font-mono-tabular text-emerald-800">Verified · 140ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-900">
                    2. Cross-checked hazard ratios against raw table Annex B
                  </span>
                  <span className="font-mono-tabular text-emerald-800">96% Match</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-900">
                    3. Extrapolating subgroup n=18 (Low sample size warning)
                  </span>
                  <span className="font-mono-tabular text-amber-800">
                    Confidence: {params.confidenceThreshold}% (Threshold Guard)
                  </span>
                </div>
              </div>
            )}

            <div className="p-3.5 bg-white border border-stone-200 rounded space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">Synthesized Finding</span>
                <span className="font-mono-tabular text-xs text-stone-600">
                  Epistemic Certainty: {params.confidenceThreshold}% · 3 Citations Grounded
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Post-operative tele-monitoring reduces 30-day cardiac readmission by{' '}
                <span className="underline decoration-emerald-700 decoration-2 font-medium text-stone-900">
                  18.4% (95% CI, p=0.004) [Source: NEJM 2025]
                </span>
                .{' '}
                {params.confidenceThreshold < 80 ? (
                  <span className="bg-amber-100/80 text-amber-950 px-1 py-0.5 rounded">
                    [Low-Confidence Speculation: Rural octogenarian cohort shows 31% variance — unverified]
                  </span>
                ) : (
                  <span className="text-stone-500 italic">
                    [Speculative subgroup claim suppressed by {params.confidenceThreshold}% Confidence Threshold]
                  </span>
                )}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Editable Semantic Intent Mapping (AI Era)
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Zero System Jargon</span>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="ai-intent-input" className="block text-xs font-medium text-stone-700 mb-1">
                  Express Goal in Domain Vernacular:
                </label>
                <input
                  id="ai-intent-input"
                  type="text"
                  value={h02NaturalInput}
                  onChange={(e) => setH02NaturalInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-xs text-stone-900"
                />
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2">
                <div className="text-xs font-medium text-stone-600">
                  Machine-Interpreted Schema (Click any parameter to toggle/verify):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setH02RemovedChip(h02RemovedChip === 'cohort' ? null : 'cohort')}
                    className={`px-2.5 py-1 text-xs font-mono-tabular rounded border transition-colors whitespace-nowrap shrink-0 ${
                      h02RemovedChip === 'cohort'
                        ? 'bg-stone-100 text-stone-400 border-stone-200 line-through'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    Cohort: Post-Op Cardiac {h02RemovedChip === 'cohort' ? '(Excluded)' : '×'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setH02RemovedChip(h02RemovedChip === 'age' ? null : 'age')}
                    className={`px-2.5 py-1 text-xs font-mono-tabular rounded border transition-colors whitespace-nowrap shrink-0 ${
                      h02RemovedChip === 'age'
                        ? 'bg-stone-100 text-stone-400 border-stone-200 line-through'
                        : 'bg-white text-stone-900 border-stone-300 hover:border-stone-500'
                    }`}
                  >
                    Age Bracket: &ge; 65 Years {h02RemovedChip === 'age' ? '(Excluded)' : '×'}
                  </button>
                  <span className="px-2.5 py-1 text-xs font-mono-tabular rounded border bg-white text-stone-900 border-stone-300">
                    Metric: 30-Day Readmission Hazard
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Mid-Flight Steering & Granular Diff Staging
              </span>
              <button
                type="button"
                onClick={() => setH03Paused(!h03Paused)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  h03Paused
                    ? 'bg-amber-800 text-white'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {h03Paused ? 'Resume Agent Run' : 'Pause & Steer Agent'}
              </button>
            </div>

            {h03Paused && (
              <div className="p-3 bg-amber-50/70 border border-amber-300 rounded space-y-2">
                <label htmlFor="steer-constraint-input" className="block text-xs font-semibold text-amber-950">
                  Inject Mid-Flight Course Correction (Without Losing Prior Steps):
                </label>
                <div className="flex gap-2">
                  <input
                    id="steer-constraint-input"
                    type="text"
                    value={h03SteerNote}
                    onChange={(e) => setH03SteerNote(e.target.value)}
                    className="flex-1 px-2.5 py-1 bg-white border border-amber-400 rounded text-xs text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setH03Paused(false)}
                    className="px-3 py-1 bg-amber-900 text-white text-xs font-medium rounded whitespace-nowrap shrink-0"
                  >
                    Apply Steering
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {[
                { id: 'diff1', label: 'Step 1: Normalize patient schema timestamps to UTC' },
                { id: 'diff2', label: 'Step 2: Archive deprecated billing codes (14 rows)' },
                { id: 'diff3', label: `Step 3: Constraint applied — "${h03SteerNote}"` }
              ].map((item) => {
                const state = h03DiffStates[item.id] || 'staged';
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tabular uppercase text-stone-500">[{state}]</span>
                      <span className={state === 'reverted' ? 'line-through text-stone-400' : 'text-stone-900 font-medium'}>
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setH03DiffStates((prev) => ({ ...prev, [item.id]: 'accepted' }))}
                        className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                          state === 'accepted'
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => setH03DiffStates((prev) => ({ ...prev, [item.id]: 'reverted' }))}
                        className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                          state === 'reverted'
                            ? 'bg-red-800 text-white border-red-800'
                            : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        Revert Step
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Invariant Schema Contract vs. Stochastic Drift
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setH04SchemaLock(!h04SchemaLock)}
                  className="px-2.5 py-1 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-900 rounded border border-stone-300 whitespace-nowrap shrink-0"
                >
                  Schema Contract: {h04SchemaLock ? 'LOCKED (Consistent)' : 'UNLOCKED (Unstable)'}
                </button>
                <button
                  type="button"
                  onClick={() => setH04SampleRun((r) => r + 1)}
                  className="px-2.5 py-1 text-xs font-medium bg-stone-900 text-white rounded whitespace-nowrap shrink-0"
                >
                  Re-Run Generation (#{h04SampleRun})
                </button>
              </div>
            </div>

            {h04SchemaLock ? (
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-white border border-stone-200 rounded">
                  <div className="text-stone-500 font-mono-tabular">PRIMARY FINDING</div>
                  <div className="font-semibold text-stone-900 mt-1">Latency -24.2%</div>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded">
                  <div className="text-stone-500 font-mono-tabular">CONFIDENCE INTERVAL</div>
                  <div className="font-semibold text-stone-900 mt-1">94.0% Grounded</div>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded">
                  <div className="text-stone-500 font-mono-tabular">RECOMMENDED ACTION</div>
                  <div className="font-semibold text-stone-900 mt-1">Deploy Canary B</div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50/70 border border-amber-300 rounded text-xs text-amber-950 space-y-1">
                <div className="font-semibold">Unconstrained Free-Form Output (Run #{h04SampleRun}):</div>
                <p>
                  {h04SampleRun % 2 === 0
                    ? 'Hey there! Looking at the metrics, Canary B seems pretty promising with around a quarter less latency, though you might want to test more!'
                    : '• Metric_Delta: -0.242\n• Thoughts: Maybe ship Canary B?\n• Note: Layout structure mutated from prior run.'}
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Pre-Execution Blast-Radius & Hallucination Guardrail
              </span>
              <span className="font-mono-tabular text-xs text-stone-600">
                Mode: {params.strictnessMode.toUpperCase()}
              </span>
            </div>

            <div className="p-3.5 bg-white border border-stone-200 rounded space-y-3 text-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-stone-900">
                    Flagged Claim in Draft: "Dosage limit increased to 450mg in 2025 guideline"
                  </div>
                  <p className="text-stone-600 mt-0.5">
                    Guardrail Alert: Source PDF (`AHA_Guidelines_2025.pdf`, p. 14) specifies <strong>250mg</strong> maximum. Export is locked until discrepancy is resolved.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setH05VerifiedCitation(!h05VerifiedCitation)}
                  className={`px-3 py-1.5 rounded font-medium whitespace-nowrap shrink-0 transition-colors ${
                    h05VerifiedCitation
                      ? 'bg-emerald-800 text-white'
                      : 'bg-amber-800 text-white hover:bg-amber-900'
                  }`}
                >
                  {h05VerifiedCitation ? 'Corrected to 250mg (Verified)' : 'Snap to Grounded 250mg'}
                </button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Contextual Recognition Lenses & Visible Memory Pins
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">
                Active Context: {h06PinnedDocs.length} Sources
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">Visible Working Memory:</span>
                {h06PinnedDocs.map((doc) => (
                  <span
                    key={doc}
                    className="px-2 py-0.5 bg-stone-100 border border-stone-300 rounded font-mono-tabular text-stone-800"
                  >
                    {doc}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'counterarguments', label: 'Surface Counterarguments' },
                  { id: 'quantify', label: 'Extract Statistical Table' },
                  { id: 'simplify', label: 'Translate for Non-Specialists' }
                ].map((lens) => (
                  <button
                    key={lens.id}
                    type="button"
                    onClick={() => setH06ActiveLens(lens.id as typeof h06ActiveLens)}
                    className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 ${
                      h06ActiveLens === lens.id
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {lens.label}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-800">
                {h06ActiveLens === 'counterarguments' && (
                  <span>
                    <strong>Counterargument Lens Active:</strong> Highlighting 2 methodological critiques from Nielsen (1994) regarding heuristic inspection vs. empirical user testing.
                  </span>
                )}
                {h06ActiveLens === 'quantify' && (
                  <span>
                    <strong>Statistical Table Lens Active:</strong> Extracted N=5 evaluator detection curve (75% usability problems identified at 5 evaluators).
                  </span>
                )}
                {h06ActiveLens === 'simplify' && (
                  <span>
                    <strong>Plain-Language Lens Active:</strong> Summarized Gulf of Evaluation & Execution into a 3-sentence executive primer.
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Direct Semantic Parameter Scrubbing (Beyond Chat)
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Zero Prompt Typing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2">
                <span className="font-medium text-stone-700 block">Target Epistemic Register:</span>
                <div className="flex gap-1">
                  {(['executive', 'technical', 'regulatory'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setH07AudienceDepth(level)}
                      className={`flex-1 py-1 px-2 rounded capitalize font-medium transition-colors whitespace-nowrap shrink-0 ${
                        h07AudienceDepth === level
                          ? 'bg-stone-900 text-white'
                          : 'bg-white text-stone-700 border border-stone-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded space-y-2">
                <label htmlFor="density-slider" className="font-medium text-stone-700 flex justify-between">
                  <span>Synthesis Density:</span>
                  <span className="font-mono-tabular">{h07Compression}%</span>
                </label>
                <input
                  id="density-slider"
                  type="range"
                  min={20}
                  max={100}
                  value={h07Compression}
                  onChange={(e) => setH07Compression(Number(e.target.value))}
                  className="w-full accent-stone-900"
                />
              </div>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded text-xs text-stone-800">
              <span className="font-mono-tabular text-stone-500 uppercase mr-2">[{h07AudienceDepth} · {h07Compression}% Density]</span>
              {h07AudienceDepth === 'executive' &&
                'Bottom Line: Adopt staged diff previews to cut agent rollback incidents by 64%.'}
              {h07AudienceDepth === 'technical' &&
                'Architecture: Enforce JSON Schema output contracts with optimistic AST state checkpoints and <150ms rollback.'}
              {h07AudienceDepth === 'regulatory' &&
                'Compliance: EU AI Act Art. 14 Human Oversight satisfied via mandatory pre-commit verification gates.'}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Anti-Slop Compression & Progressive Disclosure
              </span>
              <button
                type="button"
                onClick={() => setH08SignalOnly(!h08SignalOnly)}
                className="px-2.5 py-1 text-xs font-medium bg-stone-900 text-white rounded whitespace-nowrap shrink-0"
              >
                {h08SignalOnly ? 'Mode: High-Signal Distilled (18 words)' : 'Mode: Raw Verbose LLM Stream (94 words)'}
              </button>
            </div>

            {h08SignalOnly ? (
              <div className="p-3.5 bg-white border border-stone-200 rounded space-y-2 text-xs">
                <div className="font-semibold text-stone-900">
                  Core Decision: Migrate authentication session tokens to HttpOnly SameSite=Strict cookies before Q4 audit.
                </div>
                <button
                  type="button"
                  onClick={() => setH08ShowEvidence(!h08ShowEvidence)}
                  className="text-amber-900 font-medium underline"
                >
                  {h08ShowEvidence ? 'Hide Supporting Evidence (2 Citations)' : 'Inspect Supporting Evidence (2 Citations)'}
                </button>
                {h08ShowEvidence && (
                  <div className="pt-2 border-t border-stone-200 text-stone-600 font-mono-tabular">
                    • OWASP Session Management Cheat Sheet §3.2 · Mitigates XSS token exfiltration.
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-amber-50/60 border border-amber-300 rounded text-xs text-stone-700 leading-relaxed">
                "Certainly! Great question! In today's rapidly evolving cybersecurity landscape, ensuring robust session management is more important than ever. When we delve into the nuances of authentication tokens, there are many factors to consider. Ultimately, migrating your tokens to HttpOnly cookies is a wonderful best practice..."
              </div>
            )}
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Span-Level Fault Attribution & Scoped Repair
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Zero Scorched-Earth Reset</span>
            </div>

            <div className="p-3.5 bg-white border border-stone-200 rounded space-y-3 text-xs">
              <p className="text-stone-800 leading-relaxed">
                <span>Section 1 (Verified): Q3 European revenue grew 14.2% YoY to €42.8M. </span>
                {!h09SpanRepaired ? (
                  <span className="bg-red-100 text-red-950 px-1.5 py-0.5 rounded border border-red-300 font-medium">
                    [Fault Detected: North American margin cited as 41.0% — conflicts with uploaded CSV row 18 (31.0%)]
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-950 px-1.5 py-0.5 rounded border border-emerald-300 font-medium">
                    [Repaired Span: North American operating margin verified at 31.0% per CSV row 18.]
                  </span>
                )}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="text-stone-500">
                  Diagnosis: Stale cache context overridden by `Q3_Actuals.csv`
                </span>
                <button
                  type="button"
                  onClick={() => setH09SpanRepaired(!h09SpanRepaired)}
                  className="px-3 py-1 bg-stone-900 text-white rounded font-medium hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
                >
                  {h09SpanRepaired ? 'Reset Fault Simulation' : 'Repair Faulty Span Only'}
                </button>
              </div>
            </div>
          </div>
        );

      case 10:
      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-mono-tabular text-xs font-medium text-amber-900">
                Explicit Capability Boundaries & In-Situ Exemplars
              </span>
              <span className="font-mono-tabular text-xs text-stone-500">Honest Model Scope</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded">
                <div className="font-semibold text-emerald-950">Verified Capabilities</div>
                <ul className="mt-1 space-y-1 text-emerald-900">
                  <li>• Synthesize uploaded PDFs up to 200 pages</li>
                  <li>• Deterministic Python sandbox math verification</li>
                </ul>
              </div>
              <div className="p-3 bg-stone-100 border border-stone-300 rounded">
                <div className="font-semibold text-stone-900">Explicit Non-Capabilities</div>
                <ul className="mt-1 space-y-1 text-stone-700">
                  <li>• No live access to unindexed private ERP tables</li>
                  <li>• Does not execute external wire transfers</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded text-xs">
              <span className="text-stone-700 font-medium">
                Test Live Boundary Exemplar:
              </span>
              <div className="flex gap-1.5">
                {(['clinical', 'financial', 'code'] as const).map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setH10ActiveExemplar(ex)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors whitespace-nowrap shrink-0 ${
                      h10ActiveExemplar === ex
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {ex} Sample
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Side-by-Side or Single Era Comparison */}
      <div
        className={`grid gap-6 ${
          eraMode === 'comparative' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {showClassical && (
          <div className="p-5 bg-[#F6F3EC] border border-stone-300 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-3">
                <span className="font-mono-tabular uppercase tracking-wider font-semibold text-stone-700">
                  1994 Classical WIMP Paradigm
                </span>
                <span className="whitespace-nowrap shrink-0">Deterministic State</span>
              </div>
              {renderClassicalPanel()}
            </div>
          </div>
        )}

        {showAiNative && (
          <div className="p-5 bg-white border border-stone-300 rounded-lg shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-3">
                <span className="font-mono-tabular uppercase tracking-wider font-semibold text-amber-900">
                  2026 AI-Native Agentic Paradigm
                </span>
                <span className="whitespace-nowrap shrink-0">Probabilistic &amp; Steerable</span>
              </div>
              {renderAiNativePanel()}
            </div>
          </div>
        )}
      </div>

      {/* Live Parameter Control Deck */}
      <div className="p-5 bg-[#F5F2EB] border border-stone-300 rounded-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h4 className="text-sm font-semibold text-stone-900">
              Interactive Equilibrium Parameters ({heuristic.code})
            </h4>
            <p className="text-xs text-stone-600">
              Adjust agent autonomy, epistemic confidence threshold, and guardrail strictness to observe Gulf of Evaluation & Execution shifts.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateParams({
                autonomyLevel: heuristic.keyTension.optimalEquilibrium,
                confidenceThreshold: 85,
                contextWindowDepth: 5,
                strictnessMode: 'strict'
              })
            }
            className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-500 text-xs font-medium text-stone-900 rounded transition-colors whitespace-nowrap shrink-0"
          >
            Snap to Optimal Equilibrium ({heuristic.keyTension.optimalEquilibrium}%)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Slider 1: Autonomy Level */}
          <div className="space-y-1.5">
            <label
              htmlFor="sim-autonomy-slider"
              className="flex items-center justify-between text-xs font-medium text-stone-800"
            >
              <span>Agent Autonomy Spectrum</span>
              <span className="font-mono-tabular font-semibold text-stone-900">
                {params.autonomyLevel}% (Optimal: {heuristic.keyTension.optimalEquilibrium}%)
              </span>
            </label>
            <input
              id="sim-autonomy-slider"
              type="range"
              min={0}
              max={100}
              value={params.autonomyLevel}
              onChange={(e) => onUpdateParams({ autonomyLevel: Number(e.target.value) })}
              className="w-full accent-amber-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>{heuristic.keyTension.axisLeft}</span>
              <span>{heuristic.keyTension.axisRight}</span>
            </div>
          </div>

          {/* Slider 2: Confidence Gate */}
          <div className="space-y-1.5">
            <label
              htmlFor="sim-confidence-slider"
              className="flex items-center justify-between text-xs font-medium text-stone-800"
            >
              <span>Epistemic Confidence Gate</span>
              <span className="font-mono-tabular font-semibold text-stone-900">
                {params.confidenceThreshold}% Min
              </span>
            </label>
            <input
              id="sim-confidence-slider"
              type="range"
              min={50}
              max={99}
              value={params.confidenceThreshold}
              onChange={(e) => onUpdateParams({ confidenceThreshold: Number(e.target.value) })}
              className="w-full accent-amber-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>50% (Speculative)</span>
              <span>99% (Strict Grounding)</span>
            </div>
          </div>

          {/* Segmented Control 3: Guardrail Strictness */}
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-stone-800">
              Pre-Flight Forcing Function Strictness
            </span>
            <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-md">
              {(['permissive', 'balanced', 'strict'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onUpdateParams({ strictnessMode: mode })}
                  className={`flex-1 py-1 px-2 text-xs font-medium capitalize rounded transition-colors whitespace-nowrap shrink-0 ${
                    params.strictnessMode === mode
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-stone-500">
              Controls inline citation locks & destructive blast-radius previews.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
