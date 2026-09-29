import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenReport: () => void;
  completedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReport,
  completedCount,
  totalCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a href="/" className="text-lg font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0">
            DSA Lab Mastery
          </a>
          <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono font-medium rounded-full bg-sky-950/80 text-sky-400 border border-sky-800/60">
            Java Studio
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#lab-workspace" className="hover:text-white transition-colors">Lab Workspace</a>
          <a href="#visualizer" className="hover:text-white transition-colors">Visualizer</a>
          <a href="#code-editor" className="hover:text-white transition-colors">Code Studio</a>
          <a href="#complexity" className="hover:text-white transition-colors">Complexity</a>
        </nav>

        {/* Zone 3: Actions & Progress Badge */}
        <div className="flex items-center gap-3">
          {/* Progress pill indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-semibold">{completedCount} / {totalCount} Labs Passed</span>
          </div>

          {/* Lab Report Action */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Award className="w-3.5 h-3.5" />
            Lab Report
          </button>
        </div>
      </div>
    </header>
  );
};
