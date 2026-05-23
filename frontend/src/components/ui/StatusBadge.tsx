"use client";

import { cn } from "@/lib/utils";
import type { OrderStatus, Priority } from "@/types";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  WAITING_PICK: { label: "Menunggu Picking", className: "bg-amber-100 text-amber-800 border-amber-200" },
  PICKING: { label: "Sedang Picking", className: "bg-blue-100 text-blue-800 border-blue-200" },
  READY_PACKING: { label: "Siap Packing", className: "bg-purple-100 text-purple-800 border-purple-200" },
  PACKING: { label: "Sedang Packing", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  PACKING_COMPLETE: { label: "Packing Selesai", className: "bg-teal-100 text-teal-800 border-teal-200" },
  READY_SHIPMENT: { label: "Siap Kirim", className: "bg-green-100 text-green-800 border-green-200" },
  SHIPPED: { label: "Terkirim", className: "bg-gray-100 text-gray-800 border-gray-200" },
  CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-800 border-red-200" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className)}>
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        priority === "urgent"
          ? "bg-red-100 text-red-800 border border-red-200"
          : "bg-gray-100 text-gray-600 border border-gray-200"
      )}
    >
      {priority === "urgent" ? "🔴 Urgent" : "Normal"}
    </span>
  );
}
