"use client";

import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { type ReactNode } from "react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Sidebar />
      <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-20")}>
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
