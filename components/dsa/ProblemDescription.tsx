"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DifficultyBadge, Badge } from "@/components/ui/badge";
import type { ProblemFull } from "@/types";

interface ProblemDescriptionProps {
  problem: ProblemFull;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const [tab, setTab] = useState<"description" | "editorial" | "submissions">("description");

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-semibold text-[#e5e5e5] font-space-grotesk">{problem.title}</h2>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{problem.category}</Badge>
          {problem.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
          {problem.companies.slice(0, 3).map((c) => (
            <Badge key={c} variant="info">{c}</Badge>
          ))}
        </div>
      </div>

      <div className="flex border-b border-[#2a2a2a]">
        {(["description", "editorial", "submissions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-[#a1a1aa] hover:text-[#e5e5e5]"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "description" && (
          <div className="prose prose-invert max-w-none prose-code:text-orange-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.description}
            </ReactMarkdown>
            <h3 className="text-lg font-semibold text-[#e5e5e5] mt-6 mb-2">Examples</h3>
            {problem.examples.map((ex: any, i: number) => (
              <div key={i} className="bg-[#141414] rounded-lg p-4 mb-4 border border-[#2a2a2a]">
                <p className="text-sm font-medium text-[#a1a1aa] mb-1">Input:</p>
                <pre className="bg-[#0c0c0c] p-3 rounded text-sm text-green-400 overflow-x-auto">{ex.input}</pre>
                <p className="text-sm font-medium text-[#a1a1aa] mt-3 mb-1">Output:</p>
                <pre className="bg-[#0c0c0c] p-3 rounded text-sm text-green-400 overflow-x-auto">{ex.output}</pre>
                {ex.explanation && (
                  <>
                    <p className="text-sm font-medium text-[#a1a1aa] mt-3 mb-1">Explanation:</p>
                    <p className="text-sm text-[#e5e5e5]">{ex.explanation}</p>
                  </>
                )}
              </div>
            ))}
            <h3 className="text-lg font-semibold text-[#e5e5e5] mt-6 mb-2">Constraints</h3>
            <div className="bg-[#141414] rounded-lg p-4 border border-[#2a2a2a]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.constraints}</ReactMarkdown>
            </div>
          </div>
        )}

        {tab === "editorial" && (
          <div className="prose prose-invert max-w-none">
            {problem.solution ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.solution}</ReactMarkdown>
            ) : (
              <p className="text-[#a1a1aa]">No editorial solution available yet.</p>
            )}
          </div>
        )}

        {tab === "submissions" && (
          <p className="text-[#a1a1aa]">Sign in to view your submissions.</p>
        )}
      </div>
    </div>
  );
}
