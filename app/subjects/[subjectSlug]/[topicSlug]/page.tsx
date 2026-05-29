"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TopicList } from "@/components/subjects/TopicList";
import { TheoryContent } from "@/components/subjects/TheoryContent";
import { QuizSection } from "@/components/subjects/QuizSection";
import { ChevronRight, ChevronLeft, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import type { QuizData } from "@/types";

interface TopicDetail {
  id: string;
  slug: string;
  title: string;
  content: string;
  order: number;
  completed?: boolean;
  quizzes: QuizData[];
}

interface SubjectDetail {
  id: string;
  slug: string;
  title: string;
  icon: string;
  color: string;
  topics: TopicDetail[];
}

interface TopicPageProps {
  params: Promise<{ subjectSlug: string; topicSlug: string }>;
}

export default function TopicPage({ params }: TopicPageProps) {
  const { subjectSlug, topicSlug } = use(params);
  const router = useRouter();
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/subjects/${subjectSlug}`);
        if (!res.ok) return;
        const data: SubjectDetail = await res.json();
        setSubject(data);
        const found = data.topics.find((t) => t.slug === topicSlug);
        if (found) setTopic(found);
        const completed = data.topics
          .filter((t) => t.completed)
          .map((t) => t.slug);
        setCompletedTopics(completed);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [subjectSlug, topicSlug]);

  const handleMarkComplete = async () => {
    setMarkingComplete(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: topic?.id,
          type: "TOPIC",
          status: "COMPLETED",
        }),
      });
      if (res.ok) {
        setCompletedTopics((prev) =>
          prev.includes(topicSlug) ? prev : [...prev, topicSlug]
        );
        setTopic((prev) => (prev ? { ...prev, completed: true } : prev));
      }
    } catch {
      // ignore
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!subject || !topic) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#e5e5e5] mb-2">Topic not found</h1>
          <Link
            href={`/subjects/${subjectSlug}`}
            className="text-orange-500 hover:underline"
          >
            Back to {subject?.title || "subject"}
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = subject.topics.findIndex((t) => t.slug === topicSlug);
  const prevTopic = currentIndex > 0 ? subject.topics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex < subject.topics.length - 1
      ? subject.topics[currentIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <div className="flex">
        <TopicList
          subjectSlug={subjectSlug}
          topics={subject.topics}
          currentTopicSlug={topicSlug}
          completedTopics={completedTopics}
        />

        <div className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-8 py-8">
            <nav className="flex items-center gap-2 text-sm text-[#a1a1aa] mb-6">
              <Link
                href="/subjects"
                className="hover:text-orange-500 transition-colors"
              >
                Subjects
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/subjects/${subjectSlug}`}
                className="hover:text-orange-500 transition-colors"
              >
                {subject.title}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#e5e5e5]">{topic.title}</span>
            </nav>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#e5e5e5] mb-2">
                  {topic.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-[#a1a1aa]">
                  <span>{subject.topics.length} topics</span>
                  {topic.completed && (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              {!topic.completed && (
                <Button
                  variant="primary"
                  onClick={handleMarkComplete}
                  loading={markingComplete}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              )}
            </div>

            <TheoryContent content={topic.content} />

            {topic.quizzes.length > 0 && (
              <div className="mt-12 mb-8">
                <hr className="border-[#2a2a2a] mb-8" />
                <QuizSection quizzes={topic.quizzes} />
              </div>
            )}

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#2a2a2a]">
              {prevTopic ? (
                <Link href={`/subjects/${subjectSlug}/${prevTopic.slug}`}>
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {prevTopic.title}
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              {nextTopic ? (
                <Link href={`/subjects/${subjectSlug}/${nextTopic.slug}`}>
                  <Button variant="primary">
                    {nextTopic.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
