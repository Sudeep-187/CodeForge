import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-orange-500 hover:bg-orange-600 text-white": variant === "primary",
            "bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#e5e5e5] border border-[#2a2a2a]": variant === "default",
            "border border-[#2a2a2a] hover:border-orange-500/50 text-[#e5e5e5]": variant === "outline",
            "hover:bg-[#1a1a1a] text-[#a1a1aa] hover:text-[#e5e5e5]": variant === "ghost",
            "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20": variant === "danger",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
