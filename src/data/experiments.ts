import { Experiment } from '../types/dsa';
import { CPP_DATA } from './cppSnippets';

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'exp1',
    number: 1,
    title: 'Linear Search & Binary Search',
    shortTitle: 'Linear vs Binary Search',
    category: 'Searching',
    recommendedMinutes: 15,
    concept: {
      intuition:
        'Searching is the fundamental task of locating a target value inside a collection. In an unsorted array, we have no prior knowledge of item distribution, forcing us to inspect elements one by one. In a sorted array, the order invariant allows us to discard half the remaining search space at every single comparison.',
      prerequisites: ['Arrays & 0-indexed addressing', 'Sorted order invariant', 'Logarithms base 2'],
      analogy:
        'Finding a word in a dictionary: instead of reading from page 1 sequentially (Linear Search), you open to the exact middle, check if your word is alphabetically before or after, and repeat with the remaining half (Binary Search).',
      keyTakeaway:
        'Binary search reduces an exponential problem space to logarithmic steps ($O(\\log n)$), allowing search across 1,000,000 items in just ~20 comparisons.'
    },
    pseudocode: [
      {
        title: 'Linear Search (Sequential Scan)',
        code: `function linearSearch(arr, target):
  for i from 0 to length(arr) - 1:
    if arr[i] == target:
      return i
  return -1`,
        explanation: 'Inspects each index sequentially. Works on sorted and unsorted lists.'
      },
      {
        title: 'Binary Search (Divide & Conquer)',
        code: `function binarySearch(arr, target):
  low = 0
  high = length(arr) - 1
  while low <= high:
    mid = floor(low + (high - low) / 2)
    if arr[mid] == target:
      return mid
    else if arr[mid] < target:
      low = mid + 1
    else:
      high = mid - 1
  return -1`,
        explanation: 'Requires sorted input. Uses low + (high - low) / 2 to prevent 32-bit integer overflow.'
      }
    ],
    complexity: {
      bestTime: 'O(1) (target at first element / mid)',
      worstTime: 'Linear: O(n) · Binary: O(log n)',
      averageTime: 'Linear: O(n) · Binary: O(log n)',
      space: 'O(1) auxiliary (iterative pointers)',
      notes: 'Binary search requires pre-sorted data. If an array is searched only once, sorting ($O(n \\log n)$) + binary search ($O(\\log n)$) is slower than linear search ($O(n)$).'
    },
    taskSpec: {
      problemStatement:
        'Implement two search functions in Java:\n1. `linearSearch(int[] arr, int target)`: Scans each item sequentially and returns the index of target, or -1 if absent.\n2. `binarySearch(int[] arr, int target)`: Searches sorted array by halving the search space at each iteration. Returns index or -1.',
      functionSignatures: {
        java: 'public static int linearSearch(int[] arr, int target)\npublic static int binarySearch(int[] arr, int target)',
        javascript: 'function linearSearch(arr, target)\nfunction binarySearch(arr, target)',
        python: 'def linear_search(arr: list[int], target: int) -> int:\ndef binary_search(arr: list[int], target: int) -> int:'
      },
      inputs: ['arr: Array of integers (sorted for binarySearch)', 'target: Target integer to find'],
      outputs: ['index: Integer (0-based index if found, -1 if not found)'],
      constraints: ['0 <= arr.length <= 10^5', '-10^9 <= target, arr[i] <= 10^9', 'arr is sorted in ascending order for binarySearch'],
      examples: [
        {
          input: 'arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 23',
          output: '5',
          explanation: 'arr[5] is 23.'
        },
        {
          input: 'arr = [1, 3, 5, 7, 9], target = 4',
          output: '-1',
          explanation: '4 does not exist in the array.'
        }
      ]
    },
    starterCode: {
      java: `public class Solution {
    // Experiment 1: Linear Search
    public static int linearSearch(int[] arr, int target) {
        // TODO: Iterate through arr and return the index if arr[i] == target
        
        return -1;
    }

    // Experiment 1: Binary Search
    public static int binarySearch(int[] arr, int target) {
        // TODO: Implement binary search on sorted array arr
        // Maintain low and high pointers
        int low = 0;
        int high = arr.length - 1;
        
        return -1;
    }
}
`,
      javascript: `/**
 * Experiment 1: Linear Search and Binary Search
 * Return the index of target if found, or -1 otherwise.
 */

function linearSearch(arr, target) {
  // TODO: Iterate through arr and return the index if arr[i] === target
  
  return -1;
}

function binarySearch(arr, target) {
  // TODO: Implement binary search on sorted array arr
  // Use two pointers: low and high
  
  return -1;
}
`,
      python: `"""
Experiment 1: Linear Search and Binary Search
Return the index of target if found, or -1 otherwise.
"""

def linear_search(arr: list[int], target: int) -> int:
    # TODO: Iterate through arr and return index if arr[i] == target
    return -1

def binary_search(arr: list[int], target: int) -> int:
    # TODO: Implement binary search with low and high pointers
    low = 0
    high = len(arr) - 1
    return -1
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'Linear Search: Element present in middle',
        functionName: 'linearSearch',
        args: [[4, 2, 7, 1, 9, 3], 7],
        expected: 2
      },
      {
        id: 'tc2',
        description: 'Linear Search: Element absent',
        functionName: 'linearSearch',
        args: [[4, 2, 7, 1, 9, 3], 99],
        expected: -1
      },
      {
        id: 'tc3',
        description: 'Binary Search: Target at middle index',
        functionName: 'binarySearch',
        args: [[2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23],
        expected: 5
      },
      {
        id: 'tc4',
        description: 'Binary Search: Target at boundaries (first & last element)',
        functionName: 'binarySearch',
        args: [[10, 20, 30, 40, 50], 10],
        expected: 0,
        isEdgeCase: true
      },
      {
        id: 'tc5',
        description: 'Binary Search: Empty array and absent element',
        functionName: 'binarySearch',
        args: [[], 42],
        expected: -1,
        isEdgeCase: true
      }
    ],
    hints: {
      hint1: 'For Linear Search: Use a for-loop for (int i = 0; i < arr.length; i++) to check arr[i] == target.',
      hint2:
        'For Binary Search: while (low <= high), compute int mid = low + (high - low) / 2. If arr[mid] < target, search right (low = mid + 1). If arr[mid] > target, search left (high = mid - 1).',
      optimalSolution: {
        java: `public class Solution {
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }

    public static int binarySearch(int[] arr, int target) {
        int low = 0;
        int high = arr.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return -1;
    }
}`,
        javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}`,
        python: `def linear_search(arr: list[int], target: int) -> int:
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

def binary_search(arr: list[int], target: int) -> int:
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        explanation:
          'Linear search visits up to N elements sequentially (O(N)). Binary search repeatedly halves the active window, achieving O(log N) runtime with O(1) auxiliary space.'
      }
    }
  },
  {
    id: 'exp2',
    number: 2,
    title: 'Static Array Operations: Shift, Insert & Delete',
    shortTitle: 'Array Operations',
    category: 'Array Fundamentals',
    recommendedMinutes: 15,
    concept: {
      intuition:
        'In static contiguous memory, an array stores elements in consecutive memory addresses ($Address(i) = Base + i \\times sizeof(T)$). Inserting or deleting an element at an arbitrary index requires physically moving all subsequent elements to maintain contiguous layout, taking $O(n)$ time.',
      prerequisites: ['Contiguous memory allocation', 'Index boundary checking', 'In-place shifting'],
      analogy:
        'People sitting in a row of theater seats. If a newcomer arrives to sit in seat 3, everyone from seat 3 onward must stand up and slide one seat to their right. If someone leaves seat 3, everyone to their right slides one seat left.',
      keyTakeaway:
        'Direct index access and updates are $O(1)$, but arbitrary insertion and deletion are $O(n)$ due to index shifting.'
    },
    pseudocode: [
      {
        title: 'Insert At Index (Right Shift)',
        code: `function insertAt(arr, index, val):
  // Shift elements right starting from end
  for i from length(arr) - 1 down to index:
    arr[i + 1] = arr[i]
  arr[index] = val
  return arr`,
        explanation: 'Must iterate from end to index so elements are not prematurely overwritten.'
      },
      {
        title: 'Delete At Index (Left Shift)',
        code: `function deleteAt(arr, index):
  // Shift elements left starting from index + 1
  for i from index to length(arr) - 2:
    arr[i] = arr[i + 1]
  shorten length(arr) by 1
  return arr`,
        explanation: 'Overwrites target element by pulling subsequent items one position left.'
      }
    ],
    complexity: {
      bestTime: 'Insert/Delete at end: O(1) · Update: O(1)',
      worstTime: 'Insert/Delete at index 0: O(n) (shifts all elements)',
      averageTime: 'Insert/Delete: O(n) · Update: O(1)',
      space: 'O(1) auxiliary (in-place modification)',
      notes: 'Unlike dynamic linked lists which allow O(1) insertion given a pointer, arrays offer O(1) random access at the cost of O(n) insertions and deletions.'
    },
    taskSpec: {
      problemStatement:
        'Implement three fundamental array operation methods in Java:\n1. `insertAt(int[] arr, int index, int val)`: Inserts `val` at `index`, shifting elements right. Returns the new array of length arr.length + 1.\n2. `deleteAt(int[] arr, int index)`: Deletes element at `index`, shifting subsequent items left. Returns the new array of length arr.length - 1.\n3. `updateAt(int[] arr, int index, int val)`: Updates element at `index` in-place ($O(1)$) and returns `arr`.',
      functionSignatures: {
        java: 'public static int[] insertAt(int[] arr, int index, int val)\npublic static int[] deleteAt(int[] arr, int index)\npublic static int[] updateAt(int[] arr, int index, int val)',
        javascript: 'function insertAt(arr, index, val)\nfunction deleteAt(arr, index)\nfunction updateAt(arr, index, val)',
        python: 'def insert_at(arr: list[int], index: int, val: int) -> list[int]:\ndef delete_at(arr: list[int], index: int) -> list[int]:\ndef update_at(arr: list[int], index: int, val: int) -> list[int]:'
      },
      inputs: ['arr: int[]', 'index: 0-based position', 'val: int to insert or update'],
      outputs: ['Updated int[] array'],
      constraints: ['0 <= arr.length <= 10^4', '0 <= index <= arr.length (for insert)', '0 <= index < arr.length (for delete, update)'],
      examples: [
        {
          input: 'insertAt(new int[]{10, 20, 40, 50}, 2, 30)',
          output: '[10, 20, 30, 40, 50]',
          explanation: '30 is inserted at index 2; 40 and 50 shift right.'
        },
        {
          input: 'deleteAt(new int[]{10, 20, 99, 30}, 2)',
          output: '[10, 20, 30]',
          explanation: '99 at index 2 is removed; 30 shifts left.'
        }
      ]
    },
    starterCode: {
      java: `public class Solution {
    // Experiment 2: Insert element at index with shifting
    public static int[] insertAt(int[] arr, int index, int val) {
        // TODO: Create new int[arr.length + 1]
        // Copy elements up to index, insert val, shift remaining right
        int[] result = new int[arr.length + 1];
        
        return result;
    }

    // Experiment 2: Delete element at index with shifting
    public static int[] deleteAt(int[] arr, int index) {
        // TODO: Create new int[arr.length - 1]
        // Copy elements before index, shift subsequent left
        if (arr.length == 0) return arr;
        int[] result = new int[arr.length - 1];
        
        return result;
    }

    // Experiment 2: O(1) in-place update
    public static int[] updateAt(int[] arr, int index, int val) {
        // TODO: In-place update at arr[index]
        if (index >= 0 && index < arr.length) {
            arr[index] = val;
        }
        return arr;
    }
}
`,
      javascript: `/**
 * Experiment 2: Array Operations
 */

