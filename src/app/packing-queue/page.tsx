"use client";

import { useAppStore } from "@/store";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "@/components/ui/StatusBadge";
import { Package, Clock, Box, Zap, RefreshCw } from "lucide-react";

export default function PackingQueuePage() {
  const { packingTasks, salesOrders } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for live timer
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getWaitingDuration = (since: string) => {
    const diff = currentTime.getTime() - new Date(since).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  // Combine packing tasks with ready_packing orders
  const readyPackingOrders = salesOrders.filter((o) => o.status === "READY_PACKING");

  return (
    <div className="min-h-screen bg-[#17171c]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#17171c]/95 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#9b60aa] flex items-center justify-center">
              <Package size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Packing Queue Monitor</h1>
              <p className="text-xs text-white/60">Realtime packing queue display</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-white/60">Live</span>
            </div>
            <div className="text-right">
              <p className="text-white font-mono text-lg">
                {currentTime.toLocaleTimeString("id-ID")}
              </p>
              <p className="text-white/40 text-xs">
                {currentTime.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{packingTasks.length + readyPackingOrders.length}</p>
            <p className="text-xs text-white/60 mt-1">Total Antrian</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">{packingTasks.filter((t) => t.priority === "urgent").length}</p>
            <p className="text-xs text-white/60 mt-1">Urgent</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{packingTasks.filter((t) => t.status === "in_progress").length}</p>
            <p className="text-xs text-white/60 mt-1">In Progress</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">{packingTasks.filter((t) => t.status === "completed").length}</p>
            <p className="text-xs text-white/60 mt-1">Selesai Hari Ini</p>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="p-6 space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs text-white/40 uppercase tracking-wider font-medium">
          <div className="col-span-1">#</div>
          <div className="col-span-3">No. Order</div>
          <div className="col-span-2">Items</div>
          <div className="col-span-2">Prioritas</div>
          <div className="col-span-2">Waktu Tunggu</div>
          <div className="col-span-2">Status</div>
        </div>

        {/* Queue Items */}
        {packingTasks.map((task, idx) => (
          <div
            key={task.id}
            className={cn(
              "grid grid-cols-12 gap-4 items-center px-5 py-4 rounded-xl border transition-all",
              task.priority === "urgent"
                ? "bg-red-500/5 border-red-500/20 animate-pulse"
                : "bg-white/5 border-white/10"
            )}
          >
            <div className="col-span-1">
              <span className="text-white/60 font-mono text-sm">{idx + 1}</span>
            </div>
            <div className="col-span-3">
              <p className="text-white font-mono font-medium">{task.orderNumber}</p>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Box size={14} className="text-white/40" />
                <span className="text-white">{task.totalItems} SKU</span>
              </div>
            </div>
            <div className="col-span-2">
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className={cn(
                  task.priority === "urgent" ? "text-red-400" : "text-amber-400"
                )} />
                <span className={cn(
                  "font-mono text-sm font-medium",
                  task.priority === "urgent" ? "text-red-400" : "text-amber-400"
                )}>
                  {getWaitingDuration(task.waitingSince)}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                task.status === "waiting" ? "bg-amber-500/20 text-amber-300" :
                task.status === "in_progress" ? "bg-blue-500/20 text-blue-300" :
                "bg-emerald-500/20 text-emerald-300"
              )}>
                {task.status === "waiting" ? "Menunggu" : task.status === "in_progress" ? "Proses" : "Selesai"}
              </span>
            </div>
          </div>
        ))}

        {/* Ready Packing Orders */}
        {readyPackingOrders.map((order, idx) => (
          <div
            key={order.id}
            className={cn(
              "grid grid-cols-12 gap-4 items-center px-5 py-4 rounded-xl border transition-all",
              order.priority === "urgent"
                ? "bg-red-500/5 border-red-500/20"
                : "bg-white/5 border-white/10"
            )}
          >
            <div className="col-span-1">
              <span className="text-white/60 font-mono text-sm">{packingTasks.length + idx + 1}</span>
            </div>
            <div className="col-span-3">
              <p className="text-white font-mono font-medium">{order.orderNumber}</p>
              <p className="text-white/40 text-xs">{order.customerName}</p>
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Box size={14} className="text-white/40" />
                <span className="text-white">{order.totalItems} SKU • {order.totalQty} pcs</span>
              </div>
            </div>
            <div className="col-span-2">
              <PriorityBadge priority={order.priority} />
            </div>
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-amber-400" />
                <span className="font-mono text-sm font-medium text-amber-400">
                  {getWaitingDuration(order.updatedAt)}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                Ready Pack
              </span>
            </div>
          </div>
        ))}

        {packingTasks.length === 0 && readyPackingOrders.length === 0 && (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/60 text-lg">Tidak ada antrian packing</p>
            <p className="text-white/40 text-sm mt-1">Antrian akan muncul otomatis saat picking selesai</p>
          </div>
        )}
      </div>
    </div>
  );
}
