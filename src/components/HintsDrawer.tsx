import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronRight, Check, Copy, ArrowDownToLine, Sparkles } from 'lucide-react';
import { Language } from '../types/dsa';

interface HintsDrawerProps {
  hints: {
    hint1: string;
    hint2: string;
    optimalSolution: {
      cpp?: string;
      java: string;
      javascript: string;
      python: string;
      explanation: string;
    };
  };
  language: Language;
  onApplySolution: (solutionCode: string) => void;
}

export const HintsDrawer: React.FC<HintsDrawerProps> = ({
  hints,
  language,
  onApplySolution
}) => {
  const [openHint1, setOpenHint1] = useState(false);
  const [openHint2, setOpenHint2] = useState(false);
  const [openSolution, setOpenSolution] = useState(false);
  const [copied, setCopied] = useState(false);

  const solutionCode = hints.optimalSolution[language] || hints.optimalSolution.java || hints.optimalSolution.javascript;

  const copySolution = () => {
    navigator.clipboard.writeText(solutionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-2 p-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-semibold text-slate-200">Pedagogical Guidance & Tiered Hints</h4>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">3-Tier Scaffold</span>
      </div>

      {/* Tier 1: Conceptual Intuition Clue */}
      <div className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-950/60">
        <button
          onClick={() => setOpenHint1(!openHint1)}
          className="w-full flex items-center justify-between p-3 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sky-400 font-mono font-bold">Hint 1</span>
            <span>Conceptual Intuition Clue</span>
          </div>
          {openHint1 ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </button>
        {openHint1 && (
          <div className="p-3 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-900">
            {hints.hint1}
          </div>
        )}
      </div>

      {/* Tier 2: Algorithmic Step & Data Structure Tip */}
      <div className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-950/60">
        <button
          onClick={() => setOpenHint2(!openHint2)}
          className="w-full flex items-center justify-between p-3 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-mono font-bold">Hint 2</span>
            <span>Algorithmic Technique & Pointer Bounds</span>
          </div>
          {openHint2 ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </button>
        {openHint2 && (
          <div className="p-3 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-900">
            {hints.hint2}
          </div>
        )}
      </div>

      {/* Tier 3: Optimal Verified Solution */}
      <div className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-950/60">
        <button
          onClick={() => setOpenSolution(!openSolution)}
          className="w-full flex items-center justify-between p-3 text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-mono font-bold">Tier 3</span>
            <span>Optimal Benchmark Solution & Explanation</span>
          </div>
          {openSolution ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
        </button>
        {openSolution && (
          <div className="p-3 pt-0 space-y-3 border-t border-slate-900">
            <p className="text-xs text-slate-400 leading-relaxed">
              {hints.optimalSolution.explanation}
            </p>

            <div className="relative bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-200 border border-slate-800 overflow-x-auto">
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-900 text-[10px] text-slate-500">
                <span>{language.toUpperCase()} Solution</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copySolution}
                    className="flex items-center gap-1 text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => onApplySolution(solutionCode)}
                    className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                    <span>Load into Editor</span>
                  </button>
                </div>
              </div>
              <pre className="text-slate-300 leading-5 whitespace-pre">
                {solutionCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
