"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  loading,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#17171c] text-white hover:bg-[#2a2a32] active:bg-[#000000]",
    secondary: "bg-[#eeece7] text-[#212121] hover:bg-[#e5e3de] active:bg-[#dbd9d4]",
    outline: "bg-transparent border border-[#d9d9dd] text-[#212121] hover:bg-[#f8f8f8] active:bg-[#f0f0f0]",
    danger: "bg-[#b30000] text-white hover:bg-[#990000] active:bg-[#800000]",
    ghost: "bg-transparent text-[#212121] hover:bg-[#f5f5f5] active:bg-[#eeece7]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-[32px]",
    lg: "px-8 py-3.5 text-base rounded-[32px]",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#4c6ee6] focus:ring-offset-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
