import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle2, XCircle, ArrowLeftRight } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface PalindromeStep {
  left: number;
  right: number;
  leftChar: string;
  rightChar: string;
  action: 'check' | 'skip_left' | 'skip_right' | 'match' | 'mismatch' | 'success';
  message: string;
}

interface FreqStep {
  index: number;
  char: string;
  frequencies: Record<string, number>;
  message: string;
}

interface ReverseWordsStep {
  words: string[];
  left: number;
  right: number;
  swapped: boolean;
  message: string;
}

export const StringManipulationVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'reverse_words' | 'palindrome' | 'frequency'>('reverse_words');
  const [sentenceInput, setSentenceInput] = useState<string>('How are you');
  const [inputString, setInputString] = useState<string>('A man, a plan, a canal: Panama');
  const [freqInput, setFreqInput] = useState<string>('mississippi');

  // Reverse words state
  const [revSteps, setRevSteps] = useState<ReverseWordsStep[]>([]);
  const [revIdx, setRevIdx] = useState<number>(0);

  // Palindrome state
  const [palSteps, setPalSteps] = useState<PalindromeStep[]>([]);
  const [palIdx, setPalIdx] = useState<number>(0);

  // Frequency state
  const [freqSteps, setFreqSteps] = useState<FreqStep[]>([]);
  const [freqIdx, setFreqIdx] = useState<number>(0);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Generate Reverse Words Steps
  useEffect(() => {
    const rawWords = sentenceInput.trim().split(/\s+/).filter(Boolean);
    const trace: ReverseWordsStep[] = [];
    const working = [...rawWords];
    let left = 0;
    let right = working.length - 1;

    trace.push({
      words: [...working],
      left,
      right,
      swapped: false,
      message: `Initial word tokens: [${working.map((w) => `"${w}"`).join(', ')}]. Pointer left at index 0, right at index ${right}.`
    });

    while (left < right) {
      trace.push({
        words: [...working],
        left,
        right,
        swapped: false,
        message: `Inspecting words to swap: left[${left}] ("${working[left]}") and right[${right}] ("${working[right]}").`
      });

      // Swap
      const temp = working[left];
      working[left] = working[right];
      working[right] = temp;

      trace.push({
        words: [...working],
        left,
        right,
        swapped: true,
        message: `Swapped words! Index ${left} is now "${working[left]}", and index ${right} is now "${working[right]}". Moving pointers inward.`
      });

      left++;
      right--;
    }

    trace.push({
      words: [...working],
      left,
      right,
      swapped: false,
      message: `Pointers converged (left >= right). Joined output: "${working.join(' ')}". Word reversal complete in O(n) time!`
    });

    setRevSteps(trace);
    setRevIdx(0);
    setIsPlaying(false);
  }, [sentenceInput]);

  // Generate Palindrome Steps
  useEffect(() => {
    const s = inputString;
    const steps: PalindromeStep[] = [];
    let left = 0;
    let right = s.length - 1;
    const isAlphaNum = (ch: string) => /[a-zA-Z0-9]/.test(ch);

    steps.push({
      left,
      right,
      leftChar: s[left] || '',
      rightChar: s[right] || '',
      action: 'check',
      message: `Initial two-pointer setup: Left at 0 ('${s[0]}'), Right at ${right} ('${s[right]}').`
    });

    let isPal = true;
    while (left < right) {
      if (!isAlphaNum(s[left])) {
        steps.push({
          left,
          right,
          leftChar: s[left],
          rightChar: s[right],
          action: 'skip_left',
          message: `Index ${left} ('${s[left]}') is not alphanumeric. Incrementing left pointer.`
        });
        left++;
        continue;
      }

      if (!isAlphaNum(s[right])) {
        steps.push({
          left,
          right,
          leftChar: s[left],
          rightChar: s[right],
          action: 'skip_right',
          message: `Index ${right} ('${s[right]}') is not alphanumeric. Decrementing right pointer.`
        });
        right--;
        continue;
      }

      const lc = s[left].toLowerCase();
      const rc = s[right].toLowerCase();

      if (lc !== rc) {
        steps.push({
          left,
          right,
          leftChar: s[left],
          rightChar: s[right],
          action: 'mismatch',
          message: `Mismatch at indices [${left}, ${right}]: '${s[left]}' ('${lc}') !== '${s[right]}' ('${rc}'). Not a palindrome!`
        });
        isPal = false;
        break;
      } else {
        steps.push({
          left,
          right,
          leftChar: s[left],
          rightChar: s[right],
          action: 'match',
          message: `Match at indices [${left}, ${right}]: '${lc}' === '${rc}'. Incrementing left, decrementing right.`
        });
        left++;
        right--;
      }
    }

    if (isPal) {
      steps.push({
        left,
        right,
        leftChar: s[left] || '',
        rightChar: s[right] || '',
        action: 'success',
        message: `Pointers met or crossed. String is a valid palindrome!`
      });
    }

    setPalSteps(steps);
    setPalIdx(0);
    setIsPlaying(false);
  }, [inputString]);

  // Generate Frequency Steps
  useEffect(() => {
    const s = freqInput;
    const steps: FreqStep[] = [];
    const freqs: Record<string, number> = {};

    for (let i = 0; i < s.length; i++) {
      const char = s[i];
      freqs[char] = (freqs[char] || 0) + 1;
      steps.push({
        index: i,
        char,
        frequencies: { ...freqs },
        message: `Inspecting char '${char}' at index ${i}. Increment frequency to ${freqs[char]}.`
      });
    }

    setFreqSteps(steps);
    setFreqIdx(0);
    setIsPlaying(false);
  }, [freqInput]);

  // Autoplay
  useEffect(() => {
    if (!isPlaying) return;
    const maxIdx =
      mode === 'reverse_words'
        ? revSteps.length - 1
        : mode === 'palindrome'
        ? palSteps.length - 1
        : freqSteps.length - 1;

    const baseInterval = 1400; // Decreased speed for pedagogical clarity
    const intervalTime = Math.max(250, Math.round(baseInterval / speed));

    const timer = setInterval(() => {
      if (mode === 'reverse_words') {
        setRevIdx((prev) => {
          if (prev < maxIdx) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      } else if (mode === 'palindrome') {
        setPalIdx((prev) => {
          if (prev < maxIdx) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      } else {
        setFreqIdx((prev) => {
          if (prev < maxIdx) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, mode, revSteps.length, palSteps.length, freqSteps.length, speed]);

  const currentRev = revSteps[revIdx] || {
    words: sentenceInput.trim().split(/\s+/),
    left: 0,
    right: 0,
    swapped: false,
    message: ''
  };

  const currentPal = palSteps[palIdx] || {
    left: 0,
    right: 0,
    leftChar: '',
    rightChar: '',
    action: 'check',
    message: ''
  };

  const currentFreq = freqSteps[freqIdx] || {
    index: 0,
    char: '',
    frequencies: {},
    message: ''
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setMode('reverse_words');
                setIsPlaying(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'reverse_words' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Reverse Words ("How are you")
            </button>
            <button
              onClick={() => {
                setMode('palindrome');
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'palindrome' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Palindrome Validation
            </button>
            <button
              onClick={() => {
                setMode('frequency');
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                mode === 'frequency' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Frequency Map
            </button>
          </div>

          {mode === 'reverse_words' ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Sentence:</span>
              <input
                type="text"
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                className="w-48 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-sky-300 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          ) : mode === 'palindrome' ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Input String:</span>
              <input
                type="text"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                className="w-56 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-sky-300 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Input:</span>
              <input
                type="text"
                value={freqInput}
                onChange={(e) => setFreqInput(e.target.value)}
                className="w-48 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-emerald-300 font-mono text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          )}
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
            onClick={() => {
              if (mode === 'reverse_words' && revIdx < revSteps.length - 1) setRevIdx((p) => p + 1);
              if (mode === 'palindrome' && palIdx < palSteps.length - 1) setPalIdx((p) => p + 1);
              if (mode === 'frequency' && freqIdx < freqSteps.length - 1) setFreqIdx((p) => p + 1);
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
              setRevIdx(0);
              setPalIdx(0);
              setFreqIdx(0);
              setIsPlaying(false);
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Visual Stage */}
      {mode === 'reverse_words' ? (
        /* Reverse Words Stage */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-sky-400">Two-Pointer Word Token Reversal</h4>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-sky-400 font-mono">Left Word Index: [{currentRev.left}]</span>
              <span className="text-emerald-400 font-mono">Right Word Index: [{currentRev.right}]</span>
            </div>
          </div>

          {/* Word Tiles Display */}
          <div className="overflow-x-auto pb-4 pt-6">
            <div className="flex items-center gap-3 min-w-max justify-center">
              {currentRev.words.map((word, idx) => {
                const isLeft = idx === currentRev.left;
                const isRight = idx === currentRev.right;

                let tileStyle = 'border-slate-800 bg-slate-950 text-slate-300';
                if (isLeft && isRight) {
                  tileStyle = 'border-amber-400 bg-amber-950 text-amber-200 ring-2 ring-amber-400';
                } else if (isLeft) {
                  tileStyle = 'border-sky-400 bg-sky-950 text-sky-200 ring-2 ring-sky-400 animate-pulse';
                } else if (isRight) {
                  tileStyle = 'border-emerald-400 bg-emerald-950 text-emerald-200 ring-2 ring-emerald-400 animate-pulse';
                }

                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <div className="absolute -top-6 flex gap-1 text-[10px] font-mono font-bold">
                      {isLeft && <span className="text-sky-400">left</span>}
                      {isRight && <span className="text-emerald-400">right</span>}
                    </div>

                    <div
                      className={`px-4 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm border transition-all duration-300 ${tileStyle}`}
                    >
                      {word}
                    </div>

                    <span className="text-[10px] font-mono text-slate-500 mt-1">word[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result Sentence Output */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Reversed Sentence:</span>
            <span className="text-emerald-400 font-bold text-sm">
              "{currentRev.words.join(' ')}"
            </span>
          </div>

          {/* Step message */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="text-sky-400 font-mono font-semibold">Step {revIdx + 1}/{revSteps.length}:</span>
            <span>{currentRev.message}</span>
          </div>
        </div>
      ) : mode === 'palindrome' ? (
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-sky-400">Two-Pointer Palindrome Verification</h4>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Left Pointer: [{currentPal.left}]
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Right Pointer: [{currentPal.right}]
              </span>
            </div>
          </div>

          {/* Character Tiles */}
          <div className="overflow-x-auto pb-4 pt-6">
            <div className="flex items-center gap-1.5 min-w-max justify-center">
              {inputString.split('').map((ch, idx) => {
                const isLeft = idx === currentPal.left;
                const isRight = idx === currentPal.right;
                const isAlnum = /[a-zA-Z0-9]/.test(ch);

                let tileStyle = 'border-slate-800 bg-slate-950 text-slate-300';
                if (isLeft && isRight) {
                  tileStyle = 'border-amber-400 bg-amber-950/70 text-amber-200 ring-2 ring-amber-400/50';
                } else if (isLeft) {
                  tileStyle = 'border-sky-400 bg-sky-950/70 text-sky-200 ring-2 ring-sky-400/50';
                } else if (isRight) {
                  tileStyle = 'border-emerald-400 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-400/50';
                } else if (!isAlnum) {
                  tileStyle = 'border-slate-800/50 bg-slate-950/30 text-slate-600';
                }

                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    {/* Top Pointer Badges */}
                    <div className="absolute -top-6 flex gap-1 text-[10px] font-mono font-bold">
                      {isLeft && <span className="text-sky-400">L</span>}
                      {isRight && <span className="text-emerald-400">R</span>}
                    </div>

                    <div
                      className={`w-9 h-11 rounded-lg flex items-center justify-center font-mono font-bold text-sm border transition-all duration-200 ${tileStyle}`}
                    >
                      {ch === ' ' ? <span className="text-slate-600 text-xs">␣</span> : ch}
                    </div>

                    <span className="text-[9px] font-mono text-slate-500 mt-1">{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Log explanation message */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 font-mono font-semibold">Step {palIdx + 1}/{palSteps.length}:</span>
              <span>{currentPal.message}</span>
            </div>
            {currentPal.action === 'success' && (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                <CheckCircle2 className="w-4 h-4" /> Palindrome
              </span>
            )}
            {currentPal.action === 'mismatch' && (
              <span className="flex items-center gap-1 text-rose-400 font-semibold font-mono">
                <XCircle className="w-4 h-4" /> Not Palindrome
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Frequency Counter Stage */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-emerald-400">Character Frequency Histogram & Map</h4>
            <span className="text-xs text-slate-400 font-mono">
              Scanned: {freqIdx + 1} / {freqInput.length} chars
            </span>
          </div>

          {/* Current char highlight */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 justify-center">
            {freqInput.split('').map((ch, idx) => {
              const isCurrent = idx === currentFreq.index;
              const isPast = idx < currentFreq.index;
              return (
                <div
                  key={idx}
                  className={`w-8 h-10 rounded flex items-center justify-center font-mono font-bold text-sm border ${
                    isCurrent
                      ? 'border-emerald-400 bg-emerald-950 text-emerald-200 ring-2 ring-emerald-400/50'
                      : isPast
                      ? 'border-slate-800 bg-slate-950 text-slate-400'
                      : 'border-slate-800/60 bg-slate-950/40 text-slate-600'
                  }`}
                >
                  {ch}
                </div>
              );
            })}
          </div>

          {/* Frequency Bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(currentFreq.frequencies).map(([char, count]) => (
              <div key={char} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold text-sm">'{char}'</span>
                  <span className="font-mono text-slate-300 font-bold">{count}x</span>
                </div>
                {/* Visual bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (count / freqInput.length) * 100 * 2.5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Step log */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="text-emerald-400 font-mono font-semibold">Step {freqIdx + 1}/{freqSteps.length}:</span>
            <span>{currentFreq.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};
