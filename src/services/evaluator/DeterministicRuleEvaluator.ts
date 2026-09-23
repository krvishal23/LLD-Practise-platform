import { Problem, Submission, EvaluationResult, DeterministicFindings, RubricBreakdown } from '../../types/lld';
import { IEvaluator } from './IEvaluator';

export class DeterministicRuleEvaluator implements IEvaluator {
  public analyze(submission: Submission, problem: Problem): DeterministicFindings {
    const entities = submission.content.entities || [];
    const code = (submission.content.sourceCode || '').toLowerCase();
    const decisions = submission.content.designDecisions || {
      patternsUsed: '',
      concurrencyStrategy: '',
      extensibilityNotes: '',
      tradeoffsConsidered: '',
    };
    const combinedText = `${code} ${decisions.patternsUsed} ${decisions.concurrencyStrategy} ${decisions.extensibilityNotes} ${decisions.tradeoffsConsidered}`.toLowerCase();

    // 1. Entity Coverage Analysis
    const entityNames = entities.map((e) => e.name.toLowerCase());
    const foundEntities: string[] = [];
    const missingEntities: string[] = [];

    problem.keyEntities.forEach((expected) => {
      const expLower = expected.toLowerCase();
      const inEntities = entityNames.some((n) => n.includes(expLower) || expLower.includes(n));
      const inCode = code.includes(expLower);
      if (inEntities || inCode) {
        foundEntities.push(expected);
      } else {
        missingEntities.push(expected);
      }
    });

    const coveragePercent = Math.round(
      problem.keyEntities.length > 0 ? (foundEntities.length / problem.keyEntities.length) * 100 : 100
    );

    // 2. Coupling & Abstraction Metrics
    const totalEntities = entities.length;
    const interfaceCount = entities.filter((e) => e.type === 'interface' || e.type === 'abstract_class').length;
    const classCount = entities.filter((e) => e.type === 'class').length;
    const abstractionRatio = totalEntities > 0 ? Number((interfaceCount / totalEntities).toFixed(2)) : 0;

    // 3. God Class Detection
    const godClasses: string[] = [];
    entities.forEach((e) => {
      if (e.type === 'class') {
        const methodCount = e.methods?.length || 0;
        const fieldCount = e.fields?.length || 0;
        if (methodCount >= 6 || fieldCount >= 6) {
          godClasses.push(e.name);
        }
      }
    });

    // 4. Anti-Patterns Detected
    const antiPatternsDetected: string[] = [];
    if (godClasses.length > 0) {
      antiPatternsDetected.push(
        `Potential God Class(es) detected: ${godClasses.join(', ')} exceed 6 methods/fields, risking Single Responsibility violation.`
      );
    }
    if (classCount > 3 && interfaceCount === 0) {
      antiPatternsDetected.push(
        'Zero interfaces or abstract classes defined. High risk of tight coupling and violation of Dependency Inversion.'
      );
    }
    if (coveragePercent < 50) {
      antiPatternsDetected.push(
        `Critical domain entities missing: ${missingEntities.join(', ')}. Incomplete domain model representation.`
      );
    }

    // 5. Concurrency Signals
    const concurrencyKeywords = [
      'synchronized',
      'lock',
      'atomic',
      'mutex',
      'reentrant',
      'threadsafe',
      'concurrent',
      'semaphore',
      'volatile',
      'cas',
      'race',
    ];
    const detectedKeywords = concurrencyKeywords.filter((kw) => combinedText.includes(kw));
    const hasSynchronization = detectedKeywords.length > 0;

    return {
      entityCoverage: {
        found: foundEntities,
        missing: missingEntities,
        coveragePercent,
      },
      antiPatternsDetected,
      couplingMetrics: {
        totalEntities,
        interfaceCount,
        classCount,
        abstractionRatio,
        godClasses,
      },
      concurrencySignals: {
        hasSynchronization,
        detectedKeywords,
      },
    };
  }