function insertAt(arr, index, val) {
  for (let i = arr.length - 1; i >= index; i--) {
    arr[i + 1] = arr[i];
  }
  arr[index] = val;
  return arr;
}

function deleteAt(arr, index) {
  for (let i = index; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
  if (arr.length > 0) {
    arr.length = arr.length - 1;
  }
  return arr;
}

function updateAt(arr, index, val) {
  if (index >= 0 && index < arr.length) {
    arr[index] = val;
  }
  return arr;
}
`,
      python: `"""
Experiment 2: Array Operations
"""

def insert_at(arr: list[int], index: int, val: int) -> list[int]:
    # TODO: Expand array and shift elements right
    return arr

def delete_at(arr: list[int], index: int) -> list[int]:
    # TODO: Shift elements left and truncate length
    return arr

def update_at(arr: list[int], index: int, val: int) -> list[int]:
    # TODO: Update arr[index] in-place
    return arr
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'insertAt: Insert in middle of array',
        functionName: 'insertAt',
        args: [[10, 20, 40, 50], 2, 30],
        expected: [10, 20, 30, 40, 50]
      },
      {
        id: 'tc2',
        description: 'insertAt: Insert at start (index 0 - maximum shift)',
        functionName: 'insertAt',
        args: [[2, 3, 4], 0, 1],
        expected: [1, 2, 3, 4],
        isEdgeCase: true
      },
      {
        id: 'tc3',
        description: 'deleteAt: Remove element in middle',
        functionName: 'deleteAt',
        args: [[10, 20, 99, 30], 2],
        expected: [10, 20, 30]
      },
      {
        id: 'tc4',
        description: 'deleteAt: Remove head element (index 0)',
        functionName: 'deleteAt',
        args: [[100, 200, 300], 0],
        expected: [200, 300],
        isEdgeCase: true
      },
      {
        id: 'tc5',
        description: 'updateAt: O(1) in-place value replacement',
        functionName: 'updateAt',
        args: [[5, 10, 15, 20], 2, 99],
        expected: [5, 10, 99, 20]
      }
    ],
    hints: {
      hint1: 'In Java arrays have fixed length. For insertAt: allocate int[] result = new int[arr.length + 1], copy elements before index, set result[index] = val, and copy remaining.',
      hint2: 'For deleteAt: allocate int[] result = new int[arr.length - 1], copy items before index, and copy items after index shifted left by 1.',
      optimalSolution: {
        java: `public class Solution {
    public static int[] insertAt(int[] arr, int index, int val) {
        int[] result = new int[arr.length + 1];
        for (int i = 0; i < index; i++) {
            result[i] = arr[i];
        }
        result[index] = val;
        for (int i = index; i < arr.length; i++) {
            result[i + 1] = arr[i];
        }
        return result;
    }

    public static int[] deleteAt(int[] arr, int index) {
        if (arr.length == 0) return arr;
        int[] result = new int[arr.length - 1];
        for (int i = 0; i < index; i++) {
            result[i] = arr[i];
        }
        for (int i = index + 1; i < arr.length; i++) {
            result[i - 1] = arr[i];
        }
        return result;
    }

    public static int[] updateAt(int[] arr, int index, int val) {
        if (index >= 0 && index < arr.length) {
            arr[index] = val;
        }
        return arr;
    }
}`,
        javascript: `function insertAt(arr, index, val) {
  for (let i = arr.length - 1; i >= index; i--) {
    arr[i + 1] = arr[i];
  }
  arr[index] = val;
  return arr;
}

function deleteAt(arr, index) {
  for (let i = index; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
  if (arr.length > 0) {
    arr.length = arr.length - 1;
  }
  return arr;
}

function updateAt(arr, index, val) {
  if (index >= 0 && index < arr.length) {
    arr[index] = val;
  }
  return arr;
}`,
        python: `def insert_at(arr: list[int], index: int, val: int) -> list[int]:
    arr.append(0)
    for i in range(len(arr) - 2, index - 1, -1):
        arr[i + 1] = arr[i]
    arr[index] = val
    return arr

def delete_at(arr: list[int], index: int) -> list[int]:
    for i in range(index, len(arr) - 1):
        arr[i] = arr[i + 1]
    del arr[-1]
    return arr

def update_at(arr: list[int], index: int, val: int) -> list[int]:
    if 0 <= index < len(arr):
        arr[index] = val
    return arr`,
        explanation:
          'Shift-right and shift-left operations take linear time O(n) because each subsequent element must be moved in memory. UpdateAt directly targets arr[index] in O(1) time.'
      }
    }
  },
  {
    id: 'exp3',
    number: 3,
    title: 'String Algorithms: Two-Pointer & Frequency Maps',
    shortTitle: 'String Manipulation',
    category: 'Two-Pointer',
    recommendedMinutes: 15,
    concept: {
      intuition:
        'Strings are immutable sequences of character codes. Two major paradigms dominate string processing: the Two-Pointer technique (converging inward from both ends to verify symmetry in $O(1)$ space) and Hash Map / Direct Address counting (tracking frequency distributions in $O(n)$ time).',
      prerequisites: ['ASCII / Unicode code points', 'Two-pointer convergence', 'Hash maps / Frequency objects'],
      analogy:
        'Validating a palindrome: two reading glasses start at the first and last letters and move towards the center, ignoring spaces and punctuation. If the letters under both glasses match until they meet, the phrase is a palindrome ("racecar", "A man, a plan, a canal: Panama").',
      keyTakeaway:
        'Two-pointer inward traversal tests palindrome invariants in $O(n)$ time and $O(1)$ space, while frequency maps allow fast comparison of anagrams and character distributions in $O(n)$ time.'
    },
    pseudocode: [
      {
        title: 'Two-Pointer Word Reversal',
        code: `function reverseWords(s):
  words = split(trim(s), whitespace)
  left = 0, right = length(words) - 1
  while left < right:
    swap(words[left], words[right])
    left++, right--
  return join(words, " ")`,
        explanation: 'Reverses word order using two pointers in O(n) linear time.'
      },
      {
        title: 'Two-Pointer Palindrome Validation',
        code: `function isPalindrome(s):
  left = 0, right = length(s) - 1
  while left < right:
    while left < right and not isAlphaNumeric(s[left]):
      left++
    while left < right and not isAlphaNumeric(s[right]):
      right--
    if toLower(s[left]) != toLower(s[right]):
      return false
    left++
    right--
  return true`,
        explanation: 'Converges inwards, skipping spaces and punctuation without allocating a cleaned copy.'
      },
      {
        title: 'Character Frequency Counting',
        code: `function getCharFrequencies(s):
  freqMap = {}
  for char in s:
    freqMap[char] = (freqMap[char] or 0) + 1
  return freqMap`,
        explanation: 'Builds a frequency dictionary in a single pass ($O(n)$).'
      }
    ],
    complexity: {
      bestTime: 'reverseWords: O(n) · isPalindrome: O(1) · getCharFrequencies: O(n)',
      worstTime: 'All functions: O(n) linear pass',
      averageTime: 'O(n) linear time',
      space: 'reverseWords: O(n) for words array · isPalindrome: O(1) in-place · getCharFrequencies: O(k) alphabet size',
      notes: 'Word reversal and frequency counting run in linear O(n) time. Palindrome checking achieves O(1) auxiliary space using two pointer indices.'
    },
    taskSpec: {
      problemStatement:
        'Implement three string manipulation algorithms in Java:\n1. `reverseWords(String s)`: Takes a string and reverses the order of words. For example: `"How are you"` -> `"you are How"`. Handles multiple spaces cleanly.\n2. `isPalindrome(String s)`: Returns `true` if `s` is a palindrome, ignoring non-alphanumeric characters and case.\n3. `getCharFrequencies(String s)`: Returns a `Map<Character, Integer>` mapping each character in `s` to its frequency count.',
      functionSignatures: {
        java: 'public static String reverseWords(String s)\npublic static boolean isPalindrome(String s)\npublic static Map<Character, Integer> getCharFrequencies(String s)',
        javascript: 'function reverseWords(s)\nfunction isPalindrome(s)\nfunction getCharFrequencies(s)',
        python: 'def reverse_words(s: str) -> str:\ndef is_palindrome(s: str) -> bool:\ndef get_char_frequencies(s: str) -> dict[str, int]:'
      },
      inputs: ['s: String'],
      outputs: ['reverseWords: String', 'isPalindrome: boolean', 'getCharFrequencies: Map<Character, Integer>'],
      constraints: ['0 <= s.length() <= 10^5', 's consists of printable ASCII characters'],
      examples: [
        {
          input: 'reverseWords("How are you")',
          output: '"you are How"',
          explanation: 'The order of words is reversed.'
        },
        {
          input: 'isPalindrome("A man, a plan, a canal: Panama")',
          output: 'true'
        },
        {
          input: 'getCharFrequencies("banana")',
          output: '{"b": 1, "a": 3, "n": 2}'
        }
      ]
    },
    starterCode: {
      java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    // Experiment 3: Reverse Words in a String (e.g. "How are you" -> "you are How")
    public static String reverseWords(String s) {
        // TODO: Split words by whitespace, reverse their order, and join with a single space
        
        return "";
    }

    // Experiment 3: Two-Pointer Palindrome
    public static boolean isPalindrome(String s) {
        // TODO: Use two pointers (left and right)
        // Skip non-alphanumeric chars with Character.isLetterOrDigit
        // Compare lowercase forms with Character.toLowerCase
        int left = 0;
        int right = s.length() - 1;
        
        return false;
    }

    // Experiment 3: Character Frequency Map
    public static Map<Character, Integer> getCharFrequencies(String s) {
        // TODO: Build and return frequency map
        Map<Character, Integer> freqs = new HashMap<>();
        
        return freqs;
    }
}
`,
      javascript: `/**
 * Experiment 3: String Manipulation Algorithms
 */

function reverseWords(s) {
  // TODO: Reverse words (e.g. "How are you" -> "you are How")
  return "";
}

function isPalindrome(s) {
  // TODO: Check if s is a palindrome using two pointers
  return false;
}

function getCharFrequencies(s) {
  // TODO: Return frequency object
  return {};
}
`,
      python: `"""
Experiment 3: String Manipulation Algorithms
"""

def reverse_words(s: str) -> str:
    # TODO: "How are you" -> "you are How"
    return ""

def is_palindrome(s: str) -> bool:
    return False

def get_char_frequencies(s: str) -> dict[str, int]:
    return {}
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'reverseWords: Standard sentence "How are you"',
        functionName: 'reverseWords',
        args: ['How are you'],
        expected: 'you are How'
      },
      {
        id: 'tc2',
        description: 'reverseWords: Multi-word phrase "the sky is blue"',
        functionName: 'reverseWords',
        args: ['the sky is blue'],
        expected: 'blue is sky the'
      },
      {
        id: 'tc3',
        description: 'isPalindrome: Classic phrase with punctuation and spaces',
        functionName: 'isPalindrome',
        args: ['A man, a plan, a canal: Panama'],
        expected: true
      },
      {
        id: 'tc4',
        description: 'isPalindrome: Non-palindrome string',
        functionName: 'isPalindrome',
        args: ['race a car'],
        expected: false
      },
      {
        id: 'tc5',
        description: 'getCharFrequencies: Multi-character word with duplicates',
        functionName: 'getCharFrequencies',
        args: ['banana'],
        expected: { b: 1, a: 3, n: 2 }
      }
    ],
    hints: {
      hint1: 'For reverseWords: In Java, split words using s.trim().split("\\\\s+"), swap elements using two pointers left and right, and return String.join(" ", words).',
      hint2: 'In isPalindrome: while (left < right), increment left if not alphanumeric, decrement right if not alphanumeric, then check Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right)).',
      optimalSolution: {
        java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    public static String reverseWords(String s) {
        String[] words = s.trim().split("\\\\s+");
        int left = 0;
        int right = words.length - 1;

        while (left < right) {
            String temp = words[left];
            words[left] = words[right];
            words[right] = temp;
            left++;
            right--;
        }

        return String.join(" ", words);
    }

    public static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;

        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }

            char lc = Character.toLowerCase(s.charAt(left));
            char rc = Character.toLowerCase(s.charAt(right));

            if (lc != rc) {
                return false;
            }
            left++;
            right--;
        }

        return true;
    }

    public static Map<Character, Integer> getCharFrequencies(String s) {
        Map<Character, Integer> freqs = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            freqs.put(ch, freqs.getOrDefault(ch, 0) + 1);
        }
        return freqs;
    }
}`,
        javascript: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(" ");
}

function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  const isAlphaNum = (ch) => /[a-zA-Z0-9]/.test(ch);

  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;

    if (s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

function getCharFrequencies(s) {
  const freqs = {};
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    freqs[char] = (freqs[char] || 0) + 1;
  }
  return freqs;
}`,
        python: `def reverse_words(s: str) -> str:
    return " ".join(reversed(s.strip().split()))

def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

def get_char_frequencies(s: str) -> dict[str, int]:
    freqs = {}
    for char in s:
        freqs[char] = freqs.get(char, 0) + 1
    return freqs`,
        explanation:
          'reverseWords splits the string by whitespace in O(n) time and reverses word references with two pointers. isPalindrome runs in O(n) time and O(1) space. getCharFrequencies counts occurrences in O(n) single pass.'
      }
    }
  },
  {
    id: 'exp4',
    number: 4,
    title: 'Longest Substring Without Repeating Characters (Sliding Window)',
    shortTitle: 'Sliding Window Substring',
    category: 'Sliding Window',
    recommendedMinutes: 20,
    concept: {
      intuition:
        'A sliding window maintains a contiguous subarray or substring between two pointers `left` and `right`. As `right` expands, we maintain the invariant: "every character in the current window is unique". When a duplicate character is encountered, we contract `left` until the duplicate is evicted, ensuring an optimal $O(n)$ scan instead of $O(n^2)$ brute force.',
      prerequisites: ['Two pointers (left, right)', 'Hash Map / Set lookup in O(1)', 'Subarray / Substring contiguous invariant'],
      analogy:
        'A camera panoramic lens widening from left to right. When an unwanted photobomber appears on the right edge, the left shutter moves forward until that person drops out of the frame.',
      keyTakeaway:
        'Sliding window amortizes pointer movements: each element is visited at most twice (once by `right`, once by `left`), guaranteeing $O(n)$ time.'
    },
    pseudocode: [
      {
        title: 'Sliding Window with Hash Map / Index Lookup',
        code: `function lengthOfLongestSubstring(s):
  seenMap = {} // char -> last seen index
  left = 0
  maxLen = 0
  for right from 0 to length(s) - 1:
    char = s[right]
    if char in seenMap and seenMap[char] >= left:
      left = seenMap[char] + 1
    seenMap[char] = right
    maxLen = max(maxLen, right - left + 1)
  return maxLen`,
        explanation: 'Jumps left pointer directly to seenMap[char] + 1 instead of incremental 1-by-1 increments.'
      }
    ],
    complexity: {
      bestTime: 'O(n) (all unique characters)',
      worstTime: 'O(n) (each character processed at most twice)',
      averageTime: 'O(n)',
      space: 'O(min(n, m)) where m is character set size (e.g. 26 or 128)',
      notes: 'Brute force checks all O(n^2) substrings in O(n^3) time. The sliding window reduces this to O(n) single pass.'
    },
    taskSpec: {
      problemStatement:
        'Given a string `s`, find the length of the longest substring without repeating characters in Java using an optimal $O(n)$ sliding window algorithm.',
      functionSignatures: {
        java: 'public static int lengthOfLongestSubstring(String s)',
        javascript: 'function lengthOfLongestSubstring(s)',
        python: 'def length_of_longest_substring(s: str) -> int:'
      },
      inputs: ['s: String'],
      outputs: ['length: int representing maximum length of unique contiguous substring'],
      constraints: ['0 <= s.length() <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
      examples: [
        {
          input: 's = "abcabcbb"',
          output: '3',
          explanation: 'The answer is "abc", with length 3.'
        },
        {
          input: 's = "bbbbb"',
          output: '1'
        },
        {
          input: 's = "pwwkew"',
          output: '3',
          explanation: 'The answer is "wke", with length 3. Notice "pwke" is a subsequence, not a substring.'
        }
      ]
    },
    starterCode: {
      java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    // Experiment 4: Longest Substring Without Repeating Characters
    public static int lengthOfLongestSubstring(String s) {
        // TODO: Maintain left pointer and a Map of character -> last seen index
        // When duplicate found at index >= left, update left = lastSeen.get(char) + 1
        // Track maxLen = Math.max(maxLen, right - left + 1)
        int maxLen = 0;
        int left = 0;
        
        return maxLen;
    }
}
`,
      javascript: `/**
 * Experiment 4: Longest Substring Without Repeating Characters
 * Implement in O(n) time using the Sliding Window technique.
 */

function lengthOfLongestSubstring(s) {
  // TODO: Maintain left pointer and character map
  return 0;
}
`,
      python: `"""
Experiment 4: Longest Substring Without Repeating Characters
"""

def length_of_longest_substring(s: str) -> int:
    max_len = 0
    left = 0
    return max_len
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'Standard repeated pattern: "abcabcbb"',
        functionName: 'lengthOfLongestSubstring',
        args: ['abcabcbb'],
        expected: 3
      },
      {
        id: 'tc2',
        description: 'All identical characters: "bbbbb"',
        functionName: 'lengthOfLongestSubstring',
        args: ['bbbbb'],
        expected: 1
      },
      {
        id: 'tc3',
        description: 'Substring embedded with duplicates: "pwwkew"',
        functionName: 'lengthOfLongestSubstring',
        args: ['pwwkew'],
        expected: 3
      },
      {
        id: 'tc4',
        description: 'Empty string edge case',
        functionName: 'lengthOfLongestSubstring',
        args: [''],
        expected: 0,
        isEdgeCase: true
      },
      {
        id: 'tc5',
        description: 'String with spaces and symbols: "tmmzuxt"',
        functionName: 'lengthOfLongestSubstring',
        args: ['tmmzuxt'],
        expected: 5
      }
    ],
    hints: {
      hint1: 'In Java, use a Map<Character, Integer> to store the last seen 0-based index of each character.',
      hint2: 'When s.charAt(right) is in the map and lastIndex.get(ch) >= left, move left = lastIndex.get(ch) + 1. Then update map and maxLen = Math.max(maxLen, right - left + 1).',
      optimalSolution: {
        java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            if (lastSeen.containsKey(ch) && lastSeen.get(ch) >= left) {
                left = lastSeen.get(ch) + 1;
            }
            lastSeen.put(ch, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }
}`,
        javascript: `function lengthOfLongestSubstring(s) {
  const lastIndex = new Map();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastIndex.has(char) && lastIndex.get(char) >= left) {
      left = lastIndex.get(char) + 1;
    }
    lastIndex.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}`,
        python: `def length_of_longest_substring(s: str) -> int:
    last_index = {}
    max_len = 0
    left = 0

    for right, char in enumerate(s):
        if char in last_index and last_index[char] >= left:
            left = last_index[char] + 1
        last_index[char] = right
        max_len = max(max_len, right - left + 1)

    return max_len`,
        explanation:
          'By storing the last observed index of each character, we can jump the left pointer forward in O(1) time whenever a duplicate is found within the current window bounds, keeping total runtime strictly O(n).'
      }
    }
  },
  {
    id: 'exp5',
    number: 5,
    title: 'Comparative Study: Insertion Sort vs. Shell Sort',
    shortTitle: 'Insertion vs Shell Sort',
    category: 'Comparative Sorting',
    recommendedMinutes: 20,
    concept: {
      intuition:
        'Insertion Sort builds a sorted prefix by shifting smaller elements one position at a time. If the smallest element is at the end of the array, it requires $O(n)$ shifts just for that single element. Shell Sort optimizes this by comparing and shifting elements spaced $gap$ positions apart (h-sorting), allowing elements to take giant leaps towards their correct positions before finishing with a final $gap=1$ insertion sort.',
      prerequisites: ['In-place sorting', 'Inversion count', 'Diminishing gap sequences'],
      analogy:
        'Sorting a hand of playing cards: Insertion Sort slides each card one spot at a time. Shell Sort groups cards separated by a gap (e.g. 4 apart), sorts those sub-groups, then shrinks the gap to 2, then 1, requiring drastically fewer total shifts.',
      keyTakeaway:
        'Shell Sort breaks the quadratic $O(n^2)$ barrier of elementary sorts, achieving $O(n^{1.5})$ or $O(n \\log^2 n)$ depending on gap sequence choice.'
    },
    pseudocode: [
      {
        title: 'Insertion Sort (Gap = 1)',
        code: `function insertionSort(arr):
  for i from 1 to length(arr) - 1:
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key:
      arr[j + 1] = arr[j] // shift right
      j = j - 1
    arr[j + 1] = key
  return arr`,
        explanation: 'Maintains sorted prefix arr[0...i-1]. Shifts greater elements right to insert key.'
      },
      {
        title: 'Shell Sort (Diminishing Gaps)',
        code: `function shellSort(arr):
  n = length(arr)
  gap = floor(n / 2)
  while gap > 0:
    for i from gap to n - 1:
      temp = arr[i]
      j = i
      while j >= gap and arr[j - gap] > temp:
        arr[j] = arr[j - gap] // h-shift
        j = j - gap
      arr[j] = temp
    gap = floor(gap / 2)
  return arr`,
        explanation: 'Applies gapped insertion sort. Standard gap sequence halves gap at each phase.'
      }
    ],
    complexity: {
      bestTime: 'Insertion: O(n) (nearly sorted) · Shell: O(n log n)',
      worstTime: 'Insertion: O(n^2) (reverse sorted) · Shell: O(n^2) standard, O(n^(4/3)) Sedgewick',
      averageTime: 'Insertion: O(n^2) · Shell: O(n^(1.25)) to O(n^(1.5))',
      space: 'O(1) auxiliary (in-place in both)',
      notes: 'Insertion Sort is stable; Shell Sort is NOT stable due to long-distance jumps across gaps.'
    },
    taskSpec: {
      problemStatement:
        'Implement both `insertionSort(int[] arr)` and `shellSort(int[] arr)` in Java. Both methods sort `arr` in ascending order and return `arr`. Shell Sort must use the standard diminishing gap sequence starting with `gap = arr.length / 2` and halving until `gap = 0`.',
      functionSignatures: {
        java: 'public static int[] insertionSort(int[] arr)\npublic static int[] shellSort(int[] arr)',
        javascript: 'function insertionSort(arr)\nfunction shellSort(arr)',
        python: 'def insertion_sort(arr: list[int]) -> list[int]:\ndef shell_sort(arr: list[int]) -> list[int]:'
      },
      inputs: ['arr: int[]'],
      outputs: ['arr: Sorted int[] in ascending order'],
      constraints: ['0 <= arr.length <= 10^4', '-10^9 <= arr[i] <= 10^9'],
      examples: [
        {
          input: 'insertionSort(new int[]{12, 11, 13, 5, 6})',
          output: '[5, 6, 11, 12, 13]'
        },
        {
          input: 'shellSort(new int[]{38, 27, 43, 3, 9, 82, 10})',
          output: '[3, 9, 10, 27, 38, 43, 82]'
        }
      ]
    },
    starterCode: {
      java: `public class Solution {
    // Experiment 5: Insertion Sort (Gap = 1)
    public static int[] insertionSort(int[] arr) {
        // TODO: Implement standard insertion sort
        
        return arr;
    }

    // Experiment 5: Shell Sort (Diminishing Gaps)
    public static int[] shellSort(int[] arr) {
        // TODO: Start with gap = arr.length / 2, while gap > 0, gap /= 2
        
        return arr;
    }
}
`,
      javascript: `/**
 * Experiment 5: Comparative Study of Insertion Sort vs. Shell Sort
 */

