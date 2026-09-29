import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Plus, Trash2, Edit3, ArrowRight, AlertTriangle } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface ShiftAnimationStep {
  type: 'prepare' | 'shift_right' | 'shift_left' | 'place' | 'direct_update' | 'done';
  arraySnapshot: (number | null)[];
  activeLength: number;
  highlightIndices: number[];
  sourceIndex?: number;
  destIndex?: number;
  message: string;
  opType: 'insert' | 'delete' | 'update';
  shiftsCount: number;
}

export const ArrayOperationsVisualizer: React.FC = () => {
  const CAPACITY = 8;
  const BASE_ADDRESS = 0x2000;
  const ELEMENT_SIZE = 4; // 4 bytes

  const defaultArray: (number | null)[] = [12, 28, 45, 67, 89, null, null, null];
  const defaultLength = 5;

  const [currentSlots, setCurrentSlots] = useState<(number | null)[]>([...defaultArray]);
  const [currentLength, setCurrentLength] = useState<number>(defaultLength);

  // Form inputs for operations
  const [targetIndex, setTargetIndex] = useState<number>(2);
  const [inputValue, setInputValue] = useState<number>(99);
  const [selectedOp, setSelectedOp] = useState<'insert' | 'delete' | 'update'>('insert');

  // Animation trace
  const [steps, setSteps] = useState<ShiftAnimationStep[]>([]);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate trace whenever user triggers an operation
  const runOperation = (op: 'insert' | 'delete' | 'update', idx: number, val: number) => {
    setErrorMessage(null);
    const trace: ShiftAnimationStep[] = [];
    let working = [...currentSlots];
    let len = currentLength;
    let shifts = 0;

    if (op === 'insert') {
      if (len >= CAPACITY) {
        setErrorMessage('Array is at maximum capacity (8 slots). Cannot insert further without dynamic resizing.');
        return;
      }
      if (idx < 0 || idx > len) {
        setErrorMessage(`Index out of bounds! Valid insert range is 0 to ${len}.`);
        return;
      }

      trace.push({
        type: 'prepare',
        arraySnapshot: [...working],
        activeLength: len,
        highlightIndices: [idx],
        opType: 'insert',
        shiftsCount: 0,
        message: `Preparing to insert ${val} at index ${idx}. Must shift elements from index ${len - 1} down to ${idx} rightward.`
      });

      // Shift elements right starting from len - 1
      for (let i = len - 1; i >= idx; i--) {
        shifts++;
        working[i + 1] = working[i];
        trace.push({
          type: 'shift_right',
          arraySnapshot: [...working],
          activeLength: len + 1,
          highlightIndices: [i, i + 1],
          sourceIndex: i,
          destIndex: i + 1,
          opType: 'insert',
          shiftsCount: shifts,
          message: `Shift right: Moved arr[${i}] (${working[i]}) to arr[${i + 1}] (slot address 0x${(BASE_ADDRESS + (i + 1) * ELEMENT_SIZE).toString(16).toUpperCase()}).`
        });
      }

      working[idx] = val;
      len = len + 1;

      trace.push({
        type: 'place',
        arraySnapshot: [...working],
        activeLength: len,
        highlightIndices: [idx],
        opType: 'insert',
        shiftsCount: shifts,
        message: `Inserted new value ${val} at vacant index ${idx}. New length is ${len}. Total element shifts: ${shifts}.`
      });

      trace.push({
        type: 'done',
        arraySnapshot: [...working],
        activeLength: len,
        highlightIndices: [idx],
        opType: 'insert',
        shiftsCount: shifts,
        message: `Insertion complete in O(n) time!`
      });
    } else if (op === 'delete') {
      if (len <= 0) {
        setErrorMessage('Array is already empty. No element to delete.');
        return;
      }
      if (idx < 0 || idx >= len) {
        setErrorMessage(`Index out of bounds! Valid delete range is 0 to ${len - 1}.`);
        return;
      }

      const deletedVal = working[idx];
      trace.push({
        type: 'prepare',
        arraySnapshot: [...working],
        activeLength: len,
        highlightIndices: [idx],
        opType: 'delete',
        shiftsCount: 0,
        message: `Marked arr[${idx}] (${deletedVal}) for deletion. Must shift elements from index ${idx + 1} up to ${len - 1} leftward.`
      });

      // Shift elements left
      for (let i = idx; i < len - 1; i++) {
        shifts++;
        working[i] = working[i + 1];
        trace.push({
          type: 'shift_left',
          arraySnapshot: [...working],
          activeLength: len,
          highlightIndices: [i, i + 1],
          sourceIndex: i + 1,
          destIndex: i,
          opType: 'delete',
          shiftsCount: shifts,
          message: `Shift left: Pulled arr[${i + 1}] (${working[i + 1]}) into arr[${i}] (overwriting previous value).`
        });
      }

      working[len - 1] = null;
      len = len - 1;

      trace.push({
        type: 'done',
        arraySnapshot: [...working],
        activeLength: len,
        highlightIndices: [],
        opType: 'delete',
        shiftsCount: shifts,
        message: `Deleted element. Cleared tail slot and decremented length to ${len}. Total shifts: ${shifts}.`
      });
    } else {
      // updateAt
      if (idx < 0 || idx >= len) {
        setErrorMessage(`Index out of bounds! Valid update range is 0 to ${len - 1}.`);
        return;
      }
      const prevVal = working[idx];
      working[idx] = val;
      const targetAddr = (BASE_ADDRESS + idx * ELEMENT_SIZE).toString(16).toUpperCase();

      trace.push({
        type: 'direct_update',
        arraySnapshot: [...working],
        activeLength: len,
        highlightIndices: [idx],
        opType: 'update',
        shiftsCount: 0,
        message: `Direct O(1) Memory Access: Address = 0x${BASE_ADDRESS.toString(16)} + (${idx} * 4) = 0x${targetAddr}. Overwrote ${prevVal} with ${val}. Shifts: 0.`
      });
    }

    setSteps(trace);
    setStepIdx(0);
    setIsPlaying(true);
  };

  // Autoplay with decreased baseline speed
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    const baseInterval = 1400; // Decreased speed for pedagogical clarity
    const intervalTime = Math.max(250, Math.round(baseInterval / speed));

    const timer = setInterval(() => {
      setStepIdx((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          // Commit end state to current slots
          const last = steps[steps.length - 1];
          setCurrentSlots(last.arraySnapshot);
          setCurrentLength(last.activeLength);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, steps, speed]);

  const handleReset = () => {
    setCurrentSlots([...defaultArray]);
    setCurrentLength(defaultLength);
    setSteps([]);
    setStepIdx(0);
    setIsPlaying(false);
  };

  const currentStep = steps[stepIdx] || {
    arraySnapshot: currentSlots,
    activeLength: currentLength,
    highlightIndices: [],
    message: 'Select an operation (Insert, Delete, or Update) to visualize contiguous memory shifts.',
    shiftsCount: 0,
    opType: selectedOp
  };

  return (
    <div className="space-y-6">
      {/* Top Action Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedOp('insert')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedOp === 'insert' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              insertAt(idx, val)
            </button>
            <button
              onClick={() => setSelectedOp('delete')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedOp === 'delete' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              deleteAt(idx)
            </button>
            <button
              onClick={() => setSelectedOp('update')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedOp === 'update' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              updateAt(idx, val)
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Index:</span>
            <input
              type="number"
              min="0"
              max={CAPACITY - 1}
              value={targetIndex}
              onChange={(e) => setTargetIndex(Math.max(0, Math.min(CAPACITY - 1, Number(e.target.value))))}
              className="w-14 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-sky-400 font-mono text-center focus:outline-none focus:border-sky-500"
            />
          </div>

          {selectedOp !== 'delete' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Value:</span>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-emerald-400 font-mono text-center focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          <button
            onClick={() => runOperation(selectedOp, targetIndex, inputValue)}
            className="px-4 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors shadow-sm"
          >
            Execute {selectedOp.toUpperCase()}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {steps.length > 0 && (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => stepIdx < steps.length - 1 && setStepIdx(stepIdx + 1)}
                disabled={isPlaying || stepIdx >= steps.length - 1}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg transition-colors border border-slate-700"
                title="Step forward"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {steps.length > 0 && (
            <VisualizerSpeedControl speed={speed} onChangeSpeed={setSpeed} />
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Inline Error Message Banner if invalid index or overflow */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl flex items-center gap-2.5 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Memory Grid Visualization */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-sky-400">Contiguous Memory Buffer (Fixed Capacity = 8)</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Active Length: <strong className="text-emerald-400 font-mono">{currentStep.activeLength} / {CAPACITY}</strong></span>
              <span>·</span>
              <span>Element Shifts: <strong className="text-amber-400 font-mono">{currentStep.shiftsCount}</strong></span>
              <span>·</span>
              <span>Memory Base: <strong className="text-slate-300 font-mono">0x{BASE_ADDRESS.toString(16).toUpperCase()}</strong></span>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded font-mono bg-slate-800 text-slate-300">
            Byte Offset = index × 4 bytes
          </span>
        </div>

        {/* Physical Slots */}
        <div className="overflow-x-auto pb-4 pt-4">
          <div className="grid grid-cols-8 gap-2 min-w-[640px]">
            {currentStep.arraySnapshot.map((val, idx) => {
              const isOccupied = val !== null && idx < currentStep.activeLength;
              const isHighlighted = currentStep.highlightIndices.includes(idx);
              const hexAddr = (BASE_ADDRESS + idx * ELEMENT_SIZE).toString(16).toUpperCase();

              let containerBorder = 'border-slate-800 bg-slate-950/60 text-slate-500';
              if (isHighlighted) {
                if (currentStep.opType === 'insert') {
                  containerBorder = 'border-sky-500 bg-sky-950/60 text-sky-200 ring-2 ring-sky-500/50 shadow-md shadow-sky-950';
                } else if (currentStep.opType === 'delete') {
                  containerBorder = 'border-rose-500 bg-rose-950/60 text-rose-200 ring-2 ring-rose-500/50';
                } else {
                  containerBorder = 'border-amber-500 bg-amber-950/60 text-amber-200 ring-2 ring-amber-500/50';
                }
              } else if (isOccupied) {
                containerBorder = 'border-slate-700 bg-slate-950 text-slate-200';
              }

              return (
                <div key={idx} className="flex flex-col items-center">
                  {/* Hex memory address header */}
                  <span className="text-[10px] font-mono text-slate-500 mb-1">0x{hexAddr}</span>

                  {/* Slot box */}
                  <div
                    className={`w-full h-18 rounded-lg flex flex-col items-center justify-center border font-mono transition-all duration-300 ${containerBorder}`}
                  >
                    <span className="text-base font-bold">
                      {val !== null ? val : <span className="text-slate-700 font-normal italic text-xs">[null]</span>}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      {isOccupied ? 'Occupied' : 'Free'}
                    </span>
                  </div>

                  {/* Slot Index */}
                  <span className="text-xs font-mono font-semibold text-slate-400 mt-1.5">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Educational Log Message */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
          <div className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentStep.message}
          </div>
        </div>

        {/* Hardware Mechanics Note */}
        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            <strong>Memory Formula:</strong> <code>address(arr[i]) = 0x2000 + i * 4</code>. Because addresses are computed mathematically, reading/updating any slot takes exactly 1 CPU cycle ($O(1)$).
          </span>
          <span className="text-sky-400 font-mono font-semibold">O(1) Random Access</span>
        </div>
      </div>
    </div>
  );
};
