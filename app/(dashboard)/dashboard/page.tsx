"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Code2,
  BookOpen,
  ListOrdered,
  User,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { SubjectProgress } from "@/components/dashboard/SubjectProgress";
import { StreakCalendar } from "@/components/dashboard/StreakCalendar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import type { DashboardStats } from "@/types";

const SIDEBAR_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, section: "overview" },
  { label: "DSA Progress", icon: Code2, section: "dsa" },
  { label: "Subject Progress", icon: BookOpen, section: "subjects" },
  { label: "Submissions", icon: ListOrdered, section: "submissions" },
  { label: "Profile", icon: User, section: "profile" },
];

function generateMockChartData() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayLabel = `${days[date.getDay()]} ${date.getDate()}`;
    return {
      day: dayLabel,
      count: Math.floor(Math.random() * 8) + 1,
    };
  });
}

function generateMockSubjects() {
  return [
    { name: "Operating Systems", completed: 8, total: 12 },
    { name: "Database Management", completed: 10, total: 10 },
    { name: "Computer Networks", completed: 5, total: 10 },
    { name: "Compiler Design", completed: 3, total: 8 },
    { name: "Data Structures", completed: 15, total: 20 },
    { name: "System Design", completed: 2, total: 6 },
  ];
}

function generateMockCalendarData() {
  const data: { date: string; count: number }[] = [];
  for (let i = 89; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.random() > 0.5 ? Math.floor(Math.random() * 12) : 0,
    });
  }
  return data;
}

function generateMockSubmissions() {
  const statuses = ["ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED", "RUNTIME_ERROR", "COMPILATION_ERROR"];
  const languages = ["cpp", "java", "python", "javascript", "go", "rust"];
  const problems = [
    { title: "Two Sum", slug: "two-sum" },
    { title: "Valid Parentheses", slug: "valid-parentheses" },
    { title: "Merge Sort", slug: "merge-sort" },
    { title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal" },
    { title: "LRU Cache", slug: "lru-cache" },
    { title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters" },
  ];
  return Array.from({ length: 10 }, (_, i) => {
    const problem = problems[i % problems.length];
    const hoursAgo = i * 3 + Math.floor(Math.random() * 3);
    const date = new Date();
    date.setHours(date.getHours() - hoursAgo);
    return {
      id: `mock-sub-${i}`,
      problemTitle: problem.title,
      problemSlug: problem.slug,
      status: statuses[i % statuses.length],
      language: languages[i % languages.length],
      createdAt: date.toISOString(),
    };
  });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    problemsSolved: 47,
    currentStreak: 12,
    subjectsCompleted: 2,
    totalSubmissions: 156,
  });
  const [chartData] = useState(generateMockChartData);
  const [subjects] = useState(generateMockSubjects);
  const [calendarData] = useState(generateMockCalendarData);
  const [submissions] = useState(generateMockSubmissions);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/streak");
        const streakData = await res.json();
        if (res.ok) {
          setStats((prev) => ({ ...prev, currentStreak: streakData.current }));
        }
      } catch {
        // fallback to mock data
      }
    }
    fetchStats();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const sectionComponents: Record<string, React.ReactNode> = {
    overview: (
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        <ProgressChart data={chartData} />
        <SubjectProgress subjects={subjects} />
        <StreakCalendar data={calendarData} />
        <RecentActivity submissions={submissions} />
      </div>
    ),
    dsa: (
      <div className="space-y-6">
        <StatsGrid stats={stats} />
        <ProgressChart data={chartData} />
        <SubjectProgress subjects={subjects} />
      </div>
    ),
    subjects: (
      <div className="space-y-6">
        <SubjectProgress subjects={subjects} />
      </div>
    ),
    submissions: (
      <div className="space-y-6">
        <RecentActivity submissions={submissions} />
      </div>
    ),
    profile: (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
        <h3 className="text-white font-semibold mb-2">Profile</h3>
        <p className="text-[#71717a] text-sm">
          Welcome, {session.user?.name || session.user?.email || "User"}
        </p>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      <div className="flex">
        <aside
          className={cn(
            "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0c0c0c] border-r border-[#2a2a2a] p-6 transition-transform duration-200 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
              CF
            </div>
            <span className="text-white font-semibold text-lg">CodeForge</span>
          </div>
          <nav className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.section}
                onClick={() => {
                  setActiveSection(item.section);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeSection === item.section
                    ? "bg-orange-500/10 text-orange-400"
                    : "text-[#71717a] hover:text-[#e5e5e5] hover:bg-[#141414]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-30 lg:hidden",
            sidebarOpen ? "block" : "hidden"
          )}
          onClick={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-h-screen">
          <div className="sticky top-0 z-20 bg-[#0c0c0c]/80 backdrop-blur-sm border-b border-[#2a2a2a] px-6 py-4 flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-[#a1a1aa] hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-white font-semibold">Dashboard</span>
          </div>
          <div className="p-6">{sectionComponents[activeSection]}</div>
        </main>
      </div>
    </div>
  );
}
