"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { StatusBadge, PriorityBadge } from "@/components/ui/StatusBadge";
import { useAppStore } from "@/store";
import { formatRelativeTime } from "@/lib/utils";
import {
  ShoppingCart,
  Package,
  Truck,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const { dashboardStats, salesOrders, pickingTasks, packingTasks, stockLevels } = useAppStore();

  const lowStockItems = stockLevels.filter((s) => s.isLowStock);
  const recentOrders = salesOrders.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#616161] mt-1">Overview operasional gudang realtime</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Order Hari Ini"
            value={dashboardStats.todayOrders}
            icon={<ShoppingCart size={22} />}
            trend={{ value: 12, isPositive: true }}
            color="bg-[#003c33]"
          />
          <StatCard
            title="Pending Picking"
            value={dashboardStats.pendingPicking}
            icon={<Clock size={22} />}
            color="bg-[#1863dc]"
          />
          <StatCard
            title="Pending Packing"
            value={dashboardStats.pendingPacking}
            icon={<Package size={22} />}
            color="bg-[#9b60aa]"
          />
          <StatCard
            title="Terkirim Hari Ini"
            value={dashboardStats.todayShipped}
            icon={<Truck size={22} />}
            trend={{ value: 8, isPositive: true }}
            color="bg-emerald-600"
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Siap Kirim"
            value={dashboardStats.readyShipment}
            icon={<CheckCircle2 size={22} />}
            color="bg-teal-600"
          />
          <StatCard
            title="Low Stock Alert"
            value={dashboardStats.lowStockItems}
            icon={<AlertTriangle size={22} />}
            color="bg-amber-600"
          />
          <StatCard
            title="Total Retur"
            value={dashboardStats.totalReturns}
            icon={<RotateCcw size={22} />}
            color="bg-[#ff7759]"
          />
          <StatCard
            title="Total Order"
            value={dashboardStats.totalOrders}
            icon={<TrendingUp size={22} />}
            color="bg-[#17171c]"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#212121]">Order Terbaru</h2>
              <a href="/sales-orders" className="text-sm text-[#1863dc] hover:underline">
                Lihat Semua →
              </a>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#f8f8f8] hover:bg-[#f0f0f0] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#212121]">{order.orderNumber}</p>
                      <p className="text-xs text-[#616161]">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={order.priority} />
                    <StatusBadge status={order.status} />
                    <span className="text-xs text-[#93939f]">{formatRelativeTime(order.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#212121]">Low Stock Alert</h2>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                {lowStockItems.length} items
              </span>
            </div>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.productId} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-sm font-medium text-[#212121]">{item.productName}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#616161]">SKU: {item.sku}</span>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-amber-700">{item.available} pcs</p>
                      <p className="text-[10px] text-[#93939f]">Min: {item.minStock}</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min((item.available / item.minStock) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <p className="text-sm text-[#93939f] text-center py-4">Semua stok aman</p>
              )}
            </div>
          </Card>
        </div>

        {/* Warehouse Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Picking */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#212121]">Aktivitas Picking</h2>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                {pickingTasks.length} tasks
              </span>
            </div>
            <div className="space-y-3">
              {pickingTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border border-[#e5e7eb]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#212121]">{task.orderNumber}</p>
                      <p className="text-xs text-[#616161]">{task.totalItems} items</p>
                    </div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-[#616161] mb-1">
                      <span>Progress</span>
                      <span>{task.pickedItems}/{task.totalItems}</span>
                    </div>
                    <div className="h-2 bg-[#f2f2f2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1863dc] rounded-full transition-all"
                        style={{ width: `${(task.pickedItems / task.totalItems) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Packing Queue */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#212121]">Antrian Packing</h2>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                {packingTasks.length} antrian
              </span>
            </div>
            <div className="space-y-3">
              {packingTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border border-[#e5e7eb]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#212121]">{task.orderNumber}</p>
                      <p className="text-xs text-[#616161]">{task.totalItems} items • {task.packedItems} packed</p>
                    </div>
                    <div className="text-right">
                      <PriorityBadge priority={task.priority} />
                      <p className="text-[10px] text-[#93939f] mt-1">
                        Menunggu {formatRelativeTime(task.waitingSince)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {packingTasks.length === 0 && (
                <p className="text-sm text-[#93939f] text-center py-4">Tidak ada antrian packing</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
