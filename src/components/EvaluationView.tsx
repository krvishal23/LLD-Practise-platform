import React from 'react';
import { EvaluationResult, Submission } from '../types/lld';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap,
  Layers,
  Wrench,
  ShieldAlert,
  Lightbulb,
  Clock,
  Check,
} from 'lucide-react';

interface EvaluationViewProps {
  evaluation: EvaluationResult;
  isEvaluating: boolean;
  evaluationStep?: string;
  onTryAgain: () => void;
  onBackToEdit: () => void;
  attemptNumber: number;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  evaluation,
  isEvaluating,
  evaluationStep,
  onTryAgain,
  onBackToEdit,
  attemptNumber,
}) => {
  if (isEvaluating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-3xl glass-panel border border-white/50 dark:border-white/10 shadow-2xl text-center max-w-2xl mx-auto space-y-8 my-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 dark:border-t-cyan-400 animate-spin flex items-center justify-center" />
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Sparkles className="w-6 h-6 text-indigo-500 dark:text-cyan-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Architectural Evaluation in Progress
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Executing hybrid analysis: deterministic static metric extraction combined with Gemini 3.8 Flash architectural reasoning.
          </p>
        </div>

        {/* State Machine Steps with Glass Card */}
        <div className="w-full space-y-3 text-left rounded-2xl glass-card border border-white/40 dark:border-white/10 p-5 text-xs">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Submission received &amp; static AST normalized</span>
          </div>
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
            <Zap className="w-4 h-4 shrink-0" />
            <span>{evaluationStep || 'Analyzing entity coupling, God classes, and method contracts...'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 font-medium">
            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
              3
            </div>
            <span>Evaluating SOLID conformance, race hazards, and trade-offs</span>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500 dark:text-emerald-400 border-emerald-500/40 shadow-emerald-500/20';
    if (score >= 70) return 'text-indigo-500 dark:text-indigo-400 border-indigo-500/40 shadow-indigo-500/20';
    if (score >= 50) return 'text-amber-500 dark:text-amber-400 border-amber-500/40 shadow-amber-500/20';
    return 'text-rose-500 dark:text-rose-400 border-rose-500/40 shadow-rose-500/20';
  };

  const getStatusPill = (status: 'PASS' | 'WARN' | 'FAIL') => {
    switch (status) {
      case 'PASS':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <Check className="w-3 h-3" /> PASS
          </span>
        );
      case 'WARN':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> WARN
          </span>
        );
      case 'FAIL':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> FAIL
          </span>
        );
    }
  };

  const rubric = evaluation.rubricBreakdown;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner with Realistic Score Radial & Actions */}
      <div className="rounded-3xl glass-panel border border-white/50 dark:border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Radial Score Circle with Specular Glow */}
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(
              evaluation.overallScore
            )} glass-card shadow-xl`}
          >
            <span className="text-4xl font-black font-mono tracking-tight">{evaluation.overallScore}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">/ 100</span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                Attempt #{attemptNumber}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  evaluation.verdict === 'Exemplary'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                    : evaluation.verdict === 'Strong'
                    ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                }`}
              >
                Verdict: {evaluation.verdict}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {evaluation.executionDurationMs}ms
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Evaluation Verdict: {evaluation.verdict}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {evaluation.explainableCritique.verdictSummary}
            </p>
          </div>
        </div>

        {/* Action Buttons: Try Again (Iterate) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
          <button
            onClick={onBackToEdit}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-card glass-card-hover text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
          >
            Review Code / UML
          </button>
          <button
            onClick={onTryAgain}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again (Iterate to v{attemptNumber + 1})</span>
          </button>
        </div>
      </div>

      {/* 5-Dimension Rubric Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            Multi-Criteria LLD Rubric Breakdown
          </h4>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            5 Dimensions · 20 Pts Each
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Single Responsibility (SRP) */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover border border-white/50 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                1. Single Responsibility (SRP)
              </span>
              {getStatusPill(rubric.singleResponsibility.status)}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {rubric.singleResponsibility.score}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 20</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {rubric.singleResponsibility.feedback}
            </p>
          </div>

          {/* 2. Abstraction & Interfaces */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover border border-white/50 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                2. Abstraction &amp; Interfaces
              </span>
              {getStatusPill(rubric.abstractionAndInterfaces.status)}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {rubric.abstractionAndInterfaces.score}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 20</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {rubric.abstractionAndInterfaces.feedback}
            </p>
          </div>

          {/* 3. Design Pattern Suitability */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover border border-white/50 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                3. Design Patterns
              </span>
              {getStatusPill(rubric.designPatternSuitability.status)}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {rubric.designPatternSuitability.score}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 20</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {rubric.designPatternSuitability.feedback}
            </p>
          </div>

          {/* 4. Open-Closed Extensibility */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover border border-white/50 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                4. Extensibility (OCP)
              </span>
              {getStatusPill(rubric.openClosedExtensibility.status)}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {rubric.openClosedExtensibility.score}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 20</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {rubric.openClosedExtensibility.feedback}
            </p>
          </div>

          {/* 5. Concurrency & Edge Cases */}
          <div className="p-6 rounded-3xl glass-card glass-card-hover border border-white/50 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                5. Concurrency &amp; Safety
              </span>
              {getStatusPill(rubric.concurrencyAndEdgeCases.status)}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {rubric.concurrencyAndEdgeCases.score}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 20</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {rubric.concurrencyAndEdgeCases.feedback}
            </p>
          </div>

          {/* Static Pre-Check Card */}
          <div className="p-6 rounded-3xl glass-card border border-white/40 dark:border-white/10 space-y-3 bg-white/30 dark:bg-black/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Deterministic Pre-Check
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Rule Engine
              </span>
            </div>
            <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300 font-mono">
              <li className="flex justify-between">
                <span className="text-slate-400">Entity Coverage:</span>
                <strong>{evaluation.deterministicFindings.entityCoverage.coveragePercent}%</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Abstraction Ratio:</span>
                <strong>{evaluation.deterministicFindings.couplingMetrics.abstractionRatio}</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Thread Locks:</span>
                <strong className={evaluation.deterministicFindings.concurrencySignals.hasSynchronization ? 'text-emerald-500' : 'text-amber-500'}>
                  {evaluation.deterministicFindings.concurrencySignals.hasSynchronization ? 'Detected' : 'None'}
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Explainable Critique Section: 4 Distinct Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-emerald-500/20 bg-emerald-500/5 space-y-4 shadow-sm">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Key Architectural Strengths
          </h4>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            {evaluation.explainableCritique.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Flaws & Anti-Patterns */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-rose-500/20 bg-rose-500/5 space-y-4 shadow-sm">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Critical Flaws &amp; Potential Anti-Patterns
          </h4>
          {evaluation.explainableCritique.criticalFlaws.length > 0 ? (
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              {evaluation.explainableCritique.criticalFlaws.map((flaw, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{flaw}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              No catastrophic anti-patterns detected in this iteration.
            </p>
          )}
        </div>

        {/* Refactoring Suggestions */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-indigo-500/20 bg-indigo-500/5 space-y-4 shadow-sm">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-500" />
            Actionable Refactoring Suggestions
          </h4>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            {evaluation.explainableCritique.refactoringSuggestions.map((ref, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{ref}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alternative Designs */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-purple-500/20 bg-purple-500/5 space-y-4 shadow-sm">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-500" />
            Alternative Architectural Designs
          </h4>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            {evaluation.explainableCritique.alternativeDesigns.map((alt, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{alt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
