"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/Table";
import { toast } from "@/components/ui/Toast";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import {
  Search,
  Calendar,
  AlertTriangle,
  Layers,
  Filter,
  Download,
} from "lucide-react";

const batchStatusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  expiring_soon: { label: "Expiring Soon", className: "bg-amber-100 text-amber-700" },
  expired: { label: "Expired", className: "bg-red-100 text-red-700" },
  depleted: { label: "Depleted", className: "bg-gray-100 text-gray-700" },
};

export default function BatchTrackingPage() {
  const { batches } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = batches.filter((b) => {
    const matchSearch = b.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getDaysUntilExpiry = (expiryDate: string) => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const expiringSoon = batches.filter((b) => b.status === "expiring_soon");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Batch Tracking</h1>
            <p className="text-sm text-[#616161] mt-1">Lacak batch produk dengan FIFO/FEFO automation</p>
          </div>
          <Button variant="outline" icon={<Download size={16} />} onClick={() => toast({ type: "success", title: "Export dimulai", description: "File CSV akan diunduh sebentar lagi" })}>
            Export Laporan
          </Button>
        </div>

        {/* Alerts */}
        {expiringSoon.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">
                  {expiringSoon.length} batch akan kedaluwarsa dalam waktu dekat
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Sistem akan memprioritaskan batch ini untuk dikeluarkan terlebih dahulu (FEFO)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Batch", value: batches.length, color: "bg-[#17171c]", icon: <Layers size={18} /> },
            { label: "Active", value: batches.filter((b) => b.status === "active").length, color: "bg-emerald-500", icon: <Layers size={18} /> },
            { label: "Expiring Soon", value: expiringSoon.length, color: "bg-amber-500", icon: <AlertTriangle size={18} /> },
            { label: "Total Stok", value: batches.reduce((s, b) => s + b.qtyAvailable, 0), color: "bg-[#003c33]", icon: <Layers size={18} /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-[#e5e7eb] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#616161]">{stat.label}</p>
                  <p className="text-2xl font-semibold text-[#212121] mt-1">{stat.value}</p>
                </div>
                <div className={cn("p-2 rounded-lg text-white", stat.color)}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
              <input
                type="text"
                placeholder="Cari batch, produk, atau SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8f8f8] border border-transparent rounded-lg placeholder:text-[#93939f] focus:outline-none focus:bg-white focus:border-[#d9d9dd]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#93939f]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-[#d9d9dd] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#9b60aa]"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="depleted">Depleted</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card padding="sm">
          <DataTable
            columns={[
              { key: "batchNumber", header: "Batch No.", render: (item) => <span className="font-mono text-xs font-medium">{item.batchNumber}</span> },
              { key: "sku", header: "SKU", render: (item) => <span className="font-mono text-xs">{item.sku}</span> },
              { key: "productName", header: "Produk" },
              {
                key: "manufactureDate", header: "Manufacture",
                render: (item) => (
                  <span className="text-xs flex items-center gap-1">
                    <Calendar size={11} className="text-[#93939f]" />
                    {item.manufactureDate}
                  </span>
                ),
              },
              {
                key: "expiryDate", header: "Expiry",
                render: (item) => {
                  const days = getDaysUntilExpiry(item.expiryDate);
                  return (
                    <div>
                      <span className={cn("text-xs flex items-center gap-1", days < 30 ? "text-amber-700 font-medium" : days < 0 ? "text-red-700" : "")}>
                        <Calendar size={11} />
                        {item.expiryDate}
                      </span>
                      <span className={cn("text-[10px]", days < 0 ? "text-red-600" : days < 30 ? "text-amber-600" : "text-[#93939f]")}>
                        {days < 0 ? `Expired ${Math.abs(days)} hari` : `${days} hari lagi`}
                      </span>
                    </div>
                  );
                },
              },
              { key: "warehouseName", header: "Lokasi", render: (item) => <span className="text-xs">{item.warehouseName} • <span className="font-mono">{item.rackCode}</span></span> },
              {
                key: "qty", header: "Stok",
                render: (item) => (
                  <div>
                    <span className="text-sm font-medium">{item.qtyAvailable}</span>
                    <span className="text-xs text-[#93939f]"> / {item.qtyReceived}</span>
                  </div>
                ),
              },
              {
                key: "status", header: "Status",
                render: (item) => {
                  const c = batchStatusConfig[item.status];
                  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", c.className)}>{c.label}</span>;
                },
              },
            ]}
            data={filtered}
            keyExtractor={(item) => item.id}
          />
        </Card>

        {/* FIFO/FEFO Info */}
        <Card>
          <h3 className="text-base font-semibold text-[#212121] mb-3">Inventory Rules Aktif</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-[#e5e7eb] bg-[#f8f8f8]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#003c33] text-white flex items-center justify-center font-mono text-sm font-semibold">
                  FIFO
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#212121]">First In First Out</p>
                  <p className="text-xs text-[#616161]">Batch terlama dikeluarkan terlebih dahulu</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-[#e5e7eb] bg-[#f8f8f8]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#9b60aa] text-white flex items-center justify-center font-mono text-sm font-semibold">
                  FEFO
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#212121]">First Expired First Out</p>
                  <p className="text-xs text-[#616161]">Batch dengan expiry terdekat diutamakan</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
