"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Flame, BookOpen, Code2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  stats: {
    problemsSolved: number;
    currentStreak: number;
    subjectsCompleted: number;
    totalSubmissions: number;
  };
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  trend: number;
  color: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

function StatCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 transition-all hover:border-orange-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 text-xs font-medium">
          {trend >= 0 ? (
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          )}
          <span className={trend >= 0 ? "text-green-400" : "text-red-400"}>
            {Math.abs(trend)}%
          </span>
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">
        <AnimatedNumber value={value} />
      </div>
      <div className="text-sm text-[#a1a1aa]">{label}</div>
    </div>
  );
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards: StatCardProps[] = [
    {
      icon: CheckCircle,
      label: "Problems Solved",
      value: stats.problemsSolved,
      trend: 12,
      color: "bg-green-500/10 text-green-400",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: stats.currentStreak,
      trend: 8,
      color: "bg-orange-500/10 text-orange-400",
    },
    {
      icon: BookOpen,
      label: "Subjects Completed",
      value: stats.subjectsCompleted,
      trend: 0,
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      icon: Code2,
      label: "Total Submissions",
      value: stats.totalSubmissions,
      trend: -5,
      color: "bg-purple-500/10 text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
