"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, padding = "md", hover = false, onClick }: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-[#e5e7eb] transition-all duration-200",
        paddingClasses[padding],
        hover && "hover:shadow-md hover:border-[#d9d9dd] cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}

export function StatCard({ title, value, icon, trend, color = "bg-[#003c33]" }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-[#616161] font-medium">{title}</p>
          <p className="text-3xl font-semibold text-[#212121] tracking-tight">{value}</p>
          {trend && (
            <p className={cn("text-xs font-medium", trend.isPositive ? "text-emerald-600" : "text-red-600")}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% dari kemarin
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl text-white", color)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
