import { SubjectCard } from "@/components/subjects/SubjectCard";
import type { SubjectData } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getSubjects(): Promise<SubjectData[]> {
  try {
    const res = await fetch(`${API_BASE}/api/subjects`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#e5e5e5] mb-4">
            Computer Science Subjects
          </h1>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto">
            Master every core CS subject with structured notes and quizzes
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#a1a1aa]">No subjects available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id || subject.slug} subject={subject} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
