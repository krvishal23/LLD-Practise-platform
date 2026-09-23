import React, { useState, useEffect } from 'react';
import { PROBLEMS } from './data/problems';
import { Problem, Submission, EntityDefinition, DesignDecisions } from './types/lld';
import {
  getStoredAttempts,
  saveAttempt,
  createInitialSubmission,
  cloneForNextAttempt,
} from './utils/storage';
import { HybridEvaluator } from './services/evaluator/HybridEvaluator';
import { Navbar } from './components/Navbar';
import { ProblemSpecPanel } from './components/ProblemSpecPanel';
import { VisualUmlDiagram } from './components/VisualUmlDiagram';
import { EntityModeler } from './components/EntityModeler';
import { CodeEditor } from './components/CodeEditor';
import { DesignDecisionsForm } from './components/DesignDecisionsForm';
import { EvaluationView } from './components/EvaluationView';
import { AttemptHistoryModal } from './components/AttemptHistoryModal';
import { DocumentationModal } from './components/DocumentationModal';
import { TestSuiteModal } from './components/TestSuiteModal';
import {
  Sparkles,
  Send,
  Save,
  RotateCcw,
  BookOpen,
  Box,
  Code2,
  Lightbulb,
  FileCheck,
  ChevronRight,
  Eye,
  Sidebar,
  Maximize2,
  Columns,
  Layers,
  Check,
} from 'lucide-react';

