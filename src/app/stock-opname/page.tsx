"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { DataTable } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { StockOpname } from "@/types";
import {
  ClipboardList,
  Plus,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Building2,
  TrendingUp,
  ScanLine,
} from "lucide-react";

const opnameStatusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
};

export default function StockOpnamePage() {
  const { stockOpnames, warehouses } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOpname, setSelectedOpname] = useState<StockOpname | null>(null);
  const [actualQtyInput, setActualQtyInput] = useState<Record<string, string>>({});

  const inProgress = stockOpnames.find((o) => o.status === "in_progress");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Stock Opname</h1>
            <p className="text-sm text-[#616161] mt-1">Lakukan stock opname untuk akurasi stok fisik vs sistem</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
            Mulai Opname Baru
          </Button>
        </div>

        {/* Active Opname */}
        {inProgress && (
          <Card className="border-blue-200 bg-blue-50/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <p className="text-xs font-medium text-blue-700 uppercase tracking-wider">Sedang Berjalan</p>
                </div>
                <p className="text-lg font-semibold text-[#212121]">{inProgress.opnameNumber}</p>
                <p className="text-sm text-[#616161]">{inProgress.warehouseName}</p>
              </div>
              <Button size="sm" onClick={() => { setSelectedOpname(inProgress); setShowDetailModal(true); }}>
                Lanjutkan Opname
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-[#616161]">Progress</p>
                <p className="text-2xl font-semibold text-[#212121]">
                  {inProgress.countedItems}<span className="text-base text-[#93939f]">/{inProgress.totalItems}</span>
                </p>
                <div className="h-2 bg-[#f2f2f2] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(inProgress.countedItems / inProgress.totalItems) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-[#616161]">Diskrepansi</p>
                <p className={cn("text-2xl font-semibold", inProgress.discrepancies > 0 ? "text-amber-700" : "text-emerald-700")}>
                  {inProgress.discrepancies}
                </p>
                <p className="text-[10px] text-[#93939f] mt-2">items dengan selisih</p>
              </div>
              <div>
                <p className="text-xs text-[#616161]">Akurasi</p>
                <p className="text-2xl font-semibold text-emerald-700">
                  {inProgress.countedItems > 0
                    ? (((inProgress.countedItems - inProgress.discrepancies) / inProgress.countedItems) * 100).toFixed(1)
                    : "100"}%
                </p>
                <p className="text-[10px] text-[#93939f] mt-2">tingkat akurasi</p>
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Opname", value: stockOpnames.length, color: "bg-[#17171c]" },
            { label: "Draft", value: stockOpnames.filter((o) => o.status === "draft").length, color: "bg-gray-500" },
            { label: "In Progress", value: stockOpnames.filter((o) => o.status === "in_progress").length, color: "bg-blue-500" },
            { label: "Completed", value: stockOpnames.filter((o) => o.status === "completed").length, color: "bg-emerald-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-[#e5e7eb] p-4">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", stat.color)} />
                <span className="text-xs text-[#616161]">{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold text-[#212121] mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* History */}
        <Card padding="sm">
          <DataTable
            columns={[
              { key: "opnameNumber", header: "No. Opname", render: (item) => <span className="font-mono text-xs font-medium text-[#1863dc]">{item.opnameNumber}</span> },
              { key: "warehouseName", header: "Gudang" },
              { key: "scheduledDate", header: "Tanggal", render: (item) => <span className="text-xs">{item.scheduledDate}</span> },
              {
                key: "progress", header: "Progress",
                render: (item) => (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{item.countedItems}/{item.totalItems}</span>
                    <div className="w-20 h-1.5 bg-[#f2f2f2] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(item.countedItems / item.totalItems) * 100}%` }} />
                    </div>
                  </div>
                ),
              },
              {
                key: "discrepancies", header: "Diskrepansi",
                render: (item) => (
                  <span className={cn("text-xs font-medium", item.discrepancies > 0 ? "text-amber-700" : "text-emerald-700")}>
                    {item.discrepancies}
                  </span>
                ),
              },
              {
                key: "status", header: "Status",
                render: (item) => {
                  const c = opnameStatusConfig[item.status];
                  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", c.className)}>{c.label}</span>;
                },
              },
              {
                key: "actions", header: "",
                render: (item) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedOpname(item); setShowDetailModal(true); }}
                    className="p-1.5 rounded hover:bg-[#f5f5f5]"
                  >
                    <Eye size={16} className="text-[#616161]" />
                  </button>
                ),
              },
            ]}
            data={stockOpnames}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => { setSelectedOpname(item); setShowDetailModal(true); }}
          />
        </Card>

        {/* Create Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Mulai Stock Opname Baru" size="md">
          <div className="space-y-4">
            <Select
              label="Gudang"
              options={[{ value: "", label: "Pilih gudang..." }, ...warehouses.map((w) => ({ value: w.id, label: w.name }))]}
            />
            <Input label="Tanggal Pelaksanaan" type="date" />
            <Select
              label="Cakupan Opname"
              options={[
                { value: "all", label: "Semua produk" },
                { value: "category", label: "Per kategori" },
                { value: "rack", label: "Per rak" },
              ]}
            />
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Stock opname akan menghitung ulang stok fisik dengan data sistem. Pastikan tidak ada transaksi
                  picking/packing aktif selama proses.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Stock opname dimulai", description: "Counting sheet telah dibuat" });
                setShowCreateModal(false);
              }}>Mulai Opname</Button>
            </div>
          </div>
        </Modal>

        {/* Detail/Process Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Opname ${selectedOpname?.opnameNumber || ""}`} size="xl">
          {selectedOpname && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-[#f8f8f8]">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-[#616161]" />
                    <p className="text-xs text-[#616161]">Gudang</p>
                  </div>
                  <p className="text-sm font-medium mt-1">{selectedOpname.warehouseName}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f8]">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#616161]" />
                    <p className="text-xs text-[#616161]">Tanggal</p>
                  </div>
                  <p className="text-sm font-medium mt-1">{selectedOpname.scheduledDate}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f8]">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#616161]" />
                    <p className="text-xs text-[#616161]">Status</p>
                  </div>
                  <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1", opnameStatusConfig[selectedOpname.status].className)}>
                    {opnameStatusConfig[selectedOpname.status].label}
                  </span>
                </div>
              </div>

              {selectedOpname.items.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[#212121] mb-3">Counting Sheet</h3>
                  <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-[#f8f8f8]">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-[#616161]">SKU</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-[#616161]">Produk</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-[#616161]">Rak</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-[#616161]">Sistem</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-[#616161]">Aktual</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-[#616161]">Selisih</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-[#616161]">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f2f2f2]">
                        {selectedOpname.items.map((item) => (
                          <tr key={item.id} className={cn(item.isCounted ? "bg-white" : "bg-amber-50/30")}>
                            <td className="px-3 py-2.5 font-mono text-xs">{item.sku}</td>
                            <td className="px-3 py-2.5 text-sm">{item.productName}</td>
                            <td className="px-3 py-2.5 font-mono text-xs">{item.rackCode}</td>
                            <td className="px-3 py-2.5 text-sm text-right font-medium">{item.systemQty}</td>
                            <td className="px-3 py-2.5 text-sm text-right">
                              {item.isCounted ? (
                                <span className="font-medium">{item.actualQty}</span>
                              ) : (
                                <input
                                  type="number"
                                  value={actualQtyInput[item.id] || ""}
                                  onChange={(e) => setActualQtyInput({ ...actualQtyInput, [item.id]: e.target.value })}
                                  placeholder="0"
                                  className="w-20 px-2 py-1 text-sm border border-[#d9d9dd] rounded text-right focus:outline-none focus:border-[#9b60aa]"
                                />
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-sm text-right">
                              {item.isCounted ? (
                                <span className={cn("font-medium", item.difference === 0 ? "text-emerald-700" : item.difference > 0 ? "text-blue-700" : "text-red-700")}>
                                  {item.difference > 0 ? "+" : ""}{item.difference}
                                </span>
                              ) : <span className="text-[#93939f]">-</span>}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              {item.isCounted ? (
                                <CheckCircle2 size={16} className="text-emerald-600 mx-auto" />
                              ) : (
                                <button className="p-1 rounded hover:bg-[#f5f5f5]" title="Scan barcode">
                                  <ScanLine size={14} className="text-[#616161]" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedOpname.status === "in_progress" && (
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => toast({ type: "info", title: "Opname di-pause", description: "Anda dapat melanjutkan kapan saja" })}>Pause</Button>
                  <Button onClick={() => {
                    toast({ type: "success", title: "Stock opname selesai", description: `${selectedOpname.opnameNumber} berhasil ditutup` });
                    setShowDetailModal(false);
                  }}>Selesaikan Opname</Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