function insertionSort(arr) {
  // TODO: Implement insertion sort
  return arr;
}

function shellSort(arr) {
  // TODO: Implement shell sort
  return arr;
}
`,
      python: `"""
Experiment 5: Insertion Sort vs. Shell Sort
"""

def insertion_sort(arr: list[int]) -> list[int]:
    return arr

def shell_sort(arr: list[int]) -> list[int]:
    return arr
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'Insertion Sort: Unsorted positive integers',
        functionName: 'insertionSort',
        args: [[12, 11, 13, 5, 6]],
        expected: [5, 6, 11, 12, 13]
      },
      {
        id: 'tc2',
        description: 'Insertion Sort: Reverse sorted array (worst case)',
        functionName: 'insertionSort',
        args: [[5, 4, 3, 2, 1]],
        expected: [1, 2, 3, 4, 5]
      },
      {
        id: 'tc3',
        description: 'Shell Sort: Array with negatives and duplicates',
        functionName: 'shellSort',
        args: [[64, 34, 25, 12, 22, 11, 90, -5, 12]],
        expected: [-5, 11, 12, 12, 22, 25, 34, 64, 90]
      },
      {
        id: 'tc4',
        description: 'Shell Sort: Already sorted array (best case)',
        functionName: 'shellSort',
        args: [[1, 2, 3, 4, 5]],
        expected: [1, 2, 3, 4, 5],
        isEdgeCase: true
      },
      {
        id: 'tc5',
        description: 'Both Sorts: Single element and empty array',
        functionName: 'shellSort',
        args: [[42]],
        expected: [42],
        isEdgeCase: true
      }
    ],
    hints: {
      hint1: 'For insertionSort: for (int i = 1; i < arr.length; i++), save int key = arr[i]. Then while (j >= 0 && arr[j] > key), arr[j + 1] = arr[j], j--. Then arr[j + 1] = key.',
      hint2: 'For shellSort: int gap = arr.length / 2. While (gap > 0): for (int i = gap; i < arr.length; i++), temp = arr[i], while (j >= gap && arr[j - gap] > temp), arr[j] = arr[j - gap], j -= gap. Then arr[j] = temp. Afterwards gap /= 2.',
      optimalSolution: {
        java: `public class Solution {
    public static int[] insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        return arr;
    }

    public static int[] shellSort(int[] arr) {
        int n = arr.length;
        int gap = n / 2;

        while (gap > 0) {
            for (int i = gap; i < n; i++) {
                int temp = arr[i];
                int j = i;
                while (j >= gap && arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                }
                arr[j] = temp;
            }
            gap /= 2;
        }

        return arr;
    }
}`,
        javascript: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

function shellSort(arr) {
  const n = arr.length;
  let gap = Math.floor(n / 2);

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }

  return arr;
}`,
        python: `def insertion_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

def shell_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    return arr`,
        explanation:
          'Insertion Sort shifts items 1 step at a time, taking O(n^2) worst case. Shell Sort permits large strides over gap distances, substantially pre-sorting the array and reducing final shifts when gap = 1.'
      }
    }
  },
  {
    id: 'exp6',
    number: 6,
    title: 'Merge Sort (Divide & Conquer)',
    shortTitle: 'Merge Sort',
    category: 'Divide & Conquer',
    recommendedMinutes: 18,
    concept: {
      intuition:
        'Merge Sort is the canonical Divide and Conquer algorithm. It splits an unsorted list into two roughly equal halves recursively until each subproblem has length $\\le 1$ (base case, trivially sorted). It then systematically merges pairs of sorted subarrays back up, comparing headers in $O(n)$ time at each tree level.',
      prerequisites: ['Recursion base cases & call stack', 'Divide, Conquer, Combine paradigm', 'Auxiliary buffer allocation'],
      analogy:
        'Sorting two pre-sorted decks of cards into one large sorted deck: you only compare the top card of deck A with the top card of deck B, pick the smaller, and repeat until both decks are exhausted.',
      keyTakeaway:
        'Guaranteed $O(n \\log n)$ time in all cases (best, worst, average) because the recursion tree has depth $\\log_2 n$ and each level requires $O(n)$ total merge work.'
    },
    pseudocode: [
      {
        title: 'Merge Sort (Recursive Split)',
        code: `function mergeSort(arr):
  if length(arr) <= 1:
    return arr
  mid = floor(length(arr) / 2)
  left = mergeSort(arr[0...mid])
  right = mergeSort(arr[mid...end])
  return merge(left, right)`,
        explanation: 'Divides array down to n single-element subproblems.'
      },
      {
        title: 'Merge Routine (Two Pointers)',
        code: `function merge(left, right):
  result = []
  i = 0, j = 0
  while i < length(left) and j < length(right):
    if left[i] <= right[j]:
      result.append(left[i++])
    else:
      result.append(right[j++])
  append remaining elements from left and right
  return result`,
        explanation: 'Merges two sorted lists in linear time O(len(left) + len(right)).'
      }
    ],
    complexity: {
      bestTime: 'O(n log n)',
      worstTime: 'O(n log n) (guaranteed)',
      averageTime: 'O(n log n)',
      space: 'O(n) auxiliary space (merging buffer)',
      notes: 'Merge Sort is a stable sort: identical keys retain their relative order because left[i] <= right[j] prefers the left item.'
    },
    taskSpec: {
      problemStatement:
        'Implement `mergeSort(int[] arr)` and helper `merge(int[] left, int[] right)` in Java:\n1. `merge(int[] left, int[] right)`: Merges two sorted arrays into a new sorted array.\n2. `mergeSort(int[] arr)`: Recursively divides `arr` into halves, sorts both, and returns the merged result.',
      functionSignatures: {
        java: 'public static int[] merge(int[] left, int[] right)\npublic static int[] mergeSort(int[] arr)',
        javascript: 'function merge(left, right)\nfunction mergeSort(arr)',
        python: 'def merge(left: list[int], right: list[int]) -> list[int]:\ndef merge_sort(arr: list[int]) -> list[int]:'
      },
      inputs: ['arr: int[]'],
      outputs: ['New sorted int[] in ascending order'],
      constraints: ['0 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
      examples: [
        {
          input: 'merge(new int[]{2, 5, 8}, new int[]{1, 6, 9})',
          output: '[1, 2, 5, 6, 8, 9]'
        },
        {
          input: 'mergeSort(new int[]{38, 27, 43, 3, 9, 82, 10})',
          output: '[3, 9, 10, 27, 38, 43, 82]'
        }
      ]
    },
    starterCode: {
      java: `public class Solution {
    // Experiment 6: Merge two sorted arrays
    public static int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        
        // TODO: Compare left[i] and right[j], place smaller into result[k++]
        
        return result;
    }

    // Experiment 6: Recursive MergeSort
    public static int[] mergeSort(int[] arr) {
        // TODO: Base case: if arr.length <= 1, return arr
        if (arr.length <= 1) return arr;
        
        // Split array into left and right, recurse, return merge(leftSorted, rightSorted)
        return arr;
    }
}
`,
      javascript: `/**
 * Experiment 6: Merge Sort (Divide & Conquer)
 */

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  
  return result;
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
`,
      python: `"""
Experiment 6: Merge Sort (Divide & Conquer)
"""

