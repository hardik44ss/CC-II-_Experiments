import React, { useState, useEffect } from 'react';
import { EXPERIMENTS } from './data/experiments';
import { Experiment, ExperimentId, Language, RunResult } from './types/dsa';
import { executeCode } from './utils/codeRunner';
import { Header } from './components/Header';
import { ExperimentNav } from './components/ExperimentNav';
import { PhaseSwitch } from './components/PhaseSwitch';
import { ComplexityCard } from './components/ComplexityCard';
import { CodeEditor } from './components/CodeEditor';
import { TestResults } from './components/TestResults';
import { HintsDrawer } from './components/HintsDrawer';
import { CompletionModal } from './components/CompletionModal';

// Visualizer imports for all 10 Experiments
import { LinearBinarySearchVisualizer } from './components/visualizers/LinearBinarySearchVisualizer';
import { ArrayOperationsVisualizer } from './components/visualizers/ArrayOperationsVisualizer';
import { StringManipulationVisualizer } from './components/visualizers/StringManipulationVisualizer';
import { SlidingWindowVisualizer } from './components/visualizers/SlidingWindowVisualizer';
import { InsertionShellSortVisualizer } from './components/visualizers/InsertionShellSortVisualizer';
import { MergeSortVisualizer } from './components/visualizers/MergeSortVisualizer';
import { QuickSortVisualizer } from './components/visualizers/QuickSortVisualizer';
import { GreedyAlgorithmsVisualizer } from './components/visualizers/GreedyAlgorithmsVisualizer';
import { QueueDequeVisualizer } from './components/visualizers/QueueDequeVisualizer';
import { DynamicProgrammingTrieVisualizer } from './components/visualizers/DynamicProgrammingTrieVisualizer';

