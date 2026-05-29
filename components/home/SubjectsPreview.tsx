"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  Cpu,
  Database,
  Network,
  Settings2,
  GitBranch,
  Layers,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const subjects = [
  {
    slug: "os",
    name: "Operating Systems",
    icon: Cpu,
    color: "#3b82f6",
    topics: 48,
    description: "Processes, memory, file systems, and more.",
  },
  {
    slug: "dbms",
    name: "Database Management Systems",
    icon: Database,
    color: "#10b981",
    topics: 42,
    description: "SQL, normalization, transactions, indexing.",
  },
  {
    slug: "cn",
    name: "Computer Networks",
    icon: Network,
    color: "#8b5cf6",
    topics: 36,
    description: "TCP/IP, HTTP, routing, security protocols.",
  },
  {
    slug: "compiler-design",
    name: "Compiler Design",
    icon: Settings2,
    color: "#f59e0b",
    topics: 28,
    description: "Lexing, parsing, optimization, code generation.",
  },
  {
    slug: "dsa",
    name: "Data Structures & Algorithms",
    icon: GitBranch,
    color: "#ef4444",
    topics: 120,
    description: "Arrays, trees, graphs, DP, and greedy algorithms.",
  },
  {
    slug: "system-design",
    name: "System Design",
    icon: Layers,
    color: "#ec4899",
    topics: 32,
    description: "Scalability, microservices, databases, caching.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function SubjectsPreview() {
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
            Master Every CS Subject
          </h2>
          <p className="text-[#a1a1aa] max-w-2xl mx-auto">
            Dive deep into each subject with curated content, practice questions,
            and mock tests designed for placement preparation.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <motion.div key={subject.slug} variants={cardVariants}>
                <Link href={`/subjects/${subject.slug}`}>
                  <Card
                    hover
                    className="h-full group cursor-default"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: `${subject.color}15`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: subject.color }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-[#e5e5e5] mb-1">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-[#a1a1aa] mb-3">
                      {subject.topics} topics
                    </p>
                    <p className="text-sm text-[#a1a1aa] mb-4 leading-relaxed">
                      {subject.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-orange-500 group-hover:gap-2 transition-all">
                      Start Learning <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
