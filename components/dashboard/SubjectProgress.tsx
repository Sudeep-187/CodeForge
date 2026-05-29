interface Subject {
  name: string;
  completed: number;
  total: number;
}

interface SubjectProgressProps {
  subjects: Subject[];
}

const DOT_COLORS = [
  "bg-blue-400",
  "bg-green-400",
  "bg-purple-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-red-400",
  "bg-pink-400",
  "bg-cyan-400",
];

export function SubjectProgress({ subjects }: SubjectProgressProps) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-white font-semibold mb-6">Subject Progress</h3>
      <div className="space-y-5">
        {subjects.map((subject, i) => {
          const percentage = subject.total > 0 ? Math.round((subject.completed / subject.total) * 100) : 0;
          return (
            <div key={subject.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
                  <span className="text-sm text-[#e5e5e5] font-medium">{subject.name}</span>
                </div>
                <span className="text-xs text-[#a1a1aa]">
                  {subject.completed} / {subject.total} topics
                </span>
              </div>
              <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%`, backgroundColor: "#f97316" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
