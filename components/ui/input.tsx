import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[#a1a1aa]">
            {label}
          </label>
        )}
        <input
          id={id}
          className={cn(
            "w-full px-3 py-2 rounded-lg border bg-[#141414] text-[#e5e5e5] placeholder:text-[#71717a]",
            "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50",
            "transition-all text-sm",
            error ? "border-red-500" : "border-[#2a2a2a]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
