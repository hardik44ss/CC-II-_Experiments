import React, { useState } from 'react';
import { Award, CheckCircle2, Clock, X, RotateCcw, Share2, Sparkles, Download } from 'lucide-react';
import { Experiment, ExperimentId } from '../types/dsa';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiments: Experiment[];
  completedIds: Set<ExperimentId>;
  timeElapsedSeconds: number;
  onResetProgress: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose,
  experiments,
  completedIds,
  timeElapsedSeconds,
  onResetProgress
}) => {
  const [studentName, setStudentName] = useState('Computer Science Student');
  const [showCertificate, setShowCertificate] = useState(false);

  if (!isOpen) return null;

  const completedCount = completedIds.size;
  const totalCount = experiments.length;
  const scorePct = Math.round((completedCount / totalCount) * 100);

  const formatElapsed = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-950 border border-sky-500/40 rounded-xl flex items-center justify-center mx-auto text-sky-400 shadow-lg shadow-sky-950">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">DSA Lab Mastery Report</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Comprehensive evaluation of the 2-hour interactive Data Structures and Algorithms session.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 block mb-1">Score</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{scorePct}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{completedCount * 100} / {totalCount * 100} pts</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 block mb-1">Completed</span>
            <span className="text-2xl font-bold font-mono text-sky-400">{completedCount} / {totalCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Experiments Verified</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 block mb-1">Time Elapsed</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{formatElapsed(timeElapsedSeconds)}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">2h Window</span>
          </div>
        </div>

        {/* Experiment Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Experiment Audit Log
          </h4>
          <div className="divide-y divide-slate-800/80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            {experiments.map((exp) => {
              const isDone = completedIds.has(exp.id);
              return (
                <div key={exp.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={`font-medium ${isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                      {exp.number}. {exp.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-slate-500">{exp.category}</span>
                    <span className={isDone ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {isDone ? '100 / 100' : '0 / 100'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Section */}
        {completedCount === totalCount ? (
          <div className="p-4 bg-sky-950/40 border border-sky-500/40 rounded-xl space-y-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sky-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Full Curriculum Mastered! All 7 Experiments Verified.</span>
            </div>

            <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter Student Name"
                className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-sans focus:outline-none focus:border-sky-500 text-center"
              />
            </div>

            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors shadow-sm"
            >
              {showCertificate ? 'Hide Certificate' : 'Generate Certificate of Mastery'}
            </button>

            {showCertificate && (
              <div className="p-6 bg-slate-950 rounded-xl border-2 border-sky-500/60 text-center space-y-3 mt-4">
                <span className="text-[10px] tracking-widest text-sky-400 uppercase font-mono">
                  Certificate of Achievement
                </span>
                <h2 className="text-xl font-serif text-white font-bold tracking-tight">
                  {studentName || 'Student'}
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Has successfully implemented, visualized, and passed automated unit test suites for all 7 foundational Data Structures and Algorithms experiments in the 2-Hour Coding Studio.
                </p>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>DSA Studio Lab Verification</span>
                  <span>Completed: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400">
            Complete all 7 experiments with passing tests to unlock the Certificate of Mastery.
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset your lab progress and timer?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Lab Progress</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
