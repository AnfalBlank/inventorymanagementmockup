"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import {
  Bell,
  ShoppingCart,
  Package,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Filter,
  Trash2,
  CheckCheck,
} from "lucide-react";

const notifTypeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  new_order: { icon: <ShoppingCart size={18} />, color: "text-blue-700", bgColor: "bg-blue-100" },
  ready_picking: { icon: <Package size={18} />, color: "text-purple-700", bgColor: "bg-purple-100" },
  ready_packing: { icon: <Package size={18} />, color: "text-indigo-700", bgColor: "bg-indigo-100" },
  low_stock: { icon: <AlertTriangle size={18} />, color: "text-amber-700", bgColor: "bg-amber-100" },
  return: { icon: <RotateCcw size={18} />, color: "text-orange-700", bgColor: "bg-orange-100" },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = notifications.filter((n) => {
    if (filter === "unread" && n.isRead) return false;
    if (filter === "read" && !n.isRead) return false;
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Notifications</h1>
            <p className="text-sm text-[#616161] mt-1">Pusat notifikasi sistem MIMS</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" icon={<CheckCheck size={16} />} onClick={() => {
              markAllNotificationsRead();
              toast({ type: "success", title: "Semua notifikasi ditandai dibaca" });
            }}>
              Tandai semua dibaca
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => setTypeFilter("all")}
            className={cn(
              "p-4 rounded-lg border text-left transition-all",
              typeFilter === "all" ? "border-[#003c33] bg-[#f8f8f8]" : "border-[#e5e7eb] bg-white hover:border-[#d9d9dd]"
            )}
          >
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-[#616161]" />
              <span className="text-xs text-[#616161]">Total</span>
            </div>
            <p className="text-2xl font-semibold text-[#212121] mt-1">{notifications.length}</p>
          </button>
          {[
            { type: "new_order", label: "New Order" },
            { type: "low_stock", label: "Low Stock" },
            { type: "ready_packing", label: "Ready Pack" },
            { type: "return", label: "Return" },
          ].map((stat) => {
            const config = notifTypeConfig[stat.type];
            const count = notifications.filter((n) => n.type === stat.type).length;
            return (
              <button
                key={stat.type}
                onClick={() => setTypeFilter(stat.type)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-all",
                  typeFilter === stat.type ? "border-[#003c33] bg-[#f8f8f8]" : "border-[#e5e7eb] bg-white hover:border-[#d9d9dd]"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("p-1 rounded", config.bgColor, config.color)}>
                    {config.icon}
                  </div>
                  <span className="text-xs text-[#616161]">{stat.label}</span>
                </div>
                <p className="text-2xl font-semibold text-[#212121] mt-1">{count}</p>
              </button>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 p-1 bg-[#f2f2f2] rounded-xl w-fit">
            {[
              { key: "all", label: "Semua", count: notifications.length },
              { key: "unread", label: "Belum dibaca", count: unreadCount },
              { key: "read", label: "Sudah dibaca", count: notifications.length - unreadCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  filter === tab.key
                    ? "bg-white text-[#212121] shadow-sm"
                    : "text-[#616161] hover:text-[#212121]"
                )}
              >
                {tab.label}
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  filter === tab.key ? "bg-[#003c33] text-white" : "bg-[#e5e7eb] text-[#616161]"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <Card padding="sm">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="mx-auto text-[#93939f] mb-3" />
              <p className="text-sm text-[#616161]">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f2f2f2]">
              {filtered.map((notif) => {
                const config = notifTypeConfig[notif.type] || notifTypeConfig.new_order;
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex items-start gap-4 p-4 hover:bg-[#f8f8f8] transition-colors cursor-pointer",
                      !notif.isRead && "bg-blue-50/30"
                    )}
                    onClick={() => markNotificationRead(notif.id)}
                  >
                    <div className={cn("p-2.5 rounded-lg flex-shrink-0", config.bgColor, config.color)}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#212121]">{notif.title}</p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 bg-[#1863dc] rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-[#616161] mt-0.5">{notif.message}</p>
                          <p className="text-xs text-[#93939f] mt-1.5">{formatRelativeTime(notif.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notif.isRead && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markNotificationRead(notif.id); }}
                              className="p-1.5 rounded hover:bg-white"
                              title="Tandai dibaca"
                            >
                              <CheckCircle2 size={14} className="text-[#616161]" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({ type: "info", title: "Notifikasi dihapus" });
                            }}
                            className="p-1.5 rounded hover:bg-red-50"
                            title="Hapus"
                          >
                            <Trash2 size={14} className="text-[#616161] hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
