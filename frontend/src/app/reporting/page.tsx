"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Zap,
  Target,
} from "lucide-react";

type TabType = "inventory" | "warehouse" | "performance";

export default function ReportingPage() {
  const { stockLevels, salesOrders, pickingTasks, packingTasks } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>("inventory");

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "inventory", label: "Laporan Stok", icon: <Package size={16} /> },
    { key: "warehouse", label: "Laporan Gudang", icon: <BarChart3 size={16} /> },
    { key: "performance", label: "Performa", icon: <Zap size={16} /> },
  ];

  const totalStock = stockLevels.reduce((sum, s) => sum + s.total, 0);
  const lowStockCount = stockLevels.filter((s) => s.isLowStock).length;
  const totalAvailable = stockLevels.reduce((sum, s) => sum + s.available, 0);
  const totalReserved = stockLevels.reduce((sum, s) => sum + s.reserved, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Reporting</h1>
          <p className="text-sm text-[#616161] mt-1">Laporan dan analisis operasional gudang</p>
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

        {/* Inventory Report */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#003c33] text-white">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#616161]">Total Stok</p>
                    <p className="text-xl font-semibold text-[#212121]">{totalStock}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#616161]">Available</p>
                    <p className="text-xl font-semibold text-emerald-700">{totalAvailable}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-600 text-white">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#616161]">Reserved</p>
                    <p className="text-xl font-semibold text-purple-700">{totalReserved}</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-600 text-white">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#616161]">Low Stock</p>
                    <p className="text-xl font-semibold text-amber-700">{lowStockCount}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Stock Distribution Chart Placeholder */}
            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Distribusi Stok per Gudang</h3>
              <div className="space-y-4">
                {stockLevels.map((stock) => (
                  <div key={`${stock.productId}-${stock.warehouseId}`} className="flex items-center gap-4">
                    <div className="w-40 truncate">
                      <p className="text-xs font-medium text-[#212121] truncate">{stock.productName}</p>
                      <p className="text-[10px] text-[#93939f]">{stock.warehouseName}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-6 bg-[#f2f2f2] rounded-lg overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${(stock.available / stock.total) * 100}%` }}
                          title={`Available: ${stock.available}`}
                        />
                        <div
                          className="h-full bg-purple-500 transition-all"
                          style={{ width: `${(stock.reserved / stock.total) * 100}%` }}
                          title={`Reserved: ${stock.reserved}`}
                        />
                        <div
                          className="h-full bg-red-500 transition-all"
                          style={{ width: `${(stock.damaged / stock.total) * 100}%` }}
                          title={`Damaged: ${stock.damaged}`}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium w-12 text-right">{stock.total}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#e5e7eb]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-xs text-[#616161]">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-purple-500" />
                  <span className="text-xs text-[#616161]">Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-xs text-[#616161]">Damaged</span>
                </div>
              </div>
            </Card>

            {/* Fast/Dead Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-base font-semibold text-[#212121] mb-4">Fast Moving Items</h3>
                <div className="space-y-3">
                  {stockLevels.slice(0, 5).map((item, idx) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f8f8]">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-[10px] text-[#93939f]">{item.sku}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700">
                        <TrendingUp size={14} />
                        <span className="text-xs font-medium">{item.reserved + item.available} unit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-base font-semibold text-[#212121] mb-4">Dead Stock</h3>
                <div className="flex flex-col items-center justify-center py-8 text-[#93939f]">
                  <Package size={40} className="mb-3 opacity-50" />
                  <p className="text-sm">Tidak ada dead stock terdeteksi</p>
                  <p className="text-xs mt-1">Semua produk memiliki pergerakan dalam 30 hari terakhir</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Warehouse Report */}
        {activeTab === "warehouse" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <div className="text-center">
                  <p className="text-xs text-[#616161] mb-1">Avg Picking Speed</p>
                  <p className="text-3xl font-semibold text-[#212121]">4.2</p>
                  <p className="text-xs text-[#93939f]">menit/order</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-xs text-[#616161] mb-1">Avg Packing Speed</p>
                  <p className="text-3xl font-semibold text-[#212121]">3.8</p>
                  <p className="text-xs text-[#93939f]">menit/order</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-xs text-[#616161] mb-1">Pending Queue</p>
                  <p className="text-3xl font-semibold text-[#212121]">{pickingTasks.length + packingTasks.length}</p>
                  <p className="text-xs text-[#93939f]">tasks</p>
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Throughput Harian (7 Hari Terakhir)</h3>
              <div className="flex items-end gap-2 h-48">
                {[18, 22, 15, 28, 25, 20, 23].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-[#616161] font-medium">{val}</span>
                    <div
                      className="w-full bg-[#003c33] rounded-t-lg transition-all hover:bg-[#004d42]"
                      style={{ height: `${(val / 30) * 100}%` }}
                    />
                    <span className="text-[10px] text-[#93939f]">
                      {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Performance Report */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                    <Target size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#616161]">Akurasi Stok</p>
                    <p className="text-xl font-semibold text-emerald-700">98.5%</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                    <Target size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#616161]">Picking Accuracy</p>
                    <p className="text-xl font-semibold text-blue-700">99.2%</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#ff7759] text-white">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#616161]">Human Error</p>
                    <p className="text-xl font-semibold text-[#ff7759]">-72%</p>
                  </div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#9b60aa] text-white">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-[#616161]">Packing Speed</p>
                    <p className="text-xl font-semibold text-[#9b60aa]">+45%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Picker Performance */}
            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Performa Picker</h3>
              <div className="space-y-3">
                {[
                  { name: "Picker Device 01", tasks: 45, accuracy: 99.5, avgTime: "3.2 min" },
                  { name: "Picker Device 02", tasks: 38, accuracy: 98.8, avgTime: "4.1 min" },
                  { name: "Picker Device 03", tasks: 42, accuracy: 99.1, avgTime: "3.8 min" },
                ].map((picker) => (
                  <div key={picker.name} className="flex items-center justify-between p-4 rounded-lg border border-[#e5e7eb]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f2f2f2] flex items-center justify-center">
                        <Users size={18} className="text-[#616161]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{picker.name}</p>
                        <p className="text-xs text-[#616161]">{picker.tasks} tasks completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-emerald-700">{picker.accuracy}%</p>
                        <p className="text-[10px] text-[#93939f]">Accuracy</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-[#212121]">{picker.avgTime}</p>
                        <p className="text-[10px] text-[#93939f]">Avg Time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Packer Performance */}
            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Performa Packing</h3>
              <div className="space-y-3">
                {[
                  { name: "Packing Station 01", tasks: 52, accuracy: 99.8, avgTime: "2.8 min" },
                  { name: "Packing Station 02", tasks: 48, accuracy: 99.5, avgTime: "3.2 min" },
                ].map((packer) => (
                  <div key={packer.name} className="flex items-center justify-between p-4 rounded-lg border border-[#e5e7eb]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#f2f2f2] flex items-center justify-center">
                        <Package size={18} className="text-[#616161]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{packer.name}</p>
                        <p className="text-xs text-[#616161]">{packer.tasks} tasks completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-emerald-700">{packer.accuracy}%</p>
                        <p className="text-[10px] text-[#93939f]">Accuracy</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-[#212121]">{packer.avgTime}</p>
                        <p className="text-[10px] text-[#93939f]">Avg Time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
