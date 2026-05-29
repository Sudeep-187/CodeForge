"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-[#e5e5e5] font-space-grotesk mb-2">
          Something went wrong
        </h1>
        <p className="text-[#a1a1aa] mb-8 text-sm leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
