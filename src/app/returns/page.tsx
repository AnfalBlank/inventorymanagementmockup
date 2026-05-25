"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DataTable } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Return } from "@/types";
import { Plus, Search, Eye, RotateCcw } from "lucide-react";

const returnStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  inspecting: { label: "Inspecting", className: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  completed: { label: "Completed", className: "bg-gray-100 text-gray-700" },
};

export default function ReturnsPage() {
  const { returns, customers, products } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReturns = returns.filter((r) =>
    r.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.referenceOrder.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Return Management</h1>
            <p className="text-sm text-[#616161] mt-1">Kelola retur customer dan supplier</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
            Buat Retur Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Retur", value: returns.length, color: "bg-[#17171c]" },
            { label: "Pending", value: returns.filter((r) => r.status === "pending").length, color: "bg-amber-500" },
            { label: "Inspecting", value: returns.filter((r) => r.status === "inspecting").length, color: "bg-blue-500" },
            { label: "Completed", value: returns.filter((r) => r.status === "completed").length, color: "bg-emerald-500" },
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

        {/* Search */}
        <Card padding="sm">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
            <input
              type="text"
              placeholder="Cari nomor retur atau referensi order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8f8f8] border border-transparent rounded-lg placeholder:text-[#93939f] focus:outline-none focus:bg-white focus:border-[#d9d9dd]"
            />
          </div>
        </Card>

        {/* Table */}
        <Card padding="sm">
          <DataTable
            columns={[
              { key: "returnNumber", header: "No. Retur", render: (item) => <span className="font-mono text-xs font-medium text-[#1863dc]">{item.returnNumber}</span> },
              {
                key: "type", header: "Tipe",
                render: (item) => (
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", item.type === "customer" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}>
                    {item.type === "customer" ? "Customer" : "Supplier"}
                  </span>
                ),
              },
              { key: "referenceOrder", header: "Ref. Order", render: (item) => <span className="font-mono text-xs">{item.referenceOrder}</span> },
              { key: "reason", header: "Alasan" },
              {
                key: "status", header: "Status",
                render: (item) => {
                  const config = returnStatusConfig[item.status];
                  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.className)}>{config.label}</span>;
                },
              },
              { key: "createdAt", header: "Tanggal", render: (item) => <span className="text-xs text-[#616161]">{formatDate(item.createdAt)}</span> },
              {
                key: "actions", header: "",
                render: (item) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedReturn(item); setShowDetailModal(true); }}
                    className="p-1.5 rounded hover:bg-[#f5f5f5]"
                  >
                    <Eye size={16} className="text-[#616161]" />
                  </button>
                ),
              },
            ]}
            data={filteredReturns}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => { setSelectedReturn(item); setShowDetailModal(true); }}
          />
        </Card>

        {/* Create Return Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Buat Retur Baru" size="lg">
          <div className="space-y-4">
            <Select
              label="Tipe Retur"
              options={[{ value: "customer", label: "Retur Customer" }, { value: "supplier", label: "Retur Supplier" }]}
            />
            <Input label="Referensi Order" placeholder="Nomor SO/PO terkait" />
            <Textarea label="Alasan Retur" placeholder="Jelaskan alasan retur..." rows={3} />
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#212121] mb-3">Item Retur</h3>
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <Select label="Produk" options={[{ value: "", label: "Pilih produk..." }, ...products.map((p) => ({ value: p.id, label: `${p.sku} - ${p.name}` }))]} />
                </div>
                <div className="col-span-2">
                  <Input label="Qty" type="number" placeholder="0" />
                </div>
                <div className="col-span-3">
                  <Select label="Kondisi" options={[{ value: "good", label: "Baik" }, { value: "damaged", label: "Rusak" }, { value: "defective", label: "Cacat" }]} />
                </div>
                <div className="col-span-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ type: "info", title: "Item ditambahkan", description: "Pilih produk lain untuk menambah" })}>+ Tambah</Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Retur tercatat", description: "Tim akan melakukan inspeksi" });
                setShowCreateModal(false);
              }}>Buat Retur</Button>
            </div>
          </div>
        </Modal>

        {/* Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail Retur ${selectedReturn?.returnNumber || ""}`} size="lg">
          {selectedReturn && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Tipe</p>
                  <p className="text-sm font-medium mt-1 capitalize">{selectedReturn.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Status</p>
                  <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1", returnStatusConfig[selectedReturn.status].className)}>
                    {returnStatusConfig[selectedReturn.status].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Referensi Order</p>
                  <p className="text-sm font-mono mt-1">{selectedReturn.referenceOrder}</p>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Alasan</p>
                  <p className="text-sm mt-1">{selectedReturn.reason}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#212121] mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedReturn.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb]">
                      <div>
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-[#616161]">{item.sku} • Qty: {item.qty}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        item.condition === "good" ? "bg-emerald-100 text-emerald-700" :
                        item.condition === "damaged" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {item.condition === "good" ? "Baik" : item.condition === "damaged" ? "Rusak" : "Cacat"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
