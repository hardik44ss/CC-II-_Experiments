import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, ArrowRight, CornerDownLeft, Eye, RefreshCw } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface WindowStep {
  windowEnd: number;
  windowStart: number;
  currentElement: number;
  dequeIndices: number[];
  windowMax: number | null;
  message: string;
}

export const QueueDequeVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deque_max' | 'circular_queue'>('deque_max');

  // Sliding Window Max State
  const sampleArray = [1, 3, -1, -3, 5, 3, 6, 7];
  const K = 3;

  const [steps, setSteps] = useState<WindowStep[]>([]);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Circular Queue State
  const QUEUE_CAPACITY = 6;
  const [queueSlots, setQueueSlots] = useState<(number | null)[]>([10, 20, 30, null, null, null]);
  const [front, setFront] = useState<number>(0);
  const [rear, setRear] = useState<number>(2);
  const [queueCount, setQueueCount] = useState<number>(3);
  const [queueInputVal, setQueueInputVal] = useState<number>(40);
  const [queueLog, setQueueLog] = useState<string>('Circular Queue initialized with 3 elements (capacity 6).');

  // Pre-calculate Monotonic Deque Steps for Sliding Window Maximum
  useEffect(() => {
    const trace: WindowStep[] = [];
    const deque: number[] = []; // stores indices

    for (let i = 0; i < sampleArray.length; i++) {
      const val = sampleArray[i];

      // Remove indices that are outside the current window [i - K + 1 ... i]
      while (deque.length > 0 && deque[0] < i - K + 1) {
        const evicted = deque.shift()!;
        trace.push({
          windowStart: Math.max(0, i - K + 1),
          windowEnd: i,
          currentElement: val,
          dequeIndices: [...deque],
          windowMax: deque.length > 0 ? sampleArray[deque[0]] : null,
          message: `Evicted index ${evicted} from front of deque (out of sliding window).`
        });
      }

      // Evict elements from back of deque while they are smaller than current element
      while (deque.length > 0 && sampleArray[deque[deque.length - 1]] <= val) {
        const popped = deque.pop()!;
        trace.push({
          windowStart: Math.max(0, i - K + 1),
          windowEnd: i,
          currentElement: val,
          dequeIndices: [...deque],
          windowMax: deque.length > 0 ? sampleArray[deque[0]] : null,
          message: `Evicted index ${popped} (${sampleArray[popped]}) from back: smaller than incoming ${val}.`
        });
      }

      deque.push(i);

      const hasFullWindow = i >= K - 1;
      const curMax = hasFullWindow ? sampleArray[deque[0]] : null;

      trace.push({
        windowStart: Math.max(0, i - K + 1),
        windowEnd: i,
        currentElement: val,
        dequeIndices: [...deque],
        windowMax: curMax,
        message: hasFullWindow
          ? `Window [${i - K + 1}...${i}] complete. Front of deque is max value: ${curMax}.`
          : `Processing initial elements: added index ${i} (${val}) to deque.`
      });
    }

    setSteps(trace);
    setStepIdx(0);
    setIsPlaying(false);
  }, []);

  // Autoplay with decreased baseline speed
  useEffect(() => {
    if (!isPlaying) return;
    const baseInterval = 1400; // Decreased speed for clear monotonic deque step inspection
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

  const curStep = steps[stepIdx] || {
    windowEnd: 0,
    windowStart: 0,
    currentElement: 1,
    dequeIndices: [0],
    windowMax: null,
    message: ''
  };

  // Circular Queue Operations
  const handleEnqueue = () => {
    if (queueCount >= QUEUE_CAPACITY) {
      setQueueLog('Queue Overflow! Buffer is completely full.');
      return;
    }
    const newRear = (rear + 1) % QUEUE_CAPACITY;
    const nextSlots = [...queueSlots];
    nextSlots[newRear] = queueInputVal;
    setQueueSlots(nextSlots);
    setRear(newRear);
    setQueueCount((c) => c + 1);
    setQueueLog(`Enqueued ${queueInputVal} at rear index ${newRear} using (rear + 1) % ${QUEUE_CAPACITY}.`);
    setQueueInputVal((v) => v + 10);
  };

  const handleDequeue = () => {
    if (queueCount <= 0) {
      setQueueLog('Queue Underflow! Buffer is empty.');
      return;
    }
    const val = queueSlots[front];
    const nextSlots = [...queueSlots];
    nextSlots[front] = null;
    setQueueSlots(nextSlots);
    const newFront = (front + 1) % QUEUE_CAPACITY;
    setFront(newFront);
    setQueueCount((c) => c - 1);
    setQueueLog(`Dequeued ${val} from front index ${front}. Next front is ${newFront}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('deque_max');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'deque_max' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sliding Window Maximum (Monotonic Deque O(n))
          </button>
          <button
            onClick={() => {
              setActiveTab('circular_queue');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'circular_queue' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Circular Queue (Ring Buffer)
          </button>
        </div>

        {activeTab === 'deque_max' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Play Deque'}
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

      {activeTab === 'deque_max' ? (
        /* Monotonic Deque Sliding Window Arena */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-sky-400">Sliding Window Maximum (Window Size k = 3)</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                The Monotonic Deque maintains indices in decreasing order of values, guaranteeing $O(1)$ max query.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span>Window: [{curStep.windowStart}...{curStep.windowEnd}]</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">Current Max: {curStep.windowMax !== null ? curStep.windowMax : 'Initializing'}</span>
            </div>
          </div>

          {/* Array Boxes with Window Highlight */}
          <div className="overflow-x-auto pb-4 pt-6">
            <div className="flex items-center gap-2.5 min-w-max justify-center">
              {sampleArray.map((val, idx) => {
                const inWindow = idx >= curStep.windowStart && idx <= curStep.windowEnd;
                const isHead = idx === curStep.windowStart;
                const isTail = idx === curStep.windowEnd;
                const inDeque = curStep.dequeIndices.includes(idx);
                const isDequeFront = curStep.dequeIndices[0] === idx && curStep.windowMax !== null;

                let style = 'border-slate-800 bg-slate-950/60 text-slate-500';
                if (isDequeFront) {
                  style = 'border-emerald-400 bg-emerald-950/90 text-emerald-200 ring-2 ring-emerald-400 shadow-lg shadow-emerald-950';
                } else if (inDeque) {
                  style = 'border-sky-400 bg-sky-950 text-sky-200 ring-1 ring-sky-400';
                } else if (inWindow) {
                  style = 'border-slate-700 bg-slate-900 text-slate-300';
                }

                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <div className="absolute -top-6 flex gap-1 text-[10px] font-mono font-bold">
                      {isHead && <span className="text-sky-400">L</span>}
                      {isTail && <span className="text-amber-400">R</span>}
                    </div>

                    <div
                      className={`w-12 h-14 rounded-lg flex items-center justify-center font-mono font-bold text-base border transition-all duration-200 ${style}`}
                    >
                      {val}
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 mt-1.5">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monotonic Deque Buffer View */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Monotonic Deque (Stores Indices in Decreasing Value Order)</span>
              <span className="font-mono text-sky-400">Front $\to$ Rear</span>
            </div>
            <div className="flex items-center gap-2 min-h-12 flex-wrap">
              {curStep.dequeIndices.length === 0 ? (
                <span className="text-xs text-slate-600 italic">Empty deque</span>
              ) : (
                curStep.dequeIndices.map((idx, pos) => (
                  <div
                    key={idx}
                    className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center gap-1.5 border ${
                      pos === 0
                        ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300 font-bold'
                        : 'border-sky-500/60 bg-sky-950/40 text-sky-300'
                    }`}
                  >
                    <span>idx {idx}</span>
                    <span className="text-slate-400">(val: {sampleArray[idx]})</span>
                    {pos === 0 && <span className="text-[9px] text-emerald-400 font-bold ml-1">[MAX]</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Step message */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="text-sky-400 font-mono font-semibold">Step {stepIdx + 1}/{steps.length}:</span>
            <span>{curStep.message}</span>
          </div>
        </div>
      ) : (
        /* Circular Queue Ring Buffer Arena */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-emerald-400">Circular Queue (Ring Buffer) Simulator</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Front and Rear wrap around using modular arithmetic: (index + 1) % QUEUE_CAPACITY.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={queueInputVal}
                onChange={(e) => setQueueInputVal(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-sky-400 font-mono text-center text-xs focus:outline-none"
              />
              <button
                onClick={handleEnqueue}
                className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
              >
                Enqueue
              </button>
              <button
                onClick={handleDequeue}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
              >
                Dequeue
              </button>
            </div>
          </div>

          {/* Ring Buffer Visual Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {queueSlots.map((val, idx) => {
              const isFront = idx === front && queueCount > 0;
              const isRear = idx === rear && queueCount > 0;
              const isOccupied = val !== null;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-between h-28 font-mono transition-all ${
                    isFront && isRear
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                      : isFront
                      ? 'border-sky-400 bg-sky-950/40 text-sky-200'
                      : isRear
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : isOccupied
                      ? 'border-slate-700 bg-slate-950 text-slate-300'
                      : 'border-slate-800 bg-slate-950/40 text-slate-600'
                  }`}
                >
                  <span className="text-[10px] text-slate-500">Slot [{idx}]</span>
                  <span className="text-xl font-bold">
                    {val !== null ? val : <span className="text-slate-700 font-normal italic text-xs">null</span>}
                  </span>
                  <div className="flex gap-1 text-[10px] font-bold">
                    {isFront && <span className="text-sky-400">FRONT</span>}
                    {isRear && <span className="text-emerald-400">REAR</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status & Log */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>{queueLog}</span>
            <span className="font-mono text-slate-400">
              Count: <strong className="text-emerald-400">{queueCount}</strong> / {QUEUE_CAPACITY}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
