"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="bg-[#0c0c0c] py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-orange-500/30 bg-[#141414] p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
        >
          <div
            className="pointer-events-none absolute -inset-0.5 opacity-20 rounded-2xl blur-xl"
            style={{
              background:
                "linear-gradient(135deg, #f97316 0%, transparent 50%, #f97316 100%)",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-space-grotesk text-[#e5e5e5] mb-4">
              Ready to Ace Your Placements?
            </h2>
            <p className="text-[#a1a1aa] max-w-xl mx-auto mb-8 leading-relaxed">
              Join 50,000+ students who are already using CodeForge to master DSA,
              core subjects, and land their dream offers.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-sm text-[#a1a1aa]">
              {[
                "500+ Problems",
                "Live Compiler",
                "Progress Tracking",
                "Mock Tests",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dsa">
                <Button variant="primary" size="lg" className="text-base gap-2">
                  Start Practicing <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/subjects">
                <Button variant="outline" size="lg" className="text-base">
                  Explore Subjects
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
