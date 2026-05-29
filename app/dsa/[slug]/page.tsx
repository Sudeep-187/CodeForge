"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { CodeEditor } from "@/components/dsa/CodeEditor";
import { ProblemDescription } from "@/components/dsa/ProblemDescription";
import { TestCasePanel } from "@/components/dsa/TestCasePanel";
import { LanguageSelector } from "@/components/dsa/LanguageSelector";
import { Button } from "@/components/ui/button";
import type { ProblemFull } from "@/types";

export default function ProblemSolverPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();

  const [problem, setProblem] = useState<ProblemFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [verdict, setVerdict] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/problems/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProblem(data);
        const starter = data.starterCode?.[language] || "";
        setCode(starter);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    }
  }, [language, problem]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (error || !problem) {
    notFound();
    return null;
  }

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, stdin: "" }),
      });
      const data = await res.json();
      setOutput(data);
    } catch (err) {
      setOutput({ stdout: "", stderr: "Failed to run code. Check Judge0 connection.", time: "0", memory: "0" });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!session) {
      alert("Please login to submit.");
      return;
    }
    setSubmitting(true);
    setVerdict(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, problemId: problem.id }),
      });
      const data = await res.json();
      setVerdict(data);
    } catch (err) {
      setVerdict({ status: "ERROR", passed: 0, total: problem.testCases.length });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] pt-16 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-[#141414] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-medium text-[#e5e5e5]">{problem.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-2/5 border-r border-[#2a2a2a] overflow-y-auto max-h-[calc(100vh-8rem)]">
          <ProblemDescription problem={problem} />
        </div>
        <div className="lg:w-3/5 flex flex-col">
          <div className="flex-1 p-4">
            <CodeEditor
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
              height="100%"
            />
          </div>
          <TestCasePanel
            testCases={problem.testCases}
            output={output}
            verdict={verdict}
            onRun={handleRun}
            onSubmit={handleSubmit}
            running={running}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}
