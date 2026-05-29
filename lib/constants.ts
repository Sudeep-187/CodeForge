export const LANGUAGES = [
  { id: "cpp", label: "C++", judge0Id: 54, monacoLanguage: "cpp" },
  { id: "java", label: "Java", judge0Id: 62, monacoLanguage: "java" },
  { id: "python", label: "Python", judge0Id: 71, monacoLanguage: "python" },
  { id: "javascript", label: "JavaScript", judge0Id: 63, monacoLanguage: "javascript" },
  { id: "go", label: "Go", judge0Id: 60, monacoLanguage: "go" },
  { id: "rust", label: "Rust", judge0Id: 73, monacoLanguage: "rust" },
] as const;

export const LANGUAGE_IDS: Record<string, number> = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
  go: 60,
  rust: 73,
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: "text-green-400 bg-green-500/10 border-green-500/20",
  MEDIUM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  HARD: "text-red-400 bg-red-500/10 border-red-500/20",
};

export const SUBJECTS_DATA = [
  { slug: "operating-systems", title: "Operating Systems", icon: "Cpu", color: "blue", order: 1 },
  { slug: "dbms", title: "Database Management", icon: "Database", color: "green", order: 2 },
  { slug: "computer-networks", title: "Computer Networks", icon: "Network", color: "purple", order: 3 },
  { slug: "compiler-design", title: "Compiler Design", icon: "Settings2", color: "orange", order: 4 },
  { slug: "data-structures", title: "Data Structures", icon: "GitBranch", color: "yellow", order: 5 },
  { slug: "system-design", title: "System Design", icon: "Layers", color: "red", order: 6 },
];

export const PROBLEM_CATEGORIES = [
  "Arrays", "Strings", "Linked List", "Stack", "Queue",
  "Trees", "Graphs", "Dynamic Programming", "Recursion",
  "Binary Search", "Sliding Window", "HashMap", "Heap",
  "Greedy", "Backtracking", "Trie", "Bit Manipulation",
];

export const COMPANY_TAGS = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple",
  "Netflix", "Uber", "LinkedIn", "Twitter", "Adobe",
  "Atlassian", "Goldman Sachs", "JPMorgan", "Flipkart",
];

export const JUDGE0_FALLBACK_ERROR = "Something went wrong with the code execution. Please try again.";
