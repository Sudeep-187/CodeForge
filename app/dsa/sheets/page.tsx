"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Flame } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SHEETS = [
  {
    slug: "blind-75",
    title: "Blind 75",
    description: "The most commonly asked LeetCode questions curated by a former Meta engineer. Covers all essential DSA patterns.",
    total: 75,
    solved: 0,
    icon: "target",
  },
  {
    slug: "sde-sheet",
    title: "SDE Sheet",
    description: "Top SDE interview problems from Amazon, Google, Microsoft, and more. Complete preparation for software engineering roles.",
    total: 180,
    solved: 0,
    icon: "briefcase",
  },
  {
    slug: "love-babbar-450",
    title: "Love Babbar 450",
    description: "450 questions covering all DSA topics. A comprehensive sheet for cracking product-based company interviews.",
    total: 450,
    solved: 0,
    icon: "book",
  },
  {
    slug: "top-interview-150",
    title: "Top Interview 150",
    description: "Official LeetCode curated 150 questions. The most frequently asked interview problems across all companies.",
    total: 150,
    solved: 0,
    icon: "star",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SheetsPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#e5e5e5] font-space-grotesk">DSA Sheets</h1>
          <p className="text-[#a1a1aa] mt-1">Curated problem lists to accelerate your interview preparation</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {SHEETS.map((sheet) => {
            const progress = sheet.total > 0 ? (sheet.solved / sheet.total) * 100 : 0;
            return (
              <motion.div key={sheet.slug} variants={item}>
                <Card hover className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-orange-400" />
                      </div>
                      <span className="text-xs text-[#71717a] bg-[#1a1a1a] px-2 py-1 rounded-full border border-[#2a2a2a]">
                        {sheet.total} problems
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <h3 className="text-lg font-semibold text-[#e5e5e5] mb-2">{sheet.title}</h3>
                    <p className="text-sm text-[#a1a1aa] leading-relaxed">{sheet.description}</p>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#71717a]">
                        <span>Progress</span>
                        <span>{sheet.solved} / {sheet.total}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <Link href={`/dsa/sheets/${sheet.slug}`}>
                        <Button variant="primary" size="sm" className="w-full mt-1">
                          View Sheet
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
