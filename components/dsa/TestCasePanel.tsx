"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface TestCasePanelProps {
  testCases: { input: string; output: string; isHidden: boolean }[];
  output: { stdout: string; stderr: string; time: string; memory: string } | null;
  verdict: { status: string; passed: number; total: number; runtime?: number; memory?: number } | null;
  onRun: () => void;
  onSubmit: () => void;
  running: boolean;
  submitting: boolean;
}

export function TestCasePanel({ testCases, output, verdict, onRun, onSubmit, running, submitting }: TestCasePanelProps) {
  const [tab, setTab] = useState<"testcases" | "output" | "verdict">("testcases");
  const visible = testCases.filter((tc) => !tc.isHidden);

  return (
    <div className="bg-[#141414] border-t border-[#2a2a2a]">
      <div className="flex items-center justify-between px-4 border-b border-[#2a2a2a]">
        <div className="flex">
          {(["testcases", "output", "verdict"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-[#a1a1aa] hover:text-[#e5e5e5]"
              }`}
            >
              {t === "testcases" ? "Test Cases" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm" onClick={onRun} loading={running}>
            Run Code
          </Button>
          <Button variant="default" size="sm" onClick={onSubmit} loading={submitting}>
            Submit
          </Button>
        </div>
      </div>

      <div className="p-4 h-[180px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === "testcases" && (
            <motion.div key="testcases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {visible.map((tc, i) => (
                <div key={i} className="mb-3 bg-[#0c0c0c] rounded-lg p-3 border border-[#2a2a2a]">
                  <p className="text-xs font-medium text-[#a1a1aa] mb-1">Case {i + 1}:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-[#71717a] mb-1">Input:</p>
                      <pre className="text-xs text-green-400 bg-black/30 p-2 rounded">{tc.input}</pre>
                    </div>
                    <div>
                      <p className="text-xs text-[#71717a] mb-1">Expected Output:</p>
                      <pre className="text-xs text-yellow-400 bg-black/30 p-2 rounded">{tc.output}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {tab === "output" && (
            <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {output ? (
                <>
                  {output.stdout && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-[#a1a1aa] mb-1">Stdout:</p>
                      <pre className="bg-[#0c0c0c] p-3 rounded text-sm text-green-400 border border-[#2a2a2a] overflow-x-auto">{output.stdout}</pre>
                    </div>
                  )}
                  {output.stderr && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-[#a1a1aa] mb-1">Stderr:</p>
                      <pre className="bg-[#0c0c0c] p-3 rounded text-sm text-red-400 border border-[#2a2a2a] overflow-x-auto">{output.stderr}</pre>
                    </div>
                  )}
                  <div className="flex gap-4 text-xs text-[#71717a]">
                    <span>Time: {output.time || "N/A"}s</span>
                    <span>Memory: {output.memory || "N/A"} KB</span>
                  </div>
                </>
              ) : (
                <p className="text-[#71717a] text-sm">Run your code to see output here.</p>
              )}
            </motion.div>
          )}

          {tab === "verdict" && (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {verdict ? (
                <div className={`p-4 rounded-lg border ${
                  verdict.status === "ACCEPTED"
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {verdict.status === "ACCEPTED" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-semibold ${
                      verdict.status === "ACCEPTED" ? "text-green-400" : "text-red-400"
                    }`}>
                      {verdict.status === "ACCEPTED" ? "Accepted" : verdict.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#a1a1aa]">
                    Passed {verdict.passed} / {verdict.total} test cases
                  </p>
                  {verdict.runtime !== undefined && (
                    <p className="text-xs text-[#71717a] mt-1">Runtime: {verdict.runtime} ms</p>
                  )}
                </div>
              ) : (
                <p className="text-[#71717a] text-sm">Submit your solution to see the verdict.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
