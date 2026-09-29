import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle2, XCircle, ShoppingBag, Calendar } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface Activity {
  id: string;
  name: string;
  start: number;
  finish: number;
}

interface KnapsackItem {
  id: string;
  name: string;
  weight: number;
  value: number;
  ratio: number;
}

export const GreedyAlgorithmsVisualizer: React.FC = () => {
  const [subTopic, setSubTopic] = useState<'activity' | 'knapsack'>('activity');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Activity Selection State
  const defaultActivities: Activity[] = [
    { id: 'A1', name: 'Math Lecture', start: 1, finish: 4 },
    { id: 'A2', name: 'Lab Practical', start: 3, finish: 5 },
    { id: 'A3', name: 'DSA Seminar', start: 0, finish: 6 },
    { id: 'A4', name: 'Coding Contest', start: 5, finish: 7 },
    { id: 'A5', name: 'Web Dev Workshop', start: 3, finish: 9 },
    { id: 'A6', name: 'Project Review', start: 5, finish: 9 },
    { id: 'A7', name: 'Tech Talk', start: 6, finish: 10 },
    { id: 'A8', name: 'Hackathon Prep', start: 8, finish: 11 }
  ];

  // Knapsack State
  const defaultKnapsackItems: KnapsackItem[] = [
    { id: 'I1', name: 'Gold Dust', weight: 10, value: 60, ratio: 6.0 },
    { id: 'I2', name: 'Silver Bars', weight: 20, value: 100, ratio: 5.0 },
    { id: 'I3', name: 'Copper Coils', weight: 30, value: 120, ratio: 4.0 },
    { id: 'I4', name: 'Rare Earth', weight: 15, value: 45, ratio: 3.0 }
  ];
  const KNAPSACK_CAPACITY = 50;

  // Activity Trace
  const [sortedActivities, setSortedActivities] = useState<Activity[]>([]);
  const [actStepIdx, setActStepIdx] = useState<number>(0);

  // Knapsack Trace
  const [knapStepIdx, setKnapStepIdx] = useState<number>(0);

  useEffect(() => {
    // Sort activities by finish time (canonical Greedy choice)
    const sorted = [...defaultActivities].sort((a, b) => a.finish - b.finish);
    setSortedActivities(sorted);
    setActStepIdx(0);
    setKnapStepIdx(0);
    setIsPlaying(false);
  }, []);

  // Compute activity selection state up to actStepIdx
  const getActivityStateAtStep = () => {
    const selected: Activity[] = [];
    const rejected: Activity[] = [];
    let lastFinish = 0;

    for (let i = 0; i <= actStepIdx && i < sortedActivities.length; i++) {
      const act = sortedActivities[i];
      if (act.start >= lastFinish) {
        selected.push(act);
        lastFinish = act.finish;
      } else {
        rejected.push(act);
      }
    }

    const current = sortedActivities[actStepIdx] || null;
    return { selected, rejected, current, lastFinish };
  };

  // Compute knapsack state up to knapStepIdx
  const getKnapsackStateAtStep = () => {
    let currentWeight = 0;
    let totalValue = 0;
    const filledItems: { item: KnapsackItem; fraction: number; takenWeight: number; takenValue: number }[] = [];

    // Items pre-sorted by value-to-weight ratio descending
    const sortedItems = [...defaultKnapsackItems].sort((a, b) => b.ratio - a.ratio);

    for (let i = 0; i <= knapStepIdx && i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const remainingCap = KNAPSACK_CAPACITY - currentWeight;

      if (remainingCap <= 0) break;

      if (item.weight <= remainingCap) {
        currentWeight += item.weight;
        totalValue += item.value;
        filledItems.push({
          item,
          fraction: 1.0,
          takenWeight: item.weight,
          takenValue: item.value
        });
      } else {
        const fraction = remainingCap / item.weight;
        const takenWeight = remainingCap;
        const takenVal = item.value * fraction;
        currentWeight += takenWeight;
        totalValue += takenVal;
        filledItems.push({
          item,
          fraction,
          takenWeight,
          takenValue: takenVal
        });
        break;
      }
    }

    return { sortedItems, filledItems, currentWeight, totalValue };
  };

  const actState = getActivityStateAtStep();
  const knapState = getKnapsackStateAtStep();

  // Autoplay with decreased baseline speed
  useEffect(() => {
    if (!isPlaying) return;
    const maxIdx = subTopic === 'activity' ? sortedActivities.length - 1 : defaultKnapsackItems.length - 1;
    const baseInterval = 1400; // Decreased speed for clear activity and knapsack fraction visualization
    const intervalTime = Math.max(250, Math.round(baseInterval / speed));

    const timer = setInterval(() => {
      if (subTopic === 'activity') {
        setActStepIdx((prev) => {
          if (prev < maxIdx) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      } else {
        setKnapStepIdx((prev) => {
          if (prev < maxIdx) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, subTopic, sortedActivities.length, defaultKnapsackItems.length, speed]);

  return (
    <div className="space-y-6">
      {/* Top Toggle Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setSubTopic('activity');
              setIsPlaying(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              subTopic === 'activity' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Activity Selection (Earliest Finish Time)
          </button>
          <button
            onClick={() => {
              setSubTopic('knapsack');
              setIsPlaying(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              subTopic === 'knapsack' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Fractional Knapsack (Max Density Ratio)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Greedy Choice'}
          </button>
          <button
            onClick={() => {
              if (subTopic === 'activity' && actStepIdx < sortedActivities.length - 1) setActStepIdx((p) => p + 1);
              if (subTopic === 'knapsack' && knapStepIdx < defaultKnapsackItems.length - 1) setKnapStepIdx((p) => p + 1);
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
              setActStepIdx(0);
              setKnapStepIdx(0);
              setIsPlaying(false);
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Visual Arena */}
      {subTopic === 'activity' ? (
        /* Activity Selection Timeline */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-sky-400">Activity Selection: Greedy Choice by Finish Time</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Always pick the next compatible activity that finishes earliest, maximizing remaining free time.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">Selected: {actState.selected.length}</span>
              <span>·</span>
              <span className="text-slate-500">Inspected: {actStepIdx + 1} / {sortedActivities.length}</span>
            </div>
          </div>

          {/* Timeline Chart (0 to 12 hours) */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            {/* Timeline hour ticks */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 border-b border-slate-800 pb-1 px-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((hour) => (
                <span key={hour}>{hour}h</span>
              ))}
            </div>

            {/* Activities Bars */}
            <div className="space-y-2">
              {sortedActivities.map((act, idx) => {
                const isSelected = actState.selected.some((s) => s.id === act.id);
                const isRejected = actState.rejected.some((r) => r.id === act.id);
                const isCurrent = idx === actStepIdx;

                // Percentage styling across 0..12 hours
                const leftPct = (act.start / 12) * 100;
                const widthPct = ((act.finish - act.start) / 12) * 100;

                let barColor = 'bg-slate-800 border-slate-700 text-slate-400';
                if (isSelected) {
                  barColor = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-950';
                } else if (isRejected) {
                  barColor = 'bg-rose-950/60 border-rose-800 text-rose-400 opacity-60';
                } else if (isCurrent) {
                  barColor = 'bg-sky-950 border-sky-400 text-sky-200 ring-2 ring-sky-400';
                }

                return (
                  <div key={act.id} className="relative h-8 flex items-center bg-slate-900/40 rounded px-1">
                    <div
                      className={`absolute h-6 rounded flex items-center px-2 text-[11px] font-mono font-semibold border transition-all duration-300 ${barColor}`}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    >
                      <span className="truncate">{act.name} [{act.start}–{act.finish}]</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Step Explanation */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-mono font-semibold">Step {actStepIdx + 1}/{sortedActivities.length}:</span>
              {actState.current ? (
                <span>
                  Testing <strong>{actState.current.name}</strong> (starts at {actState.current.start}, finishes at {actState.current.finish}).{' '}
                  {actState.selected.some((s) => s.id === actState.current?.id) ? (
                    <span className="text-emerald-400 font-semibold">Compatible with last finish time! Selected.</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">Overlaps with active schedule (start {actState.current.start} &lt; previous finish {actState.lastFinish}). Discarded.</span>
                  )}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        /* Fractional Knapsack Visualizer */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-emerald-400">Fractional Knapsack: Greedy Density Ratio ($v_i / w_i$)</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Sort items by value per unit weight. Greedily take whole items, then take a fractional slice of the final item.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-sky-400 font-bold">Weight: {knapState.currentWeight} / {KNAPSACK_CAPACITY} kg</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">Total Value: ${knapState.totalValue.toFixed(1)}</span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Knapsack Physical Capacity</span>
              <span className="font-mono text-emerald-400 font-bold">
                {((knapState.currentWeight / KNAPSACK_CAPACITY) * 100).toFixed(0)}% Full
              </span>
            </div>
            <div className="w-full bg-slate-800 h-5 rounded-lg overflow-hidden flex">
              {knapState.filledItems.map((fi, idx) => (
                <div
                  key={idx}
                  className="h-full bg-emerald-500 border-r border-emerald-950 flex items-center justify-center text-[10px] font-mono text-slate-950 font-bold truncate px-1 transition-all duration-300"
                  style={{ width: `${(fi.takenWeight / KNAPSACK_CAPACITY) * 100}%` }}
                  title={`${fi.item.name}: ${fi.takenWeight}kg ($${fi.takenValue})`}
                >
                  {fi.item.name} ({fi.fraction === 1 ? '100%' : `${(fi.fraction * 100).toFixed(0)}%`})
                </div>
              ))}
            </div>
          </div>

          {/* Items Density Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {knapState.sortedItems.map((item, idx) => {
              const filled = knapState.filledItems.find((f) => f.item.id === item.id);
              const isTaken = Boolean(filled);

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border font-mono text-xs space-y-1.5 transition-all ${
                    isTaken
                      ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{item.name}</span>
                    <span className="text-[10px] text-sky-400 font-semibold">Ratio: {item.ratio}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Weight: {item.weight} kg · Value: ${item.value}
                  </div>
                  <div className="text-[10px] pt-1 border-t border-slate-900 flex justify-between">
                    <span>Status:</span>
                    <span className={isTaken ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                      {isTaken ? (filled?.fraction === 1 ? '100% Taken' : `${(filled!.fraction * 100).toFixed(0)}% Partial`) : 'Not Taken'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step description */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
            <span className="text-emerald-400 font-mono font-semibold">Greedy Invariant: </span>
            Fractional Knapsack achieves guaranteed optimal maximum value because we strictly prioritize the highest density items first ($O(n \log n)$ due to sorting).
          </div>
        </div>
      )}
    </div>
  );
};