export default function App() {
  const [activeProblem, setActiveProblem] = useState<Problem>(PROBLEMS[0]);
  const [attempts, setAttempts] = useState<Submission[]>([]);
  const [submission, setSubmission] = useState<Submission>(() =>
    createInitialSubmission(PROBLEMS[0], 1)
  );

  // Theme state: dark mode enabled by default
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Nav & Modals
  const [activeTab, setActiveTab] = useState<'workbench' | 'research' | 'design' | 'ai_usage' | 'tests'>(
    'workbench'
  );
  const [editorSubTab, setEditorSubTab] = useState<'uml' | 'entities' | 'code' | 'decisions'>('uml');
  const [viewMode, setViewMode] = useState<'edit' | 'evaluation'>('edit');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [docInitialTab, setDocInitialTab] = useState<'research' | 'design' | 'ai_usage' | 'readme'>('research');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Layout View Mode (Split, Canvas Fullscreen, Spec Fullscreen)
  const [layoutMode, setLayoutMode] = useState<'split' | 'canvas' | 'spec'>('split');

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStep, setEvaluationStep] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hybridEvaluator = React.useMemo(() => new HybridEvaluator(), []);

  // Load problem attempts when problem changes
  useEffect(() => {
    const loaded = getStoredAttempts(activeProblem.id);
    setAttempts(loaded);

    if (loaded.length > 0) {
      const latest = loaded[0];
      setSubmission(latest);
      if (latest.evaluation) {
        setViewMode('evaluation');
      } else {
        setViewMode('edit');
      }
    } else {
      const initial = createInitialSubmission(activeProblem, 1);
      setSubmission(initial);
      setViewMode('edit');
    }
  }, [activeProblem.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectProblem = (problem: Problem) => {
    setActiveProblem(problem);
  };

  const handleNavTab = (tab: 'workbench' | 'research' | 'design' | 'ai_usage' | 'tests') => {
    if (tab === 'workbench') {
      setActiveTab('workbench');
    } else if (tab === 'tests') {
      setIsTestModalOpen(true);
    } else {
      setDocInitialTab(tab as any);
      setIsDocModalOpen(true);
    }
  };

  // Submission Content Updaters
  const updateEntities = (entities: EntityDefinition[]) => {
    setSubmission((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      content: {
        ...prev.content,
        entities,
      },
    }));
  };

  const updateSourceCode = (code: string) => {
    setSubmission((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      content: {
        ...prev.content,
        sourceCode: code,
      },
    }));
  };

  const updateDesignDecisions = (decisions: DesignDecisions) => {
    setSubmission((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      content: {
        ...prev.content,
        designDecisions: decisions,
      },
    }));
  };

  // Template loader
  const handleLoadTemplate = (templateIndex: number) => {
    const tmpl = activeProblem.starterTemplates[templateIndex];
    if (!tmpl) return;

    if (window.confirm(`Load template "${tmpl.label}"? This will populate the domain canvas.`)) {
      setSubmission((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        content: JSON.parse(JSON.stringify(tmpl.content)),
      }));
      showToast(`Loaded template: ${tmpl.label}`);
    }
  };

  // Submit flow
  const handleSubmit = async () => {
    setIsEvaluating(true);
    setViewMode('evaluation');
    setEvaluationStep('Extracting static domain metrics and checking entity coverage...');

    try {
      await new Promise((r) => setTimeout(r, 600));
      setEvaluationStep('Invoking architectural reasoning engine (evaluating SOLID principles & concurrency)...');

      const result = await hybridEvaluator.evaluate(submission, activeProblem);

      const evaluatedSubmission: Submission = {
        ...submission,
        status: 'COMPLETED',
        updatedAt: new Date().toISOString(),
        evaluation: result,
      };

      setSubmission(evaluatedSubmission);
      saveAttempt(evaluatedSubmission);
      setAttempts(getStoredAttempts(activeProblem.id));
      showToast('Evaluation complete! Review your rubric breakdown.');
    } catch (e: any) {
      console.error('Submission evaluation failed', e);
      showToast('Evaluation failed; please retry.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Try again (iteration flow)
  const handleTryAgain = () => {
    const next = cloneForNextAttempt(submission);
    setSubmission(next);
    saveAttempt(next);
    setAttempts(getStoredAttempts(activeProblem.id));
    setViewMode('edit');
    setEditorSubTab('uml');
    showToast(`Started Attempt #${next.attemptNumber}! Refactor based on feedback.`);
  };

  return (
    <div className="min-h-screen realistic-ambient-bg arch-grid-pattern text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel border border-indigo-400/40 text-slate-900 dark:text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        problems={PROBLEMS}
        activeProblem={activeProblem}
        onSelectProblem={handleSelectProblem}
        activeTab={activeTab}
        onChangeTab={handleNavTab}
        attemptCount={attempts.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1900px] w-full mx-auto">
        {/* Left Side: Problem Specification Panel */}
        <div
          className={`shrink-0 transition-all duration-300 ${
            layoutMode === 'canvas'
              ? 'hidden'
              : layoutMode === 'spec'
              ? 'w-full h-[calc(100vh-4.5rem)] overflow-y-auto'
              : 'w-full lg:w-[420px] xl:w-[460px] h-[380px] lg:h-[calc(100vh-4.5rem)] border-b lg:border-b-0'
          }`}
        >
          {layoutMode === 'spec' && (
            <div className="p-3 bg-white/40 dark:bg-black/30 border-b border-white/20 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Full Spec View</span>
              <button
                onClick={() => setLayoutMode('split')}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold"
              >
                Back to Split View
              </button>
            </div>
          )}
          <ProblemSpecPanel problem={activeProblem} submission={submission} />
        </div>

        {/* Right Side: Modeling & Evaluation Workbench */}
        <div
          className={`flex-1 flex flex-col h-[calc(100vh-4.5rem)] overflow-y-auto ${
            layoutMode === 'spec' ? 'hidden' : ''
          }`}
        >
          {/* Sub-Header / Action Bar with Frosted Glass Styling */}
          <div className="sticky top-0 z-20 glass-panel border-b border-white/40 dark:border-white/10 px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl glass-pill text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                  {submission.title || `Attempt #${submission.attemptNumber}`}
                </span>

                {/* View Switcher: Edit vs Evaluation */}
                {submission.evaluation && (
                  <div className="flex rounded-xl glass-pill p-1 text-xs gap-1">
                    <button
                      onClick={() => setViewMode('edit')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        viewMode === 'edit'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Edit Design
                    </button>
                    <button
                      onClick={() => setViewMode('evaluation')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        viewMode === 'evaluation'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Feedback ({submission.evaluation.overallScore}/100)
                    </button>
                  </div>
                )}
              </div>

              {/* Layout Mode Toggles & Action Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Viewport Width Modes to Eliminate Congestion */}
                <div className="hidden md:flex items-center glass-pill p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setLayoutMode('split')}
                    className={`p-1.5 rounded-lg transition-all ${
                      layoutMode === 'split'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                    title="Split View (Spec & Canvas)"
                  >
                    <Columns className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLayoutMode('canvas')}
                    className={`p-1.5 rounded-lg transition-all ${
                      layoutMode === 'canvas'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                    title="Focus Canvas View (Full Width)"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setLayoutMode('spec')}
                    className={`p-1.5 rounded-lg transition-all ${
                      layoutMode === 'spec'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                    title="Focus Spec View"
                  >
                    <Sidebar className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Template selector & Draft save */}
                {viewMode === 'edit' && (
                  <>
                    <select
                      aria-label="Load Architecture Template"
                      onChange={(e) => {
                        if (e.target.value !== '') {
                          handleLoadTemplate(Number(e.target.value));
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="px-3 py-1.5 rounded-xl glass-input text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer outline-none"
                    >
                      <option value="" disabled>
                        Load Template...
                      </option>
                      {activeProblem.starterTemplates.map((t, idx) => (
                        <option key={idx} value={idx} className="bg-slate-50 dark:bg-slate-900">
                          {t.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        saveAttempt(submission);
                        showToast('Draft saved locally.');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-card glass-card-hover text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                    >
                      <Save className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="hidden sm:inline">Save Draft</span>
                    </button>
                  </>
                )}

                {/* Primary Evaluation Trigger Button */}
                {viewMode === 'edit' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isEvaluating}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit &amp; Evaluate</span>
                  </button>
                ) : (
                  <button
                    onClick={handleTryAgain}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again (Iterate to v{submission.attemptNumber + 1})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Workbench Body with Generous Padding */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
              {viewMode === 'evaluation' && submission.evaluation ? (
                <EvaluationView
                  evaluation={submission.evaluation}
                  isEvaluating={isEvaluating}
                  evaluationStep={evaluationStep}
                  onTryAgain={handleTryAgain}
                  onBackToEdit={() => setViewMode('edit')}
                  attemptNumber={submission.attemptNumber}
                />
              ) : isEvaluating ? (
                <EvaluationView
                  evaluation={null as any}
                  isEvaluating={true}
                  evaluationStep={evaluationStep}
                  onTryAgain={handleTryAgain}
                  onBackToEdit={() => setViewMode('edit')}
                  attemptNumber={submission.attemptNumber}
                />
              ) : (
                <div className="space-y-6 max-w-7xl mx-auto">
                  {/* 4 Tabs for Multi-Faceted Deliverables - Elevated Glass Container */}
                  <div className="p-1.5 rounded-2xl glass-card flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setEditorSubTab('uml')}
                      className={`flex items-center gap-2 py-2 px-4 text-xs font-bold rounded-xl transition-all ${
                        editorSubTab === 'uml'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live UML Diagram</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 dark:bg-black/20">
                        {submission.content.entities?.length || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => setEditorSubTab('entities')}
                      className={`flex items-center gap-2 py-2 px-4 text-xs font-bold rounded-xl transition-all ${
                        editorSubTab === 'entities'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Entity Modeler</span>
                    </button>

                    <button
                      onClick={() => setEditorSubTab('code')}
                      className={`flex items-center gap-2 py-2 px-4 text-xs font-bold rounded-xl transition-all ${
                        editorSubTab === 'code'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code &amp; Contracts</span>
                    </button>

                    <button
                      onClick={() => setEditorSubTab('decisions')}
                      className={`flex items-center gap-2 py-2 px-4 text-xs font-bold rounded-xl transition-all ${
                        editorSubTab === 'decisions'
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Design Decisions &amp; Trade-offs</span>
                    </button>
                  </div>

                  {/* Tab Views */}
                  {editorSubTab === 'uml' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2 px-1">
                        <span>Interactive blueprint visualization of your domain classes, interfaces, and structural relationships.</span>
                        <button
                          onClick={() => setEditorSubTab('entities')}
                          className="text-indigo-600 hover:text-indigo-700 dark:text-cyan-400 font-bold flex items-center gap-1.5 transition-colors"
                        >
                          + Add or Edit Domain Entities &rarr;
                        </button>
                      </div>
                      <VisualUmlDiagram entities={submission.content.entities} />
                    </div>
                  )}

                  {editorSubTab === 'entities' && (
                    <EntityModeler
                      entities={submission.content.entities || []}
                      onChangeEntities={updateEntities}
                    />
                  )}

                  {editorSubTab === 'code' && (
                    <CodeEditor
                      value={submission.content.sourceCode || ''}
                      onChange={updateSourceCode}
                    />
                  )}

                  {editorSubTab === 'decisions' && (
                    <DesignDecisionsForm
                      decisions={submission.content.designDecisions}
                      onChange={updateDesignDecisions}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
      </main>

      {/* Attempt History Modal */}
      <AttemptHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        attempts={attempts}
        onLoadAttempt={(att) => {
          setSubmission(att);
          if (att.evaluation) setViewMode('evaluation');
          else setViewMode('edit');
        }}
      />

      {/* Deliverables Documentation Modal */}
      {isDocModalOpen && (
        <DocumentationModal
          initialTab={docInitialTab}
          onClose={() => setIsDocModalOpen(false)}
        />
      )}

      {/* Automated Test Suite Modal */}
      <TestSuiteModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}
