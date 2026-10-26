export type HeuristicCategory = 'feedback-state' | 'agency-control' | 'cognition-clarity' | 'error-resilience';

export type EraMode = 'classical' | 'comparative' | 'ai-native';

export interface SimulationParameters {
  autonomyLevel: number; // 0 to 100
  confidenceThreshold: number; // 50 to 99
  contextWindowDepth: number; // 1 to 10 items
  strictnessMode: 'permissive' | 'balanced' | 'strict';
}

export interface HeuristicDefinition {
  id: number;
  code: string;
  accessionNumber: string;
  classicalTitle: string;
  aiEraTitle: string;
  category: HeuristicCategory;
  categoryLabel: string;
  yearIntroduced: number;
  nngUrl: string;
  normanConcept: string;
  classicalPrinciple: string;
  aiTransformationThesis: string;
  gulfShift: {
    gulfType: 'Gulf of Evaluation' | 'Gulf of Execution' | 'Both Gulfs';
    classicalMechanism: string;
    aiMechanism: string;
  };
  keyTension: {
    axisLeft: string;
    axisRight: string;
    optimalEquilibrium: number; // 0-100
    description: string;
  };
  failureMode: {
    name: string;
    symptom: string;
    remediation: string;
  };
  metrics: {
    classicalMetricName: string;
    classicalBaseline: string;
    aiMetricName: string;
    aiTarget: string;
  };
  checklistItems: {
    id: string;
    criterion: string;
    diagnosticQuestion: string;
    weight: number;
  }[];
}

