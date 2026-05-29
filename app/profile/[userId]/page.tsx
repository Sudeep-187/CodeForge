"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, CheckCircle, Clock, Trophy, Calendar, Code, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SubmissionResult } from "@/types";

interface ProfileData {
  userId: string;
  name: string;
  bio: string;
  avatar: string | null;
  problemsSolved: number;
  totalSubmissions: number;
  currentStreak: number;
  longestStreak: number;
  joinDate: string;
  recentSubmissions: SubmissionResult[];
}

const DEMO_PROFILE: ProfileData = {
  userId: "user-1",
  name: "Alex Chen",
  bio: "Full-stack developer passionate about DSA. Preparing for FAANG interviews. Love solving DP problems.",
  avatar: null,
  problemsSolved: 156,
  totalSubmissions: 423,
  currentStreak: 12,
  longestStreak: 45,
  joinDate: "2025-08-15",
  recentSubmissions: [
    { id: "1", status: "ACCEPTED", runtime: 12, memory: 42.5, language: "python", createdAt: "2026-05-28T10:30:00Z", problemTitle: "Two Sum", problemSlug: "two-sum" },
    { id: "2", status: "ACCEPTED", runtime: 8, memory: 38.2, language: "javascript", createdAt: "2026-05-28T09:15:00Z", problemTitle: "Valid Parentheses", problemSlug: "valid-parentheses" },
    { id: "3", status: "WRONG_ANSWER", runtime: null, memory: null, language: "cpp", createdAt: "2026-05-27T16:45:00Z", problemTitle: "3Sum", problemSlug: "3sum" },
    { id: "4", status: "ACCEPTED", runtime: 24, memory: 55.1, language: "java", createdAt: "2026-05-27T14:20:00Z", problemTitle: "LRU Cache", problemSlug: "lru-cache" },
    { id: "5", status: "TIME_LIMIT_EXCEEDED", runtime: null, memory: null, language: "python", createdAt: "2026-05-26T11:00:00Z", problemTitle: "Longest Palindromic Substring", problemSlug: "longest-palindromic-substring" },
  ],
};

function getStatusColor(status: string) {
  switch (status) {
    case "ACCEPTED": return "text-green-400";
    case "WRONG_ANSWER": return "text-red-400";
    case "TIME_LIMIT_EXCEEDED": return "text-yellow-400";
    case "COMPILE_ERROR": return "text-orange-400";
    default: return "text-[#71717a]";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "ACCEPTED": return "Accepted";
    case "WRONG_ANSWER": return "Wrong Answer";
    case "TIME_LIMIT_EXCEEDED": return "TLE";
    case "COMPILE_ERROR": return "Compile Error";
    default: return status;
  }
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile(DEMO_PROFILE);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] pt-20 pb-12 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
          <span className="text-[#a1a1aa]">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#e5e5e5] mb-2">User not found</h2>
          <p className="text-[#a1a1aa] mb-6">This user does not exist.</p>
          <Button variant="primary" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-[#e5e5e5] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {profile.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-[#e5e5e5] font-space-grotesk">{profile.name}</h1>
              <p className="text-[#a1a1aa] text-sm mt-1">{profile.bio}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {profile.joinDate}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#71717a]">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-orange-400 font-medium">{profile.currentStreak}</span> day streak
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Problems Solved", value: profile.problemsSolved, icon: CheckCircle, color: "text-green-400" },
            { label: "Total Submissions", value: profile.totalSubmissions, icon: Code, color: "text-blue-400" },
            { label: "Current Streak", value: `${profile.currentStreak}d`, icon: Flame, color: "text-orange-400" },
            { label: "Longest Streak", value: `${profile.longestStreak}d`, icon: Trophy, color: "text-yellow-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#e5e5e5]">{stat.value}</p>
                    <p className="text-xs text-[#71717a]">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#e5e5e5] mb-4 font-space-grotesk">Recent Submissions</h2>
          <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider">Problem</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#71717a] uppercase tracking-wider hidden sm:table-cell">Language</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#71717a] uppercase tracking-wider hidden md:table-cell">Runtime</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#71717a] uppercase tracking-wider hidden md:table-cell">Memory</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#71717a] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a2a]">
                {profile.recentSubmissions.map((sub, i) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-[#1a1a1a] cursor-pointer transition-colors"
                    onClick={() => sub.problemSlug && router.push(`/dsa/${sub.problemSlug}`)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#e5e5e5] group-hover:text-orange-400 transition-colors">
                        {sub.problemTitle}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {sub.status === "ACCEPTED" ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span className={`text-xs font-medium ${getStatusColor(sub.status)}`}>
                          {getStatusLabel(sub.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs uppercase">{sub.language}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className="text-sm text-[#a1a1aa] font-mono">
                        {sub.runtime !== null ? `${sub.runtime}ms` : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className="text-sm text-[#a1a1aa] font-mono">
                        {sub.memory !== null ? `${sub.memory}MB` : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-[#71717a]">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
