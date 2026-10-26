import { HEURISTICS_DATA, HeuristicDefinition } from '../data/heuristicsData';
import { AuditReport } from './heuristicEngine';

export interface MonographChapter {
  chapterNumber: string;
  code: string;
  accessionNumber: string;
  classicalTitle: string;
  aiEraTitle: string;
  categoryLabel: string;
  yearIntroduced: number;
  nngUrl: string;
  normanFoundation: string;
  classicalPrinciple: string;
  aiTransformationThesis: string;
  gulfShiftSummary: {
    gulfType: string;
    classicalMechanism: string;
    aiMechanism: string;
  };
  equilibriumTension: {
    axisRange: string;
    optimalTarget: string;
    guidance: string;
  };
  failureMode: {
    name: string;
    symptom: string;
    remediation: string;
  };
  telemetryComparison: {
    classical: string;
    aiNative: string;
  };
  auditRubric: {
    id: string;
    criterion: string;
    diagnosticQuestion: string;
  }[];
}

export interface ReadingMonographDocument {
  title: string;
  subtitle: string;
  editionMetadata: string;
  citationUrl: string;
  executiveSynthesis: {
    heading: string;
    paragraphs: string[];
    gulfComparisonTable: {
      dimension: string;
      classical1994: string;
      aiNative2026: string;
    }[];
  };
  chapters: MonographChapter[];
  auditSummary?: {
    percentage: number;
    maturityTier: string;
    totalScore: number;
    maxPossibleScore: number;
    topVulnerabilities: {
      heuristicCode: string;
      failureModeName: string;
      remediation: string;
    }[];
  };
}

/**
 * Organizes all 10 heuristics, Norman Gulf foundations, failure modes, and optional live audit scores
 * into a structured curatorial reading monograph ready for PDF compilation and Reader preview.
 */
export function buildReadingMonograph(
  heuristics: HeuristicDefinition[] = HEURISTICS_DATA,
  auditReport?: AuditReport
): ReadingMonographDocument {
  const chapters: MonographChapter[] = heuristics.map((h, index) => ({
    chapterNumber: String(index + 1).padStart(2, '0'),
    code: h.code,
    accessionNumber: h.accessionNumber,
    classicalTitle: h.classicalTitle,
    aiEraTitle: h.aiEraTitle,
    categoryLabel: h.categoryLabel,
    yearIntroduced: h.yearIntroduced,
    nngUrl: h.nngUrl,
    normanFoundation: h.normanConcept,
    classicalPrinciple: h.classicalPrinciple,
    aiTransformationThesis: h.aiTransformationThesis,
    gulfShiftSummary: {
      gulfType: h.gulfShift.gulfType,
      classicalMechanism: h.gulfShift.classicalMechanism,
      aiMechanism: h.gulfShift.aiMechanism
    },
    equilibriumTension: {
      axisRange: `${h.keyTension.axisLeft}  <-->  ${h.keyTension.axisRight}`,
      optimalTarget: `${h.keyTension.optimalEquilibrium}% Autonomy / Calibration Equilibrium`,
      guidance: h.keyTension.description
    },
    failureMode: {
      name: h.failureMode.name,
      symptom: h.failureMode.symptom,
      remediation: h.failureMode.remediation
    },
    telemetryComparison: {
      classical: `${h.metrics.classicalMetricName}: ${h.metrics.classicalBaseline}`,
      aiNative: `${h.metrics.aiMetricName}: ${h.metrics.aiTarget}`
    },
    auditRubric: h.checklistItems.map((item) => ({
      id: item.id,
      criterion: item.criterion,
      diagnosticQuestion: item.diagnosticQuestion
    }))
  }));

  return {
    title: 'Heuristics Renewed: 1994 to the Age of AI',
    subtitle:
      'A Curatorial Monograph & Reference Reader on Jakob Nielsen’s 10 Usability Heuristics and Don Norman’s Action Cycle in Probabilistic, Agentic Systems',
    editionMetadata: 'HCI Monograph Series · Reference Compendium · 10 Canonical Principles & 20 Diagnostic Rubrics',
    citationUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    executiveSynthesis: {
      heading: 'Part I — Theoretical Foundations: From Deterministic WIMP to Probabilistic Agency',
      paragraphs: [
        'For over three decades, Jakob Nielsen’s 10 Usability Heuristics (1994) and Don Norman’s Action Cycle—bridging the Gulf of Execution and the Gulf of Evaluation (1988)—have served as the bedrock of Human-Computer Interaction. In classical Windows, Icons, Menus, and Pointer (WIMP) interfaces, software behaved as a deterministic state machine: a user formulated a goal, executed a discrete syntactic command, and observed an immediate, binary state transition.',
        'Generative and agentic AI systems fundamentally alter both sides of Norman’s cycle. Across the Gulf of Execution, users shift from clicking rigid menu hierarchies to expressing high-level semantic intent and supervising multi-step autonomous trajectories. Across the Gulf of Evaluation, a progress bar no longer suffices; because stochastic models can hallucinate with high linguistic fluency, the interface must expose epistemic provenance, reasoning traces, and calibrated confidence intervals.',
        'This reading compendium reorganizes all ten heuristics into a structured curriculum: pairing each 1994 canonical formulation with its 2026 AI-native transformation, cognitive gulf analysis, equilibrium tension, primary failure mode, and empirical audit checklist.'
      ],
      gulfComparisonTable: [
        {
          dimension: 'Primary Interaction Unit',
          classical1994: 'Discrete syntactic click or command keystroke',
          aiNative2026: 'Semantic intent formulation & mid-flight trajectory steering'
        },
        {
          dimension: 'System State Nature',
          classical1994: '100% deterministic binary state or byte progress',
          aiNative2026: 'Probabilistic distribution requiring provenance & confidence bounds'
        },
        {
          dimension: 'Dominant Error Class',
          classical1994: 'Physical attentional slips & syntactic format violations',
          aiNative2026: 'Automation bias, epistemic hallucination & scope drift'
        },
        {
          dimension: 'Minimalism Imperative',
          classical1994: 'Visual pixel economy & removal of ornamental chrome',
          aiNative2026: 'Signal-to-noise compression & progressive disclosure of LLM prose'
        }
      ]
    },
    chapters,
    auditSummary: auditReport
      ? {
          percentage: auditReport.percentage,
          maturityTier: auditReport.maturityTier,
          totalScore: auditReport.totalScore,
          maxPossibleScore: auditReport.maxPossibleScore,
          topVulnerabilities: auditReport.topVulnerabilities.map((v) => ({
            heuristicCode: v.heuristicCode,
            failureModeName: v.failureModeName,
            remediation: v.remediation
          }))
        }
      : undefined
  };
}
