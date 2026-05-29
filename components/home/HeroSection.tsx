"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Flame, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const headingWords = ["Forge", "Your", "CS", "Skills.", "One", "Problem", "at", "a", "Time."];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0c0c0c] pt-20">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-transparent to-[#0c0c0c] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#141414] mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-sm text-[#a1a1aa]">
            <span className="text-orange-500">🔥</span> Trusted by 50,000+ students
          </span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-space-grotesk text-[#e5e5e5] leading-tight mb-6">
          <AnimatePresence mode="wait">
            {headingWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={cn(
                  "inline-block mr-[0.25em]",
                  word === "Skills." && "text-orange-500"
                )}
              >
                {word}
              </motion.span>
            ))}
          </AnimatePresence>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg sm:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Master DSA, core CS subjects, and crack your dream placements — all in one platform
          built for obsessive practice and real results.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dsa">
            <Button variant="primary" size="lg" className="text-base gap-2">
              Start Solving <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/subjects">
            <Button variant="outline" size="lg" className="text-base">
              Explore Subjects
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 flex items-center justify-center gap-6 sm:gap-10 text-sm text-[#a1a1aa]"
        >
          {["500+ Problems", "6 CS Subjects", "10+ Languages", "50K+ Users"].map(
            (stat) => (
              <div key={stat} className="flex items-center gap-2">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>{stat}</span>
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
