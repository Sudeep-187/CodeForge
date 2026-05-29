"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, CheckCircle, Clock, Minus, ArrowLeft, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, DifficultyBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SHEETS_DATA: Record<string, { title: string; description: string; categories: { name: string; problems: { id: string; title: string; slug: string; difficulty: string; status: string }[] }[] }> = {
  "blind-75": {
    title: "Blind 75",
    description: "The most commonly asked LeetCode questions curated by a former Meta engineer. Covers all essential DSA patterns.",
    categories: [
      {
        name: "Array & Hashing",
        problems: [
          { id: "1", title: "Two Sum", slug: "two-sum", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "2", title: "Group Anagrams", slug: "group-anagrams", difficulty: "MEDIUM", status: "NOT_STARTED" },
          { id: "3", title: "Top K Frequent Elements", slug: "top-k-frequent-elements", difficulty: "MEDIUM", status: "COMPLETED" },
        ],
      },
      {
        name: "Two Pointers",
        problems: [
          { id: "4", title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "EASY", status: "COMPLETED" },
          { id: "5", title: "3Sum", slug: "3sum", difficulty: "MEDIUM", status: "IN_PROGRESS" },
        ],
      },
      {
        name: "Sliding Window",
        problems: [
          { id: "6", title: "Best Time to Buy & Sell Stock", slug: "best-time-to-buy-sell-stock", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "7", title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "MEDIUM", status: "NOT_STARTED" },
        ],
      },
      {
        name: "Trees",
        problems: [
          { id: "8", title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "9", title: "Invert Binary Tree", slug: "invert-binary-tree", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "10", title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", difficulty: "MEDIUM", status: "NOT_STARTED" },
        ],
      },
    ],
  },
  "sde-sheet": {
    title: "SDE Sheet",
    description: "Top SDE interview problems from Amazon, Google, Microsoft, and more. Complete preparation for software engineering roles.",
    categories: [
      {
        name: "Arrays",
        problems: [
          { id: "11", title: "Set Matrix Zeroes", slug: "set-matrix-zeroes", difficulty: "MEDIUM", status: "NOT_STARTED" },
          { id: "12", title: "Pascal's Triangle", slug: "pascals-triangle", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "13", title: "Next Permutation", slug: "next-permutation", difficulty: "MEDIUM", status: "NOT_STARTED" },
        ],
      },
      {
        name: "Linked List",
        problems: [
          { id: "14", title: "Reverse a Linked List", slug: "reverse-linked-list", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "15", title: "Detect Cycle in Linked List", slug: "linked-list-cycle", difficulty: "EASY", status: "NOT_STARTED" },
        ],
      },
      {
        name: "Dynamic Programming",
        problems: [
          { id: "16", title: "Longest Increasing Subsequence", slug: "longest-increasing-subsequence", difficulty: "MEDIUM", status: "NOT_STARTED" },
          { id: "17", title: "Edit Distance", slug: "edit-distance", difficulty: "HARD", status: "NOT_STARTED" },
        ],
      },
    ],
  },
  "love-babbar-450": {
    title: "Love Babbar 450",
    description: "450 questions covering all DSA topics. A comprehensive sheet for cracking product-based company interviews.",
    categories: [
      {
        name: "Arrays",
        problems: Array.from({ length: 36 }, (_, i) => ({
          id: `lb-arr-${i + 1}`,
          title: `Array Problem ${i + 1}`,
          slug: `array-problem-${i + 1}`,
          difficulty: i % 3 === 0 ? "EASY" : i % 3 === 1 ? "MEDIUM" : "HARD",
          status: "NOT_STARTED" as const,
        })),
      },
      {
        name: "Strings",
        problems: Array.from({ length: 43 }, (_, i) => ({
          id: `lb-str-${i + 1}`,
          title: `String Problem ${i + 1}`,
          slug: `string-problem-${i + 1}`,
          difficulty: i % 3 === 0 ? "EASY" : i % 3 === 1 ? "MEDIUM" : "HARD",
          status: "NOT_STARTED" as const,
        })),
      },
    ],
  },
  "top-interview-150": {
    title: "Top Interview 150",
    description: "Official LeetCode curated 150 questions. The most frequently asked interview problems across all companies.",
    categories: [
      {
        name: "Array / String",
        problems: [
          { id: "ti-1", title: "Merge Sorted Array", slug: "merge-sorted-array", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "ti-2", title: "Remove Element", slug: "remove-element", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "ti-3", title: "Remove Duplicates from Sorted Array", slug: "remove-duplicates-from-sorted-array", difficulty: "EASY", status: "NOT_STARTED" },
        ],
      },
      {
        name: "Two Pointers",
        problems: [
          { id: "ti-4", title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "EASY", status: "NOT_STARTED" },
          { id: "ti-5", title: "Container With Most Water", slug: "container-with-most-water", difficulty: "MEDIUM", status: "NOT_STARTED" },
        ],
      },
    ],
  },
};

