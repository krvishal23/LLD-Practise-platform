import React, { useState } from 'react';
import { Submission } from '../types/lld';
import {
  History,
  X,
  TrendingUp,
  ArrowRight,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

interface AttemptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempts: Submission[];
  onLoadAttempt: (submission: Submission) => void;
}

export const AttemptHistoryModal: React.FC<AttemptHistoryModalProps> = ({
  isOpen,
  onClose,
  attempts,
  onLoadAttempt,
}) => {
  const [selectedForDiffA, setSelectedForDiffA] = useState<string | null>(null);
  const [selectedForDiffB, setSelectedForDiffB] = useState<string | null>(null);

  if (!isOpen) return null;

  const attemptA = attempts.find((a) => a.id === selectedForDiffA);
  const attemptB = attempts.find((a) => a.id === selectedForDiffB);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="rounded-3xl glass-panel border border-white/50 dark:border-white/10 shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/30 dark:border-white/10 bg-white/40 dark:bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Attempt History &amp; Iteration Tracker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review your architecture progression across iterations to verify refactoring improvements.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {attempts.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              No saved attempts yet for this problem. Submit your first design to record history!
            </div>
          ) : (
            <div className="space-y-6">
              {/* Attempt List Grid with Generous Spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attempts.map((att) => {
                  const score = att.evaluation?.overallScore;
                  return (
                    <div
                      key={att.id}
                      className="p-5 sm:p-6 rounded-2xl glass-card glass-card-hover border border-white/40 dark:border-white/10 flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                            {att.title || `Attempt #${att.attemptNumber}`}
                          </span>
                          <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                            {att.status}
                          </span>
                        </div>
                        {score !== undefined && (
                          <div className="flex items-baseline gap-1 px-3 py-1 rounded-xl glass-card border font-mono font-bold text-sm">
                            <span className={score >= 70 ? 'text-emerald-500' : 'text-amber-500'}>
                              {score}
                            </span>
                            <span className="text-[10px] text-slate-400">/ 100</span>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(att.createdAt).toLocaleTimeString()} · {new Date(att.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="truncate text-slate-600 dark:text-slate-300 font-mono">
                          Entities: {att.content.entities?.length || 0} classes · Code: {(att.content.sourceCode || '').split('\n').length} lines
                        </div>
                        {att.evaluation && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 mt-1">
                            &ldquo;{att.evaluation.explainableCritique.verdictSummary}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/20 dark:border-white/5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedForDiffA(att.id)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                              selectedForDiffA === att.id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-white/60'
                            }`}
                          >
                            Set Diff A
                          </button>
                          <button
                            onClick={() => setSelectedForDiffB(att.id)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                              selectedForDiffB === att.id
                                ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                                : 'glass-card text-slate-600 dark:text-slate-300 hover:bg-white/60'
                            }`}
                          >
                            Set Diff B
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            onLoadAttempt(att);
                            onClose();
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-cyan-400 flex items-center gap-1"
                        >
                          Load &amp; Edit &rarr;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Side-by-Side Attempt Comparison Diff Card */}
              {attemptA && attemptB && (
                <div className="p-6 rounded-3xl glass-card border border-indigo-500/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/20 dark:border-white/10">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Comparing {attemptA.title || 'Attempt A'} vs {attemptB.title || 'Attempt B'}
                    </h4>
                    {attemptA.evaluation && attemptB.evaluation && (
                      <div className="text-xs font-bold font-mono px-3 py-1 rounded-xl glass-card">
                        Delta:{' '}
                        {attemptB.evaluation.overallScore - attemptA.evaluation.overallScore >= 0 ? (
                          <span className="text-emerald-500">
                            +{attemptB.evaluation.overallScore - attemptA.evaluation.overallScore} pts
                          </span>
                        ) : (
                          <span className="text-rose-500">
                            {attemptB.evaluation.overallScore - attemptA.evaluation.overallScore} pts
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white block text-sm">
                        {attemptA.title} (Score: {attemptA.evaluation?.overallScore ?? 'N/A'})
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Entities:</strong> {attemptA.content.entities?.map((e) => e.name).join(', ') || 'None'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Patterns:</strong> {attemptA.content.designDecisions.patternsUsed || 'None'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 space-y-2">
                      <span className="font-bold text-slate-900 dark:text-white block text-sm">
                        {attemptB.title} (Score: {attemptB.evaluation?.overallScore ?? 'N/A'})
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Entities:</strong> {attemptB.content.entities?.map((e) => e.name).join(', ') || 'None'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Patterns:</strong> {attemptB.content.designDecisions.patternsUsed || 'None'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 bg-white/30 dark:bg-black/20 border-t border-white/20 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl glass-card text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-white/60 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
