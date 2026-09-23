import React, { useState } from 'react';
import { Problem, Submission } from '../types/lld';
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ListOrdered,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Layers,
} from 'lucide-react';

interface ProblemSpecPanelProps {
  problem: Problem;
  submission: Submission;
}

export const ProblemSpecPanel: React.FC<ProblemSpecPanelProps> = ({ problem, submission }) => {
  const [activeTab, setActiveTab] = useState<'requirements' | 'checklist' | 'reference'>('requirements');
  const [expandedSection, setExpandedSection] = useState<'func' | 'nonfunc' | 'constraints'>('func');

  // Check which key entities are present in current submission
  const entityNames = (submission.content.entities || []).map((e) => e.name.toLowerCase());
  const code = (submission.content.sourceCode || '').toLowerCase();

  const entityStatus = problem.keyEntities.map((expected) => {
    const expLower = expected.toLowerCase();
    const inEntities = entityNames.some((n) => n.includes(expLower) || expLower.includes(n));
    const inCode = code.includes(expLower);
    return {
      name: expected,
      present: inEntities || inCode,
    };
  });

  const coveredCount = entityStatus.filter((e) => e.present).length;
  const coveragePercent = Math.round((coveredCount / problem.keyEntities.length) * 100);

  return (
    <div className="flex flex-col h-full glass-panel border-r border-white/40 dark:border-white/10 transition-colors">
      {/* Top Header with Ample Breathing Room */}
      <div className="p-5 sm:p-6 border-b border-white/30 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 glass-pill">
              {problem.category}
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            Est. {problem.estimatedMinutes} mins
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            {problem.title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {problem.brief}
          </p>
        </div>

        {/* Live Entity Coverage Realistic Glass Card */}
        <div className="p-4 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Domain Entity Coverage
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs px-2 py-0.5 rounded-md bg-white/50 dark:bg-white/5 border border-white/20">
              {coveredCount} / {problem.keyEntities.length} ({coveragePercent}%)
            </span>
          </div>

          {/* Smooth Glass Meter */}
          <div className="w-full h-2 bg-slate-200/60 dark:bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                coveragePercent >= 75
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : coveragePercent >= 50
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-rose-500 to-red-400'
              }`}
              style={{ width: `${coveragePercent}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {entityStatus.map((ent) => (
              <span
                key={ent.name}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5 border transition-all ${
                  ent.present
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 shadow-xs'
                    : 'bg-slate-500/5 text-slate-500 dark:text-slate-400 border-white/10 opacity-70'
                }`}
              >
                {ent.present ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-400/50 shrink-0" />
                )}
                <span>{ent.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Segmented Glass Tabs */}
      <div className="px-5 pt-3 border-b border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/10">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'requirements'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Requirements
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'checklist'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Evaluation Checklist
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'reference'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Reference Solution
          </button>
        </div>
      </div>

      {/* Spacious Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
        {activeTab === 'requirements' && (
          <div className="space-y-4">
            {/* Functional Requirements Accordion */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/40 dark:border-white/10 shadow-xs">
              <button
                onClick={() => setExpandedSection(expandedSection === 'func' ? ('' as any) : 'func')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-bold text-slate-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-2 text-xs sm:text-sm">
                  <ListOrdered className="w-4 h-4 text-indigo-500" />
                  Functional Requirements
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {problem.requirements.functional.length}
                  </span>
                </span>
                {expandedSection === 'func' ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedSection === 'func' && (
                <div className="p-4 sm:p-5 pt-0 space-y-3">
                  <div className="h-px bg-white/20 dark:bg-white/5 mb-3" />
                  {problem.requirements.functional.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 text-slate-700 dark:text-slate-200 leading-relaxed text-xs"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-lg bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] font-mono mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Non-Functional Requirements Accordion */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/40 dark:border-white/10 shadow-xs">
              <button
                onClick={() => setExpandedSection(expandedSection === 'nonfunc' ? ('' as any) : 'nonfunc')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-bold text-slate-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-2 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Non-Functional &amp; SOLID
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {problem.requirements.nonFunctional.length}
                  </span>
                </span>
                {expandedSection === 'nonfunc' ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedSection === 'nonfunc' && (
                <div className="p-4 sm:p-5 pt-0 space-y-3">
                  <div className="h-px bg-white/20 dark:bg-white/5 mb-3" />
                  {problem.requirements.nonFunctional.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 text-slate-700 dark:text-slate-200 leading-relaxed text-xs"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] font-mono mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Constraints Accordion */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/40 dark:border-white/10 shadow-xs">
              <button
                onClick={() => setExpandedSection(expandedSection === 'constraints' ? ('' as any) : 'constraints')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-bold text-slate-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-2 text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Domain &amp; Concurrency Constraints
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {problem.requirements.constraints.length}
                  </span>
                </span>
                {expandedSection === 'constraints' ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {expandedSection === 'constraints' && (
                <div className="p-4 sm:p-5 pt-0 space-y-3">
                  <div className="h-px bg-white/20 dark:bg-white/5 mb-3" />
                  {problem.requirements.constraints.map((req, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 text-slate-700 dark:text-slate-200 leading-relaxed text-xs"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10px] font-mono mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Patterns Box */}
            <div className="p-5 rounded-2xl glass-card border border-indigo-500/20 bg-indigo-500/5 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-500" />
                Recommended Design Patterns
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {problem.recommendedPatterns.map((pat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 text-slate-700 dark:text-slate-200 text-xs font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{pat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-3.5">
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              The Hybrid Evaluator validates your submission against these senior architectural requirements:
            </p>
            {problem.evaluationChecklist.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-card border border-white/40 dark:border-white/10 space-y-2 hover:border-indigo-400/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {item.name}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      item.importance === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {item.importance}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reference' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 bg-emerald-500/5 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Architectural Discussion Notes
              </h4>
              <p className="text-slate-700 dark:text-slate-200 text-xs leading-relaxed">
                {problem.referenceSolution.discussionNotes}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Pattern &amp; Trade-off Strategy:
              </h4>
              <div className="p-4 rounded-2xl glass-card border border-white/30 dark:border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Design Patterns
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {problem.referenceSolution.designDecisions.patternsUsed}
                </p>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-white/30 dark:border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                  Concurrency Strategy
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {problem.referenceSolution.designDecisions.concurrencyStrategy}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
