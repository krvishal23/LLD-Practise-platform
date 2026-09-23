import { Submission, Problem } from '../types/lld';

const STORAGE_KEY_PREFIX = 'lld_platform_attempts_';

export function getStoredAttempts(problemId: string): Submission[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${problemId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load attempts from storage', e);
    return [];
  }
}

export function saveAttempt(submission: Submission): void {
  try {
    const existing = getStoredAttempts(submission.problemId);
    const index = existing.findIndex((s) => s.id === submission.id);
    if (index >= 0) {
      existing[index] = submission;
    } else {
      existing.unshift(submission);
    }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${submission.problemId}`, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save attempt', e);
  }
}

export function createInitialSubmission(problem: Problem, attemptNumber: number = 1): Submission {
  const starter = problem.starterTemplates[0]?.content || {
    classDiagramUml: '',
    entities: [],
    sourceCode: '',
    designDecisions: {
      patternsUsed: '',
      concurrencyStrategy: '',
      extensibilityNotes: '',
      tradeoffsConsidered: '',
    },
  };

  return {
    id: `sub-${problem.id}-${Date.now()}`,
    problemId: problem.id,
    attemptNumber,
    title: `Attempt #${attemptNumber}`,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: JSON.parse(JSON.stringify(starter)),
  };
}

export function cloneForNextAttempt(previous: Submission): Submission {
  const nextNumber = previous.attemptNumber + 1;
  return {
    id: `sub-${previous.problemId}-${Date.now()}`,
    problemId: previous.problemId,
    attemptNumber: nextNumber,
    title: `Attempt #${nextNumber} (Iterating on feedback)`,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: JSON.parse(JSON.stringify(previous.content)),
  };
}
