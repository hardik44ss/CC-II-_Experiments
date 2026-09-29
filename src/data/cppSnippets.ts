/**
 * C++ Signatures, Starter Code, Optimal Solutions and Pseudocode
 * for all 10 Data Structures & Algorithms Experiments
 */

export interface CppExperimentData {
  signature: string;
  starterCode: string;
  optimalSolution: string;
  pseudocode: {
    title: string;
    code: string;
    explanation: string;
  }[];
}

export const CPP_DATA: Record<string, CppExperimentData> = {
  exp1: {
    signature: `int linearSearch(const vector<int>& arr, int target);
int binarySearch(const vector<int>& arr, int target);`,
    starterCode: `#include <vector>
using namespace std;

class Solution {
public:
    // Experiment 1: Linear Search
    int linearSearch(const vector<int>& arr, int target) {
        // TODO: Iterate through arr and return index if arr[i] == target
        
        return -1;
    }

    // Experiment 1: Binary Search
    int binarySearch(const vector<int>& arr, int target) {
        // TODO: Implement binary search on sorted vector
        int low = 0;
        int high = (int)arr.size() - 1;
        
        return -1;
    }
};
`,
    optimalSolution: `#include <vector>
using namespace std;

class Solution {
public:
    int linearSearch(const vector<int>& arr, int target) {
        for (int i = 0; i < (int)arr.size(); i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }

    int binarySearch(const vector<int>& arr, int target) {
        int low = 0;
        int high = (int)arr.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
};`,
    pseudocode: [
      {
        title: 'Linear Search in C++',
        code: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); ++i) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
        explanation: 'Iterates through each element sequentially. O(n) runtime.'
      },
      {
        title: 'Binary Search in C++',
        code: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        explanation: 'Halves the search space at each iteration. O(log n) runtime.'
      }
    ]
  },

  exp2: {
    signature: `vector<int> insertAt(vector<int> arr, int index, int val);
vector<int> deleteAt(vector<int> arr, int index);
vector<int> updateAt(vector<int> arr, int index, int val);`,
    starterCode: `#include <vector>
using namespace std;

class Solution {
public:
    // Experiment 2: Insert element at index with shifting
    vector<int> insertAt(vector<int> arr, int index, int val) {
        // TODO: Insert val at index, shifting subsequent elements right
        
        return arr;
    }

    // Experiment 2: Delete element at index with shifting
    vector<int> deleteAt(vector<int> arr, int index) {
        // TODO: Delete element at index, shifting subsequent elements left
        
        return arr;
    }

    // Experiment 2: In-place O(1) update
    vector<int> updateAt(vector<int> arr, int index, int val) {
        // TODO: Direct overwrite at arr[index]
        
        return arr;
    }
};
`,
    optimalSolution: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> insertAt(vector<int> arr, int index, int val) {
        int n = arr.size();
        if (index < 0 || index > n) return arr;
        arr.push_back(0);
        for (int i = n - 1; i >= index; i--) {
            arr[i + 1] = arr[i];
        }
        arr[index] = val;
        return arr;
    }

    vector<int> deleteAt(vector<int> arr, int index) {
        int n = arr.size();
        if (index < 0 || index >= n) return arr;
        for (int i = index; i < n - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop_back();
        return arr;
    }

    vector<int> updateAt(vector<int> arr, int index, int val) {
        if (index >= 0 && index < (int)arr.size()) {
            arr[index] = val;
        }
        return arr;
    }
};`,
    pseudocode: [
      {
        title: 'InsertAt in C++',
        code: `vector<int> insertAt(vector<int> arr, int index, int val) {
    arr.push_back(0);
    for (int i = arr.size() - 2; i >= index; --i) {
        arr[i + 1] = arr[i];
    }
    arr[index] = val;
    return arr;
}`,
        explanation: 'Shifts elements rightward to open memory slot at index. O(n) time.'
      },
      {
        title: 'DeleteAt in C++',
        code: `vector<int> deleteAt(vector<int> arr, int index) {
    for (int i = index; i < arr.size() - 1; ++i) {
        arr[i] = arr[i + 1];
    }
    arr.pop_back();
    return arr;
}`,
        explanation: 'Pulls elements leftward and shrinks array size. O(n) time.'
      }
    ]
  },

  exp3: {
    signature: `string reverseWords(string s);
bool isPalindrome(string s);
unordered_map<char, int> getCharFrequencies(string s);`,
    starterCode: `#include <string>
#include <vector>
#include <unordered_map>
#include <cctype>
using namespace std;

class Solution {
public:
    // Experiment 3: Reverse words (e.g. "How are you" -> "you are How")
    string reverseWords(string s) {
        // TODO: Tokenize words, reverse their order, and join with space
        
        return "";
    }

    // Experiment 3: Two-pointer palindrome
    bool isPalindrome(string s) {
        // TODO: Two pointers skipping non-alphanumeric chars
        
        return false;
    }

    // Experiment 3: Frequency Map
    unordered_map<char, int> getCharFrequencies(string s) {
        unordered_map<char, int> freqs;
        // TODO: Count frequencies
        return freqs;
    }
};
`,
    optimalSolution: `#include <string>
#include <vector>
#include <sstream>
#include <unordered_map>
#include <cctype>
using namespace std;

class Solution {
public:
    string reverseWords(string s) {
        stringstream ss(s);
        string word;
        vector<string> words;
        while (ss >> word) {
            words.push_back(word);
        }
        int left = 0, right = (int)words.size() - 1;
        while (left < right) {
            swap(words[left], words[right]);
            left++;
            right--;
        }
        string result = "";
        for (int i = 0; i < (int)words.size(); i++) {
            if (i > 0) result += " ";
            result += words[i];
        }
        return result;
    }

    bool isPalindrome(string s) {
        int left = 0, right = (int)s.size() - 1;
        while (left < right) {
            while (left < right && !isalnum((unsigned char)s[left])) left++;
            while (left < right && !isalnum((unsigned char)s[right])) right--;
            if (tolower((unsigned char)s[left]) != tolower((unsigned char)s[right])) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    unordered_map<char, int> getCharFrequencies(string s) {
        unordered_map<char, int> freqs;
        for (char c : s) freqs[c]++;
        return freqs;
    }
};`,
    pseudocode: [
      {
        title: 'Reverse Words in C++',
        code: `string reverseWords(string s) {
    stringstream ss(s);
    string w;
    vector<string> words;
    while (ss >> w) words.push_back(w);
    reverse(words.begin(), words.end());
    // join words with single space
    return join(words, " ");
}`,
        explanation: 'Extracts words, reverses using two pointers or std::reverse, and joins.'
      },
      {
        title: 'Two-Pointer Palindrome in C++',
        code: `bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++; r--;
    }
    return true;
}`,
        explanation: 'In-place two-pointer convergence without allocating duplicate strings.'
      }
    ]
  },

  exp4: {
    signature: `int lengthOfLongestSubstring(string s);`,
    starterCode: `#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    // Experiment 4: Longest Substring Without Repeating Characters (Sliding Window)
    int lengthOfLongestSubstring(string s) {
        // TODO: Maintain left and right window pointers with an unordered_set
        
        return 0;
    }
};
`,
    optimalSolution: `#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> charSet;
        int left = 0;
        int maxLen = 0;

        for (int right = 0; right < (int)s.size(); right++) {
            while (charSet.count(s[right])) {
                charSet.erase(s[left]);
                left++;
            }
            charSet.insert(s[right]);
            maxLen = max(maxLen, right - left + 1);
        }

        return maxLen;
    }
};`,
    pseudocode: [
      {
        title: 'Sliding Window in C++',
        code: `int lengthOfLongestSubstring(string s) {
    unordered_set<char> seen;
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.size(); ++right) {
        while (seen.count(s[right])) {
            seen.erase(s[left++]);
        }
        seen.insert(s[right]);
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        explanation: 'Expands right pointer and contracts left pointer on duplicate collision.'
      }
    ]
  },

  exp5: {
    signature: `vector<int> insertionSort(vector<int> arr);
vector<int> shellSort(vector<int> arr);`,
    starterCode: `#include <vector>
using namespace std;

class Solution {
public:
    // Experiment 5: Insertion Sort
    vector<int> insertionSort(vector<int> arr) {
        // TODO: In-place shift-insert sorting
        
        return arr;
    }

    // Experiment 5: Shell Sort with diminishing gap
    vector<int> shellSort(vector<int> arr) {
        // TODO: Shell sort with gap sequence n/2, n/4 ... 1
        
        return arr;
    }
};
`,
    optimalSolution: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> insertionSort(vector<int> arr) {
        int n = arr.size();
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

    vector<int> shellSort(vector<int> arr) {
        int n = arr.size();
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = arr[i];
                int j = i;
                while (j >= gap && arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                }
                arr[j] = temp;
            }
        }
        return arr;
    }
};`,
    pseudocode: [
      {
        title: 'Insertion Sort in C++',
        code: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); ++i) {
        int key = arr[i], j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
        explanation: 'Inserts current key into sorted subarray at correct position.'
      },
      {
        title: 'Shell Sort in C++',
        code: `void shellSort(vector<int>& arr) {
    int n = arr.size();
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; ++i) {
            int temp = arr[i], j = i;
            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
        explanation: 'Diminishing gap sort resolves distant inversions quickly.'
      }
    ]
  },

  exp6: {
    signature: `vector<int> mergeSort(vector<int> arr);
vector<int> merge(const vector<int>& left, const vector<int>& right);`,
    starterCode: `#include <vector>
using namespace std;

class Solution {
public:
    // Experiment 6: Merge two sorted vectors
    vector<int> merge(const vector<int>& left, const vector<int>& right) {
        // TODO: Two pointers to merge left and right
        
        return {};
    }

    // Experiment 6: Merge Sort (Divide & Conquer)
    vector<int> mergeSort(vector<int> arr) {
        // TODO: Recursively divide and merge
        
        return arr;
    }
};
`,
    optimalSolution: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> merge(const vector<int>& left, const vector<int>& right) {
        vector<int> result;
        int i = 0, j = 0;
        while (i < (int)left.size() && j < (int)right.size()) {
            if (left[i] <= right[j]) {
                result.push_back(left[i++]);
            } else {
                result.push_back(right[j++]);
            }
        }
        while (i < (int)left.size()) result.push_back(left[i++]);
        while (j < (int)right.size()) result.push_back(right[j++]);
        return result;
    }

    vector<int> mergeSort(vector<int> arr) {
        if (arr.size() <= 1) return arr;
        int mid = arr.size() / 2;
        vector<int> left(arr.begin(), arr.begin() + mid);
        vector<int> right(arr.begin() + mid, arr.end());
        return merge(mergeSort(left), mergeSort(right));
    }
};`,
    pseudocode: [
      {
        title: 'Merge Routine in C++',
        code: `vector<int> merge(const vector<int>& l, const vector<int>& r) {
    vector<int> res;
    int i = 0, j = 0;
    while (i < l.size() && j < r.size()) {
        res.push_back(l[i] <= r[j] ? l[i++] : r[j++]);
    }
    while (i < l.size()) res.push_back(l[i++]);
    while (j < r.size()) res.push_back(r[j++]);
    return res;
}`,
        explanation: 'Combines two sorted vectors into one in O(n) linear time.'
      },
      {
        title: 'Merge Sort in C++',
        code: `vector<int> mergeSort(vector<int> arr) {
    if (arr.size() <= 1) return arr;
    int mid = arr.size() / 2;
    vector<int> left(arr.begin(), arr.begin() + mid);
    vector<int> right(arr.begin() + mid, arr.end());
    return merge(mergeSort(left), mergeSort(right));
}`,
        explanation: 'Recursive divide and conquer with O(n log n) guaranteed runtime.'
      }
    ]
  },

  exp7: {
    signature: `int partition(vector<int>& arr, int low, int high);
