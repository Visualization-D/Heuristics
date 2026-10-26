import React, { useState, useMemo } from 'react';
import { HEURISTICS_DATA } from '../data/heuristicsData';
import { AuditReport } from '../utils/heuristicEngine';
import { buildReadingMonograph, MonographChapter } from '../utils/monographBuilder';
import { downloadMonographPdf } from '../utils/pdfExporter';
import {
  FileDown,
  Printer,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Layers
} from 'lucide-react';

interface ReadingMonographSectionProps {
  auditReport: AuditReport;
}

export const ReadingMonographSection: React.FC<ReadingMonographSectionProps> = ({
  auditReport
}) => {
  const [includeAuditAppendix, setIncludeAuditAppendix] = useState<boolean>(true);
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<'all' | string>('all');
  const [lastExportResult, setLastExportResult] = useState<{
    filename: string;
    pageCount: number;
    timestamp: string;
  } | null>(null);

  const monograph = useMemo(
    () => buildReadingMonograph(HEURISTICS_DATA, auditReport),
    [auditReport]
  );

  const visibleChapters = useMemo(() => {
    if (selectedChapterFilter === 'all') return monograph.chapters;
    return monograph.chapters.filter((ch) => ch.code === selectedChapterFilter);
  }, [monograph.chapters, selectedChapterFilter]);

  const handleDownloadPdf = () => {
    const result = downloadMonographPdf(monograph, { includeAuditAppendix });
    setLastExportResult({
      filename: result.filename,
      pageCount: result.pageCount,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  };

  const handlePrintReader = () => {
    window.print();
  };

  return (
    <section
      id="reading-monograph"
      aria-labelledby="monograph-reader-heading"
      className="py-16 border-t border-stone-300 bg-[#FBF9F5]"
    >
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Section Header & Primary PDF Export Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-stone-300">
          <div>
            <div className="text-xs font-mono-tabular uppercase tracking-widest text-amber-900 font-semibold">
              05 · Curatorial Reading Compendium &amp; PDF Edition
            </div>
            <h2
              id="monograph-reader-heading"
              className="text-2xl sm:text-3xl font-serif-display font-semibold text-stone-900 mt-1 text-balance"
            >
              Complete Reading Monograph &amp; Printable Syllabus (PDF)
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
              All 10 Nielsen/Norman Usability Heuristics, cognitive gulf analyses, equilibrium tensions, AI-era failure modes, and diagnostic rubrics reorganized into a cohesive, multi-page academic reference reader.
            </p>
          </div>

          {/* Export Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <label className="inline-flex items-center gap-2 text-xs text-stone-700 bg-white px-3 py-2 border border-stone-300 rounded-md cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAuditAppendix}
                onChange={(e) => setIncludeAuditAppendix(e.target.checked)}
                className="accent-stone-900 rounded"
              />
              <span>Include Session Audit Appendix ({auditReport.percentage}%)</span>
            </label>

            <button
              type="button"
              onClick={handlePrintReader}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-md hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Reader View</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-stone-900 rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Typeset PDF Monograph</span>
            </button>
          </div>
        </div>

        {/* Confirmation Banner when PDF is Generated */}
        {lastExportResult && (
          <div
            data-testid="pdf-export-confirmation"
            className="mt-6 p-4 bg-emerald-50/80 border border-emerald-300 rounded-lg flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-950"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <div>
                <span className="font-semibold">
                  Typeset PDF Compiled &amp; Downloaded:
                </span>{' '}
                <span className="font-mono-tabular font-medium">
                  {lastExportResult.filename}
                </span>{' '}
                <span>
                  ({lastExportResult.pageCount} A4 pages · includes Part I Synthesis, 10 Heuristic Chapters{includeAuditAppendix ? ', and Session Audit Appendix' : ''})
                </span>
              </div>
            </div>
            <span className="font-mono-tabular text-emerald-800">
              Compiled at {lastExportResult.timestamp}
            </span>
          </div>
        )}

        {/* Two-Column Asymmetric Reader Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Left 3 Columns: Monograph Syllabus Index & Quick Chapter Filter */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20 bg-white border border-stone-300 rounded-lg p-5 space-y-5">
            <div className="border-b border-stone-200 pb-3">
              <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                Document Architecture
              </div>
              <h3 className="text-sm font-serif-display font-semibold text-stone-900 mt-0.5">
                Monograph Table of Contents
              </h3>
            </div>

            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedChapterFilter('all')}
                className={`w-full text-left px-2.5 py-2 rounded font-medium transition-colors flex items-center justify-between ${
                  selectedChapterFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Complete Compendium (All 10)</span>
                <span className="font-mono-tabular text-[11px] opacity-80">Ch. 01–10</span>
              </button>

              <div className="pt-2 pb-1 px-2.5 text-[11px] font-mono-tabular uppercase tracking-wider text-stone-400">
                Individual Heuristic Chapters
              </div>

              {monograph.chapters.map((ch) => {
                const isSelected = selectedChapterFilter === ch.code;
                return (
                  <button
                    key={ch.code}
                    type="button"
                    onClick={() => setSelectedChapterFilter(ch.code)}
                    className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-900 text-white font-medium'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-mono-tabular mr-1.5">{ch.code}</span>
                      {ch.classicalTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="font-mono-tabular text-[11px] uppercase text-stone-500">
                PDF Specification
              </div>
              <div className="flex justify-between">
                <span>Page Format:</span>
                <span className="font-mono-tabular text-stone-900">ISO A4 Portrait</span>
              </div>
              <div className="flex justify-between">
                <span>Chapters Included:</span>
                <span className="font-mono-tabular text-stone-900">10 Heuristics + Synthesis</span>
              </div>
              <div className="flex justify-between">
                <span>Diagnostic Rubrics:</span>
                <span className="font-mono-tabular text-stone-900">20 Empirical Checks</span>
              </div>
            </div>
          </aside>

          {/* Right 9 Columns: Typeset Monograph Sheet Preview */}
          <div className="lg:col-span-9 space-y-8">
            {/* Folio Sheet 1: Executive Synthesis & Theoretical Framework */}
            {selectedChapterFilter === 'all' && (
              <article className="bg-white border border-stone-300 rounded-lg p-8 sm:p-10 shadow-xs space-y-6">
                <div className="border-b border-stone-300 pb-6 space-y-2">
                  <div className="text-xs font-mono-tabular uppercase tracking-widest text-amber-900 font-semibold">
                    {monograph.editionMetadata}
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-serif-display font-semibold text-stone-900 tracking-tight">
                    {monograph.title}
                  </h3>
                  <p className="text-sm font-serif-display italic text-stone-600 max-w-2xl">
                    {monograph.subtitle}
                  </p>
                </div>

                <div className="space-y-4 max-w-prose">
                  <h4 className="text-lg font-serif-display font-semibold text-stone-900">
                    {monograph.executiveSynthesis.heading}
                  </h4>
                  {monograph.executiveSynthesis.paragraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-stone-800 leading-relaxed"
                    >
                      {p}
                    </p>
                  ))}
                </div>

                {/* Structural Comparison Table in Reader */}
                <div className="pt-2">
                  <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500 mb-3">
                    Table 1.1 — Structural Shift Across Norman’s Action Cycle (1994 vs. 2026)
                  </div>
                  <div className="overflow-x-auto border border-stone-300 rounded">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FBF9F5] border-b border-stone-300 font-mono-tabular text-[11px] uppercase text-stone-600">
                          <th className="py-2.5 px-3.5">Architectural Dimension</th>
                          <th className="py-2.5 px-3.5">1994 Classical WIMP Paradigm</th>
                          <th className="py-2.5 px-3.5">2026 AI-Native Agentic Paradigm</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {monograph.executiveSynthesis.gulfComparisonTable.map((row) => (
                          <tr key={row.dimension}>
                            <td className="py-2.5 px-3.5 font-semibold text-stone-900">
                              {row.dimension}
                            </td>
                            <td className="py-2.5 px-3.5 text-stone-600">
                              {row.classical1994}
                            </td>
                            <td className="py-2.5 px-3.5 text-amber-950 font-medium">
                              {row.aiNative2026}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            )}

            {/* Folio Chapters: Detailed Breakdown for Each Heuristic */}
            <div className="space-y-6">
              {visibleChapters.map((ch: MonographChapter) => (
                <article
                  key={ch.code}
                  data-testid={`monograph-chapter-${ch.code}`}
                  className="bg-white border border-stone-300 rounded-lg p-8 sm:p-10 shadow-xs space-y-6"
                >
                  {/* Chapter Top Metadata Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tabular font-bold text-amber-900">
                        CHAPTER {ch.chapterNumber} · {ch.code}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{ch.accessionNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{ch.categoryLabel}</span>
                    </div>
                    <span className="font-mono-tabular text-stone-700 font-medium">
                      Primary Gulf: {ch.gulfShiftSummary.gulfType}
                    </span>
                  </div>

                  {/* Dual Era Headings */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-stone-500">
                      1994 Canonical Principle: {ch.classicalTitle}
                    </div>
                    <h4 className="text-xl sm:text-2xl font-serif-display font-semibold text-stone-900">
                      2026 AI Transformation: {ch.aiEraTitle}
                    </h4>
                  </div>

                  {/* Prose Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded space-y-2">
                      <div className="text-xs font-mono-tabular uppercase text-stone-500 font-semibold">
                        1994 Classical Formulation &amp; Foundation
                      </div>
                      <p className="text-xs text-stone-800 leading-relaxed italic">
                        "{ch.classicalPrinciple}"
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed pt-1 border-t border-stone-200">
                        <strong>Norman Concept:</strong> {ch.normanFoundation}
                      </p>
                    </div>

                    <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded space-y-2">
                      <div className="text-xs font-mono-tabular uppercase text-amber-900 font-semibold">
                        Age of AI Re-Architecture Thesis
                      </div>
                      <p className="text-xs text-stone-800 leading-relaxed">
                        {ch.aiTransformationThesis}
                      </p>
                    </div>
                  </div>

                  {/* Mechanism Shift & Failure Mode Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-2">
                      <div className="font-mono-tabular uppercase text-stone-500 font-semibold">
                        Interaction Mechanism Shift
                      </div>
                      <dl className="space-y-2">
                        <div>
                          <dt className="font-medium text-stone-600">1994 WIMP Mechanism:</dt>
                          <dd className="text-stone-900 mt-0.5">{ch.gulfShiftSummary.classicalMechanism}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-amber-900">2026 AI-Native Mechanism:</dt>
                          <dd className="text-stone-900 font-medium mt-0.5">{ch.gulfShiftSummary.aiMechanism}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="space-y-2">
                      <div className="font-mono-tabular uppercase text-red-900 font-semibold">
                        AI-Era Failure Mode &amp; Remediation
                      </div>
                      <div className="space-y-1.5">
                        <div className="font-semibold text-stone-900">
                          Pathology: {ch.failureMode.name}
                        </div>
                        <p className="text-stone-600 leading-relaxed">
                          <strong>Symptom:</strong> {ch.failureMode.symptom}
                        </p>
                        <p className="text-stone-800 leading-relaxed">
                          <strong>Remediation:</strong> {ch.failureMode.remediation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Rubric & Telemetry Bar */}
                  <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-800">Equilibrium Guidance:</span>{' '}
                      {ch.equilibriumTension.guidance} ({ch.equilibriumTension.optimalTarget})
                    </div>
                    <div className="font-mono-tabular shrink-0 text-stone-800">
                      {ch.telemetryComparison.aiNative}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
