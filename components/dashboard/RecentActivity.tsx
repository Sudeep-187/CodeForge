import Link from "next/link";
import { cn } from "@/lib/utils";

interface Submission {
  id: string;
  problemTitle: string;
  problemSlug: string;
  status: string;
  language: string;
  createdAt: string;
}

interface RecentActivityProps {
  submissions: Submission[];
}

const LANGUAGE_BADGES: Record<string, string> = {
  cpp: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  java: "bg-red-500/10 text-red-400 border-red-500/20",
  python: "bg-green-500/10 text-green-400 border-green-500/20",
  javascript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  go: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  rust: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return "just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

export function RecentActivity({ submissions }: RecentActivityProps) {
  if (submissions.length === 0) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
        <p className="text-[#71717a] text-sm py-8 text-center">No submissions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              <th className="text-left text-[#71717a] font-medium pb-3 pr-4">Problem</th>
              <th className="text-left text-[#71717a] font-medium pb-3 pr-4">Status</th>
              <th className="text-left text-[#71717a] font-medium pb-3 pr-4">Language</th>
              <th className="text-right text-[#71717a] font-medium pb-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                className={cn(
                  "border-b border-[#2a2a2a] last:border-0 transition-colors hover:bg-white/[0.02]",
                  sub.status === "ACCEPTED" && "border-l-2 border-l-green-500 pl-3",
                  sub.status === "WRONG_ANSWER" && "border-l-2 border-l-red-500 pl-3"
                )}
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/dsa/${sub.problemSlug}`}
                    className="text-[#e5e5e5] hover:text-orange-400 transition-colors font-medium"
                  >
                    {sub.problemTitle}
                  </Link>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                      sub.status === "ACCEPTED" && "bg-green-500/10 text-green-400 border-green-500/20",
                      sub.status === "WRONG_ANSWER" && "bg-red-500/10 text-red-400 border-red-500/20",
                      sub.status === "TIME_LIMIT_EXCEEDED" && "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                      sub.status === "RUNTIME_ERROR" && "bg-orange-500/10 text-orange-400 border-orange-500/20",
                      sub.status === "COMPILATION_ERROR" && "bg-purple-500/10 text-purple-400 border-purple-500/20"
                    )}
                  >
                    {sub.status === "ACCEPTED"
                      ? "Accepted"
                      : sub.status === "WRONG_ANSWER"
                        ? "Wrong Answer"
                        : sub.status === "TIME_LIMIT_EXCEEDED"
                          ? "TLE"
                          : sub.status === "RUNTIME_ERROR"
                            ? "Runtime Error"
                            : sub.status === "COMPILATION_ERROR"
                              ? "Compilation Error"
                              : sub.status}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
                      LANGUAGE_BADGES[sub.language] || "bg-[#1a1a1a] text-[#a1a1aa] border-[#2a2a2a]"
                    )}
                  >
                    {sub.language}
                  </span>
                </td>
                <td className="py-3 text-right text-[#71717a] whitespace-nowrap">
                  {timeAgo(sub.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