export default function SheetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sheetSlug = params.sheetSlug as string;
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(SHEETS_DATA[sheetSlug]?.categories.map((c) => c.name) ?? []));

  const sheet = SHEETS_DATA[sheetSlug];

  if (!sheet) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#e5e5e5] mb-2">Sheet not found</h2>
          <p className="text-[#a1a1aa] mb-6">The sheet you are looking for does not exist.</p>
          <Button variant="primary" onClick={() => router.push("/dsa/sheets")}>
            Back to Sheets
          </Button>
        </div>
      </div>
    );
  }

  const allProblems = sheet.categories.flatMap((c) => c.problems);
  const total = allProblems.length;
  const solved = allProblems.filter((p) => p.status === "COMPLETED").length;
  const inProgress = allProblems.filter((p) => p.status === "IN_PROGRESS").length;
  const progress = total > 0 ? (solved / total) * 100 : 0;

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/dsa/sheets")}
          className="flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-[#e5e5e5] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sheets
        </button>

        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none" stroke="#f97316" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-[#e5e5e5]">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <h1 className="text-2xl sm:text-3xl font-bold text-[#e5e5e5] font-space-grotesk">{sheet.title}</h1>
              </div>
              <p className="text-[#a1a1aa] text-sm sm:text-base">{sheet.description}</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-medium">{solved}</span> Solved
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">{inProgress}</span> In Progress
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <Minus className="w-3.5 h-3.5 text-[#3a3a3a]" />
                  <span className="text-[#a1a1aa] font-medium">{total - solved - inProgress}</span> Pending
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sheet.categories.map((category, catIdx) => {
            const catSolved = category.problems.filter((p) => p.status === "COMPLETED").length;
            const isExpanded = expandedCategories.has(category.name);
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.05 }}
                className="bg-[#141414] rounded-xl border border-[#2a2a2a] overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#71717a]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#71717a]" />
                    )}
                    <span className="text-sm font-medium text-[#e5e5e5]">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {catSolved}/{category.problems.length}
                    </Badge>
                  </div>
                  <div className="w-24 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${(catSolved / category.problems.length) * 100}%` }}
                    />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#2a2a2a]">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-[#2a2a2a]">
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider w-12">#</th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider">Status</th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider">Title</th>
                              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider">Difficulty</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2a2a2a]">
                            {category.problems.map((problem, idx) => (
                              <motion.tr
                                key={problem.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                className="group hover:bg-[#1a1a1a] cursor-pointer transition-colors"
                                onClick={() => router.push(`/dsa/${problem.slug}`)}
                              >
                                <td className="px-4 sm:px-6 py-3 text-sm text-[#71717a]">{idx + 1}</td>
                                <td className="px-4 sm:px-6 py-3">
                                  {problem.status === "COMPLETED" ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : problem.status === "IN_PROGRESS" ? (
                                    <Clock className="w-4 h-4 text-yellow-400" />
                                  ) : (
                                    <Minus className="w-4 h-4 text-[#3a3a3a]" />
                                  )}
                                </td>
                                <td className="px-4 sm:px-6 py-3">
                                  <span className="text-sm text-[#e5e5e5] group-hover:text-orange-400 transition-colors">
                                    {problem.title}
                                  </span>
                                </td>
                                <td className="px-4 sm:px-6 py-3">
                                  <DifficultyBadge difficulty={problem.difficulty} />
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