def merge(left: list[int], right: list[int]) -> list[int]:
    result = []
    return result

def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
    return arr
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'merge: Merge two disjoint sorted arrays',
        functionName: 'merge',
        args: [
          [2, 5, 8],
          [1, 6, 9]
        ],
        expected: [1, 2, 5, 6, 8, 9]
      },
      {
        id: 'tc2',
        description: 'mergeSort: Standard unsorted list',
        functionName: 'mergeSort',
        args: [[38, 27, 43, 3, 9, 82, 10]],
        expected: [3, 9, 10, 27, 38, 43, 82]
      },
      {
        id: 'tc3',
        description: 'mergeSort: Reverse sorted list with negative numbers',
        functionName: 'mergeSort',
        args: [[9, 4, 1, -2, -8]],
        expected: [-8, -2, 1, 4, 9]
      },
      {
        id: 'tc4',
        description: 'mergeSort: Array with repeated duplicates',
        functionName: 'mergeSort',
        args: [[5, 2, 2, 5, 1, 1, 3]],
        expected: [1, 1, 2, 2, 3, 5, 5]
      },
      {
        id: 'tc5',
        description: 'mergeSort: Empty array and single item',
        functionName: 'mergeSort',
        args: [[]],
        expected: [],
        isEdgeCase: true
      }
    ],
    hints: {
      hint1: 'In merge: while (i < left.length && j < right.length), if (left[i] <= right[j]) result[k++] = left[i++]; else result[k++] = right[j++]. Then drain remaining elements.',
      hint2: 'In mergeSort: if (arr.length <= 1) return arr. int mid = arr.length / 2. Create left and right slices, recursively sort them, then return merge(left, right).',
      optimalSolution: {
        java: `public class Solution {
    public static int[] merge(int[] left, int[] right) {
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }

        while (i < left.length) {
            result[k++] = left[i++];
        }
        while (j < right.length) {
            result[k++] = right[j++];
        }

        return result;
    }

    public static int[] mergeSort(int[] arr) {
        if (arr.length <= 1) return arr;

        int mid = arr.length / 2;
        int[] left = new int[mid];
        int[] right = new int[arr.length - mid];

        for (int i = 0; i < mid; i++) {
            left[i] = arr[i];
        }
        for (int i = mid; i < arr.length; i++) {
            right[i - mid] = arr[i];
        }

        int[] leftSorted = mergeSort(left);
        int[] rightSorted = mergeSort(right);

        return merge(leftSorted, rightSorted);
    }
}`,
        javascript: `function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}`,
        python: `def merge(left: list[int], right: list[int]) -> list[int]:
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def merge_sort(arr: list[int]) -> list[int]:
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)`,
        explanation:
          'Merge Sort divides the array in half at each step (log n levels) and performs O(n) work to merge arrays at each level, establishing a consistent O(n log n) bound.'
      }
    }
  },
  {
    id: 'exp7',
    number: 7,
    title: 'Quick Sort (Partitioning Technique)',
    shortTitle: 'Quick Sort',
    category: 'Partitioning',
    recommendedMinutes: 20,
    concept: {
      intuition:
        'Quick Sort achieves in-place sorting through Partitioning. A pivot element is selected, and all elements smaller than the pivot are partitioned to its left, while elements larger are partitioned to its right. Once the pivot settles in its permanent sorted index, the left and right partitions are recursively sorted.',
      prerequisites: ['Lomuto partition scheme', 'In-place swapping', 'Tail recursion / stack bounds'],
      analogy:
        'A school class organizing by height: the teacher picks one student (pivot) to stand in line. Every student shorter than them is ordered to stand on their left side, and every student taller to their right side. Once grouped, each side repeats the process.',
      keyTakeaway:
        'Quick Sort is typically 2-3x faster in practice than Merge Sort because it sorts in-place ($O(1)$ memory without allocating secondary arrays) and possesses superior CPU cache locality.'
    },
    pseudocode: [
      {
        title: 'Lomuto Partition Scheme',
        code: `function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j from low to high - 1:
    if arr[j] <= pivot:
      i++
      swap(arr[i], arr[j])
  swap(arr[i + 1], arr[high])
  return i + 1 // final pivot position`,
        explanation: 'i tracks boundary of smaller elements. Swaps pivot into index i + 1.'
      },
      {
        title: 'In-Place Recursive QuickSort',
        code: `function quickSort(arr, low = 0, high = length(arr) - 1):
  if low < high:
    pIndex = partition(arr, low, high)
    quickSort(arr, low, pIndex - 1)
    quickSort(arr, pIndex + 1, high)
  return arr`,
        explanation: 'Recurses on left and right partitions around fixed pivot index.'
      }
    ],
    complexity: {
      bestTime: 'O(n log n) (balanced median partitions)',
      worstTime: 'O(n^2) (already sorted array with naive last-element pivot)',
      averageTime: 'O(n log n)',
      space: 'O(log n) call stack auxiliary (in-place data modification)',
      notes: 'Lomuto partition is simple and intuitive. Hoare partition performs roughly 3x fewer swaps on average.'
    },
    taskSpec: {
      problemStatement:
        'Implement in-place QuickSort with Lomuto partitioning in Java:\n1. `partition(int[] arr, int low, int high)`: Chooses `arr[high]` as pivot, places smaller elements to the left, swaps pivot into correct position, and returns the final pivot index.\n2. `quickSort(int[] arr, int low, int high)`: Recursively sorts `arr` between indices `low` and `high` in-place, returning `arr`.',
      functionSignatures: {
        java: 'public static int partition(int[] arr, int low, int high)\npublic static int[] quickSort(int[] arr, int low, int high)',
        javascript: 'function partition(arr, low, high)\nfunction quickSort(arr, low = 0, high = arr.length - 1)',
        python: 'def partition(arr: list[int], low: int, high: int) -> int:\ndef quick_sort(arr: list[int], low: int = 0, high: int = -1) -> list[int]:'
      },
      inputs: ['arr: int[]', 'low: int starting index', 'high: int ending index'],
      outputs: ['arr: Sorted int[] in ascending order'],
      constraints: ['0 <= arr.length <= 10^5', '-10^9 <= arr[i] <= 10^9'],
      examples: [
        {
          input: 'partition(new int[]{10, 80, 30, 90, 40, 50, 70}, 0, 6)',
          output: '4 (pivot 70 lands at index 4)'
        },
        {
          input: 'quickSort(new int[]{10, 7, 8, 9, 1, 5}, 0, 5)',
          output: '[1, 5, 7, 8, 9, 10]'
        }
      ]
    },
    starterCode: {
      java: `public class Solution {
    // Experiment 7: Lomuto Partitioning
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        // TODO: Loop j from low to high - 1
        // If arr[j] <= pivot, increment i and swap arr[i] with arr[j]
        // Finally, swap arr[i + 1] with arr[high] and return i + 1
        
        return i + 1;
    }

    // Experiment 7: In-Place Recursive QuickSort
    public static int[] quickSort(int[] arr, int low, int high) {
        // If low < high, partition and recurse on left and right partitions
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
        return arr;
    }
}
`,
      javascript: `/**
 * Experiment 7: Quick Sort (Partitioning Technique)
 */

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}
`,
      python: `"""
Experiment 7: Quick Sort (Partitioning Technique)
"""

def partition(arr: list[int], low: int, high: int) -> int:
    return low

def quick_sort(arr: list[int], low: int = 0, high: int = None) -> list[int]:
    if high is None:
        high = len(arr) - 1
    return arr
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'partition: Correct pivot placement for Lomuto scheme',
        functionName: 'partition',
        args: [[10, 80, 30, 90, 40, 50, 70], 0, 6],
        expected: 4
      },
      {
        id: 'tc2',
        description: 'quickSort: Unsorted array with odd length',
        functionName: 'quickSort',
        args: [[10, 7, 8, 9, 1, 5], 0, 5],
        expected: [1, 5, 7, 8, 9, 10]
      },
      {
        id: 'tc3',
        description: 'quickSort: Array with repeated duplicate numbers',
        functionName: 'quickSort',
        args: [[4, 2, 2, 8, 3, 3, 1], 0, 6],
        expected: [1, 2, 2, 3, 3, 4, 8]
      },
      {
        id: 'tc4',
        description: 'quickSort: Already sorted array',
        functionName: 'quickSort',
        args: [[1, 2, 3, 4, 5], 0, 4],
        expected: [1, 2, 3, 4, 5],
        isEdgeCase: true
      },
      {
        id: 'tc5',
        description: 'quickSort: Empty array and single element',
        functionName: 'quickSort',
        args: [[], 0, -1],
        expected: [],
        isEdgeCase: true
      }
    ],
    hints: {
      hint1: 'In partition: pivot = arr[high]. int i = low - 1. Loop j from low to high - 1. If arr[j] <= pivot, i++, swap arr[i] and arr[j]. Then swap arr[i + 1] and arr[high], return i + 1.',
      hint2: 'In quickSort(arr, low, high): if (low < high), int pi = partition(arr, low, high); quickSort(arr, low, pi - 1); quickSort(arr, pi + 1, high); return arr.',
      optimalSolution: {
        java: `public class Solution {
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1;
    }

    public static int[] quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
        return arr;
    }
}`,
        javascript: `function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}
