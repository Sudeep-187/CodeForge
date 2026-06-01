import { LANGUAGE_IDS, JUDGE0_FALLBACK_ERROR } from "./constants";

const RAPIDAPI_URL = process.env.JUDGE0_API_URL || "";
const RAPIDAPI_KEY = process.env.JUDGE0_API_KEY || "";
const PUBLIC_JUDGE0_URL = "https://ce.judge0.com";

interface Judge0Status {
  id: number;
  description: string;
}

export interface Judge0Result {
  stdout: string;
  stderr: string;
  time: string;
  memory: string;
  status: Judge0Status;
  compile_output?: string;
  message?: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface TestResult {
  passed: boolean;
  output: string;
  expected: string;
  status: string;
  time?: string;
  memory?: string;
}

async function callJudge0(code: string, languageId: number, stdin: string): Promise<Judge0Result> {
  const useRapidAPI = !RAPIDAPI_URL.includes("ce.judge0.com") && !!RAPIDAPI_KEY;
  const baseUrl = useRapidAPI ? RAPIDAPI_URL : PUBLIC_JUDGE0_URL;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (useRapidAPI) {
    headers["X-RapidAPI-Key"] = RAPIDAPI_KEY;
    headers["X-RapidAPI-Host"] = new URL(RAPIDAPI_URL).hostname;
  }

  const response = await fetch(`${baseUrl}/submissions?wait=true`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin: stdin || "",
      cpu_time_limit: 5,
      memory_limit: 256000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Judge0 API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function submitCode(
  code: string,
  language: string,
  stdin: string = ""
): Promise<Judge0Result> {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) {
    throw new Error(`Unsupported language: ${language}`);
  }
  return callJudge0(code, languageId, stdin);
}

export async function runAgainstTestCases(
  code: string,
  language: string,
  testCases: TestCase[]
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for (const tc of testCases) {
    try {
      const result = await submitCode(code, language, tc.input);
      const output = (result.stdout || "").trim();
      const expected = tc.output.trim();
      const passed = output === expected;

      results.push({
        passed,
        output,
        expected,
        status: getStatusDescription(result.status.id),
        time: result.time,
        memory: result.memory,
      });
    } catch {
      results.push({
        passed: false,
        output: JUDGE0_FALLBACK_ERROR,
        expected: tc.output.trim(),
        status: "ERROR",
        time: "0",
        memory: "0",
      });
    }
  }

  return results;
}

function getStatusDescription(id: number): string {
  const statuses: Record<number, string> = {
    1: "In Queue",
    2: "Processing",
    3: "Accepted",
    4: "Wrong Answer",
    5: "Time Limit Exceeded",
    6: "Compilation Error",
    7: "Runtime Error (SIGSEGV)",
    8: "Runtime Error (SIGXFSZ)",
    9: "Runtime Error (SIGFPE)",
    10: "Runtime Error (SIGABRT)",
    11: "Runtime Error (NZEC)",
    12: "Runtime Error (Other)",
    13: "Internal Error",
    14: "Exec Format Error",
  };
  return statuses[id] || "Unknown";
}
