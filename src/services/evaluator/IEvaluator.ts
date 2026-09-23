import { Problem, Submission, EvaluationResult } from '../../types/lld';

export interface IEvaluator {
  evaluate(submission: Submission, problem: Problem): Promise<EvaluationResult>;
}
