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
import type { StockTransfer } from "@/types";
import { ArrowRightLeft, Plus, Search, Eye, Truck, ArrowRight } from "lucide-react";

const transferStatusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-700" },
  received: { label: "Received", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default function StockTransferPage() {
  const { stockTransfers, warehouses, products } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);

  const filtered = stockTransfers.filter((t) =>
    t.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.fromWarehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.toWarehouseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Stock Transfer</h1>
            <p className="text-sm text-[#616161] mt-1">Kelola perpindahan stok antar gudang</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
            Buat Transfer Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Transfer", value: stockTransfers.length, color: "bg-[#17171c]" },
            { label: "Draft", value: stockTransfers.filter((t) => t.status === "draft").length, color: "bg-gray-500" },
            { label: "In Transit", value: stockTransfers.filter((t) => t.status === "in_transit").length, color: "bg-blue-500" },
            { label: "Received", value: stockTransfers.filter((t) => t.status === "received").length, color: "bg-emerald-500" },
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

        <Card padding="sm">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
            <input
              type="text"
              placeholder="Cari nomor transfer atau gudang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8f8f8] border border-transparent rounded-lg placeholder:text-[#93939f] focus:outline-none focus:bg-white focus:border-[#d9d9dd]"
            />
          </div>
        </Card>

        <Card padding="sm">
          <DataTable
            columns={[
              { key: "transferNumber", header: "No. Transfer", render: (item) => <span className="font-mono text-xs font-medium text-[#1863dc]">{item.transferNumber}</span> },
              {
                key: "route", header: "Rute",
                render: (item) => (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#212121]">{item.fromWarehouseName}</span>
                    <ArrowRight size={12} className="text-[#93939f]" />
                    <span className="text-[#212121] font-medium">{item.toWarehouseName}</span>
                  </div>
                ),
              },
              { key: "totalItems", header: "Items", render: (item) => <span>{item.totalItems} SKU</span> },
              {
                key: "status", header: "Status",
                render: (item) => {
                  const config = transferStatusConfig[item.status];
                  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.className)}>{config.label}</span>;
                },
              },
              { key: "createdBy", header: "Dibuat Oleh", render: (item) => <span className="text-xs">{item.createdBy}</span> },
              { key: "createdAt", header: "Tanggal", render: (item) => <span className="text-xs text-[#616161]">{formatDate(item.createdAt)}</span> },
              {
                key: "actions", header: "",
                render: (item) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedTransfer(item); setShowDetailModal(true); }}
                    className="p-1.5 rounded hover:bg-[#f5f5f5]"
                  >
                    <Eye size={16} className="text-[#616161]" />
                  </button>
                ),
              },
            ]}
            data={filtered}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => { setSelectedTransfer(item); setShowDetailModal(true); }}
          />
        </Card>

        {/* Create Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Buat Stock Transfer" size="xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Dari Gudang"
                options={[{ value: "", label: "Pilih gudang asal..." }, ...warehouses.map((w) => ({ value: w.id, label: w.name }))]}
              />
              <Select
                label="Ke Gudang"
                options={[{ value: "", label: "Pilih gudang tujuan..." }, ...warehouses.map((w) => ({ value: w.id, label: w.name }))]}
              />
            </div>
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#212121] mb-3">Item Transfer</h3>
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-7">
                  <Select
                    label="Produk"
                    options={[{ value: "", label: "Pilih produk..." }, ...products.map((p) => ({ value: p.id, label: `${p.sku} - ${p.name}` }))]}
                  />
                </div>
                <div className="col-span-3">
                  <Input label="Qty" type="number" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ type: "info", title: "Item ditambahkan", description: "Pilih produk lain untuk menambah" })}>+ Tambah</Button>
                </div>
              </div>
            </div>
            <Textarea label="Catatan" placeholder="Catatan transfer (opsional)" rows={2} />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Transfer dibuat", description: "Status transfer: in_transit" });
                setShowCreateModal(false);
              }}>Buat Transfer</Button>
            </div>
          </div>
        </Modal>

        {/* Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail ${selectedTransfer?.transferNumber || ""}`} size="lg">
          {selectedTransfer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Dari</p>
                  <p className="text-sm font-medium mt-1">{selectedTransfer.fromWarehouseName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Ke</p>
                  <p className="text-sm font-medium mt-1">{selectedTransfer.toWarehouseName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Status</p>
                  <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1", transferStatusConfig[selectedTransfer.status].className)}>
                    {transferStatusConfig[selectedTransfer.status].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Diterima</p>
                  <p className="text-sm mt-1">{selectedTransfer.receivedAt ? formatDate(selectedTransfer.receivedAt) : "-"}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#212121] mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedTransfer.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb]">
                      <div>
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-[#616161] font-mono">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.qty} pcs</p>
                        <p className={cn("text-xs", item.qtyReceived === item.qty ? "text-emerald-700" : "text-amber-700")}>
                          Diterima: {item.qtyReceived}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedTransfer.status === "in_transit" && (
                <div className="flex justify-end">
                  <Button icon={<Truck size={16} />} onClick={() => {
                    toast({ type: "success", title: "Transfer diterima", description: `${selectedTransfer.transferNumber} berhasil dikonfirmasi` });
                    setShowDetailModal(false);
                  }}>Konfirmasi Diterima</Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
