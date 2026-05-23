"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { PriorityBadge } from "@/components/ui/StatusBadge";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { Eye, Package, Truck, Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";

type TabType = "picking" | "packing" | "orders";

export default function MonitoringPage() {
  const { pickingTasks, packingTasks, salesOrders } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>("picking");

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "picking", label: "Live Picking", icon: <Activity size={16} /> },
    { key: "packing", label: "Live Packing", icon: <Package size={16} /> },
    { key: "orders", label: "Tracking Order", icon: <Truck size={16} /> },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Monitoring</h1>
          <p className="text-sm text-[#616161] mt-1">Pantau aktivitas gudang secara realtime</p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg w-fit">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">Live Monitoring Active</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#f2f2f2] rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.key
                  ? "bg-white text-[#212121] shadow-sm"
                  : "text-[#616161] hover:text-[#212121]"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Picking */}
        {activeTab === "picking" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pickingTasks.map((task) => (
              <Card key={task.id} className="relative overflow-hidden">
                {task.status === "in_progress" && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse" />
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-sm font-medium text-[#1863dc]">{task.orderNumber}</p>
                    <p className="text-xs text-[#616161] mt-0.5">
                      {task.status === "in_progress" ? "Sedang dikerjakan" : "Menunggu picker"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      task.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {task.status === "in_progress" ? "In Progress" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-[#616161] mb-1.5">
                    <span>Progress Picking</span>
                    <span className="font-medium">{task.pickedItems}/{task.totalItems} items</span>
                  </div>
                  <div className="h-3 bg-[#f2f2f2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${(task.pickedItems / task.totalItems) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {task.items.map((item) => (
                    <div key={item.id} className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg border",
                      item.isCompleted ? "bg-emerald-50 border-emerald-200" : "bg-[#f8f8f8] border-[#e5e7eb]"
                    )}>
                      <div className="flex items-center gap-3">
                        {item.isCompleted ? (
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        ) : (
                          <Clock size={16} className="text-[#93939f]" />
                        )}
                        <div>
                          <p className="text-xs font-medium">{item.productName}</p>
                          <p className="text-[10px] text-[#93939f]">Rak: {item.rackCode}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">{item.pickedQty}/{item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {task.startedAt && (
                  <p className="text-[10px] text-[#93939f] mt-3">
                    Dimulai: {formatRelativeTime(task.startedAt)}
                  </p>
                )}
              </Card>
            ))}
            {pickingTasks.length === 0 && (
              <Card className="col-span-2 text-center py-12">
                <Activity size={48} className="mx-auto text-[#93939f] mb-3" />
                <p className="text-sm text-[#616161]">Tidak ada aktivitas picking saat ini</p>
              </Card>
            )}
          </div>
        )}

        {/* Live Packing */}
        {activeTab === "packing" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {packingTasks.map((task) => (
              <Card key={task.id} className="relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-sm font-medium text-[#1863dc]">{task.orderNumber}</p>
                    <p className="text-xs text-[#616161] mt-0.5">{task.totalItems} items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <div className="flex items-center gap-1 text-xs text-amber-700">
                      <Clock size={12} />
                      <span>{formatRelativeTime(task.waitingSince)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {task.items.map((item) => (
                    <div key={item.id} className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg border",
                      item.isVerified ? "bg-emerald-50 border-emerald-200" : "bg-[#f8f8f8] border-[#e5e7eb]"
                    )}>
                      <div className="flex items-center gap-3">
                        {item.isVerified ? (
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        ) : (
                          <AlertCircle size={16} className="text-amber-500" />
                        )}
                        <div>
                          <p className="text-xs font-medium">{item.productName}</p>
                          <p className="text-[10px] text-[#93939f] font-mono">{item.sku}</p>
                        </div>
                      </div>
                      <p className="text-xs font-medium">{item.scannedQty}/{item.qty}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            {packingTasks.length === 0 && (
              <Card className="col-span-2 text-center py-12">
                <Package size={48} className="mx-auto text-[#93939f] mb-3" />
                <p className="text-sm text-[#616161]">Tidak ada antrian packing saat ini</p>
              </Card>
            )}
          </div>
        )}

        {/* Order Tracking */}
        {activeTab === "orders" && (
          <Card padding="sm">
            <div className="space-y-3">
              {salesOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-[#e5e7eb] hover:bg-[#f8f8f8] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      order.status === "SHIPPED" ? "bg-emerald-100" : "bg-blue-100"
                    )}>
                      {order.status === "SHIPPED" ? (
                        <CheckCircle2 size={20} className="text-emerald-600" />
                      ) : (
                        <Truck size={20} className="text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#212121]">{order.orderNumber}</p>
                      <p className="text-xs text-[#616161]">{order.customerName} • {order.totalQty} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <PriorityBadge priority={order.priority} />
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      order.status === "WAITING_PICK" && "bg-amber-100 text-amber-800",
                      order.status === "PICKING" && "bg-blue-100 text-blue-800",
                      order.status === "READY_PACKING" && "bg-purple-100 text-purple-800",
                      order.status === "PACKING_COMPLETE" && "bg-teal-100 text-teal-800",
                      order.status === "SHIPPED" && "bg-emerald-100 text-emerald-800",
                    )}>
                      {order.status.replace(/_/g, " ")}
                    </div>
                    <span className="text-xs text-[#93939f]">{formatRelativeTime(order.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
