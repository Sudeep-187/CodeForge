import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopicList } from "@/components/subjects/TopicList";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

interface TopicData {
  id: string;
  slug: string;
  title: string;
  order: number;
  _count: { quizzes: number };
}

interface SubjectDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: TopicData[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getSubject(slug: string): Promise<SubjectDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/subjects/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function estimatedReadTime(topicCount: number) {
  return `${Math.max(5, topicCount * 3)} min`;
}

export default async function SubjectPage({
  params,
}: {
  params: { subjectSlug: string };
}) {
  const subject = await getSubject(params.subjectSlug);

  if (!subject) {
    return (
      <main className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#e5e5e5] mb-2">Subject not found</h1>
          <Link href="/subjects" className="text-orange-500 hover:underline">
            Back to subjects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <div className="flex">
        <TopicList
          subjectSlug={subject.slug}
          topics={subject.topics}
          completedTopics={[]}
        />

        <div className="flex-1 p-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-[#a1a1aa] mb-2">
              <Link href="/subjects" className="hover:text-orange-500 transition-colors">
                Subjects
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#e5e5e5]">{subject.title}</span>
            </div>
            <h1 className="text-3xl font-bold text-[#e5e5e5] mb-2">
              {subject.title}
            </h1>
            <p className="text-[#a1a1aa] max-w-2xl">{subject.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subject.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/subjects/${subject.slug}/${topic.slug}`}
              >
                <Card hover className="h-full cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <BookOpen className="w-4.5 h-4.5 text-orange-500" />
                    </div>
                    <Badge variant="info">Not started</Badge>
                  </div>
                  <h3 className="font-semibold text-[#e5e5e5] mb-2">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[#a1a1aa]">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {topic._count.quizzes} subtopics
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {estimatedReadTime(topic._count.quizzes)}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
