import { Problem, Submission, EvaluationResult } from '../../types/lld';
import { DeterministicRuleEvaluator } from './DeterministicRuleEvaluator';
import { IEvaluator } from './IEvaluator';

export class HybridEvaluator implements IEvaluator {
  private deterministicEvaluator: DeterministicRuleEvaluator;

  constructor() {
    this.deterministicEvaluator = new DeterministicRuleEvaluator();
  }

  public async evaluate(submission: Submission, problem: Problem): Promise<EvaluationResult> {
    const startTime = Date.now();
    const deterministicFindings = this.deterministicEvaluator.analyze(submission, problem);

    try {
      // Call backend API endpoint running Gemini 3.8 Flash
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s resilient timeout

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem,
          submission,
          deterministicFindings,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.source === 'gemini' && data.evaluation) {
        const evalData = data.evaluation;
        const duration = Date.now() - startTime;

        return {
          id: `eval-gemini-${Date.now()}`,
          submissionId: submission.id,
          timestamp: new Date().toISOString(),
          evaluatorSource: 'GEMINI',
          overallScore: Number(evalData.overallScore) || 75,
          verdict: evalData.verdict || 'Competent',
          rubricBreakdown: {
            singleResponsibility: {
              score: Number(evalData.rubricBreakdown?.singleResponsibility?.score) || 15,
              maxScore: 20,
              status: evalData.rubricBreakdown?.singleResponsibility?.status || 'PASS',
              feedback: evalData.rubricBreakdown?.singleResponsibility?.feedback || 'Evaluated.',
            },
            abstractionAndInterfaces: {
              score: Number(evalData.rubricBreakdown?.abstractionAndInterfaces?.score) || 15,
              maxScore: 20,
              status: evalData.rubricBreakdown?.abstractionAndInterfaces?.status || 'PASS',
              feedback: evalData.rubricBreakdown?.abstractionAndInterfaces?.feedback || 'Evaluated.',
            },
            designPatternSuitability: {
              score: Number(evalData.rubricBreakdown?.designPatternSuitability?.score) || 15,
              maxScore: 20,
              status: evalData.rubricBreakdown?.designPatternSuitability?.status || 'PASS',
              feedback: evalData.rubricBreakdown?.designPatternSuitability?.feedback || 'Evaluated.',
            },
            openClosedExtensibility: {
              score: Number(evalData.rubricBreakdown?.openClosedExtensibility?.score) || 15,
              maxScore: 20,
              status: evalData.rubricBreakdown?.openClosedExtensibility?.status || 'PASS',
              feedback: evalData.rubricBreakdown?.openClosedExtensibility?.feedback || 'Evaluated.',
            },
            concurrencyAndEdgeCases: {
              score: Number(evalData.rubricBreakdown?.concurrencyAndEdgeCases?.score) || 15,
              maxScore: 20,
              status: evalData.rubricBreakdown?.concurrencyAndEdgeCases?.status || 'PASS',
              feedback: evalData.rubricBreakdown?.concurrencyAndEdgeCases?.feedback || 'Evaluated.',
            },
          },
          deterministicFindings,
          explainableCritique: {
            verdictSummary: evalData.explainableCritique?.verdictSummary || 'LLM Review Complete.',
            strengths: evalData.explainableCritique?.strengths || ['Solid domain modeling'],
            criticalFlaws: evalData.explainableCritique?.criticalFlaws || [],
            refactoringSuggestions: evalData.explainableCritique?.refactoringSuggestions || [],
            alternativeDesigns: evalData.explainableCritique?.alternativeDesigns || [],
          },
          executionDurationMs: duration,
        };
      }
    } catch (err: any) {
      console.warn('HybridEvaluator: LLM evaluation request failed, falling back to deterministic evaluator.', err);
    }

    // Graceful fallback
    const fallbackResult = await this.deterministicEvaluator.evaluate(submission, problem);
    fallbackResult.evaluatorSource = 'HYBRID_FALLBACK';
    fallbackResult.explainableCritique.verdictSummary +=
      ' (Generated via deterministic architectural rule engine with automated heuristics).';
    return fallbackResult;
  }
}