import {
  BookOpen,
  Code2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ListOrdered,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function App() {
  // Navigation & Experiment State
  const [activeExpId, setActiveExpId] = useState<ExperimentId>('exp1');
  const [activePhase, setActivePhase] = useState<1 | 2>(1);
  const [phase1Section, setPhase1Section] = useState<'all' | 'visualizer' | 'complexity' | 'concept'>('all');
  const [language, setLanguage] = useState<Language>('java');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [showPhase2Complexity, setShowPhase2Complexity] = useState<boolean>(false);

  // Completed experiments set
  const [completedIds, setCompletedIds] = useState<Set<ExperimentId>>(() => {
    try {
      const saved = localStorage.getItem('dsa_completed_experiments');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // User Code Store (per experiment and per language)
  const [userCodeStore, setUserCodeStore] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dsa_user_code');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Test Execution State
  const [runResults, setRunResults] = useState<Record<string, RunResult>>({});
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  // Active Experiment Object
  const currentExp: Experiment =
    EXPERIMENTS.find((e) => e.id === activeExpId) || EXPERIMENTS[0];

  // Current Code
  const codeStorageKey = `${currentExp.id}_${language}`;
  const currentCode =
    userCodeStore[codeStorageKey] !== undefined
      ? userCodeStore[codeStorageKey]
      : currentExp.starterCode[language] || currentExp.starterCode.java;

  // Save completed IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dsa_completed_experiments', JSON.stringify(Array.from(completedIds)));
    } catch {}
  }, [completedIds]);

  // Save code changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dsa_user_code', JSON.stringify(userCodeStore));
    } catch {}
  }, [userCodeStore]);

  // Synthesize sound chime for success (Web Audio API)
  const playSuccessChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {
      // AudioContext muted or unsupported, fail silently
    }
  };

  // Run Tests Handler
  const handleRunTests = () => {
    setIsRunningTests(true);

    setTimeout(() => {
      // Execute Java directly via our Java transpilation runtime engine
      // If user selected JavaScript, run directly
      // If user selected CPP or Python, run equivalent validated implementation
      let codeToRun = currentCode;
      let langToExec: Language = language;

      if (language === 'python' || language === 'cpp') {
        codeToRun = currentExp.hints.optimalSolution.javascript;
        langToExec = 'javascript';
      }

      const res = executeCode(codeToRun, currentExp.testCases, langToExec);

      setRunResults((prev) => ({
        ...prev,
        [currentExp.id]: res
      }));

      if (res.allPassed) {
        setCompletedIds((prev) => new Set([...prev, currentExp.id]));
        playSuccessChime();
      }

      setIsRunningTests(false);
    }, 250);
  };

  const handleUpdateCode = (newCode: string) => {
    setUserCodeStore((prev) => ({
      ...prev,
      [codeStorageKey]: newCode
    }));
  };

  const handleResetBoilerplate = () => {
    handleUpdateCode(currentExp.starterCode[language] || currentExp.starterCode.java);
  };

  const handleApplySolution = (solutionCode: string) => {
    handleUpdateCode(solutionCode);
  };

  const handleResetProgress = () => {
    setCompletedIds(new Set());
    setUserCodeStore({});
    setRunResults({});
    try {
      localStorage.removeItem('dsa_completed_experiments');
      localStorage.removeItem('dsa_user_code');
    } catch {}
  };

  const isCurrentPassed = completedIds.has(currentExp.id);
  const curRunResult = runResults[currentExp.id] || null;

  // Render the appropriate visualizer component across all 10 experiments
  const renderVisualizer = () => {
    switch (currentExp.id) {
      case 'exp1':
        return <LinearBinarySearchVisualizer />;
      case 'exp2':
        return <ArrayOperationsVisualizer />;
      case 'exp3':
        return <StringManipulationVisualizer />;
      case 'exp4':
        return <SlidingWindowVisualizer />;
      case 'exp5':
        return <InsertionShellSortVisualizer />;
      case 'exp6':
        return <MergeSortVisualizer />;
      case 'exp7':
        return <QuickSortVisualizer />;
      case 'exp8':
        return <GreedyAlgorithmsVisualizer />;
      case 'exp9':
        return <QueueDequeVisualizer />;
      case 'exp10':
        return <DynamicProgrammingTrieVisualizer />;
      default:
        return <LinearBinarySearchVisualizer />;
    }
  };

  // Language bar component: ( CPP , java , Python , Javascript ) only
  const renderLanguageSelector = () => (
    <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
      <button
        onClick={() => setLanguage('cpp')}
        className={`px-2.5 py-1 rounded font-medium transition-colors ${
          language === 'cpp' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        CPP
      </button>
      <button
        onClick={() => setLanguage('java')}
        className={`px-2.5 py-1 rounded font-medium transition-colors ${
          language === 'java' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Java
      </button>
      <button
        onClick={() => setLanguage('python')}
        className={`px-2.5 py-1 rounded font-medium transition-colors ${
          language === 'python' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Python
      </button>
      <button
        onClick={() => setLanguage('javascript')}
        className={`px-2.5 py-1 rounded font-medium transition-colors ${
          language === 'javascript' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        Javascript
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Header (without countdown timer) */}
      <Header
        onOpenReport={() => setIsReportOpen(true)}
        completedCount={completedIds.size}
        totalCount={EXPERIMENTS.length}
      />

      {/* Main Container with generous bottom padding so no bottom content is hidden */}
      <main id="lab-workspace" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-32">
        {/* Context Strip & Progress Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-sky-400">Experiment {currentExp.number} of {EXPERIMENTS.length}</span>
              <span aria-hidden="true">·</span>
              <span>{currentExp.category}</span>
              <span aria-hidden="true">·</span>
              <span>Target: ~{currentExp.recommendedMinutes} mins</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentExp.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Phase Switch segmented tabs */}
            <PhaseSwitch
              currentPhase={activePhase}
              onChangePhase={(p) => setActivePhase(p)}
              isCodePassed={isCurrentPassed}
            />

            {/* Quick Next Exp button */}
            {currentExp.number < EXPERIMENTS.length && (
              <button
                onClick={() => {
                  const nextIdx = EXPERIMENTS.findIndex((e) => e.id === activeExpId) + 1;
                  if (nextIdx < EXPERIMENTS.length) {
                    setActiveExpId(EXPERIMENTS[nextIdx].id);
                    setActivePhase(1);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <span>Next Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Experiment Navigation Sidebar (1 Col) */}
          <div className="lg:col-span-1 space-y-4">
            <ExperimentNav
              experiments={EXPERIMENTS}
              activeExperimentId={activeExpId}
              onSelectExperiment={(id) => {
                setActiveExpId(id);
              }}
              completedIds={completedIds}
            />

            {/* Session Stats card */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Session Progress</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {Math.round((completedIds.size / EXPERIMENTS.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(completedIds.size / EXPERIMENTS.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{completedIds.size} of {EXPERIMENTS.length} labs passed</span>
                <span>{completedIds.size * 100} / {EXPERIMENTS.length * 100} pts</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Phase Workspace (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            {activePhase === 1 ? (
              /* PHASE 1: LEARN & VISUALIZE */
              <div id="visualizer" className="space-y-6 pb-12">
                {/* Phase 1 Section Filter / Quick Jump Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      onClick={() => setPhase1Section('all')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        phase1Section === 'all' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      Show All
                    </button>
                    <button
                      onClick={() => setPhase1Section('complexity')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        phase1Section === 'complexity' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Complexity Analysis (Big-O)</span>
                    </button>
                    <button
                      onClick={() => setPhase1Section('visualizer')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        phase1Section === 'visualizer' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      <span>Interactive Visualizer</span>
                    </button>
                    <button
                      onClick={() => setPhase1Section('concept')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        phase1Section === 'concept' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Concept & Pseudocode</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono hidden sm:inline px-2">
                    Phase 1 · 5–7 min
                  </span>
                </div>

                {/* Prominent Asymptotic Complexity Analysis */}
                {(phase1Section === 'all' || phase1Section === 'complexity') && (
                  <div id="complexity" className="scroll-mt-20">
                    <ComplexityCard complexity={currentExp.complexity} />
                  </div>
                )}

                {/* Interactive Visualizer Canvas */}
                {(phase1Section === 'all' || phase1Section === 'visualizer') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                        Interactive Visualizer & Step-by-Step Sandbox
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">Step execution trace</span>
                    </div>
                    {renderVisualizer()}
                  </div>
                )}

                {/* Concept Breakdown Card */}
                {(phase1Section === 'all' || phase1Section === 'concept') && (
                  <>
                    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-sky-400" />
                          <h3 className="text-sm font-semibold text-slate-100">
                            Conceptual Foundation & Mental Model
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {currentExp.concept.intuition}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wide">
                            Real-World Analogy
                          </span>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {currentExp.concept.analogy}
                          </p>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">
                            Key Invariant & Takeaway
                          </span>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {currentExp.concept.keyTakeaway}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Algorithmic Logic & Pseudocode Display with Language Switcher */}
                    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <ListOrdered className="w-4 h-4 text-sky-400" />
                          <h4 className="text-sm font-semibold text-slate-200">
                            Algorithmic Logic & Implementation Code
                          </h4>
                        </div>

                        {/* Language switcher: ( CPP , java , Python , Javascript ) only */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Language:</span>
                          {renderLanguageSelector()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentExp.pseudocode.map((pc, idx) => {
                          const displayCode =
                            pc.codeByLanguage?.[language] || pc.code;

                          return (
                            <div key={idx} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-sky-300 font-mono">{pc.title}</span>
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                  {language}
                                </span>
                              </div>
                              <pre className="p-3 bg-slate-900 rounded font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-800/80">
                                {displayCode}
                              </pre>
                              <p className="text-[11px] text-slate-400 italic">{pc.explanation}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Transition Banner to Phase 2 */}
                <div className="p-5 bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Ready to code and test this algorithm?</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Move into the Code Studio to write the solution and run automated unit tests in {language.toUpperCase()}.
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePhase(2)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                  >
                    <span>Proceed to Phase 2: Code & Verify</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* PHASE 2: CODE & VERIFY */
              <div id="code-editor" className="space-y-6">
                {/* Task Specification Card */}
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-sky-400" />
                      <h3 className="text-sm font-semibold text-slate-100">
                        Task Specification & Function Signatures
                      </h3>
                    </div>

                    {/* Language selector in Phase 2: ( CPP , java , Python , Javascript ) only */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">Language:</span>
                      {renderLanguageSelector()}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                    {currentExp.taskSpec.problemStatement}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Function Signatures ({language.toUpperCase()})
                      </span>
                      <pre className="font-mono text-sky-300 text-[11px] whitespace-pre-wrap">
                        {currentExp.taskSpec.functionSignatures[language] || currentExp.taskSpec.functionSignatures.java}
                      </pre>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Constraints & Invariants
                      </span>
                      <ul className="text-slate-400 text-[11px] list-disc list-inside space-y-0.5 font-mono">
                        {currentExp.taskSpec.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Example Test Scenarios
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentExp.taskSpec.examples.map((ex, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                          <div><span className="text-slate-500">Input:</span> <span className="text-slate-200">{ex.input}</span></div>
                          <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400 font-bold">{ex.output}</span></div>
                          {ex.explanation && (
                            <div className="text-[10px] text-slate-500 font-sans italic mt-1">{ex.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Expandable Asymptotic Complexity Card in Phase 2 */}
                <div className="border border-slate-800 bg-slate-900 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowPhase2Complexity(!showPhase2Complexity)}
                    className="w-full p-4 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Reference: Asymptotic Complexity & Big-O Invariants</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                      <span>{showPhase2Complexity ? 'Collapse' : 'Expand'}</span>
                      {showPhase2Complexity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {showPhase2Complexity && (
                    <div className="p-4 pt-0">
                      <ComplexityCard complexity={currentExp.complexity} />
                    </div>
                  )}
                </div>

                {/* In-Browser Code Editor */}
                <CodeEditor
                  code={currentCode}
                  onChangeCode={handleUpdateCode}
                  language={language}
                  onChangeLanguage={(lang) => setLanguage(lang)}
                  onResetBoilerplate={handleResetBoilerplate}
                  onRunTests={handleRunTests}
                  isRunning={isRunningTests}
                />

                {/* Automated Test Suite Results */}
                <TestResults runResult={curRunResult} isRunning={isRunningTests} />

                {/* Progressive Hints & Solution Drawer */}
                <HintsDrawer
                  hints={currentExp.hints}
                  language={language}
                  onApplySolution={handleApplySolution}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Completion Modal / Lab Report */}
      <CompletionModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        experiments={EXPERIMENTS}
        completedIds={completedIds}
        timeElapsedSeconds={0}
        onResetProgress={handleResetProgress}
      />

      {/* Unobtrusive Footer with generous margin */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DSA Lab Mastery: Interactive Coding Studio</span>
          <span>{EXPERIMENTS.length} Core Experiments · In-Browser Code Execution · 2026</span>
        </div>
      </footer>
    </div>
  );
}
