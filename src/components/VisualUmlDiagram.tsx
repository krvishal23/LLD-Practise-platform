import React from 'react';
import { EntityDefinition } from '../types/lld';
import { Box, ArrowRight, Layers, FileCode, CheckCircle2 } from 'lucide-react';

interface VisualUmlDiagramProps {
  entities: EntityDefinition[];
}

export const VisualUmlDiagram: React.FC<VisualUmlDiagramProps> = ({ entities }) => {
  if (!entities || entities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 sm:p-20 text-center rounded-3xl glass-card border border-dashed border-white/50 dark:border-white/10 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 glass-pill border border-indigo-500/20">
          <Box className="w-8 h-8" />
        </div>
        <div>
          <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
            No Architecture Entities Defined Yet
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mt-1 leading-relaxed">
            Add your domain classes, interfaces, and relationships in the Entity Modeler tab, or load a starter template above to visualize the live UML diagram.
          </p>
        </div>
      </div>
    );
  }

  const getTypeBadge = (type: EntityDefinition['type']) => {
    switch (type) {
      case 'interface':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
      case 'abstract_class':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'enum':
        return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
    }
  };

  const getRelationshipBadge = (type: string) => {
    switch (type) {
      case 'inheritance':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20';
      case 'composition':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20';
      case 'aggregation':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Architectural Legend - Frosted Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-white/40 dark:border-white/10 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Entity Types:
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20">
            class
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20">
            &laquo;interface&raquo;
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
            &laquo;abstract&raquo;
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20">
            enum
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-200">Relationships:</span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20">
            inherits (&rarr;)
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20">
            composes (&diams;)
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
            aggregates (&loz;)
          </span>
        </div>
      </div>

      {/* Grid of UML Class Diagram Cards with Generous Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {entities.map((entity) => (
          <div
            key={entity.id || entity.name}
            className="flex flex-col glass-card glass-card-hover rounded-2xl border border-white/50 dark:border-white/10 overflow-hidden shadow-lg"
          >
            {/* Class Header Compartment */}
            <div className="p-4 sm:p-5 border-b border-white/30 dark:border-white/10 bg-white/40 dark:bg-white/5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${getTypeBadge(entity.type)}`}>
                  {entity.type === 'interface'
                    ? '<<interface>>'
                    : entity.type === 'abstract_class'
                    ? '<<abstract>>'
                    : entity.type}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {entity.methods?.length || 0} methods
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-mono tracking-tight truncate">
                {entity.name}
              </h3>

              {entity.responsibilities && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                  {entity.responsibilities}
                </p>
              )}
            </div>

            {/* Attributes Compartment */}
            <div className="p-4 sm:p-5 border-b border-white/20 dark:border-white/5 bg-white/20 dark:bg-black/10 flex-1 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 block">
                Attributes &amp; State
              </span>
              {entity.fields && entity.fields.length > 0 ? (
                <ul className="space-y-1.5 text-xs font-mono text-slate-700 dark:text-slate-200">
                  {entity.fields.map((field, idx) => (
                    <li
                      key={idx}
                      className="p-1.5 rounded-lg bg-white/40 dark:bg-white/5 border border-white/10 truncate hover:bg-white/60 transition-colors"
                      title={field}
                    >
                      {field}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic block py-1">
                  No attributes specified
                </span>
              )}
            </div>

            {/* Methods / Operations Compartment */}
            <div className="p-4 sm:p-5 border-b border-white/20 dark:border-white/5 bg-white/40 dark:bg-white/5 flex-1 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 block">
                Operations &amp; Contracts
              </span>
              {entity.methods && entity.methods.length > 0 ? (
                <ul className="space-y-1.5 text-xs font-mono text-slate-800 dark:text-slate-100">
                  {entity.methods.map((method, idx) => (
                    <li
                      key={idx}
                      className="p-1.5 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20 truncate hover:bg-white/70 transition-colors"
                      title={method}
                    >
                      {method}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-slate-400 dark:text-slate-500 italic block py-1">
                  No operations specified
                </span>
              )}
            </div>

            {/* Outgoing Structural Relationships */}
            {entity.relationships && entity.relationships.length > 0 && (
              <div className="p-4 bg-white/30 dark:bg-black/20 text-xs border-t border-white/20 dark:border-white/10 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 block">
                  Associations &amp; Dependencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {entity.relationships.map((rel, i) => (
                    <span
                      key={i}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono flex items-center gap-1.5 shadow-xs ${getRelationshipBadge(
                        rel.type
                      )}`}
                    >
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      <span className="font-bold">{rel.target}</span>
                      <span className="text-[9px] opacity-75 uppercase">({rel.type})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
