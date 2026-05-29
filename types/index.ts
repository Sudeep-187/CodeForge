import type { Role, Difficulty, SubmissionStatus, ProgressType, ProgressStatus } from "@prisma/client";

export type Language = "cpp" | "java" | "python" | "javascript" | "go" | "rust";

export interface ProblemListItem {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  companies: string[];
  order: number;
  userStatus?: ProgressStatus;
}

export interface ProblemFull {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  companies: string[];
  hints: string[];
  solution: string | null;
  constraints: string;
  examples: Example[];
  starterCode: Record<string, string>;
  testCases: TestCaseVisible[];
  order: number;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCaseVisible {
  id: string;
  input: string;
  output: string;
  isHidden: boolean;
}

export interface SubmissionResult {
  id: string;
  status: SubmissionStatus;
  runtime: number | null;
  memory: number | null;
  language: string;
  createdAt: string;
  problemTitle?: string;
  problemSlug?: string;
}

export interface SubjectData {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  topicCount?: number;
  completedTopics?: number;
}

export interface TheoryTopicData {
  id: string;
  slug: string;
  title: string;
  content: string;
  order: number;
  quizzes: QuizData[];
  completed?: boolean;
}

export interface QuizData {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string | null;
}

export interface DashboardStats {
  problemsSolved: number;
  currentStreak: number;
  subjectsCompleted: number;
  totalSubmissions: number;
}

export interface ProgressData {
  id: string;
  userId: string;
  problemId: string | null;
  topicId: string | null;
  type: ProgressType;
  status: ProgressStatus;
}