void quickSort(vector<int>& arr, int low, int high);`,
    starterCode: `#include <vector>
using namespace std;

class Solution {
public:
    // Experiment 7: Lomuto Partition Scheme
    int partition(vector<int>& arr, int low, int high) {
        // TODO: Select pivot arr[high], partition elements <= pivot
        
        return low;
    }

    // Experiment 7: In-place QuickSort
    void quickSort(vector<int>& arr, int low, int high) {
        // TODO: In-place recursive quicksort
    }
};
`,
    optimalSolution: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int partition(vector<int>& arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        swap(arr[i + 1], arr[high]);
        return i + 1;
    }

    void quickSort(vector<int>& arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
};`,
    pseudocode: [
      {
        title: 'Lomuto Partition Scheme in C++',
        code: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; ++j) {
        if (arr[j] <= pivot) {
            swap(arr[++i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
        explanation: 'Places pivot at final sorted position with smaller items left.'
      }
    ]
  },

  exp8: {
    signature: `int activitySelection(vector<int>& start, vector<int>& finish);
double fractionalKnapsack(vector<int>& values, vector<int>& weights, int capacity);`,
    starterCode: `#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    // Experiment 8: Activity Selection (Greedy earliest finish time)
    int activitySelection(vector<int>& start, vector<int>& finish) {
        // TODO: Sort activities by finish time and select disjoint set
        
        return 0;
    }

    // Experiment 8: Fractional Knapsack (Greedy value-to-weight density)
    double fractionalKnapsack(vector<int>& values, vector<int>& weights, int capacity) {
        // TODO: Sort items descending by value / weight ratio
        
        return 0.0;
    }
};
`,
    optimalSolution: `#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    int activitySelection(vector<int>& start, vector<int>& finish) {
        int n = start.size();
        if (n == 0) return 0;
        vector<pair<int, int>> acts(n);
        for (int i = 0; i < n; i++) acts[i] = {finish[i], start[i]};
        sort(acts.begin(), acts.end());

        int count = 1;
        int lastFinish = acts[0].first;
        for (int i = 1; i < n; i++) {
            if (acts[i].second >= lastFinish) {
                count++;
                lastFinish = acts[i].first;
            }
        }
        return count;
    }

    double fractionalKnapsack(vector<int>& values, vector<int>& weights, int capacity) {
        int n = values.size();
        vector<pair<double, pair<int, int>>> items(n);
        for (int i = 0; i < n; i++) {
            items[i] = {(double)values[i] / weights[i], {values[i], weights[i]}};
        }
        sort(items.rbegin(), items.rend());

        double totalVal = 0.0;
        int curWeight = 0;
        for (int i = 0; i < n; i++) {
            int val = items[i].second.first;
            int wt = items[i].second.second;
            if (curWeight + wt <= capacity) {
                curWeight += wt;
                totalVal += val;
            } else {
                int remain = capacity - curWeight;
                totalVal += val * ((double)remain / wt);
                break;
            }
        }
        return round(totalVal * 100.0) / 100.0;
    }
};`,
    pseudocode: [
      {
        title: 'Activity Selection in C++',
        code: `int activitySelection(vector<int>& start, vector<int>& finish) {
    vector<pair<int, int>> acts; // {finish, start}
    for (int i = 0; i < start.size(); ++i) acts.push_back({finish[i], start[i]});
    sort(acts.begin(), acts.end());
    int count = 1, lastEnd = acts[0].first;
    for (int i = 1; i < acts.size(); ++i) {
        if (acts[i].second >= lastEnd) {
            count++; lastEnd = acts[i].first;
        }
    }
    return count;
}`,
        explanation: 'Greedy choice by earliest finish time maximizes disjoint activities.'
      }
    ]
  },

  exp9: {
    signature: `vector<int> maxSlidingWindow(vector<int>& nums, int k);`,
    starterCode: `#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    // Experiment 9: Sliding Window Maximum using Monotonic Deque
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        // TODO: Store indices in monotonic decreasing deque
        
        return {};
    }
};
`,
    optimalSolution: `#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        int n = nums.size();
        if (n == 0 || k <= 0) return {};
        vector<int> result;
        deque<int> dq; // stores indices

        for (int i = 0; i < n; i++) {
            while (!dq.empty() && dq.front() < i - k + 1) {
                dq.pop_front();
            }
            while (!dq.empty() && nums[dq.back()] <= nums[i]) {
                dq.pop_back();
            }
            dq.push_back(i);
            if (i >= k - 1) {
                result.push_back(nums[dq.front()]);
            }
        }
        return result;
    }
};`,
    pseudocode: [
      {
        title: 'Monotonic Deque in C++',
        code: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> res;
    for (int i = 0; i < nums.size(); ++i) {
        if (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) res.push_back(nums[dq.front()]);
    }
    return res;
}`,
        explanation: 'Maintains window maximum candidates in monotonic decreasing order.'
      }
    ]
  },

  exp10: {
    signature: `int lengthOfLIS(vector<int>& nums);
vector<bool> trieOperations(vector<string>& wordsToInsert, vector<string>& wordsToSearch, vector<string>& prefixesToTest);`,
    starterCode: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    // Experiment 10: Longest Increasing Subsequence (DP)
    int lengthOfLIS(vector<int>& nums) {
        // TODO: Dynamic programming LIS
        
        return 0;
    }

    // Experiment 10: Trie prefix matching and dictionary search
    vector<bool> trieOperations(vector<string>& wordsToInsert, vector<string>& wordsToSearch, vector<string>& prefixesToTest) {
        // TODO: Build Trie and test queries
        
        return {};
    }
};
`,
    optimalSolution: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();
        if (n == 0) return 0;
        vector<int> dp(n, 1);
        int maxLIS = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = max(dp[i], dp[j] + 1);
                }
            }
            maxLIS = max(maxLIS, dp[i]);
        }
        return maxLIS;
    }

    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        bool isEnd = false;
    };

    vector<bool> trieOperations(vector<string>& wordsToInsert, vector<string>& wordsToSearch, vector<string>& prefixesToTest) {
        TrieNode* root = new TrieNode();

        // Insert
        for (const string& w : wordsToInsert) {
            TrieNode* cur = root;
            for (char ch : w) {
                if (!cur->children.count(ch)) cur->children[ch] = new TrieNode();
                cur = cur->children[ch];
            }
            cur->isEnd = true;
        }

        vector<bool> results;
        // Search exact
        for (const string& w : wordsToSearch) {
            TrieNode* cur = root;
            bool found = true;
            for (char ch : w) {
                if (!cur->children.count(ch)) { found = false; break; }
                cur = cur->children[ch];
            }
            results.push_back(found && cur->isEnd);
        }

        // StartsWith prefixes
        for (const string& p : prefixesToTest) {
            TrieNode* cur = root;
            bool found = true;
            for (char ch : p) {
                if (!cur->children.count(ch)) { found = false; break; }
                cur = cur->children[ch];
            }
            results.push_back(found);
        }

        return results;
    }
};`,
    pseudocode: [
      {
        title: 'Dynamic Programming LIS in C++',
        code: `int lengthOfLIS(vector<int>& nums) {
    int n = nums.size(), maxLIS = 1;
    vector<int> dp(n, 1);
    for (int i = 1; i < n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) dp[i] = max(dp[i], dp[j] + 1);
        }
        maxLIS = max(maxLIS, dp[i]);
    }
    return maxLIS;
}`,
        explanation: 'Avoids redundant recomputation using memoized subproblem states. O(n^2).'
      },
      {
        title: 'Trie Prefix Matching in C++',
        code: `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};
// Traverses character by character in deterministic O(L) time.`,
        explanation: 'Retrieval tree offering prefix matching and dictionary search in O(L) time.'
      }
    ]
  }
};
