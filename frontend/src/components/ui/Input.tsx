"use client";

import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#212121]">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-2.5 text-sm border border-[#d9d9dd] rounded-lg bg-white text-[#212121] placeholder:text-[#93939f] transition-all duration-150",
              "focus:outline-none focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20",
              icon && "pl-10",
              error && "border-[#b30000] focus:border-[#b30000] focus:ring-[#b30000]/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#b30000]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#212121]">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 text-sm border border-[#d9d9dd] rounded-lg bg-white text-[#212121] transition-all duration-150",
            "focus:outline-none focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20",
            error && "border-[#b30000]",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[#b30000]">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#212121]">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 text-sm border border-[#d9d9dd] rounded-lg bg-white text-[#212121] placeholder:text-[#93939f] transition-all duration-150 resize-none",
            "focus:outline-none focus:border-[#9b60aa] focus:ring-2 focus:ring-[#9b60aa]/20",
            error && "border-[#b30000]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#b30000]">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
