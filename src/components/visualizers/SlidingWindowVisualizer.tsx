import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface WindowStep {
  left: number;
  right: number;
  currentChar: string;
  duplicateFound: boolean;
  duplicateChar?: string;
  lastSeenIdx?: number;
  currentWindowStr: string;
  currentWindowLen: number;
  maxLenSoFar: number;
  longestSubstr: string;
  charMap: Record<string, number>;
  message: string;
}

export const SlidingWindowVisualizer: React.FC = () => {
  const [inputStr, setInputStr] = useState<string>('abcabcbb');
  const [steps, setSteps] = useState<WindowStep[]>([]);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Pre-calculate full sliding window execution trace
  useEffect(() => {
    const s = inputStr;
    const trace: WindowStep[] = [];
    const lastIndex = new Map<string, number>();
    let left = 0;
    let maxLen = 0;
    let bestStart = 0;

    trace.push({
      left: 0,
      right: 0,
      currentChar: s[0] || '',
      duplicateFound: false,
      currentWindowStr: s[0] || '',
      currentWindowLen: s.length > 0 ? 1 : 0,
      maxLenSoFar: 0,
      longestSubstr: '',
      charMap: {},
      message: 'Initial state: Window starts with left = 0, expanding right pointer.'
    });

    for (let right = 0; right < s.length; right++) {
      const char = s[right];
      const hasDup = lastIndex.has(char) && (lastIndex.get(char)! >= left);
      const prevIdx = lastIndex.get(char);

      if (hasDup) {
        const oldLeft = left;
        left = prevIdx! + 1;
        trace.push({
          left,
          right,
          currentChar: char,
          duplicateFound: true,
          duplicateChar: char,
          lastSeenIdx: prevIdx,
          currentWindowStr: s.slice(left, right + 1),
          currentWindowLen: right - left + 1,
          maxLenSoFar: maxLen,
          longestSubstr: s.slice(bestStart, bestStart + maxLen),
          charMap: Object.fromEntries(lastIndex),
          message: `Duplicate detected! '${char}' was previously seen at index ${prevIdx}. Jump left pointer from ${oldLeft} to ${left}.`
        });
      }

      lastIndex.set(char, right);
      const curLen = right - left + 1;
      if (curLen > maxLen) {
        maxLen = curLen;
        bestStart = left;
      }

      trace.push({
        left,
        right,
        currentChar: char,
        duplicateFound: false,
        currentWindowStr: s.slice(left, right + 1),
        currentWindowLen: curLen,
        maxLenSoFar: maxLen,
        longestSubstr: s.slice(bestStart, bestStart + maxLen),
        charMap: Object.fromEntries(lastIndex),
        message: `Expanded window to [${left}...${right}] ("${s.slice(left, right + 1)}"). Current length: ${curLen}. Max so far: ${maxLen}.`
      });
    }

    setSteps(trace);
    setStepIdx(0);
    setIsPlaying(false);
  }, [inputStr]);

  // Autoplay with decreased baseline speed
  useEffect(() => {
    if (!isPlaying) return;
    const baseInterval = 1400; // Decreased speed for clear pedagogical reading
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
    left: 0,
    right: 0,
    currentChar: '',
    duplicateFound: false,
    currentWindowStr: '',
    currentWindowLen: 0,
    maxLenSoFar: 0,
    longestSubstr: '',
    charMap: {},
    message: ''
  };

  const presets = ['abcabcbb', 'bbbbb', 'pwwkew', 'tmmzuxt', 'algorithm'];

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Input String:</span>
            <input
              type="text"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              className="w-40 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-sky-400 font-mono text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-1">Presets:</span>
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setInputStr(p)}
                className={`px-2 py-1 text-[11px] rounded font-mono transition-colors ${
                  inputStr === p
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

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
      </div>

      {/* Main Sliding Window View */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-sky-400">Sliding Window: [left ... right]</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Current Window: <strong className="text-sky-300 font-mono">"{cur.currentWindowStr}" (len: {cur.currentWindowLen})</strong></span>
              <span>·</span>
              <span>Max Length: <strong className="text-emerald-400 font-mono">{cur.maxLenSoFar}</strong></span>
              <span>·</span>
              <span>Longest Substr: <strong className="text-emerald-300 font-mono">"{cur.longestSubstr}"</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cur.duplicateFound && (
              <span className="text-xs px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-semibold animate-pulse">
                Duplicate Collision: '{cur.duplicateChar}'
              </span>
            )}
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
              O(n) Amortized
            </span>
          </div>
        </div>

        {/* Character String with Visual Sliding Window Bracket */}
        <div className="overflow-x-auto pb-4 pt-6">
          <div className="flex items-center gap-2 min-w-max justify-center">
            {inputStr.split('').map((ch, idx) => {
              const inWindow = idx >= cur.left && idx <= cur.right;
              const isLeftEdge = idx === cur.left;
              const isRightEdge = idx === cur.right;
              const isConflict = cur.duplicateFound && idx === cur.lastSeenIdx;

              let style = 'border-slate-800 bg-slate-950/60 text-slate-500';
              if (isConflict) {
                style = 'border-rose-500 bg-rose-950 text-rose-200 ring-2 ring-rose-500 shadow-md shadow-rose-950';
              } else if (isRightEdge) {
                style = 'border-sky-400 bg-sky-950 text-sky-100 ring-2 ring-sky-400';
              } else if (inWindow) {
                style = 'border-sky-700/80 bg-sky-950/40 text-sky-200';
              }

              return (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Top Pointer Indicators */}
                  <div className="absolute -top-6 flex gap-1 text-[10px] font-mono font-bold">
                    {isLeftEdge && <span className="text-emerald-400 font-mono">left</span>}
                    {isRightEdge && <span className="text-sky-400 font-mono">right</span>}
                  </div>

                  {/* Character box */}
                  <div
                    className={`w-11 h-13 rounded-lg flex items-center justify-center font-mono font-bold text-base border transition-all duration-200 ${style}`}
                  >
                    {ch}
                  </div>

                  {/* Index */}
                  <span className="text-[10px] font-mono text-slate-500 mt-1.5">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Hash Map of Last Observed Indices */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Hash Map: Last Observed Character Indices</span>
            <span className="text-[11px] font-mono">O(1) Map Lookup</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(cur.charMap).length === 0 ? (
              <span className="text-xs text-slate-600 italic">Empty map</span>
            ) : (
              Object.entries(cur.charMap).map(([ch, lastIdx]) => {
                const isActiveInWindow = lastIdx >= cur.left;
                return (
                  <div
                    key={ch}
                    className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 border ${
                      isActiveInWindow
                        ? 'border-sky-700/60 bg-sky-950/40 text-sky-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-500'
                    }`}
                  >
                    <span className="font-bold">'{ch}':</span>
                    <span>idx {lastIdx}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Step explanation */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
          <span className="text-sky-400 font-mono font-semibold shrink-0">Step {stepIdx + 1}/{steps.length}:</span>
          <span>{cur.message}</span>
        </div>
      </div>
    </div>
  );
};
