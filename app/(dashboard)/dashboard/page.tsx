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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    problemsSolved: 0,
    currentStreak: 0,
    subjectsCompleted: 0,
    totalSubmissions: 0,
  });
  const [chartData, setChartData] = useState<{ day: string; count: number }[]>([]);
  const [subjects, setSubjects] = useState<{ name: string; completed: number; total: number }[]>([]);
  const [calendarData, setCalendarData] = useState<{ date: string; count: number }[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setChartData(data.chartData);
          setSubjects(data.subjectProgress);
          setCalendarData(data.calendarData);
          setSubmissions(data.submissions);
        }
      } catch {
        // silently fail - keep zeros
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[#71717a] text-sm">Loading your dashboard...</span>
        </div>
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