`,
        python: `def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr: list[int], low: int = 0, high: int = None) -> list[int]:
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr`,
        explanation:
          'Lomuto partition rearranges the array in O(n) linear scan by expanding the boundary i of elements less than or equal to the pivot, then anchors the pivot into i + 1 with zero extra heap allocations.'
      }
    }
  },
  {
    id: 'exp8',
    number: 8,
    title: 'Greedy Algorithms: Activity Selection & Fractional Knapsack (CO2, BT3 Apply)',
    shortTitle: 'Greedy Algorithms',
    category: 'Greedy Algorithms',
    recommendedMinutes: 20,
    concept: {
      intuition:
        'A greedy algorithm constructs a solution step by step, making the locally optimal choice at each stage in the hope of finding a global optimum. For Activity Selection, selecting the activity that finishes earliest maximizes remaining time for future activities. For Fractional Knapsack, sorting items by value-to-weight ratio (density) and taking as much as possible greedily guarantees maximum total profit.',
      prerequisites: ['Greedy choice property', 'Optimal substructure', 'Sorting by finish time / density ratio'],
      analogy:
        'Booking a meeting room: picking the presentation that finishes earliest leaves the maximum free room time for subsequent presenters. In Fractional Knapsack: filling a treasure bag with the most valuable powder per gram before taking heavier, lower-value ores.',
      keyTakeaway:
        'Greedy algorithms run in O(n log n) time due to sorting, and produce guaranteed optimal solutions when the problem possesses the greedy choice property.'
    },
    pseudocode: [
      {
        title: 'Activity Selection Problem',
        code: `function activitySelection(start, finish):
  n = length(start)
  sort activities by finish time ascending
  count = 1
  lastFinish = finish[0]
  for i from 1 to n - 1:
    if start[i] >= lastFinish:
      count++
      lastFinish = finish[i]
  return count`,
        explanation: 'Always selects the next compatible activity that ends earliest.'
      },
      {
        title: 'Fractional Knapsack Problem',
        code: `function fractionalKnapsack(values, weights, capacity):
  sort items by ratio (value / weight) descending
  totalValue = 0, currentWeight = 0
  for item in sortedItems:
    if currentWeight + item.weight <= capacity:
      currentWeight += item.weight
      totalValue += item.value
    else:
      remaining = capacity - currentWeight
      totalValue += item.value * (remaining / item.weight)
      break
  return totalValue`,
        explanation: 'Fills knapsack greedily by density, taking fraction of last item.'
      }
    ],
    complexity: {
      bestTime: 'Activity: O(n log n) · Knapsack: O(n log n) (Sorting bound)',
      worstTime: 'Activity: O(n log n) · Knapsack: O(n log n)',
      averageTime: 'O(n log n)',
      space: 'O(n) auxiliary space for item/activity pairs',
      notes: 'If activities are pre-sorted by finish time, Activity Selection runs in linear O(n) time and O(1) space.'
    },
    taskSpec: {
      problemStatement:
        'Implement two classic Greedy algorithms in Java:\n1. `activitySelection(int[] start, int[] finish)`: Returns the maximum number of mutually compatible activities that can be performed by a single person/room. Assumes finish times are sorted or sorts them accordingly.\n2. `fractionalKnapsack(int[] values, int[] weights, int capacity)`: Calculates and returns the maximum total value (double) achievable in a knapsack with given weight capacity, allowing fractional items.',
      functionSignatures: {
        java: 'public static int activitySelection(int[] start, int[] finish)\npublic static double fractionalKnapsack(int[] values, int[] weights, int capacity)',
        javascript: 'function activitySelection(start, finish)\nfunction fractionalKnapsack(values, weights, capacity)',
        python: 'def activity_selection(start: list[int], finish: list[int]) -> int:\ndef fractional_knapsack(values: list[int], weights: list[int], capacity: int) -> float:'
      },
      inputs: ['start: int[], finish: int[]', 'values: int[], weights: int[], capacity: int'],
      outputs: ['activitySelection: int', 'fractionalKnapsack: double'],
      constraints: ['1 <= n <= 10^5', '1 <= capacity <= 10^5', '1 <= values[i], weights[i] <= 10^4'],
      examples: [
        {
          input: 'activitySelection([1, 3, 0, 5, 8, 5], [2, 4, 6, 7, 9, 9])',
          output: '4',
          explanation: 'Can choose activities [1,2], [3,4], [5,7], [8,9].'
        },
        {
          input: 'fractionalKnapsack([60, 100, 120], [10, 20, 30], 50)',
          output: '240.0',
          explanation: 'Take item 1 (10kg, $60) + item 2 (20kg, $100) + 2/3 of item 3 (20kg, $80) = $240.'
        }
      ]
    },
    starterCode: {
      java: `public class Solution {
    // Experiment 8: Activity Selection Problem
    public static int activitySelection(int[] start, int[] finish) {
        int n = start.length;
        if (n == 0) return 0;
        
        // TODO: Pair start and finish times, sort by finish time ascending
        // Greedily pick compatible activities (start[i] >= lastFinish)
        int count = 1;
        int lastFinish = finish[0];
        
        for (int i = 1; i < n; i++) {
            if (start[i] >= lastFinish) {
                count++;
                lastFinish = finish[i];
            }
        }
        
        return count;
    }

    // Experiment 8: Fractional Knapsack Problem
    public static double fractionalKnapsack(int[] values, int[] weights, int capacity) {
        // TODO: Compute value-to-weight ratio for each item
        // Sort items by ratio descending
        // Greedily take items; take fraction if item cannot fit fully
        double totalValue = 0.0;
        
        return totalValue;
    }
}
`,
      javascript: `/**
 * Experiment 8: Greedy Algorithms
 */

