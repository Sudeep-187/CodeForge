"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Code2,
  ListChecks,
  BookOpen,
  Terminal,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Code2,
    title: "DSA Problem Bank",
    description:
      "500+ handpicked problems sorted by pattern, difficulty, and company tags.",
  },
  {
    icon: ListChecks,
    title: "SDE Sheets",
    description:
      "Curated problem sheets covering all must-know patterns for SDE interviews.",
  },
  {
    icon: BookOpen,
    title: "OS, DBMS, CN, Compilers",
    description:
      "In-depth subject-wise content for core CS fundamentals and interview prep.",
  },
  {
    icon: Terminal,
    title: "In-Browser Compiler",
    description:
      "Write, compile, and test code directly in your browser — zero setup needed.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Track your streaks, solved counts, and subject-wise mastery at a glance.",
  },
  {
    icon: BrainCircuit,
    title: "MCQ Quizzes",
    description:
      "Test your knowledge with subject-wise MCQs designed to simulate real exams.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section className="bg-[#0c0c0c] py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-space-grotesk text-[#e5e5e5] mb-4">
            Everything You Need to Crack Placements
          </h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto">
            From DSA to core subjects, from coding to quizzes — CodeForge is your
            all-in-one placement preparation platform.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={cardVariants}>
                <Card
                  hover
                  className="h-full group cursor-default"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#e5e5e5] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#a1a1aa] leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
