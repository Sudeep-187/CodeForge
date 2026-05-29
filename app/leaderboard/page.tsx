"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ChevronLeft, ChevronRight, Medal, Flame, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Period = "all" | "week" | "month";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  problemsSolved: number;
  streak: number;
  joinDate: string;
  isCurrentUser?: boolean;
}

const generateMockData = (period: Period, currentUserId?: string): LeaderboardEntry[] => {
  const names = [
    "Alex Chen", "Sarah Johnson", "Raj Patel", "Emily Williams", "David Kim",
    "Priya Sharma", "James Wilson", "Lisa Anderson", "Michael Brown", "Sophie Taylor",
    "Kevin Lee", "Anna Martinez", "Ryan Park", "Emma Davis", "Chris Miller",
  ];

  const baseSolved = period === "all" ? 500 : period === "month" ? 120 : 35;

  return names.map((name, i) => ({
    rank: i + 1,
    userId: `user-${i + 1}`,
    name,
    avatar: null,
    problemsSolved: Math.max(1, baseSolved - i * (period === "all" ? 32 : period === "month" ? 8 : 2) + Math.floor(Math.random() * 5)),
    streak: Math.max(0, Math.floor(Math.random() * 60)),
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isCurrentUser: currentUserId === `user-${i + 1}`,
  }));
};

const TOP_THREE_COLORS = [
  { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", icon: "text-yellow-500" },
  { bg: "bg-gray-300/10", border: "border-gray-300/30", text: "text-gray-300", icon: "text-gray-400" },
  { bg: "bg-amber-700/10", border: "border-amber-700/30", text: "text-amber-600", icon: "text-amber-600" },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const allData = generateMockData(period);
  const totalPages = Math.ceil(allData.length / perPage);
  const paginatedData = allData.slice((page - 1) * perPage, page * perPage);

  const tabs: { key: Period; label: string }[] = [
    { key: "all", label: "All Time" },
    { key: "month", label: "This Month" },
    { key: "week", label: "This Week" },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0c] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#e5e5e5] font-space-grotesk">Leaderboard</h1>
            <p className="text-[#a1a1aa] mt-1">Top performers in the CodeForge community</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#141414] rounded-lg border border-[#2a2a2a] p-1 mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setPeriod(tab.key); setPage(1); }}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                period === tab.key
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                  : "text-[#a1a1aa] hover:text-[#e5e5e5]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-[#71717a] uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">User</div>
            <div className="col-span-2 text-right">Solved</div>
            <div className="col-span-2 text-right">Streak</div>
            <div className="col-span-3 text-right">Joined</div>
          </div>

          {paginatedData.map((entry, idx) => {
            const isTop3 = entry.rank <= 3;
            const topStyle = isTop3 ? TOP_THREE_COLORS[entry.rank - 1] : null;
            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={cn(
                  "grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg border transition-all",
                  entry.isCurrentUser
                    ? "bg-orange-500/5 border-orange-500/20"
                    : isTop3
                      ? `${topStyle?.bg} ${topStyle?.border}`
                      : "bg-[#141414] border-[#2a2a2a] hover:border-[#3a3a3a]"
                )}
              >
                <div className="col-span-1 flex items-center">
                  {isTop3 ? (
                    <Medal className={cn("w-5 h-5", topStyle?.icon)} />
                  ) : (
                    <span className="text-sm text-[#71717a] font-mono">#{entry.rank}</span>
                  )}
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-xs font-bold text-white">
                    {entry.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-[#e5e5e5]">{entry.name}</span>
                    {entry.isCurrentUser && (
                      <Badge variant="warning" className="ml-2 text-[10px]">You</Badge>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm font-mono text-[#e5e5e5]">{entry.problemsSolved}</span>
                </div>
                <div className="col-span-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-sm font-mono text-[#e5e5e5]">{entry.streak}</span>
                  </div>
                </div>
                <div className="col-span-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#71717a]" />
                    <span className="text-xs text-[#71717a]">{entry.joinDate}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i + 1}
                variant={i + 1 === page ? "primary" : "ghost"}
                size="sm"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
