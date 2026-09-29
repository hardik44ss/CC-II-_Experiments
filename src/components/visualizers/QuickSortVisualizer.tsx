import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface PartitionStep {
  array: number[];
  low: number;
  high: number;
  pivotIndex: number;
  i: number;
  j: number;
  swappedIndices?: [number, number];
  isFinalSwap?: boolean;
  message: string;
}

export const QuickSortVisualizer: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<number[]>([10, 80, 30, 90, 40, 50, 70]);
  const [steps, setSteps] = useState<PartitionStep[]>([]);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Generate Lomuto partition trace
  useEffect(() => {
    const a = [...arrayInput];
    const trace: PartitionStep[] = [];
    const low = 0;
    const high = a.length - 1;
    const pivot = a[high];
    let i = low - 1;

    trace.push({
      array: [...a],
      low,
      high,
      pivotIndex: high,
      i,
      j: low,
      message: `Initial Lomuto Partition setup on [${low}...${high}]. Pivot is arr[${high}] = ${pivot}. Boundary pointer i = ${i}.`
    });

    for (let j = low; j < high; j++) {
      if (a[j] <= pivot) {
        i++;
        const prevI = i;
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;

        trace.push({
          array: [...a],
          low,
          high,
          pivotIndex: high,
          i,
          j,
          swappedIndices: [prevI, j],
          message: `arr[${j}] (${a[i]}) <= pivot (${pivot}). Increment i to ${i}, then swap arr[${i}] and arr[${j}].`
        });
      } else {
        trace.push({
          array: [...a],
          low,
          high,
          pivotIndex: high,
          i,
          j,
          message: `arr[${j}] (${a[j]}) > pivot (${pivot}). Leave in place. Advance j.`
        });
      }
    }

    // Final pivot swap
    const finalPivotPos = i + 1;
    const temp = a[finalPivotPos];
    a[finalPivotPos] = a[high];
    a[high] = temp;

    trace.push({
      array: [...a],
      low,
      high,
      pivotIndex: finalPivotPos,
      i,
      j: high,
      swappedIndices: [finalPivotPos, high],
      isFinalSwap: true,
      message: `Final pivot swap! Swapped arr[${finalPivotPos}] with pivot arr[${high}] (${pivot}). Pivot is now anchored at its final sorted index ${finalPivotPos}.`
    });

    setSteps(trace);
    setStepIdx(0);
    setIsPlaying(false);
  }, [arrayInput]);

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
    array: arrayInput,
    low: 0,
    high: arrayInput.length - 1,
    pivotIndex: arrayInput.length - 1,
    i: -1,
    j: 0,
    message: ''
  };

  const randomize = () => {
    const fresh = Array.from({ length: 7 }, () => Math.floor(Math.random() * 85) + 10);
    setArrayInput(fresh);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">
            Lomuto Partition Visualizer
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Range: [{cur.low}...{cur.high}]</span>
            <span>·</span>
            <span>Pivot: <strong className="text-amber-400 font-mono">{cur.array[cur.pivotIndex]}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Partition'}
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
          <button
            onClick={randomize}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Randomize array"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Array Visualization */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-sky-400">Partition Array & Pointers</h4>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-400 font-semibold">Boundary pointer i = {cur.i}</span>
            <span className="text-sky-400 font-semibold">Scan pointer j = {cur.j}</span>
          </div>
        </div>

        {/* Array Items */}
        <div className="overflow-x-auto pb-4 pt-8">
          <div className="flex items-center gap-3 min-w-max justify-center">
            {cur.array.map((val, idx) => {
              const isPivot = idx === cur.pivotIndex;
              const isI = idx === cur.i;
              const isJ = idx === cur.j;
              const isSwapped = cur.swappedIndices?.includes(idx);
              const isSmallerOrEqual = idx <= cur.i && !isPivot;
              const isGreater = idx > cur.i && idx < cur.j && !isPivot;

              let style = 'border-slate-800 bg-slate-950 text-slate-300';
              if (isPivot) {
                style = 'border-amber-400 bg-amber-950/70 text-amber-200 ring-2 ring-amber-400/50 shadow-md shadow-amber-950';
              } else if (isSwapped) {
                style = 'border-sky-400 bg-sky-950 text-sky-200 ring-2 ring-sky-400 animate-pulse';
              } else if (isSmallerOrEqual) {
                style = 'border-emerald-700 bg-emerald-950/50 text-emerald-200';
              } else if (isGreater) {
                style = 'border-slate-700 bg-slate-900 text-slate-400';
              }

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Pointers above */}
                  <div className="absolute -top-7 flex gap-1.5 text-[10px] font-mono font-bold">
                    {isPivot && <span className="text-amber-400">PIVOT</span>}
                    {isI && <span className="text-emerald-400">i</span>}
                    {isJ && <span className="text-sky-400">j</span>}
                  </div>

                  {/* Number Box */}
                  <div
                    className={`w-14 h-16 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-lg border transition-all duration-200 ${style}`}
                  >
                    <span>{val}</span>
                  </div>

                  {/* Index and classification */}
                  <span className="text-[10px] font-mono text-slate-500 mt-1.5">[{idx}]</span>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                    {isPivot ? 'pivot' : isSmallerOrEqual ? '≤ pivot' : isGreater ? '> pivot' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-950 border border-amber-400" />
            <span>Pivot Element (`arr[high]`)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500" />
            <span>Partition $\le$ Pivot (indices $\le i$)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-900 border border-slate-700" />
            <span>Partition &gt; Pivot (indices &gt; i)</span>
          </div>
        </div>

        {/* Step message */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <span className="text-sky-400 font-mono font-semibold">Step {stepIdx + 1}/{steps.length}:</span>
          <span>{cur.message}</span>
        </div>
      </div>
    </div>
  );
};