function activitySelection(start, finish) {
  // TODO: Sort by finish time, greedily pick compatible activities
  let count = 1;
  let lastFinish = finish[0];
  for (let i = 1; i < start.length; i++) {
    if (start[i] >= lastFinish) {
      count++;
      lastFinish = finish[i];
    }
  }
  return count;
}

function fractionalKnapsack(values, weights, capacity) {
  // TODO: Sort by density ratio descending, greedily take items
  const items = values.map((v, i) => ({ value: v, weight: weights[i], ratio: v / weights[i] }));
  items.sort((a, b) => b.ratio - a.ratio);

  let totalVal = 0;
  let curWeight = 0;

  for (const it of items) {
    if (curWeight + it.weight <= capacity) {
      curWeight += it.weight;
      totalVal += it.value;
    } else {
      const remain = capacity - curWeight;
      totalVal += it.value * (remain / it.weight);
      break;
    }
  }
  return totalVal;
}
`,
      python: `"""
Experiment 8: Greedy Algorithms
"""

def activity_selection(start: list[int], finish: list[int]) -> int:
    acts = sorted(zip(start, finish), key=lambda x: x[1])
    count = 1
    last_finish = acts[0][1]
    for s, f in acts[1:]:
        if s >= last_finish:
            count += 1
            last_finish = f
    return count

