import React from 'react';
import { ComplexityInfo } from '../types/dsa';
import { Zap, Clock, ShieldAlert, Database, Info, Layers } from 'lucide-react';

interface ComplexityCardProps {
  complexity: ComplexityInfo;
}

export const ComplexityCard: React.FC<ComplexityCardProps> = ({ complexity }) => {
  return (
    <div className="p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <h4 className="text-sm font-semibold text-slate-100">
            Asymptotic Complexity Analysis (Time & Space Invariants)
          </h4>
        </div>
        <span className="text-xs text-sky-400 font-mono font-medium">Formal Big-O Invariants</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Best Case */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 space-y-2 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-300">Best Time Complexity</span>
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400 leading-snug break-words">
            {complexity.bestTime}
          </div>
          <span className="text-[10px] text-slate-500 font-sans block pt-1 border-t border-slate-900">
            Optimal execution path
          </span>
        </div>

        {/* Average Case */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 space-y-2 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold text-slate-300">Average Time Complexity</span>
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-sky-400 leading-snug break-words">
            {complexity.averageTime}
          </div>
          <span className="text-[10px] text-slate-500 font-sans block pt-1 border-t border-slate-900">
            Expected random inputs
          </span>
        </div>

        {/* Worst Case */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 space-y-2 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold text-slate-300">Worst Time Complexity</span>
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-rose-400 leading-snug break-words">
            {complexity.worstTime}
          </div>
          <span className="text-[10px] text-slate-500 font-sans block pt-1 border-t border-slate-900">
            Pathological / reversed inputs
          </span>
        </div>

        {/* Space Complexity */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 space-y-2 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Database className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-300">Auxiliary Space</span>
          </div>
          <div className="text-xs sm:text-sm font-mono font-bold text-amber-400 leading-snug break-words">
            {complexity.space}
          </div>
          <span className="text-[10px] text-slate-500 font-sans block pt-1 border-t border-slate-900">
            Memory outside input allocation
          </span>
        </div>
      </div>

      {/* Comprehensive Educational Notes (Fully visible, no truncation) */}
      <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-200 block text-xs uppercase tracking-wider">
            Pedagogical Complexity Context & Hardware Notes
          </span>
          <p className="text-xs text-slate-300 leading-relaxed whitespace-normal break-words">
            {complexity.notes}
          </p>
        </div>
      </div>
    </div>
  );
};
