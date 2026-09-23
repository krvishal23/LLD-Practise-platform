import React from 'react';
import { DesignDecisions } from '../types/lld';
import { Lightbulb, Lock, GitBranch, Scale, Sparkles } from 'lucide-react';

interface DesignDecisionsFormProps {
  decisions: DesignDecisions;
  onChange: (decisions: DesignDecisions) => void;
}

export const DesignDecisionsForm: React.FC<DesignDecisionsFormProps> = ({ decisions, onChange }) => {
  const updateField = (field: keyof DesignDecisions, value: string) => {
    onChange({
      ...decisions,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Why This Matters Callout Banner */}
      <div className="p-5 sm:p-6 rounded-3xl glass-card border border-indigo-500/20 bg-indigo-500/5 space-y-2">
        <h4 className="font-extrabold text-sm sm:text-base text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-500" />
          Senior Interviewer Architectural Evaluation Criteria
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Staff and Principal software engineers are evaluated on technical reasoning and architectural judgment. Articulating <em>why</em> you chose a specific pattern, how you safeguard concurrent execution, and which trade-offs you deliberately accepted is what separates a routine coder from a senior system architect.
        </p>
      </div>

      {/* 1. Design Patterns & Applicability */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/50 dark:border-white/10 space-y-3.5 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              1. Design Patterns &amp; Applicability
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Which design patterns did you employ and what specific coupling problems do they solve?
            </p>
          </div>
        </div>

        <textarea
          rows={4}
          value={decisions.patternsUsed || ''}
          onChange={(e) => updateField('patternsUsed', e.target.value)}
          placeholder="e.g. Employed the Strategy Pattern for SpotAssignmentStrategy and PricingStrategy so algorithms can be swapped dynamically at runtime without modifying the ParkingLot orchestrator..."
          className="w-full p-4 rounded-2xl glass-input text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none font-normal"
        />
      </div>

      {/* 2. Concurrency Strategy */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/50 dark:border-white/10 space-y-3.5 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              2. Concurrency &amp; Thread-Safety Strategy
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              How do you prevent race conditions, deadlocks, and double-allocation under high throughput?
            </p>
          </div>
        </div>

        <textarea
          rows={4}
          value={decisions.concurrencyStrategy || ''}
          onChange={(e) => updateField('concurrencyStrategy', e.target.value)}
          placeholder="e.g. Used fine-grained mutex locking on individual ParkingSpot transitions rather than a coarse lock on the entire lot to maximize parallel entrance gate throughput..."
          className="w-full p-4 rounded-2xl glass-input text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none font-normal"
        />
      </div>

      {/* 3. Extensibility (OCP) */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/50 dark:border-white/10 space-y-3.5 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              3. Extensibility (Open-Closed Principle)
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              How can new requirements or vehicle types be added without modifying existing tested classes?
            </p>
          </div>
        </div>

        <textarea
          rows={4}
          value={decisions.extensibilityNotes || ''}
          onChange={(e) => updateField('extensibilityNotes', e.target.value)}
          placeholder="e.g. New vehicle types implement the abstract Vehicle interface; new pricing tariffs implement PricingStrategy without needing code changes to ParkingLot or Ticket..."
          className="w-full p-4 rounded-2xl glass-input text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none font-normal"
        />
      </div>

      {/* 4. Trade-offs Considered */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-white/50 dark:border-white/10 space-y-3.5 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              4. Key Trade-offs Considered
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              What compromises did you evaluate (e.g. memory overhead vs latency, sync vs async)?
            </p>
          </div>
        </div>

        <textarea
          rows={4}
          value={decisions.tradeoffsConsidered || ''}
          onChange={(e) => updateField('tradeoffsConsidered', e.target.value)}
          placeholder="e.g. Chose in-memory indexed hash maps for active tickets to achieve O(1) retrieval latency at the cost of memory. State pattern introduces more classes but eliminates brittle conditionals..."
          className="w-full p-4 rounded-2xl glass-input text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none font-normal"
        />
      </div>
    </div>
  );
};
