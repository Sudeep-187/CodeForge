import { Flame } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Flame className="w-10 h-10 text-orange-500 animate-spin" />
          <div className="absolute inset-0 w-10 h-10 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-[#e5e5e5] font-space-grotesk">CodeForge</span>
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
