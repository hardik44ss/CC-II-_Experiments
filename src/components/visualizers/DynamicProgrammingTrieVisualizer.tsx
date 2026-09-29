import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, GitMerge, Search, Plus } from 'lucide-react';
import { VisualizerSpeedControl } from './VisualizerSpeedControl';

interface LISStep {
  i: number;
  j: number;
  dp: number[];
  comparing: boolean;
  canExtend: boolean;
  message: string;
}

interface TrieNode {
  char: string;
  isEnd: boolean;
  children: Record<string, TrieNode>;
}

export const DynamicProgrammingTrieVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lis' | 'trie'>('lis');

  // LIS State
  const lisArray = [10, 9, 2, 5, 3, 7, 101, 18];
  const [lisSteps, setLisSteps] = useState<LISStep[]>([]);
  const [lisStepIdx, setLisStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Trie State
  const [trieWords, setTrieWords] = useState<string[]>(['apple', 'app', 'bat', 'ball', 'code']);
  const [searchQuery, setSearchQuery] = useState<string>('app');
  const [newWordInput, setNewWordInput] = useState<string>('cat');
  const [searchResult, setSearchResult] = useState<{ isWord: boolean; isPrefix: boolean } | null>(null);

  // Pre-generate LIS Steps
  useEffect(() => {
    const trace: LISStep[] = [];
    const n = lisArray.length;
    const dp = new Array(n).fill(1);

    trace.push({
      i: 0,
      j: -1,
      dp: [...dp],
      comparing: false,
      canExtend: false,
      message: 'Base case: Every single element forms an increasing subsequence of length 1.'
    });

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        const canExt = lisArray[j] < lisArray[i];
        if (canExt) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
        }

        trace.push({
          i,
          j,
          dp: [...dp],
          comparing: true,
          canExtend: canExt,
          message: canExt
            ? `arr[${j}] (${lisArray[j]}) < arr[${i}] (${lisArray[i]}): Valid subsequence! Updated dp[${i}] = max(dp[${i}], dp[${j}] + 1) = ${dp[i]}.`
            : `arr[${j}] (${lisArray[j]}) >= arr[${i}] (${lisArray[i]}): Not strictly increasing. Cannot extend.`
        });
      }
    }

    const maxLIS = Math.max(...dp);
    trace.push({
      i: n - 1,
      j: n - 1,
      dp: [...dp],
      comparing: false,
      canExtend: false,
      message: `DP table complete! Overall Longest Increasing Subsequence length = ${maxLIS}.`
    });

    setLisSteps(trace);
    setLisStepIdx(0);
    setIsPlaying(false);
  }, []);

  // Autoplay for LIS with decreased baseline speed
  useEffect(() => {
    if (!isPlaying) return;
    const baseInterval = 1400; // Decreased speed for clear DP table step observation
    const intervalTime = Math.max(250, Math.round(baseInterval / speed));

    const timer = setInterval(() => {
      setLisStepIdx((prev) => {
        if (prev < lisSteps.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, lisSteps.length, speed]);

  const curLIS = lisSteps[lisStepIdx] || {
    i: 0,
    j: -1,
    dp: new Array(lisArray.length).fill(1),
    comparing: false,
    canExtend: false,
    message: ''
  };

  // Build Trie Tree Data Structure
  const buildTrie = (words: string[]): TrieNode => {
    const root: TrieNode = { char: 'ROOT', isEnd: false, children: {} };
    for (const w of words) {
      let cur = root;
      for (const ch of w) {
        if (!cur.children[ch]) {
          cur.children[ch] = { char: ch, isEnd: false, children: {} };
        }
        cur = cur.children[ch];
      }
      cur.isEnd = true;
    }
    return root;
  };

  const trieRoot = buildTrie(trieWords);

  // Search in Trie
  const handleTrieSearch = (q: string) => {
    let cur = trieRoot;
    let isPrefix = true;

    for (const ch of q.toLowerCase()) {
      if (!cur.children[ch]) {
        isPrefix = false;
        break;
      }
      cur = cur.children[ch];
    }

    setSearchResult({
      isPrefix,
      isWord: isPrefix && cur.isEnd
    });
  };

  const handleAddWord = () => {
    if (!newWordInput.trim()) return;
    const clean = newWordInput.trim().toLowerCase();
    if (!trieWords.includes(clean)) {
      setTrieWords([...trieWords, clean]);
      setNewWordInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toggle Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('lis');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'lis' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dynamic Programming: LIS Table O(n²)
          </button>
          <button
            onClick={() => {
              setActiveTab('trie');
              setIsPlaying(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'trie' ? 'bg-sky-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trie (Prefix Matching & Dictionary)
          </button>
        </div>

        {activeTab === 'lis' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Play DP Step'}
            </button>
            <button
              onClick={() => lisStepIdx < lisSteps.length - 1 && setLisStepIdx((p) => p + 1)}
              disabled={isPlaying || lisStepIdx >= lisSteps.length - 1}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg transition-colors border border-slate-700"
              title="Step forward"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <VisualizerSpeedControl speed={speed} onChangeSpeed={setSpeed} />
            <button
              onClick={() => {
                setLisStepIdx(0);
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

      {activeTab === 'lis' ? (
        /* LIS Dynamic Programming Stage */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-sky-400">Longest Increasing Subsequence (LIS) State</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Formula: dp[i] = 1 + max(dp[j]) for all 0 &le; j &lt; i where nums[j] &lt; nums[i]
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-sky-300">Active i: [{curLIS.i}]</span>
              <span>·</span>
              <span className="text-amber-400">Comparing j: [{curLIS.j >= 0 ? curLIS.j : '-'}]</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">Max LIS so far: {Math.max(...curLIS.dp)}</span>
            </div>
          </div>

          {/* Array Values and DP Array aligned */}
          <div className="overflow-x-auto pb-4 pt-4">
            <div className="flex items-center gap-2 min-w-max justify-center">
              {lisArray.map((val, idx) => {
                const isI = idx === curLIS.i;
                const isJ = idx === curLIS.j;
                const isBeforeI = idx < curLIS.i;

                let style = 'border-slate-800 bg-slate-950 text-slate-300';
                if (isI) {
                  style = 'border-sky-400 bg-sky-950/80 text-sky-200 ring-2 ring-sky-400';
                } else if (isJ) {
                  style = curLIS.canExtend
                    ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-400'
                    : 'border-rose-400 bg-rose-950/60 text-rose-300 ring-1 ring-rose-400';
                } else if (isBeforeI) {
                  style = 'border-slate-700 bg-slate-900 text-slate-400';
                }

                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Pointer tag */}
                    <div className="h-5 text-[10px] font-mono font-bold">
                      {isI && <span className="text-sky-400">i</span>}
                      {isJ && <span className="text-amber-400">j</span>}
                    </div>

                    {/* Array Value Box */}
                    <div
                      className={`w-12 h-14 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-base border transition-all ${style}`}
                    >
                      <span>{val}</span>
                    </div>

                    {/* Index */}
                    <span className="text-[10px] font-mono text-slate-500 mt-1">[{idx}]</span>

                    {/* DP Value Box */}
                    <div className="mt-2 w-12 h-10 rounded border border-slate-800 bg-slate-950 flex flex-col items-center justify-center font-mono text-xs">
                      <span className="text-[9px] text-slate-500">dp[{idx}]</span>
                      <span className="font-bold text-emerald-400">{curLIS.dp[idx]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step message */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="text-sky-400 font-mono font-semibold">Step {lisStepIdx + 1}/{lisSteps.length}:</span>
            <span>{curLIS.message}</span>
          </div>
        </div>
      ) : (
        /* Trie Prefix Matching Stage */
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-emerald-400">Trie (Prefix Tree) Dictionary Explorer</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Enables $O(L)$ instant retrieval for exact words and prefix queries where $L$ is word length.
              </p>
            </div>

            {/* Word Insertion form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newWordInput}
                onChange={(e) => setNewWordInput(e.target.value)}
                placeholder="New word"
                className="w-28 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-sky-400 font-mono text-xs focus:outline-none"
              />
              <button
                onClick={handleAddWord}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
              >
                <Plus className="w-3 h-3" />
                Insert Word
              </button>
            </div>
          </div>

          {/* Search / Prefix bar */}
          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleTrieSearch(e.target.value);
              }}
              placeholder="Search exact word or prefix (e.g. 'app', 'bat')..."
              className="flex-1 bg-transparent text-xs font-mono text-slate-200 focus:outline-none"
            />
            {searchResult && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className={searchResult.isWord ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                  exact match: {searchResult.isWord ? 'TRUE' : 'FALSE'}
                </span>
                <span>·</span>
                <span className={searchResult.isPrefix ? 'text-sky-400 font-bold' : 'text-rose-400'}>
                  startsWith: {searchResult.isPrefix ? 'TRUE' : 'FALSE'}
                </span>
              </div>
            )}
          </div>

          {/* Dictionary Words Pool */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-mono">Indexed Words in Trie:</span>
            <div className="flex flex-wrap gap-2">
              {trieWords.map((w) => {
                const isExact = searchQuery.toLowerCase() === w;
                const isPref = w.startsWith(searchQuery.toLowerCase()) && searchQuery.length > 0;

                return (
                  <div
                    key={w}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs border ${
                      isExact
                        ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300 font-bold'
                        : isPref
                        ? 'border-sky-500/60 bg-sky-950/40 text-sky-300 font-semibold'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    {w}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Branches Diagram representation */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 font-mono">Top-Level Character Branches (ROOT $\to$ Children):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(trieRoot.children).map(([ch, node]) => (
                <div key={ch} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold text-sm">'{ch}'</span>
                    <span className="text-slate-500">{Object.keys(node.children).length} sub-branches</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Next letters: [{Object.keys(node.children).join(', ')}]
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
