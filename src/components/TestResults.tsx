import React, { useState } from 'react';
import { RunResult } from '../types/dsa';
import { CheckCircle2, XCircle, Terminal, AlertTriangle, Clock } from 'lucide-react';
import { formatValue } from '../utils/codeRunner';

interface TestResultsProps {
  runResult: RunResult | null;
  isRunning: boolean;
}

export const TestResults: React.FC<TestResultsProps> = ({ runResult, isRunning }) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'logs'>('tests');

  if (isRunning) {
    return (
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-mono">Executing sandboxed test suite...</span>
      </div>
    );
  }

  if (!runResult) {
    return (
      <div className="p-8 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-2">
        <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
        <h5 className="text-xs font-semibold text-slate-400">Test Suite Awaiting Execution</h5>
        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          Click "Run Test Suite" to verify your implementation against nominal inputs and tricky edge cases.
        </p>
      </div>
    );
  }

  const passedCount = runResult.results.filter((r) => r.passed).length;
  const totalCount = runResult.results.length;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg space-y-0">
      {/* Top Console Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {runResult.allPassed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-xs font-semibold text-slate-200">
              {runResult.allPassed
                ? 'All Test Cases Passed!'
                : `${passedCount} of ${totalCount} Tests Passed`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {runResult.totalRuntimeMs} ms
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
              activeTab === 'tests' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Test Cases ({passedCount}/{totalCount})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-2.5 py-0.5 rounded font-medium transition-colors ${
              activeTab === 'logs' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Console Logs ({runResult.consoleLogs.length})
          </button>
        </div>
      </div>

      {/* Global Execution Error if syntax error */}
      {runResult.executionError && (
        <div className="p-4 bg-rose-950/40 border-b border-rose-900/60 text-xs text-rose-300 font-mono flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Execution Error:</strong> {runResult.executionError}
          </div>
        </div>
      )}

      {/* Content Body */}
      {activeTab === 'tests' ? (
        <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
          {runResult.results.map((res, idx) => (
            <div
              key={res.testId}
              className={`p-3.5 text-xs transition-colors ${
                res.passed ? 'bg-slate-950 hover:bg-slate-900/40' : 'bg-rose-950/20 hover:bg-rose-950/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {res.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span className="font-semibold text-slate-200">
                    Test {idx + 1}: {res.description}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">
                  {res.executionTimeMs} ms
                </span>
              </div>

              {res.error ? (
                <div className="ml-5 mt-1 text-rose-400 font-mono text-[11px] bg-rose-950/40 p-2 rounded border border-rose-900/50">
                  Runtime Error: {res.error}
                </div>
              ) : !res.passed ? (
                <div className="ml-5 mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Expected Output:</span>
                    <span className="text-emerald-400">{formatValue(res.expected)}</span>
                  </div>
                  <div className="p-2 bg-rose-950/40 rounded border border-rose-900/40">
                    <span className="text-rose-400/80 block text-[10px]">Your Output:</span>
                    <span className="text-rose-300">{formatValue(res.actual)}</span>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        /* Console Logs Tab */
        <div className="p-4 font-mono text-xs max-h-80 overflow-y-auto space-y-1">
          {runResult.consoleLogs.length === 0 ? (
            <span className="text-slate-600 italic">No console.log statements printed during execution.</span>
          ) : (
            runResult.consoleLogs.map((log, i) => (
              <div key={i} className="text-slate-300 leading-relaxed">
                <span className="text-slate-600 mr-2">&gt;</span>
                {log}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
