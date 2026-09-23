import React from 'react';
import { Code2, Sparkles, Copy, Check, Terminal } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const [copied, setCopied] = React.useState(false);

  const lines = (value || '').split('\n');
  const lineCount = lines.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertInterfaceTemplate = () => {
    const template = `\n// Strategy Pattern Interface\nexport interface ISpotAssignmentStrategy {\n  assignSpot(vehicle: Vehicle, availableSpots: ParkingSpot[]): ParkingSpot | null;\n}\n`;
    onChange(value + template);
  };

  const insertLockTemplate = () => {
    const template = `\n// Fine-grained Concurrency Lock\nprivate readonly spotLock = new Mutex();\n\npublic async parkVehicle(vehicle: Vehicle): Promise<boolean> {\n  const release = await this.spotLock.acquire();\n  try {\n    if (this.isOccupied) return false;\n    this.assignedVehicle = vehicle;\n    this.isOccupied = true;\n    return true;\n  } finally {\n    release();\n  }\n}\n`;
    onChange(value + template);
  };

  return (
    <div className="flex flex-col h-full rounded-3xl glass-panel border border-white/50 dark:border-white/10 overflow-hidden shadow-2xl transition-colors">
      {/* Editor Header Bar with Realistic Window Controls & Glass Highlights */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-white/40 dark:bg-black/30 border-b border-white/30 dark:border-white/10 text-xs">
        <div className="flex items-center gap-3">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/30 shadow-xs" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/30 shadow-xs" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/30 shadow-xs" />
          </div>

          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-500" />
            <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
              Solution.ts
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md glass-pill text-slate-500 dark:text-slate-400">
              {lineCount} lines
            </span>
          </div>
        </div>

        {/* Quick Action Snippets */}
        <div className="flex items-center gap-2 pt-2 sm:pt-0">
          <button
            onClick={insertInterfaceTemplate}
            className="px-3 py-1.5 rounded-xl glass-card glass-card-hover text-slate-700 dark:text-slate-200 text-xs font-mono font-medium"
            title="Insert Interface contract template"
          >
            + Strategy Interface
          </button>
          <button
            onClick={insertLockTemplate}
            className="px-3 py-1.5 rounded-xl glass-card glass-card-hover text-slate-700 dark:text-slate-200 text-xs font-mono font-medium"
            title="Insert Thread-safe Lock template"
          >
            + Concurrency Lock
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl glass-card glass-card-hover text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            title="Copy Solution Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Body with Roomy Monospace Styling */}
      <div className="relative flex-1 p-5 sm:p-6 bg-slate-900/90 dark:bg-black/40 overflow-auto">
        <textarea
          aria-label="Code and Contracts Editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full h-full min-h-[500px] bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none selection:bg-indigo-500/40 tracking-wide"
          placeholder="// Define your classes, interfaces, method signatures, and concurrency logic here..."
        />
      </div>

      {/* Sleek IDE Footer */}
      <div className="px-5 py-3 bg-white/30 dark:bg-black/20 border-t border-white/20 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Tip: Prioritize clean interfaces, method contracts, and encapsulation over bloated implementations.</span>
        </span>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>UTF-8</span>
          <span>TypeScript / OOP</span>
        </div>
      </div>
    </div>
  );
};