export const HEURISTICS_DATA: HeuristicDefinition[] = [
  {
    id: 1,
    code: 'H01',
    accessionNumber: 'ACC. 1994.01.VIS',
    classicalTitle: 'Visibility of System Status',
    aiEraTitle: 'Transparency of Reasoning, Confidence & Epistemic Provenance',
    category: 'feedback-state',
    categoryLabel: 'Feedback & State',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/visibility-system-status/',
    normanConcept: 'Bridging the Gulf of Evaluation through immediate, deterministic state feedback.',
    classicalPrinciple:
      'The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time (e.g., 0.1s direct manipulation, 1.0s state transition, 10s progress indicator).',
    aiTransformationThesis:
      'In deterministic software, status means completion percentage or network state. In probabilistic AI systems, a spinning loader hides epistemic uncertainty. Visibility now requires exposing multi-step reasoning traces, tool invocations, token streaming velocity, and calibrated confidence intervals with source citations.',
    gulfShift: {
      gulfType: 'Gulf of Evaluation',
      classicalMechanism: 'Deterministic byte-count progress bar (0% to 100%) and binary HTTP status codes.',
      aiMechanism: 'Live chain-of-thought step disclosure, source grounding badges, and calibrated epistemic confidence bands.'
    },
    keyTension: {
      axisLeft: 'Opaque Black-Box Latency',
      axisRight: 'Raw Token Log Overload',
      optimalEquilibrium: 68,
      description: 'Show structured semantic reasoning milestones and source provenance without flooding the user with raw token debug streams.'
    },
    failureMode: {
      name: 'Silent Hallucination Under Opaque Spinner',
      symptom: 'User waits 12 seconds staring at a generic shimmer only to receive an unverified claim with no indication of which sources were consulted.',
      remediation: 'Surface collapsible reasoning stages ("Querying clinical database", "Cross-checking 3 citations") and explicit confidence indicators.'
    },
    metrics: {
      classicalMetricName: 'Time-to-First-Feedback',
      classicalBaseline: '< 100 ms (State Change)',
      aiMetricName: 'Provenance Verification Rate',
      aiTarget: '> 92% Grounded Claims'
    },
    checklistItems: [
      {
        id: 'h01-c1',
        criterion: 'Live Reasoning & Tool Step Visibility',
        diagnosticQuestion: 'Does the interface expose active sub-tasks (e.g., searching, retrieving, synthesizing) rather than an opaque spinner?',
        weight: 5
      },
      {
        id: 'h01-c2',
        criterion: 'Calibrated Epistemic Confidence & Grounding',
        diagnosticQuestion: 'Can users immediately distinguish high-certainty grounded facts from speculative or generative synthesis?',
        weight: 5
      }
    ]
  },
  {
    id: 2,
    code: 'H02',
    accessionNumber: 'ACC. 1994.02.MAT',
    classicalTitle: 'Match Between System and the Real World',
    aiEraTitle: 'Semantic Intent Alignment & Calibrated Anthropomorphism',
    category: 'cognition-clarity',
    categoryLabel: 'Cognition & Clarity',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/match-system-real-world/',
    normanConcept: 'Aligning the System Image with the user’s existing Mental Model and cultural metaphors.',
    classicalPrinciple:
      'The design should speak the users’ language. Use words, phrases, and concepts familiar to the user, rather than internal system-oriented terms. Follow real-world conventions, making information appear in a natural and logical order.',
    aiTransformationThesis:
      'Classical interfaces relied on skeuomorphic desktop metaphors (folders, trash cans, clipboards). AI systems natively parse human vernacular, domain mental models, and unstructured intent—yet introduce the danger of deceptive anthropomorphism, where fluent prose tricks users into assuming human-like sentience or infallibility.',
    gulfShift: {
      gulfType: 'Gulf of Execution',
      classicalMechanism: 'Translating human goals into rigid database fields, SQL-like filters, and hierarchical menus.',
      aiMechanism: 'Translating natural semantic intent into structured system parameters while visibly previewing the interpreted schema.'
    },
    keyTension: {
      axisLeft: 'Rigid System Jargon',
      axisRight: 'Deceptive Human Persona',
      optimalEquilibrium: 62,
      description: 'Adapt fluently to the user’s domain vocabulary while maintaining honest machine framing as an analytical instrument.'
    },
    failureMode: {
      name: 'The Eliza Effect / Anthropomorphic Over-Trust',
      symptom: 'System uses first-person emotional apologies ("I feel terrible I missed that!") instead of clearly showing how it mapped natural language into query filters.',
      remediation: 'Translate natural language into editable, structured domain pills/chips so the user sees the exact machine interpretation.'
    },
    metrics: {
      classicalMetricName: 'Taxonomy Navigation Success',
      classicalBaseline: '78% First-Click Accuracy',
      aiMetricName: 'Semantic Intent Parse Fidelity',
      aiTarget: '95% Editable Chip Mapping'
    },
    checklistItems: [
      {
        id: 'h02-c1',
        criterion: 'Natural Domain Vocabulary Translation',
        diagnosticQuestion: 'Does the system accept everyday domain language without forcing users to memorize internal syntax or schema codes?',
        weight: 5
      },
      {
        id: 'h02-c2',
        criterion: 'Non-Deceptive Machine Framing',
        diagnosticQuestion: 'Does the interface avoid false emotional sentience while clearly displaying how it interpreted the user’s intent?',
        weight: 5
      }
    ]
  },
  {
    id: 3,
    code: 'H03',
    accessionNumber: 'ACC. 1994.03.CTL',
    classicalTitle: 'User Control and Freedom',
    aiEraTitle: 'Agentic Steering, Mid-Flight Interruptibility & Granular Rollback',
    category: 'agency-control',
    categoryLabel: 'Agency & Control',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/user-control-and-freedom/',
    normanConcept: 'Providing immediate "Emergency Exits" and reversible action trees.',
    classicalPrinciple:
      'Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process. Support Undo and Redo.',
    aiTransformationThesis:
      'When a classical user clicks a single button, `Ctrl+Z` reverses one deterministic state mutation. When an autonomous AI agent executes a 7-step workflow across files or APIs, User Control requires mid-stream pause/steer controls, non-destructive diff staging (sandbox preview), and selective step-level rollback.',
    gulfShift: {
      gulfType: 'Gulf of Execution',
      classicalMechanism: 'Single-action Undo stack (`Ctrl+Z`) and modal Cancel button.',
      aiMechanism: 'Live execution pause/redirect, branchable state checkpoints, and granular per-item diff accept/reject controls.'
    },
    keyTension: {
      axisLeft: 'Zero Autonomy (Manual Clicks)',
      axisRight: 'Unstoppable Runaway Agent',
      optimalEquilibrium: 70,
      description: 'Allow high-leverage multi-step execution inside a staged sandbox where every mutation can be inspected, steered, or reverted.'
    },
    failureMode: {
      name: 'Destructive Autonomous Cascade',
      symptom: 'An AI agent directly overwrites 14 records or sends external emails without a staging boundary or mid-run stop switch.',
      remediation: 'Enforce human-in-the-loop staging diffs for external/destructive mutations and provide instant mid-flight steering.'
    },
    metrics: {
      classicalMetricName: 'Single-Step Undo Latency',
      classicalBaseline: '< 50 ms State Restore',
      aiMetricName: 'Granular Diff Recovery Rate',
      aiTarget: '100% Reversible Checkpoint Tree'
    },
    checklistItems: [
      {
        id: 'h03-c1',
        criterion: 'Mid-Execution Pause & Directional Steering',
        diagnosticQuestion: 'Can the user pause an active generation or agent run and inject a course correction without losing prior progress?',
        weight: 5
      },
      {
        id: 'h03-c2',
        criterion: 'Granular Diff Acceptance & Checkpoint Rollback',
        diagnosticQuestion: 'Are multi-part AI outputs staged as inspectable diffs where individual changes can be accepted or reverted?',
        weight: 5
      }
    ]
  },
  {
    id: 4,
    code: 'H04',
    accessionNumber: 'ACC. 1994.04.CON',
    classicalTitle: 'Consistency and Standards',
    aiEraTitle: 'Behavioral Predictability & Cross-Modal Interaction Conventions',
    category: 'cognition-clarity',
    categoryLabel: 'Cognition & Clarity',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/consistency-and-standards/',
    normanConcept: 'Internal and external standardization (Jakob’s Law) to transfer prior user learning.',
    classicalPrinciple:
      'Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.',
    aiTransformationThesis:
      'In classical UI, consistency meant pixel-identical button placement and menu labels. Because generative models are inherently stochastic (the same prompt can yield varied phrasing or layout structures), modern consistency shifts toward structural schema contracts, predictable citation patterns, and clear visual distinction between deterministic vs. generative controls.',
    gulfShift: {
      gulfType: 'Both Gulfs',
      classicalMechanism: 'Static design system tokens, fixed navigation bars, and deterministic output templates.',
      aiMechanism: 'Structured JSON output schemas, invariant visual affordances for AI vs. manual actions, and stable persona boundaries.'
    },
    keyTension: {
      axisLeft: 'Chaotic Generative Variance',
      axisRight: 'Brittle Canned Templates',
      optimalEquilibrium: 74,
      description: 'Constrain stochastic generation inside reliable structural schemas so spatial reading order remains invariant across runs.'
    },
    failureMode: {
      name: 'Stochastic UI Whiplash',
      symptom: 'Asking the same analytical question twice produces a prose paragraph the first time and an incompatible 9-column table the second time.',
      remediation: 'Bind generative outputs to deterministic UI component contracts (structured cards, consistent severity scales, invariant actions).'
    },
    metrics: {
      classicalMetricName: 'Design Token Compliance',
      classicalBaseline: '100% Component Reuse',
      aiMetricName: 'Schema Structural Stability',
      aiTarget: '> 98% Invariant Layout Contract'
    },
    checklistItems: [
      {
        id: 'h04-c1',
        criterion: 'Clear Distinction Between Deterministic & Generative Controls',
        diagnosticQuestion: 'Can users visually tell before clicking whether a control triggers an instant deterministic action or a probabilistic AI synthesis?',
        weight: 5
      },
      {
        id: 'h04-c2',
        criterion: 'Structured Output Schema Consistency',
        diagnosticQuestion: 'Do repeated AI analyses adhere to a consistent spatial structure, unit system, and action layout?',
        weight: 5
      }
    ]
  },
  {
    id: 5,
    code: 'H05',
    accessionNumber: 'ACC. 1994.05.PRV',
    classicalTitle: 'Error Prevention',
    aiEraTitle: 'Pre-Execution Guardrails, Hallucination Grounding & Impact Dry-Runs',
    category: 'error-resilience',
    categoryLabel: 'Error & Resilience',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/slips-and-mistakes/',
    normanConcept: 'Designing forcing functions and constraints to prevent unconscious slips and conscious mistakes.',
    classicalPrinciple:
      'Good error messages are important, but the best designs carefully prevent problems from occurring in the first place. Eliminate error-prone conditions, or check for them and present users with a confirmation option before they commit to the action.',
    aiTransformationThesis:
      'Norman distinguished between Slips (attentional errors) and Mistakes (inaccurate mental models). In the AI era, a new class arises: Collaborative Oversight Slips, where users rubber-stamp plausible-looking AI hallucinations or underspecified prompts trigger broad side effects. Prevention requires pre-flight ambiguity detection, RAG grounding locks, andblast-radius simulation.',
    gulfShift: {
      gulfType: 'Gulf of Execution',
      classicalMechanism: 'Disabled submit buttons, input masks, and "Are you sure you want to delete?" confirmation modals.',
      aiMechanism: 'Proactive prompt ambiguity resolution, automated fact-check grounding against source documents, and blast-radius dry runs.'
    },
    keyTension: {
      axisLeft: 'Unchecked Hallucination Risk',
      axisRight: 'Confirmation Fatigue',
      optimalEquilibrium: 76,
      description: 'Reserve hard forcing functions for high-blast-radius or ungrounded claims while resolving prompt ambiguity inline.'
    },
    failureMode: {
      name: 'Automation Bias Rubber-Stamping',
      symptom: 'User approves an AI-drafted legal or clinical summary containing a fabricated figure because it was formatted with high fluency.',
      remediation: 'Highlight ungrounded claims or low-confidence spans inline and require explicit verification before export.'
    },
    metrics: {
      classicalMetricName: 'Form Submission Error Rate',
      classicalBaseline: '< 2.5% Invalid Submits',
      aiMetricName: 'Ungrounded Claim Interception',
      aiTarget: '> 96% Pre-Flight Catch Rate'
    },
    checklistItems: [
      {
        id: 'h05-c1',
        criterion: 'Proactive Ambiguity & Underspecification Check',
        diagnosticQuestion: 'When an instruction is underspecified or high-risk, does the system clarify scope or run a dry-run preview before acting?',
        weight: 5
      },
      {
        id: 'h05-c2',
        criterion: 'Inline Verification of Low-Confidence Claims',
        diagnosticQuestion: 'Are unverified numbers, dates, or external mutations flagged with forcing functions to prevent automation bias?',
        weight: 5
      }
    ]
  },
  {
    id: 6,
    code: 'H06',
    accessionNumber: 'ACC. 1994.06.REC',
    classicalTitle: 'Recognition Rather Than Recall',
    aiEraTitle: 'Contextual Scaffolding, Proactive Next-Actions & Overcoming the Blank Canvas',
    category: 'cognition-clarity',
    categoryLabel: 'Cognition & Clarity',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/recognition-and-recall/',
    normanConcept: 'Placing "Knowledge in the World" (visible affordances) rather than demanding "Knowledge in the Head" (memorization).',
    classicalPrinciple:
      'Minimize the user’s memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another.',
    aiTransformationThesis:
      'Early generative AI violated this heuristic catastrophically by replacing rich GUI menus with an empty text box ("Ask anything..."), forcing users to recall prompt engineering syntax from memory. Contemporary AI restores Recognition by surfacing context-aware starter lenses, inline selection toolbars, and visual parameter tokens.',
    gulfShift: {
      gulfType: 'Gulf of Execution',
      classicalMechanism: 'Visible dropdown menus, toolbar icons, and recently opened file lists.',
      aiMechanism: 'Artifact-anchored contextual action palettes, dynamic follow-up lenses, and visible context-window memory pins.'
    },
    keyTension: {
      axisLeft: 'The Tyranny of the Blank Prompt',
      axisRight: 'Cluttered Suggestion Spam',
      optimalEquilibrium: 72,
      description: 'Surface 3–4 high-signal, artifact-specific recognition triggers right where the user’s attention rests.'
    },
    failureMode: {
      name: 'Blank-Canvas Prompt Paralysis',
      symptom: 'Users stare at an empty prompt input unsure what capabilities exist or which documents are currently in the system’s working memory.',
      remediation: 'Provide visible context pills showing active memory items and direct-manipulation transformation lenses.'
    },
    metrics: {
      classicalMetricName: 'Menu Discovery Time',
      classicalBaseline: '3.2s Visual Scan',
      aiMetricName: 'Zero-Typing Task Initiation',
      aiTarget: '> 75% Guided Action Start'
    },
    checklistItems: [
      {
        id: 'h06-c1',
        criterion: 'Elimination of Cold Blank-Box Paralysis',
        diagnosticQuestion: 'Does the interface offer contextual, clickable transformation lenses and examples rather than an unguided empty text box?',
        weight: 5
      },
      {
        id: 'h06-c2',
        criterion: 'Visible Working Memory & Context State',
        diagnosticQuestion: 'Can users see at a glance which documents, constraints, and prior decisions the AI currently holds in context?',
        weight: 5
      }
    ]
  },
  {
    id: 7,
    code: 'H07',
    accessionNumber: 'ACC. 1994.07.FLX',
    classicalTitle: 'Flexibility and Efficiency of Use',
    aiEraTitle: 'Adaptive Co-Creation, Multi-Modal Fluidity & Programmable Macros',
    category: 'agency-control',
    categoryLabel: 'Agency & Control',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/flexibility-efficiency-heuristic/',
    normanConcept: 'Supporting both novices (guided scaffolding) and experts (accelerators) within a unified conceptual model.',
    classicalPrinciple:
      'Shortcuts — hidden from novice users — may speed up the interaction for the expert user such that the design can cater to both inexperienced and experienced users. Allow users to tailor frequent actions.',
    aiTransformationThesis:
      'Classical accelerators were static keyboard shortcuts (`Cmd+K`) or recorded macros. In AI-native software, efficiency scales across abstraction levels: novices use guided natural-language intents, while power users chain multi-modal inputs, adjust semantic sliders (temperature, rigor, brevity), or save reusable reasoning workflows.',
    gulfShift: {
      gulfType: 'Gulf of Execution',
      classicalMechanism: 'Keyboard accelerators (`Cmd+Shift+P`), customizable toolbars, and batch scripts.',
      aiMechanism: 'Direct semantic sliders (e.g., Audience Depth, Synthesis Density), inline canvas brushing, and reusable workflow templates.'
    },
    keyTension: {
      axisLeft: 'Slow Turn-by-Turn Chatting',
      axisRight: 'Steep Prompt-Code Complexity',
      optimalEquilibrium: 78,
      description: 'Combine tactile direct-manipulation controls (sliders, brushes) with composable semantic accelerators.'
    },
    failureMode: {
      name: 'Conversational Bottleneck for Tactile Tasks',
      symptom: 'Forcing a user to type "make the tone 20% more concise and formal" three times in chat instead of providing a 2D semantic tone pad.',
      remediation: 'Provide direct-manipulation semantic controls and one-click reusable synthesis lenses alongside natural language.'
    },
    metrics: {
      classicalMetricName: 'Keystroke-Level Model (KLM) Time',
      classicalBaseline: '4.5s via Shortcut',
      aiMetricName: 'Semantic Iteration Velocity',
      aiTarget: '< 1.5s via Direct Parameter Scrub'
    },
    checklistItems: [
      {
        id: 'h07-c1',
        criterion: 'Direct Semantic Accelerators Beyond Chat',
        diagnosticQuestion: 'Can power users adjust output dimensions (depth, tone, format) via fast tactile controls without typing verbose prompts?',
        weight: 5
      },
      {
        id: 'h07-c2',
        criterion: 'Reusable Workflow & Lens Composition',
        diagnosticQuestion: 'Can users encapsulate recurring multi-step instructions into one-click reusable lenses or templates?',
        weight: 5
      }
    ]
  },
  {
    id: 8,
    code: 'H08',
    accessionNumber: 'ACC. 1994.08.AES',
    classicalTitle: 'Aesthetic and Minimalist Design',
    aiEraTitle: 'Signal-to-Noise Discipline & Anti-Slop Progressive Disclosure',
    category: 'cognition-clarity',
    categoryLabel: 'Cognition & Clarity',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/aesthetic-minimalist-design/',
    normanConcept: 'Maximizing signal-to-noise ratio so every visual unit serves the user’s primary cognitive goal.',
    classicalPrinciple:
      'Interfaces should not contain information which is irrelevant or rarely needed. Every extra unit of information in an interface competes with the relevant units of information and diminishes their relative visibility.',
    aiTransformationThesis:
      'In 1994, screen pixels were scarce and writing text was expensive. Today, LLMs generate 800 words of verbose, hedging "AI slop" at near-zero marginal cost, overwhelming human reading bandwidth. Minimalist design in the AI era means ruthless synthesis compression: leading with high-signal structured takeaways and tucking supporting prose into progressive disclosure layers.',
    gulfShift: {
      gulfType: 'Gulf of Evaluation',
      classicalMechanism: 'Removing decorative bevels, redundant links, and secondary form fields from static screens.',
      aiMechanism: 'Automated verbosity compression, executive structured synthesis first, and on-demand drill-down into source evidence.'
    },
    keyTension: {
      axisLeft: 'Cryptic 1-Word Truncation',
      axisRight: 'Wall-of-Text LLM Verbosity',
      optimalEquilibrium: 65,
      description: 'Lead with crisp, scannable thesis findings and tabular numbers; disclose full chain-of-evidence only on user request.'
    },
    failureMode: {
      name: 'Generative Verbosity Flood ("AI Slop")',
      symptom: 'A simple status question returns 5 paragraphs of generic preamble ("Certainly! In today’s fast-paced landscape...") burying the actual answer.',
      remediation: 'Enforce strict signal-to-noise density: zero conversational filler, structured answer first, expandable evidence below.'
    },
    metrics: {
      classicalMetricName: 'Visual Pixel Density Ratio',
      classicalBaseline: '60% Whitespace Budget',
      aiMetricName: 'Information Signal-to-Token Ratio',
      aiTarget: '< 45 Words to Core Decision'
    },
    checklistItems: [
      {
        id: 'h08-c1',
        criterion: 'Zero Conversational Preamble & Slop Compression',
        diagnosticQuestion: 'Does the interface strip out boilerplate AI pleasantries and lead immediately with the structured answer?',
        weight: 5
      },
      {
        id: 'h08-c2',
        criterion: 'Layered Progressive Disclosure of Complexity',
        diagnosticQuestion: 'Are secondary reasoning traces, raw citations, and edge-case caveats organized in clean expandable layers?',
        weight: 5
      }
    ]
  },
  {
    id: 9,
    code: 'H09',
    accessionNumber: 'ACC. 1994.09.ERR',
    classicalTitle: 'Help Users Recognize, Diagnose, and Recover from Errors',
    aiEraTitle: 'Collaborative Repair of Epistemic Failures, Drift & Partial Faults',
    category: 'error-resilience',
    categoryLabel: 'Error & Resilience',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/error-message-guidelines/',
    normanConcept: 'Making anomalous system states legible in human terms and offering a direct path to resolution.',
    classicalPrinciple:
      'Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.',
    aiTransformationThesis:
      'Classical errors were binary and syntactic (`404 Not Found`, `Invalid Email Format`). AI failures are subtle, semantic, and partial: 85% of a generated report is accurate while 15% misinterprets a constraint or hits a context boundary. Recovery requires pinpointing the exact semantic divergence and offering one-click targeted regeneration or constraint repair.',
    gulfShift: {
      gulfType: 'Both Gulfs',
      classicalMechanism: 'Plain-text validation banner under an input field with a clear fix instruction.',
      aiMechanism: 'Span-level semantic fault highlighting, root-cause attribution (missing context vs. conflicting constraint), and targeted repair actions.'
    },
    keyTension: {
      axisLeft: 'Opaque "Something Went Wrong"',
      axisRight: 'Forcing Full Prompt Rewrite',
      optimalEquilibrium: 75,
      description: 'Isolate the degraded span or unmet constraint and let the user repair just that segment with one click.'
    },
    failureMode: {
      name: 'Scorched-Earth Regeneration Loop',
      symptom: 'When one calculation in a 6-part synthesis is wrong, the user has to regenerate the entire response and hope the good parts survive.',
      remediation: 'Provide localized fault diagnosis ("Constraint conflict in Section 3") with scoped repair options.'
    },
    metrics: {
      classicalMetricName: 'Error Recovery Completion',
      classicalBaseline: '84% Single-Attempt Fix',
      aiMetricName: 'Scoped Repair Preservation',
      aiTarget: '100% Unchanged Valid Spans'
    },
    checklistItems: [
      {
        id: 'h09-c1',
        criterion: 'Root-Cause Diagnosis of Semantic or Context Failures',
        diagnosticQuestion: 'When AI output degrades or fails, does the UI explain why (e.g., missing source data, conflicting rules) in plain language?',
        weight: 5
      },
      {
        id: 'h09-c2',
        criterion: 'Scoped Inline Repair Without Full Reset',
        diagnosticQuestion: 'Can users repair or regenerate a specific faulty claim or section without discarding the rest of the valid work?',
        weight: 5
      }
    ]
  },
  {
    id: 10,
    code: 'H10',
    accessionNumber: 'ACC. 1994.10.HLP',
    classicalTitle: 'Help and Documentation',
    aiEraTitle: 'In-Situ Capability Discovery, Explainable Boundaries & Interactive Exemplars',
    category: 'feedback-state',
    categoryLabel: 'Feedback & State',
    yearIntroduced: 1994,
    nngUrl: 'https://www.nngroup.com/articles/help-and-documentation/',
    normanConcept: 'Providing task-focused, searchable procedural guidance when the system image alone cannot bridge the gulf.',
    classicalPrinciple:
      'It’s best if the system doesn’t need any additional explanation. However, it may be necessary to provide documentation to help users understand how to complete their tasks.',
    aiTransformationThesis:
      'Static PDF manuals and external knowledge bases failed because users had to leave their workflow to search them. In the age of AI, documentation becomes embedded, context-aware, and honest about model boundaries—explicitly teaching users what the system is verified to do, where its training cutoff or tool scope ends, and offering live runnable exemplars.',
    gulfShift: {
      gulfType: 'Gulf of Evaluation',
      classicalMechanism: 'Searchable external Help Center, static tooltips, and step-by-step wizard tours.',
      aiMechanism: 'In-situ capability boundary cards, interactive "Try with sample data" exemplars, and self-explaining why-this-output inspectors.'
    },
    keyTension: {
      axisLeft: 'Undocumented Capability Mystery',
      axisRight: 'Intrusive Onboarding Modals',
      optimalEquilibrium: 70,
      description: 'Embed quiet, inspectable capability boundaries and runnable exemplars directly inside the task workspace.'
    },
    failureMode: {
      name: 'Silent Capability Cliff',
      symptom: 'User assumes the AI can query live 2026 financial filings when it only has access to uploaded local PDFs, leading to silent fabrication.',
      remediation: 'Display explicit Scope & Boundary cards showing active data connectors, temporal cutoffs, and runnable task exemplars.'
    },
    metrics: {
      classicalMetricName: 'Help Article Deflection Rate',
      classicalBaseline: '62% Self-Service',
      aiMetricName: 'Boundary Calibration Accuracy',
      aiTarget: '94% User Scope Awareness'
    },
    checklistItems: [
      {
        id: 'h10-c1',
        criterion: 'Explicit System Scope & Boundary Disclosure',
        diagnosticQuestion: 'Does the interface clearly state what data sources, tools, and temporal cutoffs the AI can and cannot access?',
        weight: 5
      },
      {
        id: 'h10-c2',
        criterion: 'Runnable In-Situ Exemplars',
        diagnosticQuestion: 'Can users test capabilities immediately via interactive sample scenarios rather than reading abstract help prose?',
        weight: 5
      }
    ]
  }
];
