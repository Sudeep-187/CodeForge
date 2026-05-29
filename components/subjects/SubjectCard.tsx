"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SubjectData } from "@/types";

interface SubjectCardProps {
  subject: SubjectData;
}

const colorMap: Record<string, string> = {
  blue: "#3b82f6",
  green: "#10b981",
  purple: "#8b5cf6",
  orange: "#f97316",
  yellow: "#eab308",
  red: "#ef4444",
};

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = Icons[subject.icon as keyof typeof Icons] as React.ElementType;
  const color = colorMap[subject.color] || subject.color;
  const topicCount = subject.topicCount ?? 0;
  const completed = subject.completedTopics ?? 0;
  const progress = topicCount > 0 ? Math.round((completed / topicCount) * 100) : 0;

  return (
    <Link href={`/subjects/${subject.slug}`}>
      <Card hover className="h-full group cursor-pointer">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          style={{ backgroundColor: `${color}15` }}
        >
          {Icon && <Icon className="w-5 h-5" style={{ color }} />}
        </div>
        <h3 className="text-lg font-semibold text-[#e5e5e5] mb-1">
          {subject.title}
        </h3>
        <p className="text-sm text-[#a1a1aa] mb-4 leading-relaxed line-clamp-2">
          {subject.description}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#a1a1aa]">
            <span>{completed}/{topicCount} topics</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-orange-500 group-hover:gap-2 transition-all">
          Start Learning <Icons.ArrowRight className="w-3.5 h-3.5" />
        </div>
      </Card>
    </Link>
  );
}