def fractional_knapsack(values: list[int], weights: list[int], capacity: int) -> float:
    items = sorted(zip(values, weights), key=lambda x: x[0] / x[1], reverse=True)
    total_val = 0.0
    cur_weight = 0
    for v, w in items:
        if cur_weight + w <= capacity:
            cur_weight += w
            total_val += v
        else:
            remain = capacity - cur_weight
            total_val += v * (remain / w)
            break
    return total_val
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'activitySelection: Standard overlapping activities',
        functionName: 'activitySelection',
        args: [[1, 3, 0, 5, 8, 5], [2, 4, 6, 7, 9, 9]],
        expected: 4
      },
      {
        id: 'tc2',
        description: 'activitySelection: Three non-overlapping intervals',
        functionName: 'activitySelection',
        args: [[10, 20, 30], [20, 25, 40]],
        expected: 2
      },
      {
        id: 'tc3',
        description: 'fractionalKnapsack: Standard multi-item case with partial take',
        functionName: 'fractionalKnapsack',
        args: [[60, 100, 120], [10, 20, 30], 50],
        expected: 240.0
      },
      {
        id: 'tc4',
        description: 'fractionalKnapsack: Large capacity exceeding all items',
        functionName: 'fractionalKnapsack',
        args: [[10, 20, 30], [5, 10, 15], 100],
        expected: 60.0
      },
      {
        id: 'tc5',
        description: 'fractionalKnapsack: Single item with partial slice',
        functionName: 'fractionalKnapsack',
        args: [[500], [30], 10],
        expected: 166.67,
        isEdgeCase: true
      }
    ],
    hints: {
      hint1: 'For Activity Selection: Sort by finish time. Maintain lastFinish = finish[0] and count = 1. If start[i] >= lastFinish, increment count and update lastFinish = finish[i].',
      hint2: 'For Fractional Knapsack: Create an Item object with value, weight, and ratio = (double)value / weight. Sort descending by ratio. Take as much weight as capacity permits, and multiply value by (capacity - curWeight) / weight for the partial remainder.',
      optimalSolution: {
        java: `public class Solution {
    public static int activitySelection(int[] start, int[] finish) {
        int n = start.length;
        if (n == 0) return 0;

        // Create paired indices and sort by finish time
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        java.util.Arrays.sort(order, (a, b) -> Integer.compare(finish[a], finish[b]));

        int count = 1;
        int lastFinish = finish[order[0]];

        for (int i = 1; i < n; i++) {
            int idx = order[i];
            if (start[idx] >= lastFinish) {
                count++;
                lastFinish = finish[idx];
            }
        }

        return count;
    }

    public static double fractionalKnapsack(int[] values, int[] weights, int capacity) {
        int n = values.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;

        // Sort descending by value / weight ratio
        java.util.Arrays.sort(order, (a, b) -> {
            double r1 = (double) values[a] / weights[a];
            double r2 = (double) values[b] / weights[b];
            return Double.compare(r2, r1);
        });

        double totalValue = 0.0;
        int currentWeight = 0;

        for (int i = 0; i < n; i++) {
            int idx = order[i];
            if (currentWeight + weights[idx] <= capacity) {
                currentWeight += weights[idx];
                totalValue += values[idx];
            } else {
                int remain = capacity - currentWeight;
                totalValue += values[idx] * ((double) remain / weights[idx]);
                break;
            }
        }

        return Math.round(totalValue * 100.0) / 100.0;
    }
}`,
        javascript: `function activitySelection(start, finish) {
  const acts = start.map((s, i) => ({ start: s, finish: finish[i] }));
  acts.sort((a, b) => a.finish - b.finish);

  let count = 1;
  let lastFinish = acts[0].finish;

  for (let i = 1; i < acts.length; i++) {
    if (acts[i].start >= lastFinish) {
      count++;
      lastFinish = acts[i].finish;
    }
  }
  return count;
}

function fractionalKnapsack(values, weights, capacity) {
  const items = values.map((v, i) => ({ value: v, weight: weights[i], ratio: v / weights[i] }));
  items.sort((a, b) => b.ratio - a.ratio);

  let totalVal = 0;
  let curWeight = 0;

  for (const it of items) {
    if (curWeight + it.weight <= capacity) {
      curWeight += it.weight;
      totalVal += it.value;
    } else {
      const remain = capacity - curWeight;
      totalVal += it.value * (remain / it.weight);
      break;
    }
  }
  return Math.round(totalVal * 100) / 100;
}`,
        python: `def activity_selection(start: list[int], finish: list[int]) -> int:
    acts = sorted(zip(start, finish), key=lambda x: x[1])
    count = 1
    last_finish = acts[0][1]
    for s, f in acts[1:]:
        if s >= last_finish:
            count += 1
            last_finish = f
    return count

def fractional_knapsack(values: list[int], weights: list[int], capacity: int) -> float:
    items = sorted(zip(values, weights), key=lambda x: x[0] / x[1], reverse=True)
    total_val = 0.0
    cur_weight = 0
    for v, w in items:
        if cur_weight + w <= capacity:
            cur_weight += w
            total_val += v
        else:
            remain = capacity - cur_weight
            total_val += v * (remain / w)
            break
    return round(total_val, 2)`,
        explanation:
          'Greedy sorting by earliest finish time guarantees maximum disjoint activity coverage. Sorting items by value density v_i/w_i guarantees maximum fractional knapsack value.'
      }
    }
  },
  {
    id: 'exp9',
    number: 9,
    title: 'Queue and Deque Applications for Real-Time Problem Solving (CO4, BT4 Analyze)',
    shortTitle: 'Queue & Deque',
    category: 'Queue & Deque',
    recommendedMinutes: 20,
    concept: {
      intuition:
        'Queues enforce First-In-First-Out (FIFO) semantics, widely used in CPU task scheduling, breadth-first search, and asynchronous event streams. Double-Ended Queues (Deques) allow O(1) insertions and deletions at both ends, enabling high-performance real-time streaming algorithms such as the Monotonic Deque for Sliding Window Maximum in linear O(n) time.',
      prerequisites: ['FIFO queue semantics', 'Circular ring buffer with modulo arithmetic', 'Monotonic decreasing stack/deque'],
      analogy:
        'A sliding window max with a monotonic deque: think of job candidates competing for the leadership of an active committee. When a younger candidate with higher qualifications arrives, all older candidates with lesser qualifications are permanently dropped from the queue because they can never be the top choice again.',
      keyTakeaway:
        'A monotonic deque computes the maximum/minimum of all contiguous sliding windows of size k in strict O(n) time and O(k) space, compared to O(n * k) brute force.'
    },
    pseudocode: [
      {
        title: 'Sliding Window Maximum with Monotonic Deque',
        code: `function maxSlidingWindow(nums, k):
  deque = [] // stores indices of candidates in decreasing value order
  result = []
  for i from 0 to length(nums) - 1:
    // Remove indices outside active window [i - k + 1 ... i]
    if not empty(deque) and deque.front < i - k + 1:
      deque.pollFirst()
    // Evict smaller elements from back
    while not empty(deque) and nums[deque.rear] <= nums[i]:
      deque.pollLast()
    deque.addLast(i)
    if i >= k - 1:
      result.append(nums[deque.front])
  return result`,
        explanation: 'Each index is pushed once and popped at most once, guaranteeing linear O(n) runtime.'
      }
    ],
    complexity: {
      bestTime: 'O(n) amortized (each element pushed/popped at most once)',
      worstTime: 'O(n) linear pass',
      averageTime: 'O(n)',
      space: 'O(k) auxiliary space for sliding window bounds',
      notes: 'Standard brute-force or heap-based sliding window takes O(n log k). The monotonic deque reduces queries to amortized O(1) per step.'
    },
    taskSpec: {
      problemStatement:
        'Implement the optimal Sliding Window Maximum algorithm in Java using a Double-Ended Queue (Deque):\nGiven an integer array `nums` and a sliding window size `k`, return an array containing the maximum value in each sliding window moving from left to right in $O(n)$ time.',
      functionSignatures: {
        java: 'public static int[] maxSlidingWindow(int[] nums, int k)',
        javascript: 'function maxSlidingWindow(nums, k)',
        python: 'def max_sliding_window(nums: list[int], k: int) -> list[int]:'
      },
      inputs: ['nums: int[] array of numbers', 'k: int window size (1 <= k <= nums.length)'],
      outputs: ['int[] array containing maximums for each of the (nums.length - k + 1) windows'],
      constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
      examples: [
        {
          input: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
          output: '[3, 3, 5, 5, 6, 7]',
          explanation: 'Window 1 [1, 3, -1] max 3; Window 2 [3, -1, -3] max 3; Window 3 [-1, -3, 5] max 5, etc.'
        },
        {
          input: 'nums = [1], k = 1',
          output: '[1]'
        }
      ]
    },
    starterCode: {
      java: `import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    // Experiment 9: Sliding Window Maximum using Monotonic Deque
    public static int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        if (n == 0 || k <= 0) return new int[0];
        
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>(); // stores indices
        
        // TODO: Iterate i from 0 to n - 1
        // 1. Remove indices out of current window (deque.peekFirst() < i - k + 1)
        // 2. Remove indices from back while nums[deque.peekLast()] <= nums[i]
        // 3. Add current index i to back
        // 4. When i >= k - 1, record nums[deque.peekFirst()] into result
        
        return result;
    }
}
`,
      javascript: `/**
 * Experiment 9: Sliding Window Maximum (Monotonic Deque)
 */

function maxSlidingWindow(nums, k) {
  const n = nums.length;
  if (n === 0 || k <= 0) return [];
  const result = [];
  const deque = []; // stores indices

  for (let i = 0; i < n; i++) {
    // Remove indices outside window
    while (deque.length > 0 && deque[0] < i - k + 1) {
      deque.shift();
    }
    // Evict smaller elements from back
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);

    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}
`,
      python: `"""
Experiment 9: Sliding Window Maximum
"""
from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    n = len(nums)
    if n == 0 or k <= 0:
        return []
    result = []
    d = deque()

    for i in range(n):
        while d and d[0] < i - k + 1:
            d.popleft()
        while d and nums[d[-1]] <= nums[i]:
            d.pop()
        d.append(i)
        if i >= k - 1:
            result.append(nums[d[0]])
    return result
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'maxSlidingWindow: Classic mixed array with k = 3',
        functionName: 'maxSlidingWindow',
        args: [[1, 3, -1, -3, 5, 3, 6, 7], 3],
        expected: [3, 3, 5, 5, 6, 7]
      },
      {
        id: 'tc2',
        description: 'maxSlidingWindow: Single element array with k = 1',
        functionName: 'maxSlidingWindow',
        args: [[1], 1],
        expected: [1]
      },
      {
        id: 'tc3',
        description: 'maxSlidingWindow: Two elements with k = 1',
        functionName: 'maxSlidingWindow',
        args: [[1, -1], 1],
        expected: [1, -1]
      },
      {
        id: 'tc4',
        description: 'maxSlidingWindow: Two elements with k = 2',
        functionName: 'maxSlidingWindow',
        args: [[9, 11], 2],
        expected: [11],
        isEdgeCase: true
      },
      {
        id: 'tc5',
        description: 'maxSlidingWindow: Decreasing elements [4, -2] with k = 2',
        functionName: 'maxSlidingWindow',
        args: [[4, -2], 2],
        expected: [4],
        isEdgeCase: true
      }
    ],
    hints: {
      hint1: 'Store indices in the deque rather than values so you can easily check if an element is older than i - k + 1.',
      hint2: 'Before pushing index i, pop all indices from the back whose corresponding value is <= nums[i]. The front of the deque will always point to the maximum element in the current window.',
      optimalSolution: {
        java: `import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        if (n == 0 || k <= 0) return new int[0];

        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            // 1. Remove indices outside window boundary
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }

            // 2. Remove smaller elements from rear
            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {
                deque.pollLast();
            }

            // 3. Add current element index
            deque.offerLast(i);

            // 4. Save window maximum
            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }

        return result;
    }
}`,
        javascript: `function maxSlidingWindow(nums, k) {
  const n = nums.length;
  if (n === 0 || k <= 0) return [];
  const result = [];
  const deque = [];

  for (let i = 0; i < n; i++) {
    while (deque.length > 0 && deque[0] < i - k + 1) {
      deque.shift();
    }
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  return result;
}`,
        python: `from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    n = len(nums)
    if n == 0 or k <= 0:
        return []
    result = []
    d = deque()

    for i in range(n):
        while d and d[0] < i - k + 1:
            d.popleft()
        while d and nums[d[-1]] <= nums[i]:
            d.pop()
        d.append(i)
        if i >= k - 1:
            result.append(nums[d[0]])
    return result`,
        explanation:
          'By maintaining indices in monotonically decreasing value order, each element enters and leaves the deque at most once, achieving strict O(n) total time.'
      }
    }
  },
  {
    id: 'exp10',
    number: 10,
    title: 'Dynamic Programming (LIS) & Trie for Prefix Matching (BT4 Analyze)',
    shortTitle: 'DP (LIS) & Trie',
    category: 'DP & Trie',
    recommendedMinutes: 20,
    concept: {
      intuition:
        'Dynamic Programming solves complex problems by breaking them into overlapping subproblems with optimal substructure. For Longest Increasing Subsequence (LIS), we compute dp[i] as the length of LIS ending at index i. For string retrieval, a Trie (Prefix Tree) organizes words character-by-character, allowing prefix lookups and word searches in O(L) time regardless of dictionary size.',
      prerequisites: ['Optimal substructure and memoization', 'Tree branching by character codes', 'Prefix matching vs full word search'],
      analogy:
        'LIS: Stepping stones across a river where you can only jump onto a taller stone than your current one. Trie: A phone contact auto-complete directory where typing "ap" instantly narrows down to all contacts under the "a -> p" branch.',
      keyTakeaway:
        'Dynamic programming reduces LIS from O(2^n) exponential brute force to O(n^2), while a Trie provides deterministic O(L) dictionary lookups where L is key length.'
    },
    pseudocode: [
      {
        title: 'Longest Increasing Subsequence (LIS) DP',
        code: `function lengthOfLIS(nums):
  n = length(nums)
  dp = array of size n filled with 1
  for i from 1 to n - 1:
    for j from 0 to i - 1:
      if nums[j] < nums[i]:
        dp[i] = max(dp[i], dp[j] + 1)
  return max(dp)`,
        explanation: 'dp[i] represents length of longest increasing subsequence ending at index i.'
      },
      {
        title: 'Trie Insert & Search Operations',
        code: `class Trie:
  insert(word):
    cur = root
    for ch in word:
      if ch not in cur.children:
        cur.children[ch] = new TrieNode()
      cur = cur.children[ch]
    cur.isEndOfWord = true`,
        explanation: 'Walks down tree character by character, inserting nodes as needed.'
      }
    ],
    complexity: {
      bestTime: 'LIS: O(n log n) with patience sorting, O(n^2) DP · Trie: O(L) per search/insert',
      worstTime: 'LIS: O(n^2) · Trie: O(L) where L is query length',
      averageTime: 'LIS: O(n^2) · Trie: O(L)',
      space: 'LIS: O(n) for DP array · Trie: O(ALPHABET_SIZE * N * L) for nodes',
      notes: 'Trie search time depends solely on the length of the query string L, not the total number of words in the dictionary.'
    },
    taskSpec: {
      problemStatement:
        'Implement two foundational computer science structures in Java:\n1. `lengthOfLIS(int[] nums)`: Computes and returns the length of the Longest Increasing Subsequence using Dynamic Programming ($O(n^2)$).\n2. `trieOperations(String[] wordsToInsert, String[] wordsToSearch, String[] prefixesToTest)`: Implements a Trie to insert words, then returns a boolean array containing search results for exact words followed by prefix test results.',
      functionSignatures: {
        java: 'public static int lengthOfLIS(int[] nums)\npublic static boolean[] trieOperations(String[] wordsToInsert, String[] wordsToSearch, String[] prefixesToTest)',
        javascript: 'function lengthOfLIS(nums)\nfunction trieOperations(wordsToInsert, wordsToSearch, prefixesToTest)',
        python: 'def length_of_lis(nums: list[int]) -> int:\ndef trie_operations(words_to_insert: list[str], words_to_search: list[str], prefixes_to_test: list[str]) -> list[bool]:'
      },
      inputs: ['nums: int[]', 'wordsToInsert: String[], wordsToSearch: String[], prefixesToTest: String[]'],
      outputs: ['lengthOfLIS: int', 'trieOperations: boolean[]'],
      constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4', 'Words consist of lowercase English letters'],
      examples: [
        {
          input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
          output: '4',
          explanation: 'Longest increasing subsequence is [2, 3, 7, 101], length 4.'
        },
        {
          input: 'trieOperations(["apple", "app"], ["apple", "appl"], ["app", "bat"])',
          output: '[true, false, true, false]',
          explanation: 'apple found, appl not found; prefix app exists, bat does not.'
        }
      ]
    },
    starterCode: {
      java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    // Experiment 10: Longest Increasing Subsequence (LIS) via Dynamic Programming
    public static int lengthOfLIS(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        
        int[] dp = new int[n];
        int maxLIS = 1;
        
        // TODO: Initialize dp array with 1
        // Loop i from 1 to n - 1, loop j from 0 to i - 1
        // If nums[j] < nums[i], dp[i] = Math.max(dp[i], dp[j] + 1)
        
        return maxLIS;
    }

    // Experiment 10: Trie for Prefix Matching and Dictionary Search
    public static boolean[] trieOperations(String[] wordsToInsert, String[] wordsToSearch, String[] prefixesToTest) {
        // TODO: Build Trie by inserting wordsToInsert
        // Search exact words and check prefixes
        boolean[] results = new boolean[wordsToSearch.length + prefixesToTest.length];
        
        return results;
    }
}
`,
      javascript: `/**
 * Experiment 10: Dynamic Programming (LIS) & Trie
 */

function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const dp = new Array(n).fill(1);
  let maxLIS = 1;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLIS = Math.max(maxLIS, dp[i]);
  }
  return maxLIS;
}

function trieOperations(wordsToInsert, wordsToSearch, prefixesToTest) {
  const root = { isEnd: false, children: {} };

  const insert = (word) => {
    let cur = root;
    for (const ch of word) {
      if (!cur.children[ch]) cur.children[ch] = { isEnd: false, children: {} };
      cur = cur.children[ch];
    }
    cur.isEnd = true;
  };

  const search = (word) => {
    let cur = root;
    for (const ch of word) {
      if (!cur.children[ch]) return false;
      cur = cur.children[ch];
    }
    return Boolean(cur.isEnd);
  };

  const startsWith = (prefix) => {
    let cur = root;
    for (const ch of prefix) {
      if (!cur.children[ch]) return false;
      cur = cur.children[ch];
    }
    return true;
  };

  wordsToInsert.forEach(insert);
  const res = [];
  wordsToSearch.forEach((w) => res.push(search(w)));
  prefixesToTest.forEach((p) => res.push(startsWith(p)));
  return res;
}
`,
      python: `"""
Experiment 10: LIS & Trie
"""

def length_of_lis(nums: list[int]) -> int:
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

def trie_operations(words_to_insert: list[str], words_to_search: list[str], prefixes_to_test: list[str]) -> list[bool]:
    trie = {}
    for w in words_to_insert:
        cur = trie
        for ch in w:
            if ch not in cur:
                cur[ch] = {}
            cur = cur[ch]
        cur['#'] = True

    res = []
    for w in words_to_search:
        cur = trie
        found = True
        for ch in w:
            if ch not in cur:
                found = False
                break
            cur = cur[ch]
        res.append(found and '#' in cur)

    for p in prefixes_to_test:
        cur = trie
        found = True
        for ch in p:
            if ch not in cur:
                found = False
                break
            cur = cur[ch]
        res.append(found)

    return res
`
    },
    testCases: [
      {
        id: 'tc1',
        description: 'lengthOfLIS: Standard unsorted sequence [10,9,2,5,3,7,101,18]',
        functionName: 'lengthOfLIS',
        args: [[10, 9, 2, 5, 3, 7, 101, 18]],
        expected: 4
      },
      {
        id: 'tc2',
        description: 'lengthOfLIS: Sequence with duplicate values [0,1,0,3,2,3]',
        functionName: 'lengthOfLIS',
        args: [[0, 1, 0, 3, 2, 3]],
        expected: 4
      },
      {
        id: 'tc3',
        description: 'lengthOfLIS: All identical elements [7,7,7,7]',
        functionName: 'lengthOfLIS',
        args: [[7, 7, 7, 7]],
        expected: 1,
        isEdgeCase: true
      },
      {
        id: 'tc4',
        description: 'trieOperations: Insert apple & app; search exact and prefixes',
        functionName: 'trieOperations',
        args: [
          ['apple', 'app'],
          ['apple', 'app', 'appl'],
          ['app', 'ap', 'bat']
        ],
        expected: [true, true, false, true, true, false]
      },
      {
        id: 'tc5',
        description: 'trieOperations: Single character words and empty prefix tests',
        functionName: 'trieOperations',
        args: [
          ['a', 'b'],
          ['a', 'c'],
          ['a', 'b']
        ],
        expected: [true, false, true, true],
        isEdgeCase: true
      }
    ],
    hints: {
      hint1: 'For LIS: Initialize dp array with 1. For each i from 1 to n - 1, check every j from 0 to i - 1. If nums[j] < nums[i], update dp[i] = Math.max(dp[i], dp[j] + 1). Return Math.max(...dp).',
      hint2: 'For Trie: Use a TrieNode class with Map<Character, TrieNode> children and boolean isEnd. For search, traverse character by character and check isEnd == true. For startsWith, traverse character by character and return true if path exists.',
      optimalSolution: {
        java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    public static int lengthOfLIS(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;

        int[] dp = new int[n];
        int maxLIS = 1;

        for (int i = 0; i < n; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            maxLIS = Math.max(maxLIS, dp[i]);
        }

        return maxLIS;
    }

    static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isEnd = false;
    }

    public static boolean[] trieOperations(String[] wordsToInsert, String[] wordsToSearch, String[] prefixesToTest) {
        TrieNode root = new TrieNode();

        // Insert
        for (int w = 0; w < wordsToInsert.length; w++) {
            String word = wordsToInsert[w];
            TrieNode cur = root;
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                if (!cur.children.containsKey(ch)) {
                    cur.children.put(ch, new TrieNode());
                }
                cur = cur.children.get(ch);
            }
            cur.isEnd = true;
        }

        boolean[] results = new boolean[wordsToSearch.length + prefixesToTest.length];
        int idx = 0;

        // Search exact
        for (int s = 0; s < wordsToSearch.length; s++) {
            String target = wordsToSearch[s];
            TrieNode cur = root;
            boolean found = true;
            for (int i = 0; i < target.length(); i++) {
                char ch = target.charAt(i);
                if (!cur.children.containsKey(ch)) {
                    found = false;
                    break;
                }
                cur = cur.children.get(ch);
            }
            results[idx++] = found && cur.isEnd;
        }

        // StartsWith prefixes
        for (int p = 0; p < prefixesToTest.length; p++) {
            String prefix = prefixesToTest[p];
            TrieNode cur = root;
            boolean hasPrefix = true;
            for (int i = 0; i < prefix.length(); i++) {
                char ch = prefix.charAt(i);
                if (!cur.children.containsKey(ch)) {
                    hasPrefix = false;
                    break;
                }
                cur = cur.children.get(ch);
            }
            results[idx++] = hasPrefix;
        }

        return results;
    }
}`,
        javascript: `function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const dp = new Array(n).fill(1);
  let maxLIS = 1;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLIS = Math.max(maxLIS, dp[i]);
  }
  return maxLIS;
}

