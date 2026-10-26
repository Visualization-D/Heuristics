import { jsPDF } from 'jspdf';
import { ReadingMonographDocument } from './monographBuilder';

export interface PdfGenerationOptions {
  includeAuditAppendix: boolean;
}

/**
 * Generates a multi-page, typeset PDF monograph using jsPDF and triggers a direct browser download.
 * Also returns the generated page count and filename for verification telemetry.
 */
export function downloadMonographPdf(
  docData: ReadingMonographDocument,
  options: PdfGenerationOptions = { includeAuditAppendix: true }
): { filename: string; pageCount: number } {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = pdf.internal.pageSize.getHeight(); // 841.89 pt
  const marginX = 48;
  const contentWidth = pageWidth - marginX * 2;
  let cursorY = 56;

  const drawPageBackground = () => {
    pdf.setFillColor(251, 249, 245); // Archival warm paper #FBF9F5
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  const ensureSpace = (neededPt: number) => {
    if (cursorY + neededPt > pageHeight - 54) {
      pdf.addPage();
      drawPageBackground();
      cursorY = 52;
      // Running header on continuation pages
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(120, 113, 108);
      pdf.text('HEURISTICS RENEWED: 1994 TO THE AGE OF AI  ·  CURATORIAL READING COMPENDIUM', marginX, 34);
      pdf.setDrawColor(214, 211, 209);
      pdf.setLineWidth(0.5);
      pdf.line(marginX, 40, pageWidth - marginX, 40);
      cursorY = 56;
    }
  };

  const writeWrappedText = (
    text: string,
    fontSize: number,
    fontStyle: 'normal' | 'bold' | 'italic',
    fontFamily: 'times' | 'helvetica' | 'courier',
    color: [number, number, number],
    lineHeightMultiplier = 1.38,
    indentX = 0,
    maxWidth = contentWidth - indentX
  ) => {
    pdf.setFont(fontFamily, fontStyle);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines: string[] = pdf.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * lineHeightMultiplier;
    for (const line of lines) {
      ensureSpace(lineHeight + 2);
      pdf.text(line, marginX + indentX, cursorY);
      cursorY += lineHeight;
    }
  };

  // =========================================================================
  // PAGE 1: COVER & PART I — THEORETICAL FOUNDATIONS
  // =========================================================================
  drawPageBackground();

  // Top Monograph Kicker
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(154, 52, 18); // Terracotta #9A3412
  pdf.text(docData.editionMetadata.toUpperCase(), marginX, cursorY);
  cursorY += 22;

  // Main Title
  writeWrappedText(docData.title, 24, 'bold', 'times', [28, 25, 23], 1.18);
  cursorY += 4;

  // Subtitle
  writeWrappedText(docData.subtitle, 11, 'italic', 'times', [87, 83, 78], 1.35);
  cursorY += 8;

  // Canonical Reference Line
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(100, 95, 90);
  pdf.text(`Canonical Source: ${docData.citationUrl}`, marginX, cursorY);
  cursorY += 14;

  // Hairline Divider
  pdf.setDrawColor(168, 162, 158);
  pdf.setLineWidth(0.8);
  pdf.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 20;

  // Part I Heading
  writeWrappedText(docData.executiveSynthesis.heading, 13, 'bold', 'times', [28, 25, 23], 1.3);
  cursorY += 6;

  for (const para of docData.executiveSynthesis.paragraphs) {
    writeWrappedText(para, 10, 'normal', 'times', [41, 37, 36], 1.45);
    cursorY += 8;
  }

  cursorY += 6;
  ensureSpace(140);

  // Structural Shift Table Box
  pdf.setFillColor(245, 242, 235);
  pdf.setDrawColor(214, 211, 209);
  pdf.rect(marginX, cursorY, contentWidth, 22, 'FD');
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(28, 25, 23);
  pdf.text('DIMENSION', marginX + 8, cursorY + 14);
  pdf.text('1994 CLASSICAL WIMP PARADIGM', marginX + 145, cursorY + 14);
  pdf.text('2026 AI-NATIVE PARADIGM', marginX + 320, cursorY + 14);
  cursorY += 22;

  for (const row of docData.executiveSynthesis.gulfComparisonTable) {
    ensureSpace(34);
    pdf.setDrawColor(231, 229, 228);
    pdf.rect(marginX, cursorY, contentWidth, 30, 'S');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(28, 25, 23);
    const dimLines = pdf.splitTextToSize(row.dimension, 130);
    pdf.text(dimLines, marginX + 8, cursorY + 12);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(87, 83, 78);
    const cLines = pdf.splitTextToSize(row.classical1994, 165);
    pdf.text(cLines, marginX + 145, cursorY + 12);

    pdf.setTextColor(154, 52, 18);
    const aiLines = pdf.splitTextToSize(row.aiNative2026, 170);
    pdf.text(aiLines, marginX + 320, cursorY + 12);

    cursorY += 30;
  }

  cursorY += 20;

  // Table of Contents Summary on Page 1
  ensureSpace(160);
  writeWrappedText('Part II — Complete 10-Heuristic Concordance Index', 12, 'bold', 'times', [28, 25, 23], 1.3);
  cursorY += 4;

  for (const ch of docData.chapters) {
    ensureSpace(16);
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(154, 52, 18);
    pdf.text(`${ch.code}`, marginX, cursorY);

    pdf.setFont('times', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(28, 25, 23);
    pdf.text(`${ch.classicalTitle}`, marginX + 30, cursorY);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(87, 83, 78);
    pdf.text(`->  ${ch.aiEraTitle}`, marginX + 215, cursorY);
    cursorY += 14;
  }

  // =========================================================================
  // PART II: DETAILED MONOGRAPH CHAPTERS (H01 - H10)
  // =========================================================================
  for (const ch of docData.chapters) {
    // Start a fresh section block with ample room
    ensureSpace(235);
    cursorY += 10;

    // Chapter Top Rule
    pdf.setDrawColor(120, 113, 108);
    pdf.setLineWidth(0.9);
    pdf.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 14;

    // Accession Header
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(154, 52, 18);
    pdf.text(
      `CHAPTER ${ch.chapterNumber}  ·  ${ch.code} (${ch.accessionNumber})  ·  ${ch.categoryLabel.toUpperCase()}  ·  ${ch.gulfShiftSummary.gulfType.toUpperCase()}`,
      marginX,
      cursorY
    );
    cursorY += 15;

    // Classical 1994 Title
    writeWrappedText(
      `1994 Classical Heuristic: ${ch.classicalTitle}`,
      11,
      'bold',
      'helvetica',
      [87, 83, 78],
      1.25
    );
    cursorY += 2;

    // 2026 AI-Era Title
    writeWrappedText(
      `2026 AI-Era Transformation: ${ch.aiEraTitle}`,
      15,
      'bold',
      'times',
      [28, 25, 23],
      1.25
    );
    cursorY += 6;

    // Norman Cognitive Foundation
    writeWrappedText(
      `Norman Cognitive Foundation: ${ch.normanFoundation}`,
      9.5,
      'italic',
      'times',
      [68, 64, 60],
      1.35
    );
    cursorY += 4;

    // 1994 Principle
    writeWrappedText(
      `1994 Canonical Formulation: "${ch.classicalPrinciple}"`,
      9.5,
      'normal',
      'times',
      [68, 64, 60],
      1.38
    );
    cursorY += 4;

    // 2026 Transformation Thesis
    writeWrappedText(
      `Age of AI Thesis: ${ch.aiTransformationThesis}`,
      10,
      'normal',
      'times',
      [28, 25, 23],
      1.42
    );
    cursorY += 6;

    // Comparative Mechanisms Callout
    writeWrappedText(
      `• 1994 Mechanism: ${ch.gulfShiftSummary.classicalMechanism}`,
      9,
      'normal',
      'helvetica',
      [87, 83, 78],
      1.35,
      8
    );
    writeWrappedText(
      `• 2026 AI Mechanism: ${ch.gulfShiftSummary.aiMechanism}`,
      9,
      'bold',
      'helvetica',
      [28, 25, 23],
      1.35,
      8
    );
    cursorY += 4;

    // Failure Mode & Remediation
    writeWrappedText(
      `AI-Era Failure Risk (${ch.failureMode.name}): ${ch.failureMode.symptom}`,
      9,
      'normal',
      'helvetica',
      [153, 27, 27],
      1.35,
      8
    );
    writeWrappedText(
      `Architectural Remediation: ${ch.failureMode.remediation}`,
      9,
      'normal',
      'helvetica',
      [20, 83, 45],
      1.35,
      8
    );
    cursorY += 4;

    // Telemetry & Equilibrium
    writeWrappedText(
      `Telemetry Shift: [1994] ${ch.telemetryComparison.classical}   |   [2026] ${ch.telemetryComparison.aiNative}   |   ${ch.equilibriumTension.optimalTarget}`,
      8.5,
      'normal',
      'courier',
      [87, 83, 78],
      1.35,
      8
    );
    cursorY += 4;

    // Diagnostic Rubric Questions
    for (const rubric of ch.auditRubric) {
      writeWrappedText(
        `[Audit Check] ${rubric.criterion}: ${rubric.diagnosticQuestion}`,
        8.5,
        'italic',
        'times',
        [87, 83, 78],
        1.32,
        8
      );
    }

    cursorY += 8;
  }

  // =========================================================================
  // PART III: OPTIONAL LIVE AUDIT SCORECARD APPENDIX
  // =========================================================================
  if (options.includeAuditAppendix && docData.auditSummary) {
    ensureSpace(160);
    cursorY += 12;
    pdf.setDrawColor(28, 25, 23);
    pdf.setLineWidth(1.2);
    pdf.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 18;

    writeWrappedText(
      'Appendix — Current Session AI-Native Readiness Scorecard',
      14,
      'bold',
      'times',
      [28, 25, 23],
      1.3
    );
    cursorY += 4;

    writeWrappedText(
      `Composite Score: ${docData.auditSummary.percentage}% (${docData.auditSummary.totalScore} / ${docData.auditSummary.maxPossibleScore} pts)  ·  Classification: ${docData.auditSummary.maturityTier}`,
      10.5,
      'bold',
      'courier',
      [154, 52, 18],
      1.4
    );
    cursorY += 6;

    if (docData.auditSummary.topVulnerabilities.length > 0) {
      writeWrappedText(
        'Priority Failure-Mode Remediations Flagged in Session:',
        10,
        'bold',
        'helvetica',
        [28, 25, 23],
        1.35
      );
      for (const vuln of docData.auditSummary.topVulnerabilities) {
        writeWrappedText(
          `• ${vuln.heuristicCode} (${vuln.failureModeName}): ${vuln.remediation}`,
          9,
          'normal',
          'times',
          [68, 64, 60],
          1.38,
          10
        );
      }
    }
  }

  // Add page numbers to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(120, 113, 108);
    pdf.text(
      `Page ${p} of ${totalPages}  ·  Nielsen Norman Group (NN/g) & Don Norman HCI Monograph`,
      marginX,
      pageHeight - 28
    );
  }

  const filename = 'Heuristics_Renewed_1994_to_AI_Monograph.pdf';
  pdf.save(filename);

  return {
    filename,
    pageCount: totalPages
  };
}
