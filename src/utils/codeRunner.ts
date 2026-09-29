import { TestCase, TestResult, RunResult, Language } from '../types/dsa';

/**
 * Deep equality helper for arrays, objects, numbers, and strings
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 0.01;
  }
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return false;

  // If a or b has toJSON
  if (a && typeof a.toJSON === 'function') {
    a = a.toJSON();
  }
  if (b && typeof b.toJSON === 'function') {
    b = b.toJSON();
  }
  if (a instanceof Map) {
    a = Object.fromEntries(a);
  }
  if (b instanceof Map) {
    b = Object.fromEntries(b);
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (keysB[i] !== key) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

/**
 * Serialize values for readable diffs and logs
 */
export function formatValue(val: any): string {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'function') return '[Function]';
  if (val && typeof val.toJSON === 'function') {
    return JSON.stringify(val.toJSON());
  }
  if (val instanceof Map) {
    return JSON.stringify(Object.fromEntries(val));
  }
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

/**
 * Transpiles Java code into clean browser-executable JavaScript
 */
export function transpileJavaToJs(javaCode: string): string {
  let js = javaCode;

  // 1. Remove package and import lines
  js = js.replace(/package\s+[\w.]+;/g, '');
  js = js.replace(/import\s+[\w.*]+;/g, '');

  // 2. Remove standard outer class declaration wrapper: public class Solution { ... }
  // We match the outermost class Solution { and remove the last closing brace
  if (/(?:public\s+|final\s+)?class\s+[A-Za-z0-9_]+\s*\{/.test(js)) {
    js = js.replace(/(?:public\s+|final\s+)?class\s+[A-Za-z0-9_]+\s*\{/, '/* class wrapper */');
    const lastBraceIndex = js.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      js = js.substring(0, lastBraceIndex) + '/* end class wrapper */' + js.substring(lastBraceIndex + 1);
    }
  }

  // 3. Convert inner static classes: static class TrieNode { ... } -> class TrieNode { ... }
  js = js.replace(/static\s+class\s+([A-Za-z0-9_]+)\s*\{/g, 'class $1 {');

  // 4. Replace System.out.println and print
  js = js.replace(/System\.out\.println\s*\(/g, 'console.log(');
  js = js.replace(/System\.out\.print\s*\(/g, 'console.log(');

  // 5. Remove Java type casts in expressions, e.g. (double) val, (int) Math.floor(...)
  js = js.replace(/\(\s*(?:double|float|int|long|short|byte|char)\s*\)/g, '');

  // 6. Transform method headers like:
  // public static int linearSearch(int[] arr, int target) {
  // public int[] insertAt(int[] arr, int index, int val) {
  // boolean isPalindrome(String s) {
  // Map<Character, Integer> getCharFrequencies(String s) {
  js = js.replace(
    /(?:public|private|protected)?\s*(?:static)?\s*(?:final)?\s*(?:[a-zA-Z0-9_<>[\]]+)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)\s*\{/g,
    (match, fnName, rawParams) => {
      // Don't replace control keywords like if, while, for, switch, catch
      if (['if', 'while', 'for', 'switch', 'catch', 'function', 'class'].includes(fnName)) {
        return match;
      }
      // Extract parameter names from typed list: e.g. "int[] arr, int target" -> "arr, target"
      const cleanParams = rawParams
        .split(',')
        .map((p: string) => {
          const parts = p.trim().split(/\s+/);
          return parts[parts.length - 1]; // last token is param name
        })
        .filter(Boolean)
        .join(', ');

      return `function ${fnName}(${cleanParams}) {`;
    }
  );

  // 7. Replace variable type declarations inside functions
  const javaTypes = [
    'int\\[\\]',
    'int',
    'double\\[\\]',
    'double',
    'float',
    'long',
    'short',
    'byte',
    'boolean\\[\\]',
    'boolean',
    'char',
    'String\\[\\]',
    'String',
    'Integer\\[\\]',
    'Integer',
    'Double\\[\\]',
    'Double',
    'Map<[^>]+>',
    'HashMap<[^>]+>',
    'Map',
    'HashMap',
    'List<[^>]+>',
    'ArrayList<[^>]+>',
    'List',
    'ArrayList',
    'Set<[^>]+>',
    'HashSet<[^>]+>',
    'Set',
    'HashSet',
    'Deque<[^>]+>',
    'ArrayDeque<[^>]+>',
    'Deque',
    'ArrayDeque',
    'TrieNode'
  ];

  const typeRegex = new RegExp(`(?:^|[\\s;{(])(?:final\\s+)?(?:${javaTypes.join('|')})\\s+([a-zA-Z0-9_]+)\\s*=`, 'g');
  js = js.replace(typeRegex, (match, varName) => {
    return match.replace(/(?:final\s+)?(?:[\w<>[\]]+)\s+([a-zA-Z0-9_]+)\s*=/, `let ${varName} =`);
  });

  // Handle for loop variable declarations: for (int i = 0; ...) -> for (let i = 0; ...)
  js = js.replace(/for\s*\(\s*(?:int|long|double|float)\s+([a-zA-Z0-9_]+)\s*=/g, 'for (let $1 =');

  // Handle declarations without assignment: int i; or int low, high;
  js = js.replace(/(?:^|[\\s;{(])(?:int|double|boolean|char|String)\s+([a-zA-Z0-9_]+)\s*;/g, ' let $1;');

  // 8. Java object instantiation
  js = js.replace(/new\s+int\s*\[\s*([^\]]+)\s*\]/g, 'new Array($1).fill(0)');
  js = js.replace(/new\s+boolean\s*\[\s*([^\]]+)\s*\]/g, 'new Array($1).fill(false)');
  js = js.replace(/new\s+double\s*\[\s*([^\]]+)\s*\]/g, 'new Array($1).fill(0.0)');
  js = js.replace(/new\s+String\s*\[\s*([^\]]+)\s*\]/g, 'new Array($1).fill("")');
  js = js.replace(/new\s+Integer\s*\[\s*([^\]]+)\s*\]/g, 'new Array($1)');
  js = js.replace(/new\s+int\s*\[\s*\]\s*\{([^}]+)\}/g, '[$1]');
  js = js.replace(/new\s+HashMap\s*(?:<[^>]*>)?\s*\(\s*\)/g, 'new HashMap()');
  js = js.replace(/new\s+HashSet\s*(?:<[^>]*>)?\s*\(\s*\)/g, 'new HashSet()');
  js = js.replace(/new\s+ArrayList\s*(?:<[^>]*>)?\s*\(\s*\)/g, 'new ArrayList()');
  js = js.replace(/new\s+ArrayDeque\s*(?:<[^>]*>)?\s*\(\s*\)/g, 'new ArrayDeque()');
  js = js.replace(/new\s+StringBuilder\s*\(([^)]*)\)/g, 'new StringBuilder($1)');

  // 9. Java string splits and regex
  js = js.replace(/\.split\s*\(\s*"\\\\s\+"\s*\)/g, ".trim().split(/\\s+/)");
  js = js.replace(/\.split\s*\(\s*" "\s*\)/g, ".trim().split(/\\s+/)");

  // 10. Standard Java string and char helpers
  js = js.replace(/\.length\s*\(\s*\)/g, '.length'); // String length() in Java -> length in JS
  js = js.replace(/Character\.isLetterOrDigit\s*\(([^)]+)\)/g, '/[a-zA-Z0-9]/.test($1)');
  js = js.replace(/Character\.toLowerCase\s*\(([^)]+)\)/g, 'String($1).toLowerCase()');
  js = js.replace(/Character\.toUpperCase\s*\(([^)]+)\)/g, 'String($1).toUpperCase()');

  // 11. Integer division helper: in Java (high - low) / 2 produces an integer
  js = js.replace(/(\(\s*high\s*-\s*low\s*\))\s*\/\s*2/g, 'Math.floor($1 / 2)');
  js = js.replace(/(\(\s*low\s*\+\s*high\s*\))\s*\/\s*2/g, 'Math.floor($1 / 2)');
  js = js.replace(/(gap\s*\/\s*2)/g, 'Math.floor($1)');

  return js;
}

