import { DeterministicRuleEvaluator } from '../services/evaluator/DeterministicRuleEvaluator';
import { PROBLEMS } from '../data/problems';
import { Submission } from '../types/lld';

export interface TestResultItem {
  id: string;
  name: string;
  category: string;
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  details: string;
}

export async function runAllEvaluationTests(): Promise<{
  summary: { total: number; passed: number; failed: number; durationMs: number };
  results: TestResultItem[];
}> {
  const results: TestResultItem[] = [];
  const evaluator = new DeterministicRuleEvaluator();
  const parkingProblem = PROBLEMS[0];
  const overallStart = Date.now();

  // Test 1: Entity Coverage Detection
  {
    const start = Date.now();
    const submission: Submission = {
      id: 'sub-test-1',
      problemId: parkingProblem.id,
      attemptNumber: 1,
      title: 'Coverage Test',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {
        classDiagramUml: '',
        entities: [
          {
            id: '1',
            name: 'ParkingLot',
            type: 'class',
            responsibilities: 'Manages lots',
            fields: [],
            methods: ['+ park()'],
            relationships: [],
          },
          {
            id: '2',
            name: 'ParkingSpot',
            type: 'class',
            responsibilities: 'Spots',
            fields: [],
            methods: [],
            relationships: [],
          },
          {
            id: '3',
            name: 'Vehicle',
            type: 'class',
            responsibilities: 'Vehicle',
            fields: [],
            methods: [],
            relationships: [],
          },
          {
            id: '4',
            name: 'Ticket',
            type: 'class',
            responsibilities: 'Ticket receipt',
            fields: [],
            methods: [],
            relationships: [],
          },
        ],
        sourceCode: 'class Payment {} class ParkingFloor {}',
        designDecisions: {
          patternsUsed: 'Strategy Pattern',
          concurrencyStrategy: 'synchronized lock',
          extensibilityNotes: 'OCP compliant',
          tradeoffsConsidered: 'memory vs disk',
        },
      },
    };

    const findings = evaluator.analyze(submission, parkingProblem);
    const passed =
      findings.entityCoverage.found.includes('ParkingLot') &&
      findings.entityCoverage.found.includes('ParkingSpot') &&
      findings.entityCoverage.found.includes('Vehicle') &&
      findings.entityCoverage.found.includes('Ticket') &&
      findings.entityCoverage.found.includes('Payment');

    results.push({
      id: 't1',
      name: 'Entity Coverage Analysis: Accurately identifies present and missing entities',
      category: 'Static Analysis',
      status: passed ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - start,
      details: `Found ${findings.entityCoverage.found.length} of ${parkingProblem.keyEntities.length} entities (${findings.entityCoverage.coveragePercent}% coverage).`,
    });
  }

  // Test 2: God Class Detection Anti-Pattern
  {
    const start = Date.now();
    const godClassSubmission: Submission = {
      id: 'sub-test-2',
      problemId: parkingProblem.id,
      attemptNumber: 1,
      title: 'God Class Test',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {
        classDiagramUml: '',
        entities: [
          {
            id: 'g1',
            name: 'MegaGodController',
            type: 'class',
            responsibilities: 'Does everything',
            fields: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
            methods: ['m1()', 'm2()', 'm3()', 'm4()', 'm5()', 'm6()', 'm7()', 'm8()'],
            relationships: [],
          },
        ],
        sourceCode: '',
        designDecisions: {
          patternsUsed: '',
          concurrencyStrategy: '',
          extensibilityNotes: '',
          tradeoffsConsidered: '',
        },
      },
    };

    const findings = evaluator.analyze(godClassSubmission, parkingProblem);
    const passed = findings.couplingMetrics.godClasses.includes('MegaGodController');

    results.push({
      id: 't2',
      name: 'Anti-Pattern Heuristic: Identifies God Classes with excessive methods/fields',
      category: 'Heuristic Detection',
      status: passed ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - start,
      details: `Correctly flagged MegaGodController as a God class (methods: 8, fields: 7).`,
    });
  }

  // Test 3: Interface & Abstraction Ratio Metrics
  {
    const start = Date.now();
    const cleanSubmission: Submission = {
      id: 'sub-test-3',
      problemId: parkingProblem.id,
      attemptNumber: 1,
      title: 'Abstraction Test',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {
        classDiagramUml: '',
        entities: [
          { id: 'i1', name: 'IParkingStrategy', type: 'interface', responsibilities: '', fields: [], methods: ['+ find()'], relationships: [] },
          { id: 'i2', name: 'IPricingEngine', type: 'interface', responsibilities: '', fields: [], methods: ['+ calc()'], relationships: [] },
          { id: 'c1', name: 'StandardPricingEngine', type: 'class', responsibilities: '', fields: [], methods: ['+ calc()'], relationships: [] },
          { id: 'c2', name: 'ParkingLot', type: 'class', responsibilities: '', fields: [], methods: [], relationships: [] },
        ],
        sourceCode: '',
        designDecisions: {
          patternsUsed: 'Strategy',
          concurrencyStrategy: 'AtomicReference',
          extensibilityNotes: 'Pluggable strategies',
          tradeoffsConsidered: '',
        },
      },
    };

    const findings = evaluator.analyze(cleanSubmission, parkingProblem);
    const passed =
      findings.couplingMetrics.interfaceCount === 2 &&
      findings.couplingMetrics.classCount === 2 &&
      findings.couplingMetrics.abstractionRatio === 0.5;

    results.push({
      id: 't3',
      name: 'Coupling Metrics: Calculates interface count and abstraction ratio',
      category: 'Static Analysis',
      status: passed ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - start,
      details: `Interface count: ${findings.couplingMetrics.interfaceCount}, Class count: ${findings.couplingMetrics.classCount}, Ratio: ${findings.couplingMetrics.abstractionRatio}.`,
    });
  }

  // Test 4: Concurrency Primitive Signals
  {
    const start = Date.now();
    const concurrentSubmission: Submission = {
      id: 'sub-test-4',
      problemId: parkingProblem.id,
      attemptNumber: 1,
      title: 'Concurrency Test',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {
        classDiagramUml: '',
        entities: [],
        sourceCode: 'public synchronized boolean lockSpot() { mutex.acquire(); }',
        designDecisions: {
          patternsUsed: '',
          concurrencyStrategy: 'ReentrantLock and AtomicInteger counter to avoid race conditions.',
          extensibilityNotes: '',
          tradeoffsConsidered: '',
        },
      },
    };

    const findings = evaluator.analyze(concurrentSubmission, parkingProblem);
    const passed =
      findings.concurrencySignals.hasSynchronization &&
      findings.concurrencySignals.detectedKeywords.includes('synchronized') &&
      findings.concurrencySignals.detectedKeywords.includes('mutex') &&
      findings.concurrencySignals.detectedKeywords.includes('reentrant');

    results.push({
      id: 't4',
      name: 'Concurrency Signals: Detects thread-safety primitives and synchronization patterns',
      category: 'Static Analysis',
      status: passed ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - start,
      details: `Detected concurrency signals: ${findings.concurrencySignals.detectedKeywords.join(', ')}.`,
    });
  }

  // Test 5: Edge Case: Completely Empty Submission
  {
    const start = Date.now();
    const emptySubmission: Submission = {
      id: 'sub-empty',
      problemId: parkingProblem.id,
      attemptNumber: 1,
      title: 'Empty Submission',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {
        classDiagramUml: '',
        entities: [],
        sourceCode: '',
        designDecisions: {
          patternsUsed: '',
          concurrencyStrategy: '',
          extensibilityNotes: '',
          tradeoffsConsidered: '',
        },
      },
    };

    const result = await evaluator.evaluate(emptySubmission, parkingProblem);
    const passed =
      result.overallScore <= 60 &&
      result.overallScore >= 0 &&
      result.deterministicFindings.entityCoverage.coveragePercent === 0 &&
      result.rubricBreakdown.singleResponsibility.maxScore === 20;

    results.push({
      id: 't5',
      name: 'Edge Case: Empty submission handles gracefully without exceptions',
      category: 'Edge Cases & Resilience',
      status: passed ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - start,
      details: `Evaluated empty submission safely in ${result.executionDurationMs}ms; returned bounded score: ${result.overallScore}/100.`,
    });
  }

  // Test 6: Rubric Boundedness and Integrity
  {
    const start = Date.now();
    const templateSub: Submission = {
      id: 'sub-starter',
      problemId: parkingProblem.id,
      attemptNumber: 1,
      title: 'Starter Template Evaluation',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: parkingProblem.starterTemplates[0].content,
    };

    const result = await evaluator.evaluate(templateSub, parkingProblem);
    const rub = result.rubricBreakdown;
    const sum =
      rub.singleResponsibility.score +
      rub.abstractionAndInterfaces.score +
      rub.designPatternSuitability.score +
      rub.openClosedExtensibility.score +
      rub.concurrencyAndEdgeCases.score;

    const passed =
      result.overallScore === sum &&
      result.overallScore >= 0 &&
      result.overallScore <= 100 &&
      result.explainableCritique.refactoringSuggestions.length > 0;

    results.push({
      id: 't6',
      name: 'Rubric Invariant: Sub-scores sum strictly matches overall score and stays within 0-100',
      category: 'Domain Invariants',
      status: passed ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - start,
      details: `Overall score ${result.overallScore} matches rubric components sum (${sum}). Verdict: ${result.verdict}.`,
    });
  }

  const durationMs = Date.now() - overallStart;
  const passedCount = results.filter((r) => r.status === 'PASSED').length;

  return {
    summary: {
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      durationMs,
    },
    results,
  };
}
