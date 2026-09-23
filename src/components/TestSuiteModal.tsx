import React, { useState, useEffect } from 'react';
import { runAllEvaluationTests, TestResultItem } from '../tests/evaluator.test';
import { TestTube2, CheckCircle2, XCircle, RotateCcw, X, Clock, Layers } from 'lucide-react';

interface TestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestSuiteModal: React.FC<TestSuiteModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testData, setTestData] = useState<{
    summary: { total: number; passed: number; failed: number; durationMs: number };
    results: TestResultItem[];
  } | null>(null);

  const executeTests = async () => {
    setIsRunning(true);
    await new Promise((r) => setTimeout(r, 200));
    try {
      const data = await runAllEvaluationTests();
      setTestData(data);
    } catch (e) {
      console.error('Test execution failed', e);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen && !testData) {
      executeTests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="rounded-3xl glass-panel border border-white/50 dark:border-white/10 shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between px-6 sm:px-8 py-5 border-b border-white/30 dark:border-white/10 bg-white/40 dark:bg-black/30 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <TestTube2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Automated Test Suite Runner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verifying static analysis, heuristics, anti-pattern detection, edge cases, and fallback resilience.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={executeTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running...' : 'Run All Tests'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {testData && (
            <div className="flex flex-wrap items-center justify-between p-5 rounded-2xl glass-card border border-white/40 dark:border-white/10 gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      testData.summary.failed === 0
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {testData.summary.failed === 0 ? 'ALL TESTS PASSED' : `${testData.summary.failed} FAILED`}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-200 font-mono font-bold">
                  {testData.summary.passed} / {testData.summary.total} assertions passed
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{testData.summary.durationMs}ms</span>
              </div>
            </div>
          )}

          {/* Test items */}
          <div className="space-y-3">
            {testData?.results.map((test) => (
              <div
                key={test.id}
                className="p-4 sm:p-5 rounded-2xl glass-card glass-card-hover border border-white/40 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                      {test.category}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {test.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono leading-relaxed">
                    {test.details}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-slate-400 font-mono">{test.durationMs}ms</span>
                  {test.status === 'PASSED' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" /> PASS
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
                      <XCircle className="w-4 h-4" /> FAIL
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-white/30 dark:bg-black/20 border-t border-white/20 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl glass-card text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-white/60 transition-colors"
          >
            Close Runner
          </button>
        </div>
      </div>
    </div>
  );
};
