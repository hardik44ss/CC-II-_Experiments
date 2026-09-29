import React from 'react';
import { BookOpen, Code2, Eye, CheckCircle2 } from 'lucide-react';

interface PhaseSwitchProps {
  currentPhase: 1 | 2;
  onChangePhase: (phase: 1 | 2) => void;
  isCodePassed: boolean;
}

export const PhaseSwitch: React.FC<PhaseSwitchProps> = ({
  currentPhase,
  onChangePhase,
  isCodePassed
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl w-full sm:w-auto">
      <button
        onClick={() => onChangePhase(1)}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
          currentPhase === 1
            ? 'bg-sky-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Phase 1: Learn & Visualize</span>
        <span className="text-[10px] opacity-75 font-normal font-mono hidden sm:inline">(5–7 min)</span>
      </button>

      <button
        onClick={() => onChangePhase(2)}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
          currentPhase === 2
            ? 'bg-sky-600 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Code2 className="w-3.5 h-3.5" />
        <span>Phase 2: Code & Verify</span>
        <span className="text-[10px] opacity-75 font-normal font-mono hidden sm:inline">(10–12 min)</span>
        {isCodePassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
      </button>
    </div>
  );
};
