import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, GitBranch, Layers } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface MergeStep {
  leftArr: number[];
  rightArr: number[];
  leftIdx: number;
  rightIdx: number;
  mergedArr: number[];
  message: string;
  comparing: boolean;
  chosenSide?: 'left' | 'right';
}

export const MergeSortVisualizer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'tree' | 'merge_routine'>('tree');

  // Interactive merge routine state
  const leftSample = [3, 27, 38, 43];
  const rightSample = [9, 10, 19, 82];

  const [steps, setSteps] = useState<MergeStep[]>([]);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Pre-generate steps for merge routine
  useEffect(() => {
    const trace: MergeStep[] = [];
    let i = 0;
    let j = 0;
    const merged: number[] = [];

    trace.push({
      leftArr: leftSample,
      rightArr: rightSample,
      leftIdx: 0,
      rightIdx: 0,
      mergedArr: [],
      comparing: false,
      message: 'Initial state: Pointer i points to left[0], pointer j points to right[0].'
    });

    while (i < leftSample.length && j < rightSample.length) {
      const leftVal = leftSample[i];
      const rightVal = rightSample[j];

      trace.push({
        leftArr: leftSample,
        rightArr: rightSample,
        leftIdx: i,
        rightIdx: j,
        mergedArr: [...merged],
        comparing: true,
        message: `Comparing left[${i}] (${leftVal}) vs right[${j}] (${rightVal}).`
      });

      if (leftVal <= rightVal) {
        merged.push(leftVal);
        trace.push({
          leftArr: leftSample,
          rightArr: rightSample,
          leftIdx: i,
          rightIdx: j,
          mergedArr: [...merged],
          comparing: false,
          chosenSide: 'left',
          message: `left[${i}] (${leftVal}) <= right[${j}] (${rightVal}). Append ${leftVal} to merged result. Increment i.`
        });
        i++;
      } else {
        merged.push(rightVal);
        trace.push({
          leftArr: leftSample,
          rightArr: rightSample,
          leftIdx: i,
          rightIdx: j,
          mergedArr: [...merged],
          comparing: false,
          chosenSide: 'right',
          message: `right[${j}] (${rightVal}) < left[${i}] (${leftVal}). Append ${rightVal} to merged result. Increment j.`
        });
        j++;
      }
    }

    while (i < leftSample.length) {
      merged.push(leftSample[i]);
      trace.push({
        leftArr: leftSample,
        rightArr: rightSample,
        leftIdx: i,
        rightIdx: j,
        mergedArr: [...merged],
        comparing: false,
        chosenSide: 'left',
        message: `Right array exhausted. Append remaining left element ${leftSample[i]}.`
      });
      i++;
    }

    while (j < rightSample.length) {
      merged.push(rightSample[j]);
      trace.push({
        leftArr: leftSample,
        rightArr: rightSample,
        leftIdx: i,
        rightIdx: j,
        mergedArr: [...merged],
        comparing: false,
        chosenSide: 'right',
        message: `Left array exhausted. Append remaining right element ${rightSample[j]}.`
      });
      j++;
    }

    trace.push({
      leftArr: leftSample,
      rightArr: rightSample,
      leftIdx: i,
      rightIdx: j,
      mergedArr: [...merged],
      comparing: false,
      message: 'Merge operation complete! Both sorted sublists successfully combined in linear time O(n).'
    });

    setSteps(trace);
    setStepIdx(0);
    setIsPlaying(false);
  }, []);

  // Autoplay with decreased baseline speed
  useEffect(() => {
    if (!isPlaying) return;
    const baseInterval = 1400; // Decreased speed for clear step observation
    const intervalTime = Math.max(250, Math.round(baseInterval / speed));

    const timer = setInterval(() => {
      setStepIdx((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

  const cur = steps[stepIdx] || {
    leftArr: leftSample,
    rightArr: rightSample,
    leftIdx: 0,
    rightIdx: 0,
    mergedArr: [],
    comparing: false,
    message: ''
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'tree' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Divide & Conquer Recursion Tree
          </button>
          <button
            onClick={() => setViewMode('merge_routine')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'merge_routine' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Linear Merge Sandbox
          </button>
        </div>

        {viewMode === 'merge_routine' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={() => stepIdx < steps.length - 1 && setStepIdx(stepIdx + 1)}
              disabled={isPlaying || stepIdx >= steps.length - 1}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg transition-colors border border-slate-700"
              title="Step forward"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <VisualizerSpeedControl speed={speed} onChangeSpeed={setSpeed} />
            <button
              onClick={() => {
                setStepIdx(0);
                setIsPlaying(false);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {viewMode === 'tree' ? (
        /* Full Recursion Tree Diagram */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-sky-400">Recursive Split & Conquer Hierarchy</h4>
            <span className="text-xs text-slate-400 font-mono">
              Tree Depth = ⌈log₂ N⌉ = 3 levels
            </span>
          </div>

          <div className="flex flex-col items-center gap-6 py-4">
            {/* Level 0: Root */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono text-slate-500 mb-1">Level 0 (N = 8)</span>
              <div className="flex gap-1.5 px-3 py-2 bg-slate-950 border border-sky-600/60 rounded-lg font-mono text-sm shadow-md">
                {[38, 27, 43, 3, 9, 82, 10, 19].map((v, i) => (
                  <span key={i} className="px-1.5 text-sky-200">{v}</span>
                ))}
              </div>
            </div>

            {/* Split connectors */}
            <div className="w-64 h-4 border-t-2 border-l-2 border-r-2 border-slate-700/60 rounded-t-sm" />

            {/* Level 1: Split Halves */}
            <div className="flex gap-12">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500 mb-1">Left Half (N/2 = 4)</span>
                <div className="flex gap-1.5 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg font-mono text-xs">
                  {[38, 27, 43, 3].map((v, i) => (
                    <span key={i} className="px-1 text-slate-300">{v}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500 mb-1">Right Half (N/2 = 4)</span>
                <div className="flex gap-1.5 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg font-mono text-xs">
                  {[9, 82, 10, 19].map((v, i) => (
                    <span key={i} className="px-1 text-slate-300">{v}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Level 2: Pairs */}
            <div className="flex flex-wrap justify-center gap-4">
              {[[38, 27], [43, 3], [9, 82], [10, 19]].map((pair, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="flex gap-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-xs">
                    {pair.map((v, i) => (
                      <span key={i} className="px-1 text-slate-400">{v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Level 3: Base Case Singletons */}
            <div className="flex flex-wrap justify-center gap-2">
              {[38, 27, 43, 3, 9, 82, 10, 19].map((v, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded border border-emerald-500/50 bg-emerald-950/40 flex items-center justify-center font-mono text-xs font-bold text-emerald-300"
                >
                  {v}
                </div>
              ))}
            </div>

            <div className="text-xs text-emerald-400 font-mono font-medium">
              ↓ Base Case Reached (len ≤ 1) → Commence Merging Upward ↓
            </div>

            {/* Merge Up: Fully Sorted Array */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono text-emerald-400 mb-1">Final Merged Output</span>
              <div className="flex gap-1.5 px-3 py-2 bg-emerald-950/40 border border-emerald-500 rounded-lg font-mono text-sm text-emerald-200 font-bold shadow-lg shadow-emerald-950/50">
                {[3, 9, 10, 19, 27, 38, 43, 82].map((v, i) => (
                  <span key={i} className="px-1.5">{v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Linear Two-Pointer Merge Step Sandbox */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-sky-400">Two-Pointer Merge Routine</h4>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-sky-400 font-mono">Pointer i: [{cur.leftIdx}]</span>
              <span className="text-emerald-400 font-mono">Pointer j: [{cur.rightIdx}]</span>
            </div>
          </div>

          {/* Subarrays Arena */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Subarray */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs text-sky-400 font-semibold font-mono">Left Sorted Buffer (arr1)</span>
              <div className="flex gap-2">
                {cur.leftArr.map((v, idx) => {
                  const isCurrent = idx === cur.leftIdx;
                  const isConsumed = idx < cur.leftIdx;
                  return (
                    <div
                      key={idx}
                      className={`w-11 h-12 rounded flex items-center justify-center font-mono font-bold text-sm border ${
                        isCurrent
                          ? 'border-sky-400 bg-sky-950 text-sky-200 ring-2 ring-sky-400'
                          : isConsumed
                          ? 'border-slate-800 bg-slate-950/40 text-slate-600'
                          : 'border-slate-700 bg-slate-900 text-slate-300'
                      }`}
                    >
                      {v}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Subarray */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs text-emerald-400 font-semibold font-mono">Right Sorted Buffer (arr2)</span>
              <div className="flex gap-2">
                {cur.rightArr.map((v, idx) => {
                  const isCurrent = idx === cur.rightIdx;
                  const isConsumed = idx < cur.rightIdx;
                  return (
                    <div
                      key={idx}
                      className={`w-11 h-12 rounded flex items-center justify-center font-mono font-bold text-sm border ${
                        isCurrent
                          ? 'border-emerald-400 bg-emerald-950 text-emerald-200 ring-2 ring-emerald-400'
                          : isConsumed
                          ? 'border-slate-800 bg-slate-950/40 text-slate-600'
                          : 'border-slate-700 bg-slate-900 text-slate-300'
                      }`}
                    >
                      {v}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Merged Target Buffer */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-mono">Merged Output Array:</span>
            <div className="flex gap-2 min-h-12 items-center flex-wrap">
              {cur.mergedArr.length === 0 ? (
                <span className="text-xs text-slate-600 italic">No elements merged yet</span>
              ) : (
                cur.mergedArr.map((v, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded bg-sky-950/70 border border-sky-500 text-sky-200 flex items-center justify-center font-mono font-bold text-sm shadow-sm"
                  >
                    {v}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Step message */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="text-sky-400 font-mono font-semibold">Step {stepIdx + 1}/{steps.length}:</span>
            <span>{cur.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
