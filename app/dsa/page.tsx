"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, CheckCircle, Clock, Minus, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { DifficultyBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProblemListItem } from "@/types";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];
const CATEGORIES = ["Arrays", "Strings", "Linked List", "Stack", "Queue", "Trees", "Graphs", "Dynamic Programming", "Recursion", "Binary Search", "Sliding Window", "HashMap", "Heap", "Greedy", "Backtracking"];

export default function DSAPage() {
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 50;

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (difficulty.length === 1) params.set("difficulty", difficulty[0]);
    if (category) params.set("category", category);
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    try {
      const res = await fetch(`/api/problems?${params}`);
      const data = await res.json();
      setProblems(data.problems);
      setTotal(data.total);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, category, page]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#0c0c0c] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#e5e5e5] font-space-grotesk">DSA Problems</h1>
            <p className="text-[#a1a1aa] mt-1">{total} problems to solve</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className={cn("mb-6 space-y-4", showFilters ? "block" : "hidden")}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-[#141414] text-[#e5e5e5] text-sm border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(difficulty.includes(d) ? [] : [d])}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    difficulty.includes(d)
                      ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                      : "bg-[#141414] text-[#a1a1aa] border-[#2a2a2a] hover:border-[#3a3a3a]"
                  )}
                >
                  {d === "EASY" ? "Easy" : d === "MEDIUM" ? "Medium" : "Hard"}
                </button>
              ))}
            </div>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-3 py-1.5 rounded-lg border bg-[#141414] text-[#e5e5e5] text-xs border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider w-12">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider hidden lg:table-cell">Companies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-[#1a1a1a] rounded animate-pulse" style={{ width: j === 2 ? "60%" : j === 5 ? "40%" : "80%" }} /></td>
                    ))}
                  </tr>
                ))
              ) : problems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#71717a]">No problems found. Try adjusting your filters.</td>
                </tr>
              ) : (
                problems.map((problem, idx) => (
                  <motion.tr
                    key={problem.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-[#1a1a1a] cursor-pointer transition-colors"
                    onClick={() => window.location.href = `/dsa/${problem.slug}`}
                  >
                    <td className="px-4 py-4 text-sm text-[#71717a]">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-4">
                      {problem.userStatus === "COMPLETED" ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : problem.userStatus === "IN_PROGRESS" ? (
                        <Clock className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <Minus className="w-4 h-4 text-[#3a3a3a]" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-[#e5e5e5] group-hover:text-orange-400 transition-colors">{problem.title}</span>
                    </td>
                    <td className="px-4 py-4">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <Badge variant="outline">{problem.category}</Badge>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {problem.companies.slice(0, 2).map((c) => (
                          <Badge key={c} variant="default">{c}</Badge>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (p > totalPages) return null;
              return (
                <Button
                  key={p}
                  variant={p === page ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
