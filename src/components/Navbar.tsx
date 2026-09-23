import React, { useState, useEffect } from 'react';
import { Problem } from '../types/lld';
import {
  BookOpen,
  Layers,
  FileText,
  Bot,
  TestTube2,
  History,
  Clock,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  problems: Problem[];
  activeProblem: Problem;
  onSelectProblem: (problem: Problem) => void;
  activeTab: 'workbench' | 'research' | 'design' | 'ai_usage' | 'tests';
  onChangeTab: (tab: 'workbench' | 'research' | 'design' | 'ai_usage' | 'tests') => void;
  attemptCount: number;
  onOpenHistory: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  problems,
  activeProblem,
  onSelectProblem,
  activeTab,
  onChangeTab,
  attemptCount,
  onOpenHistory,
  isDarkMode = true,
  onToggleDarkMode,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'HARD':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-white/40 dark:border-white/10 transition-colors">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 sm:gap-6">
          {/* Brand Logo & Title with Specular Lighting */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="relative group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-white/20 transition-transform group-hover:scale-105">
                <Layers className="w-5 h-5" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-sm -z-10 group-hover:bg-indigo-500/30 transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  LLD Practice Platform
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 glass-pill">
                  Arch Workbench
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block tracking-normal">
                Architectural Domain Modeler · Concurrency &amp; SOLID Rubrics
              </p>
            </div>
          </div>

          {/* Problem Selector Dropdown - Spacious Glass Card */}
          <div className="flex items-center gap-3 max-w-lg w-full">
            <div className="relative w-full">
              <select
                aria-label="Select LLD Practice Problem"
                value={activeProblem.id}
                onChange={(e) => {
                  const found = problems.find((p) => p.id === e.target.value);
                  if (found) onSelectProblem(found);
                }}
                className="w-full pl-3.5 pr-9 py-2 text-xs sm:text-sm glass-input rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer truncate appearance-none"
              >
                {problems.map((prob) => (
                  <option key={prob.id} value={prob.id} className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {prob.title} — {prob.category} ({prob.difficulty})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <span
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold tracking-wide ${getDifficultyBadge(
                  activeProblem.difficulty
                )}`}
              >
                {activeProblem.difficulty}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 glass-pill px-2.5 py-1 rounded-lg border">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{activeProblem.estimatedMinutes}m</span>
              </span>
            </div>
          </div>

          {/* Navigation Deliverables & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Nav Deliverable Tabs */}
            <div className="flex items-center p-1 rounded-xl glass-pill gap-1">
              <button
                onClick={() => onChangeTab('workbench')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'workbench'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Workbench</span>
              </button>

              <button
                onClick={() => onChangeTab('research')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'research'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
                title="Learner Problem, Tools Researched, Key Gaps"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Research</span>
              </button>

              <button
                onClick={() => onChangeTab('design')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'design'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
                title="Design Note (MVP Explanation, Interfaces, 5 Questions)"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Design Note</span>
              </button>

              <button
                onClick={() => onChangeTab('ai_usage')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'ai_usage'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
                title="AI Usage Note (3-5 Decisions)"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">AI Usage</span>
              </button>

              <button
                onClick={() => onChangeTab('tests')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'tests'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                }`}
                title="Automated Test Suite Runner"
              >
                <TestTube2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden xl:inline">Tests</span>
              </button>
            </div>

            {/* History Pill Button */}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl glass-card glass-card-hover text-slate-700 dark:text-slate-200 border"
              title="View Attempt History & Iterations"
            >
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">History</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10px] font-mono shadow-xs">
                {attemptCount}
              </span>
            </button>

            {/* Theme Toggle (Dark / Light Glass) */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-xl glass-card glass-card-hover text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                title={isDarkMode ? 'Switch to Light Crystal Glass' : 'Switch to Dark Slate Glass'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
