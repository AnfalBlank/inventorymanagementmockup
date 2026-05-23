"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Database,
  Warehouse,
  Eye,
  BarChart3,
  ShoppingCart,
  Truck,
  RotateCcw,
  Settings,
  ChevronLeft,
  Box,
  ArrowRightLeft,
  ClipboardList,
  Layers,
  Barcode,
  Bell,
  Send,
  Cog,
} from "lucide-react";

const menuGroups = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Inventory",
    items: [
      { href: "/inventory", label: "Stock Management", icon: Package },
      { href: "/stock-transfer", label: "Stock Transfer", icon: ArrowRightLeft },
      { href: "/stock-opname", label: "Stock Opname", icon: ClipboardList },
      { href: "/batch-tracking", label: "Batch Tracking", icon: Layers },
    ],
  },
  {
    label: "Transactions",
    items: [
      { href: "/sales-orders", label: "Sales Order", icon: ShoppingCart },
      { href: "/purchase-orders", label: "Purchase Order", icon: Truck },
      { href: "/shipments", label: "Shipments", icon: Send },
      { href: "/returns", label: "Returns", icon: RotateCcw },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/monitoring", label: "Live Monitoring", icon: Eye },
      { href: "/transfer-queue", label: "Transfer Queue", icon: ArrowRightLeft },
      { href: "/barcode", label: "Barcode Generator", icon: Barcode },
    ],
  },
  {
    label: "Configuration",
    items: [
      { href: "/master-data", label: "Master Data", icon: Database },
      { href: "/reporting", label: "Reporting", icon: BarChart3 },
      { href: "/configuration", label: "System Config", icon: Cog },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-[#17171c] text-white z-40 transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-[#003c33] flex items-center justify-center flex-shrink-0">
          <Box size={22} className="text-white" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-base font-semibold tracking-tight">MIMS</h1>
            <p className="text-[10px] text-[#93939f] tracking-wider uppercase">Warehouse System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {sidebarOpen && (
              <p className="px-3 py-1 text-[10px] text-[#93939f] uppercase tracking-wider font-semibold">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-[#93939f] hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Warehouse Picker/Packer Links */}
      {sidebarOpen && (
        <div className="px-3 pb-3 space-y-1 border-t border-white/10 pt-3">
          <p className="px-3 py-1 text-[10px] text-[#93939f] uppercase tracking-wider font-semibold">
            Operational (No Login)
          </p>
          <Link
            href="/picker"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#93939f] hover:text-white hover:bg-white/5 transition-all"
          >
            <Warehouse size={18} />
            <span>Picker Interface</span>
          </Link>
          <Link
            href="/packing-queue"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#93939f] hover:text-white hover:bg-white/5 transition-all"
          >
            <Package size={18} />
            <span>Packing Queue</span>
          </Link>
          <Link
            href="/packing-process"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#93939f] hover:text-white hover:bg-white/5 transition-all"
          >
            <Box size={18} />
            <span>Packing Process</span>
          </Link>
        </div>
      )}

      {/* Collapse Button */}
      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={20}
            className={cn("text-[#93939f] transition-transform", !sidebarOpen && "rotate-180")}
          />
        </button>
      </div>
    </aside>
  );
}
