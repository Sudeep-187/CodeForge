"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame, Play, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { LANGUAGES, JUDGE0_FALLBACK_ERROR } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CodeEditor } from "@/components/dsa/CodeEditor";

interface RunResult {
  stdout: string;
  stderr: string;
  time: string;
  memory: string;
  status: { id: number; description: string };
}

const LANGUAGE_VERSIONS: Record<string, string> = {
  cpp: "C++17 (GCC 9.2.0)",
  java: "Java (OpenJDK 13.0.1)",
  python: "Python (3.8.1)",
  javascript: "Node.js (12.14.0)",
  go: "Go (1.13.5)",
  rust: "Rust (1.40.0)",
};

const DEFAULT_CODE: Record<string, string> = {
  cpp: '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, CodeForge!" << endl;\n  return 0;\n}',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, CodeForge!");\n  }\n}',
  python: 'print("Hello, CodeForge!")',
  javascript: 'console.log("Hello, CodeForge!");',
  go: 'package main\nimport "fmt"\nfunc main() {\n  fmt.Println("Hello, CodeForge!")\n}',
  rust: 'fn main() {\n  println!("Hello, CodeForge!");\n}',
};

export default function Playground() {
  const [language, setLanguage] = useState<string>("python");
  const [code, setCode] = useState<string>(DEFAULT_CODE["python"]);
  const [stdin, setStdin] = useState<string>("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  useEffect(() => {
    setCode(DEFAULT_CODE[language] || "");
    setResult(null);
    setExecutionTime(null);
  }, [language]);

  const handleRun = useCallback(async () => {
    setLoading(true);
    setResult(null);
    setExecutionTime(null);
    const start = performance.now();
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        stdout: "",
        stderr: JUDGE0_FALLBACK_ERROR,
        time: "0",
        memory: "0",
        status: { id: 0, description: "Error" },
      });
    } finally {
      setExecutionTime(performance.now() - start);
      setLoading(false);
    }
  }, [code, language, stdin]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const handleClear = () => {
    setCode("");
    setStdin("");
    setResult(null);
    setExecutionTime(null);
  };

  const statusColor = (id: number) => {
    if (id === 3) return "text-green-400";
    if (id >= 4 && id <= 12) return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="h-screen w-full bg-[#0c0c0c] flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a2a] bg-[#0c0c0c] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold text-[#e5e5e5]">CodeForge</span>
          </div>
          <div className="w-px h-5 bg-[#2a2a2a]" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 rounded-md border bg-[#141414] text-[#e5e5e5] text-xs border-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-orange-500/50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="ml-1.5 text-xs">Clear</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span className="ml-1.5 text-xs">{loading ? "Running..." : "Run"}</span>
          </Button>
          <span className="text-[#71717a] text-[10px] hidden sm:inline">Ctrl+Enter</span>
        </div>
      </div>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor */}
        <div className="w-[65%] border-r border-[#2a2a2a] flex flex-col">
          <div className="flex-1">
            <CodeEditor
              language={language}
              value={code}
              onChange={(v) => setCode(v ?? "")}
              height="100%"
            />
          </div>
        </div>

        {/* Right: Input/Output */}
        <div className="w-[35%] flex flex-col bg-[#0c0c0c]">
          {/* Input section */}
          <div className="border-b border-[#2a2a2a]">
            <div className="px-3 py-1.5 text-[10px] font-medium text-[#71717a] uppercase tracking-wider bg-[#141414]">
              Input (stdin)
            </div>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter input here..."
              className="w-full resize-none bg-transparent text-[#e5e5e5] p-3 font-mono text-sm outline-none placeholder:text-[#4a4a4a]"
              rows={5}
              spellCheck={false}
            />
          </div>

          {/* Output section */}
          <div className="flex-1 flex flex-col">
            <div className="px-3 py-1.5 text-[10px] font-medium text-[#71717a] uppercase tracking-wider bg-[#141414] border-b border-[#2a2a2a] flex items-center justify-between">
              <span>Output</span>
              {result && executionTime !== null && (
                <span className="text-[10px] text-[#71717a] font-mono">
                  {(executionTime).toFixed(0)}ms
                </span>
              )}
            </div>
            <div className="flex-1 overflow-auto p-3 font-mono text-sm">
              {loading ? (
                <div className="flex items-center gap-2 text-[#71717a]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing...</span>
                </div>
              ) : result ? (
                <div className="space-y-2">
                  {result.stderr ? (
                    <pre className="text-red-400 whitespace-pre-wrap break-all m-0">{result.stderr}</pre>
                  ) : null}
                  {result.stdout ? (
                    <pre className="text-[#e5e5e5] whitespace-pre-wrap break-all m-0">{result.stdout}</pre>
                  ) : null}
                  {!result.stdout && !result.stderr ? (
                    <span className="text-[#4a4a4a]">(no output)</span>
                  ) : null}
                </div>
              ) : (
                <span className="text-[#4a4a4a]">Run your code to see output</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-[#2a2a2a] bg-[#0c0c0c] shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-[#71717a]">
          <span>{LANGUAGE_VERSIONS[language] || language}</span>
          {result && (
            <>
              <span className="text-[#2a2a2a]">|</span>
              <span>
                Status:{" "}
                <span className={cn("font-medium", statusColor(result.status.id))}>
                  {result.status.description}
                </span>
              </span>
              {result.time !== "0" && (
                <>
                  <span className="text-[#2a2a2a]">|</span>
                  <span>Time: {parseFloat(result.time).toFixed(3)}s</span>
                </>
              )}
              {result.memory !== "0" && (
                <>
                  <span className="text-[#2a2a2a]">|</span>
                  <span>Memory: {result.memory} KB</span>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
