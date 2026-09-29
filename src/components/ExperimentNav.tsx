import React from 'react';
import { Experiment, ExperimentId } from '../types/dsa';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface ExperimentNavProps {
  experiments: Experiment[];
  activeExperimentId: ExperimentId;
  onSelectExperiment: (id: ExperimentId) => void;
  completedIds: Set<ExperimentId>;
}

export const ExperimentNav: React.FC<ExperimentNavProps> = ({
  experiments,
  activeExperimentId,
  onSelectExperiment,
  completedIds
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-1">
      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span>Lab Experiments</span>
        <span className="font-mono text-sky-400">{completedIds.size}/{experiments.length} Done</span>
      </div>

      <div className="space-y-1">
        {experiments.map((exp) => {
          const isActive = exp.id === activeExperimentId;
          const isDone = completedIds.has(exp.id);

          return (
            <button
              key={exp.id}
              onClick={() => onSelectExperiment(exp.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-150 flex items-start gap-3 border ${
                isActive
                  ? 'bg-slate-800/90 border-sky-500/50 text-white shadow-sm'
                  : 'bg-slate-950/40 border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-600'}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold truncate ${isActive ? 'text-sky-300' : 'text-slate-300'}`}>
                    {exp.number}. {exp.shortTitle}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {exp.recommendedMinutes}m
                  </span>
                </div>

                {/* Unboxed metadata with typographic separators */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1 truncate">
                  <span>{exp.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{isDone ? 'Completed' : isActive ? 'In Progress' : 'Pending'}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