/**
 * Execute user code inside a sandboxed Function wrapper with timeout detection
 */
export function executeCode(code: string, testCases: TestCase[], language: Language = 'javascript'): RunResult {
  const consoleLogs: string[] = [];
  const results: TestResult[] = [];
  const startTime = performance.now();

  // Custom console interceptor
  const customConsole = {
    log: (...args: any[]) => {
      consoleLogs.push(args.map(formatValue).join(' '));
    },
    warn: (...args: any[]) => {
      consoleLogs.push('[WARN] ' + args.map(formatValue).join(' '));
    },
    error: (...args: any[]) => {
      consoleLogs.push('[ERROR] ' + args.map(formatValue).join(' '));
    }
  };

  try {
    // If Java, transpile to JavaScript
    const executableCode = language === 'java' ? transpileJavaToJs(code) : code;

    // Sandbox scope with comprehensive Java runtime polyfills
    const sandboxWrapper = new Function(
      'console',
      `
      "use strict";

      // Java Map/HashMap Polyfill for browser execution
      class HashMap {
        constructor() {
          this._store = {};
        }
        put(k, v) {
          this._store[String(k)] = v;
          return v;
        }
        get(k) {
          return this._store[String(k)];
        }
        containsKey(k) {
          return String(k) in this._store;
        }
        getOrDefault(k, def) {
          return (String(k) in this._store) ? this._store[String(k)] : def;
        }
        remove(k) {
          const val = this._store[String(k)];
          delete this._store[String(k)];
          return val;
        }
        size() {
          return Object.keys(this._store).length;
        }
        toJSON() {
          return this._store;
        }
      }

      // Java HashSet Polyfill
      class HashSet {
        constructor() {
          this._set = new Set();
        }
        add(x) {
          this._set.add(x);
          return true;
        }
        contains(x) {
          return this._set.has(x);
        }
        remove(x) {
          return this._set.delete(x);
        }
        size() {
          return this._set.size;
        }
      }

      class ArrayList extends Array {
        add(x) { this.push(x); return true; }
        get(i) { return this[i]; }
        set(i, val) { const old = this[i]; this[i] = val; return old; }
        size() { return this.length; }
      }

      class ArrayDeque extends Array {
        addFirst(x) { this.unshift(x); }
        addLast(x) { this.push(x); }
        offerFirst(x) { this.unshift(x); return true; }
        offerLast(x) { this.push(x); return true; }
        pollFirst() { return this.length > 0 ? this.shift() : null; }
        pollLast() { return this.length > 0 ? this.pop() : null; }
        peekFirst() { return this.length > 0 ? this[0] : null; }
        peekLast() { return this.length > 0 ? this[this.length - 1] : null; }
        isEmpty() { return this.length === 0; }
        size() { return this.length; }
      }

      class StringBuilder {
        constructor(init = '') { this._val = String(init); }
        append(v) { this._val += String(v); return this; }
        reverse() { this._val = this._val.split('').reverse().join(''); return this; }
        length() { return this._val.length; }
        toString() { return this._val; }
      }

      // Java Character utility polyfill
      const Character = {
        isLetterOrDigit: (c) => /[a-zA-Z0-9]/.test(String(c)),
        isLetter: (c) => /[a-zA-Z]/.test(String(c)),
        isDigit: (c) => /[0-9]/.test(String(c)),
        toLowerCase: (c) => String(c).toLowerCase(),
        toUpperCase: (c) => String(c).toUpperCase()
      };

      // Java Integer / Double polyfills
      const Integer = {
        MAX_VALUE: 2147483647,
        MIN_VALUE: -2147483648,
        compare: (a, b) => (a < b ? -1 : a > b ? 1 : 0),
        parseInt: (s) => parseInt(s, 10)
      };

      const Double = {
        MAX_VALUE: Number.MAX_VALUE,
        MIN_VALUE: Number.MIN_VALUE,
        compare: (a, b) => (a < b ? -1 : a > b ? 1 : 0),
        parseDouble: (s) => parseFloat(s)
      };

      // Java Arrays utility polyfill
      const Arrays = {
        sort: (arr, comp) => {
          if (typeof comp === 'function') {
            arr.sort((a, b) => comp(a, b));
          } else {
            arr.sort((a, b) => a - b);
          }
          return arr;
        },
        fill: (arr, val) => arr.fill(val)
      };

      const java = {
        util: {
          Arrays,
          HashMap,
          HashSet,
          ArrayList,
          ArrayDeque
        }
      };

      // Java String.join helper
      if (typeof String.join !== 'function') {
        String.join = function(delim, list) {
          if (Array.isArray(list)) return list.join(delim);
          return Array.from(list).join(delim);
        };
      }

      ${executableCode}

      return {
        linearSearch: typeof linearSearch !== 'undefined' ? linearSearch : undefined,
        binarySearch: typeof binarySearch !== 'undefined' ? binarySearch : undefined,
        insertAt: typeof insertAt !== 'undefined' ? insertAt : undefined,
        deleteAt: typeof deleteAt !== 'undefined' ? deleteAt : undefined,
        updateAt: typeof updateAt !== 'undefined' ? updateAt : undefined,
        isPalindrome: typeof isPalindrome !== 'undefined' ? isPalindrome : undefined,
        getCharFrequencies: typeof getCharFrequencies !== 'undefined' ? getCharFrequencies : undefined,
        reverseWords: typeof reverseWords !== 'undefined' ? reverseWords : undefined,
        lengthOfLongestSubstring: typeof lengthOfLongestSubstring !== 'undefined' ? lengthOfLongestSubstring : undefined,
        insertionSort: typeof insertionSort !== 'undefined' ? insertionSort : undefined,
        shellSort: typeof shellSort !== 'undefined' ? shellSort : undefined,
        merge: typeof merge !== 'undefined' ? merge : undefined,
        mergeSort: typeof mergeSort !== 'undefined' ? mergeSort : undefined,
        partition: typeof partition !== 'undefined' ? partition : undefined,
        quickSort: typeof quickSort !== 'undefined' ? quickSort : undefined,
        activitySelection: typeof activitySelection !== 'undefined' ? activitySelection : undefined,
        fractionalKnapsack: typeof fractionalKnapsack !== 'undefined' ? fractionalKnapsack : undefined,
        maxSlidingWindow: typeof maxSlidingWindow !== 'undefined' ? maxSlidingWindow : undefined,
        lengthOfLIS: typeof lengthOfLIS !== 'undefined' ? lengthOfLIS : undefined,
        trieOperations: typeof trieOperations !== 'undefined' ? trieOperations : undefined,
        Trie: typeof Trie !== 'undefined' ? Trie : undefined,
      };
      `
    );

    const exportedScope = sandboxWrapper(customConsole);

    // Run each test case
    for (const tc of testCases) {
      const tcStart = performance.now();
      let actual: any = undefined;
      let error: string | undefined = undefined;
      let passed = false;

      try {
        const targetFnName = tc.functionName || 'solve';
        const fn = exportedScope[targetFnName];

        if (typeof fn !== 'function') {
          throw new Error(`Target function "${targetFnName}" is not defined or is not a function.`);
        }

        // Deep clone input args to prevent mutations between tests affecting next runs
        const clonedArgs = JSON.parse(JSON.stringify(tc.args));

        // In some challenges like insertAt / deleteAt / updateAt, function modifies array or returns modified array
        const returnedVal = fn(...clonedArgs);

        // For in-place array ops, if returnedVal is undefined, check clonedArgs[0] if expected is array
        if (returnedVal === undefined && Array.isArray(tc.expected) && Array.isArray(clonedArgs[0])) {
          actual = clonedArgs[0];
        } else if (returnedVal && typeof returnedVal.toJSON === 'function') {
          actual = returnedVal.toJSON();
        } else {
          actual = returnedVal;
        }

        passed = deepEqual(actual, tc.expected);
      } catch (err: any) {
        error = err?.message || String(err);
        passed = false;
      }

      const tcDuration = Math.round((performance.now() - tcStart) * 100) / 100;
      results.push({
        testId: tc.id,
        description: tc.description,
        passed,
        actual,
        expected: tc.expected,
        executionTimeMs: tcDuration,
        error
      });
    }

    const totalRuntime = Math.round((performance.now() - startTime) * 100) / 100;
    const allPassed = results.length > 0 && results.every((r) => r.passed);

    return {
      allPassed,
      results,
      consoleLogs,
      totalRuntimeMs: totalRuntime
    };
  } catch (globalErr: any) {
    const totalRuntime = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      allPassed: false,
      results: testCases.map((tc) => ({
        testId: tc.id,
        description: tc.description,
        passed: false,
        actual: undefined,
        expected: tc.expected,
        executionTimeMs: 0,
        error: globalErr?.message || 'Syntax or evaluation error in code.'
      })),
      consoleLogs,
      totalRuntimeMs: totalRuntime,
      executionError: globalErr?.message || String(globalErr)
    };
  }
}
