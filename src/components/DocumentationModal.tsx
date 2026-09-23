import React, { useState } from 'react';
import { X, BookOpen, FileText, Bot, Layers, CheckCircle2, ChevronRight } from 'lucide-react';

interface DocumentationModalProps {
  initialTab?: 'research' | 'design' | 'ai_usage' | 'readme';
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  initialTab = 'research',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'research' | 'design' | 'ai_usage' | 'readme'>(initialTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="rounded-3xl glass-panel border border-white/50 dark:border-white/10 shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header with Segmented Deliverable Tabs */}
        <div className="flex flex-wrap items-center justify-between px-6 sm:px-8 py-4 border-b border-white/30 dark:border-white/10 bg-white/40 dark:bg-black/30 gap-3">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-1 rounded-2xl glass-pill">
            <button
              onClick={() => setActiveTab('research')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'research'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Research Note</span>
            </button>

            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'design'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Design Note &amp; 5 Questions</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_usage')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'ai_usage'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Usage (Decisions)</span>
            </button>

            <button
              onClick={() => setActiveTab('readme')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'readme'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>README</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reader Body with Roomy Spacing & Clean Typography */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed space-y-6">
          {activeTab === 'research' && (
            <div className="space-y-6">
              <div className="border-b border-white/20 dark:border-white/10 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 glass-pill">
                  Deliverable 1 · Problem Framing &amp; Competitive Analysis
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                  Research Note: The Low-Level Design (LLD) Practice Dilemma
                </h2>
              </div>

              <div className="p-6 rounded-3xl glass-card space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  1. Executive Summary &amp; The Learner Problem
                </h3>
                <p>
                  Practicing Low-Level Design (Object-Oriented Design) is a notorious bottleneck for software engineers preparing for senior technical interviews and real-world system architecture:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    <strong>The Evaluation Dilemma:</strong> In algorithmic coding (LeetCode), learners get binary deterministic feedback (<code>Accepted</code> vs <code>Wrong Answer</code>). In LLD, there is rarely a single &ldquo;correct&rdquo; answer. Multiple distinct class hierarchies and design patterns can satisfy a prompt (e.g., State Pattern vs Command Pattern in an Elevator system).
                  </li>
                  <li>
                    <strong>Silent Anti-Patterns:</strong> A learner can spend 45 minutes coding a Parking Lot or Vending Machine in Java or C++, feel confident, yet have completely violated the Open-Closed Principle, created an 800-line God class, coupled persistence with domain models, or forgotten thread-safety during spot allocation.
                  </li>
                  <li>
                    <strong>The &ldquo;Uncertainty Void&rdquo;:</strong> Without senior engineering mentorship, learners repeat the same structural flaws across multiple practice problems, cementing bad habits.
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-3xl glass-card space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  2. Competitive Landscape &amp; Existing Tools Researched
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-white/20">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-white/40 dark:bg-black/30 font-bold text-slate-900 dark:text-white">
                      <tr>
                        <th className="p-3 border-b border-white/20">Platform / Tool</th>
                        <th className="p-3 border-b border-white/20">Delivery Format</th>
                        <th className="p-3 border-b border-white/20">Evaluation Capability</th>
                        <th className="p-3 border-b border-white/20">Critical Gap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="p-3 font-bold">LeetCode / HackerRank</td>
                        <td className="p-3">Code editor + unit tests</td>
                        <td className="p-3">Binary pass/fail test runner</td>
                        <td className="p-3">Focuses on algorithmic puzzles; unable to evaluate class abstractions, interfaces, or SOLID principles.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Educative (Grokking OOD)</td>
                        <td className="p-3">Static text &amp; diagrams</td>
                        <td className="p-3">Passive reading / quizzes</td>
                        <td className="p-3">Purely passive reading. No feedback on learner&apos;s own design attempts; learners memorize rather than practice.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Interviewing.io / Pramp</td>
                        <td className="p-3">1-on-1 human mocks</td>
                        <td className="p-3">High-quality mentor feedback</td>
                        <td className="p-3">Prohibitively expensive ($150&ndash;$250/hr); cannot be repeated 20 times for daily practice.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Generic Chatbots</td>
                        <td className="p-3">Unstructured prompt box</td>
                        <td className="p-3">General text critique</td>
                        <td className="p-3">Inconsistent scoring, lacks standardized rubric, no attempt versioning, no entity model verification.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 rounded-3xl glass-card space-y-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  3. Key Gaps &amp; Product Direction
                </h3>
                <p>
                  To provide an effective practice experience, our platform establishes a standardized 3-layer submission (Entities, Contracts, and Justified Trade-offs) paired with a Hybrid Evaluator (deterministic heuristics + Gemini 3.8 Flash reasoning) and versioned attempt iteration.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <div className="border-b border-white/20 dark:border-white/10 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 glass-pill">
                  Deliverable 2 · Architecture &amp; The 5 Main Questions
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                  Design Note: Architecture &amp; Technical Answers
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Q1: What does a learner actually need to provide for an LLD attempt to be meaningful?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    A raw code dump alone is too unstructured; a simple box diagram alone lacks method semantics. An LLD attempt is only meaningful when it combines:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li><strong>Domain Model &amp; Entities:</strong> Clear definitions of classes, interfaces, inheritance, and composition.</li>
                    <li><strong>Contracts &amp; Method Signatures:</strong> Public APIs, abstraction points, and state representations.</li>
                    <li><strong>Explicit Design Decisions &amp; Trade-Offs:</strong> Stating <em>why</em> a pattern was chosen, how concurrency is handled, and how future requirements can extend the system without touching tested classes.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Q2: What makes feedback useful when there can be more than one valid LLD solution?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Feedback is made actionable by:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li>Evaluating against <strong>fundamental heuristics</strong> (SOLID, Coupling, Cohesion, Concurrency) rather than matching a single golden AST.</li>
                    <li>Providing <strong>pros &amp; cons</strong> of chosen trade-offs (e.g. enum vs class hierarchy).</li>
                    <li>Supplying <strong>concrete refactoring steps</strong> (e.g. &ldquo;Extract SpotAssignmentStrategy out of ParkingLot&rdquo;).</li>
                    <li>Presenting <strong>alternative architectural designs</strong> (e.g. Event-driven Observer vs State pattern).</li>
                  </ul>
                </div>

                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Q3: Which parts of evaluation should be deterministic, and which parts benefit from an LLM?
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li><strong>Deterministic:</strong> Entity coverage check (100% precision), God-class detection (classes with &gt; 6 methods/fields), interface-to-class abstraction ratio, and concurrency keywords.</li>
                    <li><strong>LLM Reasoning:</strong> Semantic responsibility boundaries, design pattern suitability vs over-engineering, and the depth of trade-off justifications.</li>
                  </ul>
                </div>

                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Q4: How would the design accommodate another evaluation approach or submission format later?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Strict implementation of the <strong>Strategy Pattern</strong>: <code>IEvaluator</code> is implemented by <code>DeterministicRuleEvaluator</code>, <code>LLMReasoningEvaluator</code>, and <code>HybridEvaluator</code>. Pluggable submission parsers (<code>ISubmissionParser</code>) can be added for PlantUML, Mermaid markdown, or AST parsers.
                  </p>
                </div>

                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Q5: What should happen if evaluation takes time or fails?
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    The platform utilizes an async state machine (<code>QUEUED &rarr; EVALUATING &rarr; COMPLETED / FAILED</code>) with a 18s resilient timeout. If the LLM call times out or errors, the system seamlessly falls back to deterministic rule analysis, ensuring the learner is never stuck!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai_usage' && (
            <div className="space-y-6">
              <div className="border-b border-white/20 dark:border-white/10 pb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 glass-pill">
                  Deliverable 5 · AI_USAGE.md
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                  AI Usage: Meaningful Architectural Decisions
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Decision 1: Submission Format Architecture
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>AI Suggested:</strong> Requiring the learner to write and compile a runnable multi-file Java/TypeScript project in WebAssembly.
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    &bull; Accepted: Multi-faceted structured submission (Entities, Contracts, Code, Decisions).
                  </p>
                  <p className="text-rose-600 dark:text-rose-400 font-semibold">
                    &bull; Rejected: Mandatory sandbox compilation and execution.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs italic">
                    Why: LLD interviews evaluate abstractions and trade-offs. Forcing WebAssembly compilation causes learners to spend 80% of time fixing trivial import errors instead of reasoning about SOLID principles.
                  </p>
                </div>

                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Decision 2: Hybrid Evaluation vs Pure LLM Scoring
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>AI Suggested:</strong> Directly prompting Gemini with raw submission text and using its free-form score.
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    &bull; Accepted: Gemini 3.8 Flash for semantic reasoning and critique.
                  </p>
                  <p className="text-rose-600 dark:text-rose-400 font-semibold">
                    &bull; Rejected: Sole reliance on LLM without deterministic grounding.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs italic">
                    Why: Pure LLMs can hallucinate coverage. Grounding the prompt with deterministic static analysis yields rigorous, reproducible evaluations and guarantees an instant fallback.
                  </p>
                </div>

                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Decision 3: Evaluation Rubric Scope
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>AI Suggested:</strong> 10-criterion rubric including database sharding, Kubernetes pods, and CDN caching.
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    &bull; Accepted: 5-dimension rubric strictly tailored to LLD (SRP, Abstraction, Patterns, Extensibility, Concurrency).
                  </p>
                  <p className="text-rose-600 dark:text-rose-400 font-semibold">
                    &bull; Rejected: High-Level Design (HLD) infrastructure concerns.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs italic">
                    Why: Assignment boundary explicitly states: &ldquo;LLD focus: classes, objects, responsibilities, interfaces, behaviour, relationships, patterns, extensibility, and code-level decisions. Do not spend majority of time on Kubernetes, microservices, CDN design.&rdquo;
                  </p>
                </div>

                <div className="p-6 rounded-3xl glass-card space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Decision 4: Attempt History &amp; Progression Loop
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>AI Suggested:</strong> Single-shot submit &amp; forget quiz model.
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    &bull; Accepted: Versioned attempt history with score delta and automated &ldquo;Try Again&rdquo; flow.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs italic">
                    Why: The prompt emphasizes: &ldquo;The learner can see previous attempts so the product supports improvement, not just one-time solving.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl glass-card space-y-3">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Project Overview &amp; Architecture
                </h2>
                <p>
                  This prototype delivers an end-to-end Low-Level Design practice platform built using React 19, TypeScript, Tailwind CSS, Express, and Google GenAI SDK.
                </p>
                <div className="p-4 bg-slate-950/80 text-cyan-300 rounded-2xl font-mono text-xs border border-white/10 space-y-1">
                  <div>npm run dev # Launches full-stack server on port 3000</div>
                  <div>npm run build # Produces production bundle</div>
                  <div>npm run lint # Validates TypeScript types</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-white/30 dark:bg-black/20 border-t border-white/20 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl glass-card text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-white/60 transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
