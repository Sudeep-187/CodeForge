"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CounterProps {
  target: number;
  suffix: string;
  label: string;
}

function AnimatedCounter({ target, suffix, label }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-bold font-space-grotesk text-[#e5e5e5]">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-[#a1a1aa] mt-1">{label}</div>
    </div>
  );
}

const stats = [
  { target: 500, suffix: "+", label: "Problems" },
  { target: 6, suffix: "", label: "CS Subjects" },
  { target: 10, suffix: "+", label: "Languages" },
  { target: 50000, suffix: "+", label: "Users" },
];

export function StatsBar() {
  return (
    <section className="bg-[#0c0c0c] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-4 gap-8 py-8",
            "border-t border-b border-[#2a2a2a]"
          )}
        >
          {stats.map((stat) => (
            <AnimatedCounter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
