import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "success" | "warning" | "danger" | "info";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        {
          "bg-[#1a1a1a] text-[#a1a1aa] border-[#2a2a2a]": variant === "default",
          "border-[#2a2a2a] text-[#a1a1aa]": variant === "outline",
          "bg-green-500/10 text-green-400 border-green-500/20": variant === "success",
          "bg-yellow-500/10 text-yellow-400 border-yellow-500/20": variant === "warning",
          "bg-red-500/10 text-red-400 border-red-500/20": variant === "danger",
          "bg-blue-500/10 text-blue-400 border-blue-500/20": variant === "info",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colorClass = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.EASY;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", colorClass)}>
      {difficulty === "EASY" ? "Easy" : difficulty === "MEDIUM" ? "Medium" : "Hard"}
    </span>
  );
}
