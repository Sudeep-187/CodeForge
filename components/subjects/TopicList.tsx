"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface TopicItem {
  slug: string;
  title: string;
  order: number;
}

interface TopicListProps {
  subjectSlug: string;
  topics: TopicItem[];
  currentTopicSlug?: string;
  completedTopics?: string[];
}

export function TopicList({
  subjectSlug,
  topics,
  currentTopicSlug,
  completedTopics = [],
}: TopicListProps) {
  return (
    <aside className="w-72 shrink-0 border-r border-[#2a2a2a] bg-[#0c0c0c]">
      <div className="p-4 border-b border-[#2a2a2a]">
        <h3 className="text-sm font-semibold text-[#e5e5e5] uppercase tracking-wider">
          Topics
        </h3>
        <p className="text-xs text-[#a1a1aa] mt-0.5">
          {completedTopics.length}/{topics.length} completed
        </p>
      </div>
      <nav className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 12rem)" }}>
        {topics.map((topic) => {
          const isActive = topic.slug === currentTopicSlug;
          const isCompleted = completedTopics.includes(topic.slug);
          return (
            <Link
              key={topic.slug}
              href={`/subjects/${subjectSlug}/${topic.slug}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm border-l-2 transition-colors",
                isActive
                  ? "border-orange-500 bg-orange-500/5 text-[#e5e5e5]"
                  : "border-transparent text-[#a1a1aa] hover:text-[#e5e5e5] hover:bg-[#141414]"
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-[#2a2a2a] shrink-0" />
              )}
              <span className="truncate">{topic.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
