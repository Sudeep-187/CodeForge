"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#a1a1aa]">
            {label}
          </label>
        )}
        <select
          id={id}
          className={cn(
            "w-full px-3 py-2 rounded-lg border bg-[#141414] text-[#e5e5e5]",
            "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50",
            "transition-all text-sm border-[#2a2a2a]",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
