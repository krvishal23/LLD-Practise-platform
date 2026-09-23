/**
 * Core Domain Models for the LLD Practice Platform
 */

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface RequirementSet {
  functional: string[];
  nonFunctional: string[];
  constraints: string[];
}

export interface EvaluationChecklistItem {
  id: string;
  name: string;
  description: string;
  importance: 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE';
}

export interface EntityRelationship {
  source: string;
  target: string;
  type: 'inheritance' | 'composition' | 'aggregation' | 'association';
  label?: string;
}

export interface EntityDefinition {
  id: string;
  name: string;
  type: 'class' | 'interface' | 'abstract_class' | 'enum';
  responsibilities: string;
  fields: string[];
  methods: string[];
  relationships: EntityRelationship[];
}

export interface DesignDecisions {
  patternsUsed: string;
  concurrencyStrategy: string;
  extensibilityNotes: string;
  tradeoffsConsidered: string;
}

export interface SubmissionContent {
  classDiagramUml: string;
  entities: EntityDefinition[];
  sourceCode: string;
  designDecisions: DesignDecisions;
}

export interface StarterTemplate {
  label: string;
  description: string;
  content: SubmissionContent;
}

export interface Problem {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  brief: string;
  requirements: RequirementSet;
  keyEntities: string[];
  recommendedPatterns: string[];
  evaluationChecklist: EvaluationChecklistItem[];
  starterTemplates: StarterTemplate[];
  referenceSolution: {
    overview: string;
    entities: EntityDefinition[];
    sourceCode: string;
    designDecisions: DesignDecisions;
    discussionNotes: string;
  };
}

export type SubmissionStatus = 'DRAFT' | 'QUEUED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export interface RubricDimensionScore {
  score: number; // 0 - 20
  maxScore: number; // 20
  status: 'PASS' | 'WARN' | 'FAIL';
  feedback: string;
}

export interface RubricBreakdown {
  singleResponsibility: RubricDimensionScore;
  abstractionAndInterfaces: RubricDimensionScore;
  designPatternSuitability: RubricDimensionScore;
  openClosedExtensibility: RubricDimensionScore;
  concurrencyAndEdgeCases: RubricDimensionScore;
}

export interface DeterministicFindings {
  entityCoverage: {
    found: string[];
    missing: string[];
    coveragePercent: number;
  };
  antiPatternsDetected: string[];
  couplingMetrics: {
    totalEntities: number;
    interfaceCount: number;
    classCount: number;
    abstractionRatio: number; // interfaceCount / totalEntities
    godClasses: string[]; // classes with > 6 methods or > 6 fields
  };
  concurrencySignals: {
    hasSynchronization: boolean;
    detectedKeywords: string[];
  };
}

export interface ExplainableCritique {
  verdictSummary: string;
  strengths: string[];
  criticalFlaws: string[];
  refactoringSuggestions: string[];
  alternativeDesigns: string[];
}

export interface EvaluationResult {
  id: string;
  submissionId: string;
  timestamp: string;
  evaluatorSource: 'DETERMINISTIC' | 'GEMINI' | 'HYBRID_FALLBACK';
  overallScore: number; // 0 - 100
  verdict: 'Exemplary' | 'Strong' | 'Competent' | 'Needs Revision' | 'Unacceptable';
  rubricBreakdown: RubricBreakdown;
  deterministicFindings: DeterministicFindings;
  explainableCritique: ExplainableCritique;
  executionDurationMs: number;
}

export interface Submission {
  id: string;
  problemId: string;
  attemptNumber: number;
  title: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  content: SubmissionContent;
  evaluation?: EvaluationResult;
}
