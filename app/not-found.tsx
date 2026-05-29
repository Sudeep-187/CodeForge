import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
          <Flame className="w-8 h-8 text-orange-400" />
        </div>
        <h1 className="text-6xl font-bold text-[#e5e5e5] font-space-grotesk mb-2">404</h1>
        <p className="text-xl text-[#a1a1aa] mb-2">This page doesn&apos;t exist</p>
        <p className="text-sm text-[#71717a] mb-8">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