  public async evaluate(submission: Submission, problem: Problem): Promise<EvaluationResult> {
    const startTime = Date.now();
    const findings = this.analyze(submission, problem);

    // Compute scores for each rubric dimension deterministically (0 - 20)
    let srpScore = 15;
    let srpFeedback = 'Classes appear reasonably scoped.';
    if (findings.couplingMetrics.godClasses.length > 0) {
      srpScore = 8;
      srpFeedback = `Warning: ${findings.couplingMetrics.godClasses.join(', ')} has high method/field count. Extract sub-responsibilities.`;
    }

    let absScore = 14;
    let absFeedback = 'Adequate use of abstractions.';
    if (findings.couplingMetrics.interfaceCount === 0) {
      absScore = 7;
      absFeedback = 'No interfaces or abstract classes defined. Direct class coupling limits polymorphism.';
    } else if (findings.couplingMetrics.abstractionRatio >= 0.25) {
      absScore = 18;
      absFeedback = `Good interface segregation (${findings.couplingMetrics.interfaceCount} interfaces / abstract classes).`;
    }

    let patternScore = 14;
    const patterns = submission.content.designDecisions.patternsUsed || '';
    if (patterns.length > 15) {
      patternScore = 17;
    } else if (patterns.length === 0) {
      patternScore = 9;
    }

    let ocpScore = 14;
    if (findings.entityCoverage.coveragePercent >= 80) {
      ocpScore = 17;
    } else if (findings.entityCoverage.coveragePercent < 50) {
      ocpScore = 9;
    }

    let concScore = 12;
    let concFeedback = 'Basic concurrency considerations noted.';
    if (findings.concurrencySignals.hasSynchronization) {
      concScore = 18;
      concFeedback = `Detected thread-safety primitives: ${findings.concurrencySignals.detectedKeywords.join(', ')}.`;
    } else {
      concScore = 8;
      concFeedback = 'No synchronization or thread-safe concurrency mechanisms explicitly specified.';
    }

    const overallScore = Math.min(100, Math.max(0, srpScore + absScore + patternScore + ocpScore + concScore));

    let verdict: EvaluationResult['verdict'] = 'Competent';
    if (overallScore >= 85) verdict = 'Exemplary';
    else if (overallScore >= 70) verdict = 'Strong';
    else if (overallScore >= 50) verdict = 'Competent';
    else verdict = 'Needs Revision';

    const rubricBreakdown: RubricBreakdown = {
      singleResponsibility: {
        score: srpScore,
        maxScore: 20,
        status: srpScore >= 14 ? 'PASS' : srpScore >= 10 ? 'WARN' : 'FAIL',
        feedback: srpFeedback,
      },
      abstractionAndInterfaces: {
        score: absScore,
        maxScore: 20,
        status: absScore >= 14 ? 'PASS' : absScore >= 10 ? 'WARN' : 'FAIL',
        feedback: absFeedback,
      },
      designPatternSuitability: {
        score: patternScore,
        maxScore: 20,
        status: patternScore >= 14 ? 'PASS' : patternScore >= 10 ? 'WARN' : 'FAIL',
        feedback: patterns ? `Design patterns noted: ${patterns}` : 'No explicit patterns designated in submission.',
      },
      openClosedExtensibility: {
        score: ocpScore,
        maxScore: 20,
        status: ocpScore >= 14 ? 'PASS' : ocpScore >= 10 ? 'WARN' : 'FAIL',
        feedback: `Domain coverage is ${findings.entityCoverage.coveragePercent}%.`,
      },
      concurrencyAndEdgeCases: {
        score: concScore,
        maxScore: 20,
        status: concScore >= 14 ? 'PASS' : concScore >= 10 ? 'WARN' : 'FAIL',
        feedback: concFeedback,
      },
    };

    const duration = Date.now() - startTime;

    return {
      id: `eval-det-${Date.now()}`,
      submissionId: submission.id,
      timestamp: new Date().toISOString(),
      evaluatorSource: 'DETERMINISTIC',
      overallScore,
      verdict,
      rubricBreakdown,
      deterministicFindings: findings,
      explainableCritique: {
        verdictSummary: `Deterministic static review complete. Overall domain compliance score: ${overallScore}/100.`,
        strengths: [
          findings.entityCoverage.coveragePercent >= 70
            ? `Covered core entities: ${findings.entityCoverage.found.join(', ')}`
            : 'Clear domain entity naming convention',
          findings.couplingMetrics.interfaceCount > 0
            ? `Extracted ${findings.couplingMetrics.interfaceCount} abstractions for polymorphism.`
            : 'Straightforward class hierarchy structure.',
        ],
        criticalFlaws: findings.antiPatternsDetected.length > 0
          ? findings.antiPatternsDetected
          : ['Ensure edge cases such as capacity limits, cancellation, or concurrent access are explicitly guarded.'],
        refactoringSuggestions: [
          findings.couplingMetrics.godClasses.length > 0
            ? `Split responsibility out of ${findings.couplingMetrics.godClasses[0]} into a dedicated manager or service class.`
            : 'Extract spot assignment logic into an explicit Strategy pattern interface.',
          'Consider separating state persistence from runtime in-memory domain coordination.',
        ],
        alternativeDesigns: [
          'Event-driven model: Publish state changes (e.g., TicketIssued, SpotOccupied) to decoupling observers.',
          'State Pattern: Encapsulate entity status transitions inside concrete State objects rather than switch statements.',
        ],
      },
      executionDurationMs: duration,
    };
  }
}
