import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Sparkles, FastForward } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface Step {
  type: 'linear' | 'binary';
  currentIndex?: number;
  low?: number;
  mid?: number;
  high?: number;
  found: boolean;
  message: string;
  comparisons: number;
  eliminatedRange?: [number, number];
}

export const LinearBinarySearchVisualizer: React.FC = () => {
  const [array, setArray] = useState<number[]>([3, 7, 12, 19, 24, 31, 42, 55, 68, 77, 83, 95]);
  const [target, setTarget] = useState<number>(55);
  const [algorithm, setAlgorithm] = useState<'both' | 'linear' | 'binary'>('both');
  const [speed, setSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Linear search trace
  const [linearSteps, setLinearSteps] = useState<Step[]>([]);
  const [linearStepIdx, setLinearStepIdx] = useState<number>(0);

  // Binary search trace
  const [binarySteps, setBinarySteps] = useState<Step[]>([]);
  const [binaryStepIdx, setBinaryStepIdx] = useState<number>(0);

  // Generate steps whenever array or target changes
  useEffect(() => {
    // 1. Generate Linear Steps
    const lSteps: Step[] = [];
    let lComps = 0;
    let lFound = false;
    for (let i = 0; i < array.length; i++) {
      lComps++;
      if (array[i] === target) {
        lFound = true;
        lSteps.push({
          type: 'linear',
          currentIndex: i,
          found: true,
          comparisons: lComps,
          message: `Inspecting index ${i}: Value ${array[i]} === Target ${target}. Found!`
        });
        break;
      } else {
        lSteps.push({
          type: 'linear',
          currentIndex: i,
          found: false,
          comparisons: lComps,
          message: `Inspecting index ${i}: Value ${array[i]} !== Target ${target}. Moving next.`
        });
      }
    }
    if (!lFound) {
      lSteps.push({
        type: 'linear',
        currentIndex: -1,
        found: false,
        comparisons: lComps,
        message: `Finished linear scan of entire array. Target ${target} not found (-1).`
      });
    }
    setLinearSteps(lSteps);
    setLinearStepIdx(0);

    // 2. Generate Binary Steps
    const bSteps: Step[] = [];
    let bComps = 0;
    let low = 0;
    let high = array.length - 1;
    let bFound = false;

    bSteps.push({
      type: 'binary',
      low,
      high,
      mid: Math.floor((low + high) / 2),
      found: false,
      comparisons: 0,
      message: `Initial search boundary: low=${low}, high=${high}. Middle index = ${Math.floor((low + high) / 2)}.`
    });

    while (low <= high) {
      bComps++;
      const mid = low + Math.floor((high - low) / 2);
      if (array[mid] === target) {
        bFound = true;
        bSteps.push({
          type: 'binary',
          low,
          high,
          mid,
          found: true,
          comparisons: bComps,
          message: `Inspecting mid index ${mid}: Value ${array[mid]} === Target ${target}. Target found!`
        });
        break;
      } else if (array[mid] < target) {
        const prevLow = low;
        low = mid + 1;
        bSteps.push({
          type: 'binary',
          low,
          high,
          mid,
          found: false,
          comparisons: bComps,
          eliminatedRange: [prevLow, mid],
          message: `arr[${mid}] (${array[mid]}) < ${target}. Target must be in right half. Setting low = ${low}.`
        });
      } else {
        const prevHigh = high;
        high = mid - 1;
        bSteps.push({
          type: 'binary',
          low,
          high,
          mid,
          found: false,
          comparisons: bComps,
          eliminatedRange: [mid, prevHigh],
          message: `arr[${mid}] (${array[mid]}) > ${target}. Target must be in left half. Setting high = ${high}.`
        });
      }
    }

    if (!bFound) {
      bSteps.push({
        type: 'binary',
        low,
        high,
        mid: -1,
        found: false,
        comparisons: bComps,
        message: `Pointers crossed (low > high). Target ${target} not in sorted array (-1).`
      });
    }

    setBinarySteps(bSteps);
    setBinaryStepIdx(0);
    setIsPlaying(false);
  }, [array, target]);

  // Autoplay timer with decreased default speed for pedagogical clarity
  useEffect(() => {
    if (!isPlaying) return;
    const baseIntervalMs = 1500; // Decreased speed (~1.5s per step at 1x)
    const intervalTime = Math.max(250, Math.round(baseIntervalMs / speed));

    const timer = setInterval(() => {
      let canAdvanceLinear = false;
      let canAdvanceBinary = false;

      if (linearStepIdx < linearSteps.length - 1) {
        setLinearStepIdx((prev) => prev + 1);
        canAdvanceLinear = true;
      }
      if (binaryStepIdx < binarySteps.length - 1) {
        setBinaryStepIdx((prev) => prev + 1);
        canAdvanceBinary = true;
      }

      if (!canAdvanceLinear && !canAdvanceBinary) {
        setIsPlaying(false);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, linearStepIdx, binaryStepIdx, linearSteps.length, binarySteps.length, speed]);

  const handleStepForward = () => {
    if (linearStepIdx < linearSteps.length - 1) setLinearStepIdx((p) => p + 1);
    if (binaryStepIdx < binarySteps.length - 1) setBinaryStepIdx((p) => p + 1);
  };

  const handleReset = () => {
    setLinearStepIdx(0);
    setBinaryStepIdx(0);
    setIsPlaying(false);
  };

  const randomize = () => {
    const len = 12;
    const set = new Set<number>();
    while (set.size < len) {
      set.add(Math.floor(Math.random() * 95) + 3);
    }
    const sorted = Array.from(set).sort((a, b) => a - b);
    setArray(sorted);
    setTarget(sorted[Math.floor(Math.random() * sorted.length)]);
  };

  const curLinear = linearSteps[linearStepIdx] || { currentIndex: 0, comparisons: 0, message: '' };
  const curBinary = binarySteps[binaryStepIdx] || { low: 0, mid: 0, high: array.length - 1, comparisons: 0, message: '' };

  return (
    <div className="space-y-6">
      {/* Top Visualizer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setAlgorithm('both')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                algorithm === 'both' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side Comparison
            </button>
            <button
              onClick={() => setAlgorithm('binary')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                algorithm === 'binary' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Binary Search
            </button>
            <button
              onClick={() => setAlgorithm('linear')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                algorithm === 'linear' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Linear Search
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Target:</span>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-sky-400 font-mono text-center focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Auto Play'}
          </button>
          <button
            onClick={handleStepForward}
            disabled={isPlaying}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition-colors border border-slate-700"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Step
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={randomize}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Randomize Values"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Speed selector */}
          <VisualizerSpeedControl speed={speed} onChangeSpeed={setSpeed} />
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="grid grid-cols-1 gap-6">
        {/* Binary Search Visual Display */}
        {(algorithm === 'both' || algorithm === 'binary') && (
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-sky-400">Binary Search (O(log n))</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>Comparisons: <strong className="text-sky-300 font-mono">{curBinary.comparisons}</strong></span>
                  <span>·</span>
                  <span>Low: <strong className="text-emerald-400 font-mono">{curBinary.low ?? 0}</strong></span>
                  <span>·</span>
                  <span>Mid: <strong className="text-amber-400 font-mono">{curBinary.mid ?? '-'}</strong></span>
                  <span>·</span>
                  <span>High: <strong className="text-rose-400 font-mono">{curBinary.high ?? 0}</strong></span>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded font-medium ${
                curBinary.found ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
              }`}>
                {curBinary.found ? 'Found Target' : 'Searching Active Window'}
              </span>
            </div>

            {/* Array Boxes with pointer tags */}
            <div className="overflow-x-auto pb-4 pt-8">
              <div className="flex items-center gap-2 min-w-max justify-center">
                {array.map((val, idx) => {
                  const isLow = idx === curBinary.low;
                  const isHigh = idx === curBinary.high;
                  const isMid = idx === curBinary.mid;
                  const isExcluded = (curBinary.low !== undefined && idx < curBinary.low) || (curBinary.high !== undefined && idx > curBinary.high);
                  const isFound = isMid && curBinary.found;

                  let borderClass = 'border-slate-800 bg-slate-950 text-slate-300';
                  if (isFound) {
                    borderClass = 'border-emerald-500 bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-950';
                  } else if (isMid) {
                    borderClass = 'border-amber-400 bg-amber-950/50 text-amber-200 ring-2 ring-amber-400/40';
                  } else if (!isExcluded) {
                    borderClass = 'border-sky-700 bg-sky-950/30 text-sky-200';
                  } else {
                    borderClass = 'border-slate-800 bg-slate-950/40 text-slate-600 opacity-40';
                  }

                  return (
                    <div key={idx} className="relative flex flex-col items-center">
                      {/* Pointer labels above */}
                      <div className="absolute -top-7 flex gap-1 text-[10px] font-mono font-bold whitespace-nowrap">
                        {isLow && <span className="text-emerald-400">L</span>}
                        {isMid && <span className="text-amber-400">M</span>}
                        {isHigh && <span className="text-rose-400">H</span>}
                      </div>

                      {/* Element box */}
                      <div
                        className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center border font-mono font-bold text-base transition-all duration-200 ${borderClass}`}
                      >
                        <span>{val}</span>
                      </div>

                      {/* Index below */}
                      <span className="text-[10px] font-mono text-slate-500 mt-1.5">[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Explanation callout */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <span className="text-sky-400 shrink-0 font-semibold font-mono">Step {binaryStepIdx + 1}/{binarySteps.length}:</span>
              <span>{curBinary.message}</span>
            </div>
          </div>
        )}

        {/* Linear Search Visual Display */}
        {(algorithm === 'both' || algorithm === 'linear') && (
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-violet-400">Linear Search (O(n))</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>Comparisons: <strong className="text-violet-300 font-mono">{curLinear.comparisons}</strong></span>
                  <span>·</span>
                  <span>Scanning Index: <strong className="text-violet-400 font-mono">{curLinear.currentIndex}</strong></span>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded font-medium ${
                curLinear.found ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-300'
              }`}>
                {curLinear.found ? 'Found Target' : 'Sequential Scan'}
              </span>
            </div>

            {/* Array Boxes */}
            <div className="overflow-x-auto pb-4 pt-6">
              <div className="flex items-center gap-2 min-w-max justify-center">
                {array.map((val, idx) => {
                  const isCurrent = idx === curLinear.currentIndex;
                  const isInspected = idx < (curLinear.currentIndex ?? 0);
                  const isFound = isCurrent && curLinear.found;

                  let borderClass = 'border-slate-800 bg-slate-950 text-slate-400';
                  if (isFound) {
                    borderClass = 'border-emerald-500 bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-500/50';
                  } else if (isCurrent) {
                    borderClass = 'border-violet-500 bg-violet-950/50 text-violet-200 ring-2 ring-violet-500/50';
                  } else if (isInspected) {
                    borderClass = 'border-slate-800 bg-slate-950/50 text-slate-600';
                  }

                  return (
                    <div key={idx} className="relative flex flex-col items-center">
                      {isCurrent && (
                        <span className="absolute -top-6 text-[10px] font-mono text-violet-400 font-bold">i</span>
                      )}
                      <div
                        className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center border font-mono font-bold text-base transition-all duration-200 ${borderClass}`}
                      >
                        <span>{val}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 mt-1.5">[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Explanation callout */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <span className="text-violet-400 shrink-0 font-semibold font-mono">Step {linearStepIdx + 1}/{linearSteps.length}:</span>
              <span>{curLinear.message}</span>
            </div>
          </div>
        )}

        {/* Live Comparison Benchmark Matrix */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Mathematical Scaling Benchmark: Step Count vs Array Size
            </span>
            <span className="text-[11px] text-slate-400">Worst Case Scenarios</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[
              { size: 'N = 16', linear: '16 steps', binary: '4 steps' },
              { size: 'N = 1,024', linear: '1,024 steps', binary: '10 steps' },
              { size: 'N = 65,536', linear: '65,536 steps', binary: '16 steps' },
              { size: 'N = 1,000,000', linear: '1,000,000 steps', binary: '20 steps' }
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-xs font-mono text-slate-400 mb-1">{item.size}</div>
                <div className="text-xs text-violet-400 font-mono">Linear: {item.linear}</div>
                <div className="text-xs text-sky-400 font-mono font-bold">Binary: {item.binary}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