function trieOperations(wordsToInsert, wordsToSearch, prefixesToTest) {
  const root = { isEnd: false, children: {} };

  const insert = (word) => {
    let cur = root;
    for (const ch of word) {
      if (!cur.children[ch]) cur.children[ch] = { isEnd: false, children: {} };
      cur = cur.children[ch];
    }
    cur.isEnd = true;
  };

  const search = (word) => {
    let cur = root;
    for (const ch of word) {
      if (!cur.children[ch]) return false;
      cur = cur.children[ch];
    }
    return Boolean(cur.isEnd);
  };

  const startsWith = (prefix) => {
    let cur = root;
    for (const ch of prefix) {
      if (!cur.children[ch]) return false;
      cur = cur.children[ch];
    }
    return true;
  };

  wordsToInsert.forEach(insert);
  const res = [];
  wordsToSearch.forEach((w) => res.push(search(w)));
  prefixesToTest.forEach((p) => res.push(startsWith(p)));
  return res;
}`,
        python: `def length_of_lis(nums: list[int]) -> int:
    if not nums:
        return 0
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

def trie_operations(words_to_insert: list[str], words_to_search: list[str], prefixes_to_test: list[str]) -> list[bool]:
    trie = {}
    for w in words_to_insert:
        cur = trie
        for ch in w:
            if ch not in cur:
                cur[ch] = {}
            cur = cur[ch]
        cur['#'] = True

    res = []
    for w in words_to_search:
        cur = trie
        found = True
        for ch in w:
            if ch not in cur:
                found = False
                break
            cur = cur[ch]
        res.append(found and '#' in cur)

    for p in prefixes_to_test:
        cur = trie
        found = True
        for ch in p:
            if ch not in cur:
                found = False
                break
            cur = cur[ch]
        res.append(found)

    return res`,
        explanation:
          'Dynamic Programming avoids redundant exponential branches in LIS by memoizing subproblem solutions in O(n^2). Trie prefix matching searches characters in deterministic O(L) time.'
      }
    }
  }
];

// Enrich all 10 experiments with C++ signatures, starter code, solutions, and language-specific pseudocode
EXPERIMENTS.forEach((exp) => {
  const cpp = CPP_DATA[exp.id];
  if (cpp) {
    (exp.taskSpec.functionSignatures as any).cpp = cpp.signature;
    (exp.starterCode as any).cpp = cpp.starterCode;
    (exp.hints.optimalSolution as any).cpp = cpp.optimalSolution;
    exp.pseudocode.forEach((pc, i) => {
      pc.codeByLanguage = {
        cpp: cpp.pseudocode && cpp.pseudocode[i] ? cpp.pseudocode[i].code : cpp.starterCode,
        java: exp.hints.optimalSolution.java || exp.starterCode.java,
        python: exp.hints.optimalSolution.python || exp.starterCode.python,
        javascript: exp.hints.optimalSolution.javascript || exp.starterCode.javascript
      };
    });
  }
});
