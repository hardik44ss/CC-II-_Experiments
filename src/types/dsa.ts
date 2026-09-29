export type Language = 'cpp' | 'java' | 'python' | 'javascript';

export type ExperimentId = 'exp1' | 'exp2' | 'exp3' | 'exp4' | 'exp5' | 'exp6' | 'exp7' | 'exp8' | 'exp9' | 'exp10';

export interface ComplexityInfo {
  bestTime: string;
  worstTime: string;
  averageTime: string;
  space: string;
  notes: string;
}

export interface TestCase {
  id: string;
  description: string;
  functionName?: string;
  args: any[];
  expected: any;
  isEdgeCase?: boolean;
}

export interface TestResult {
  testId: string;
  description: string;
  passed: boolean;
  actual: any;
  expected: any;
  executionTimeMs: number;
  error?: string;
}

export interface PseudocodeItem {
  title: string;
  code: string;
  explanation: string;
  codeByLanguage?: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
}

export interface Experiment {
  id: ExperimentId;
  number: number;
  title: string;
  shortTitle: string;
  category: 'Searching' | 'Array Fundamentals' | 'Two-Pointer' | 'Sliding Window' | 'Comparative Sorting' | 'Divide & Conquer' | 'Partitioning' | 'Greedy Algorithms' | 'Queue & Deque' | 'DP & Trie';
  recommendedMinutes: number;
  
  // Phase 1: Learn & Visualize
  concept: {
    intuition: string;
    prerequisites: string[];
    analogy: string;
    keyTakeaway: string;
  };
  pseudocode: PseudocodeItem[];
  complexity: ComplexityInfo;
  
  // Phase 2: Code & Verify
  taskSpec: {
    problemStatement: string;
    functionSignatures: {
      cpp?: string;
      java: string;
      python: string;
      javascript: string;
    };
    inputs: string[];
    outputs: string[];
    constraints: string[];
    examples: {
      input: string;
      output: string;
      explanation?: string;
    }[];
  };
  starterCode: {
    cpp?: string;
    java: string;
    python: string;
    javascript: string;
  };
  testCases: TestCase[];
  hints: {
    hint1: string;
    hint2: string;
    optimalSolution: {
      cpp?: string;
      java: string;
      python: string;
      javascript: string;
      explanation: string;
    };
  };
}

export interface RunResult {
  allPassed: boolean;
  results: TestResult[];
  consoleLogs: string[];
  totalRuntimeMs: number;
  executionError?: string;
}
