import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface SortStep {
  array: number[];
  activeIndices: number[];
  keyIndex?: number;
  gap?: number;
  comparisons: number;
  shifts: number;
  message: string;
}

export const InsertionShellSortVisualizer: React.FC = () => {
  const [initialArray, setInitialArray] = useState<number[]>([45, 12, 85, 32, 89, 39, 69, 22, 58, 15]);
  const [speed, setSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Traces
  const [insertionSteps, setInsertionSteps] = useState<SortStep[]>([]);
  const [insertionIdx, setInsertionIdx] = useState<number>(0);

  const [shellSteps, setShellSteps] = useState<SortStep[]>([]);
  const [shellIdx, setShellIdx] = useState<number>(0);

  // Pre-generate steps for both algorithms
  useEffect(() => {
    // 1. Generate Insertion Sort Steps
    const iSteps: SortStep[] = [];
    const a = [...initialArray];
    let iComps = 0;
    let iShifts = 0;

    iSteps.push({
      array: [...a],
      activeIndices: [],
      comparisons: 0,
      shifts: 0,
      message: 'Initial array. Insertion sort starts with first element considered sorted.'
    });

    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      iSteps.push({
        array: [...a],
        activeIndices: [i],
        keyIndex: i,
        comparisons: iComps,
        shifts: iShifts,
        message: `Current key to insert: ${key} at index ${i}.`
      });

      while (j >= 0) {
        iComps++;
        if (a[j] > key) {
          a[j + 1] = a[j];
          iShifts++;
          iSteps.push({
            array: [...a],
            activeIndices: [j, j + 1],
            keyIndex: j,
            comparisons: iComps,
            shifts: iShifts,
            message: `Shift right: a[${j}] (${a[j]}) > key (${key}). Moved to index ${j + 1}.`
          });
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;
      iSteps.push({
        array: [...a],
        activeIndices: [j + 1],
        comparisons: iComps,
        shifts: iShifts,
        message: `Placed key ${key} into position ${j + 1}. Prefix [0...${i}] is now sorted.`
      });
    }

    setInsertionSteps(iSteps);
    setInsertionIdx(0);

    // 2. Generate Shell Sort Steps
    const sSteps: SortStep[] = [];
    const b = [...initialArray];
    let sComps = 0;
    let sShifts = 0;
    const n = b.length;
    let gap = Math.floor(n / 2);

    sSteps.push({
      array: [...b],
      activeIndices: [],
      gap,
      comparisons: 0,
      shifts: 0,
      message: `Initial state. Starting Shell Sort with gap = floor(${n} / 2) = ${gap}.`
    });

    while (gap > 0) {
      sSteps.push({
        array: [...b],
        activeIndices: [],
        gap,
        comparisons: sComps,
        shifts: sShifts,
        message: `Starting gap phase = ${gap}. Elements separated by ${gap} positions will be compared.`
      });

      for (let i = gap; i < n; i++) {
        const temp = b[i];
        let j = i;
        while (j >= gap) {
          sComps++;
          if (b[j - gap] > temp) {
            b[j] = b[j - gap];
            sShifts++;
            sSteps.push({
              array: [...b],
              activeIndices: [j - gap, j],
              gap,
              comparisons: sComps,
              shifts: sShifts,
              message: `Gap leap: b[${j - gap}] (${b[j - gap]}) > temp (${temp}). Shifted forward across gap ${gap}.`
            });
            j -= gap;
          } else {
            break;
          }
        }
        b[j] = temp;
        sSteps.push({
          array: [...b],
          activeIndices: [j],
          gap,
          comparisons: sComps,
          shifts: sShifts,
          message: `Placed element ${temp} at index ${j} during gap ${gap} pass.`
        });
      }
      gap = Math.floor(gap / 2);
    }

    setShellSteps(sSteps);
    setShellIdx(0);
    setIsPlaying(false);
  }, [initialArray]);

  // Autoplay with decreased baseline speed
  useEffect(() => {
    if (!isPlaying) return;
    const baseInterval = 1400; // Decreased speed for clear side-by-side observation
    const intervalTime = Math.max(250, Math.round(baseInterval / speed));

    const timer = setInterval(() => {
      let canAdvanceIns = false;
      let canAdvanceShell = false;

      if (insertionIdx < insertionSteps.length - 1) {
        setInsertionIdx((p) => p + 1);
        canAdvanceIns = true;
      }
      if (shellIdx < shellSteps.length - 1) {
        setShellIdx((p) => p + 1);
        canAdvanceShell = true;
      }

      if (!canAdvanceIns && !canAdvanceShell) {
        setIsPlaying(false);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, insertionIdx, shellIdx, insertionSteps.length, shellSteps.length, speed]);

  const curIns = insertionSteps[insertionIdx] || {
    array: initialArray,
    activeIndices: [],
    comparisons: 0,
    shifts: 0,
    message: ''
  };

  const curShell = shellSteps[shellIdx] || {
    array: initialArray,
    activeIndices: [],
    gap: Math.floor(initialArray.length / 2),
    comparisons: 0,
    shifts: 0,
    message: ''
  };

  const setPreset = (type: 'worst' | 'random' | 'nearly') => {
    if (type === 'worst') {
      setInitialArray([90, 80, 70, 60, 50, 40, 30, 20, 10, 5]);
    } else if (type === 'nearly') {
      setInitialArray([10, 20, 25, 40, 35, 50, 60, 75, 70, 90]);
    } else {
      const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 10);
      setInitialArray(arr);
    }
  };

  const maxVal = Math.max(...initialArray, 100);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Presets:</span>
          <button
            onClick={() => setPreset('worst')}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-rose-300 rounded font-medium border border-rose-950/60"
          >
            Worst Case (Reverse)
          </button>
          <button
            onClick={() => setPreset('random')}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-sky-300 rounded font-medium border border-slate-700"
          >
            Random
          </button>
          <button
            onClick={() => setPreset('nearly')}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded font-medium border border-slate-700"
          >
            Nearly Sorted
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Comparison'}
          </button>
          <button
            onClick={() => {
              if (insertionIdx < insertionSteps.length - 1) setInsertionIdx((p) => p + 1);
              if (shellIdx < shellSteps.length - 1) setShellIdx((p) => p + 1);
            }}
            disabled={isPlaying}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Step forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <VisualizerSpeedControl speed={speed} onChangeSpeed={setSpeed} />
          <button
            onClick={() => {
              setInsertionIdx(0);
              setShellIdx(0);
              setIsPlaying(false);
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Visualizer Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insertion Sort Pane */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-rose-400">Insertion Sort (Gap = 1)</h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Comparisons: <strong className="text-rose-300 font-mono">{curIns.comparisons}</strong></span>
                <span>·</span>
                <span>Shifts: <strong className="text-rose-300 font-mono">{curIns.shifts}</strong></span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-900/60 font-mono">
              O(n²) Worst Case
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-44 flex items-end justify-center gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800">
            {curIns.array.map((val, idx) => {
              const isActive = curIns.activeIndices.includes(idx);
              const heightPct = Math.max(15, (val / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center max-w-10">
                  <span className="text-[10px] font-mono text-slate-400 mb-1">{val}</span>
                  <div
                    className={`w-full rounded-t transition-all duration-150 ${
                      isActive
                        ? 'bg-rose-500 shadow-md shadow-rose-950'
                        : 'bg-rose-950/60 border border-rose-900/50'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span className="text-rose-400 font-mono font-semibold">Step {insertionIdx + 1}/{insertionSteps.length}: </span>
            {curIns.message}
          </div>
        </div>

        {/* Shell Sort Pane */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-emerald-400">Shell Sort (Diminishing Gaps)</h4>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>Comparisons: <strong className="text-emerald-300 font-mono">{curShell.comparisons}</strong></span>
                <span>·</span>
                <span>Shifts: <strong className="text-emerald-300 font-mono">{curShell.shifts}</strong></span>
                <span>·</span>
                <span>Current Gap: <strong className="text-amber-400 font-mono">{curShell.gap ?? 1}</strong></span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-900/60 font-mono">
              O(n¹.⁵) / Sub-Quadratic
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-44 flex items-end justify-center gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800">
            {curShell.array.map((val, idx) => {
              const isActive = curShell.activeIndices.includes(idx);
              const heightPct = Math.max(15, (val / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center max-w-10">
                  <span className="text-[10px] font-mono text-slate-400 mb-1">{val}</span>
                  <div
                    className={`w-full rounded-t transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-400 shadow-md shadow-emerald-950'
                        : 'bg-emerald-950/60 border border-emerald-900/50'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span className="text-emerald-400 font-mono font-semibold">Step {shellIdx + 1}/{shellSteps.length}: </span>
            {curShell.message}
          </div>
        </div>
      </div>

      {/* Efficiency Comparison Metric */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-300">
          <strong>Efficiency Verdict:</strong> Insertion Sort takes 1-step shifts, causing worst-case quadratic behavior. Shell Sort h-sorts across gaps first, putting far-apart elements in near-sorted order rapidly!
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-rose-400">Total Shifts (Insertion): <strong>{curIns.shifts}</strong></div>
          <div className="text-emerald-400">Total Shifts (Shell): <strong>{curShell.shifts}</strong></div>
        </div>
      </div>
    </div>
  );
};
