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
import { formatDate, formatCurrency } from "@/lib/utils";
import type { PurchaseOrder } from "@/types";
import { Plus, Search, Eye, Truck } from "lucide-react";

const poStatusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
  ordered: { label: "Ordered", className: "bg-blue-100 text-blue-700" },
  partial: { label: "Partial", className: "bg-amber-100 text-amber-700" },
  received: { label: "Received", className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
};

export default function PurchaseOrdersPage() {
  const { purchaseOrders, suppliers, products } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const filteredPOs = purchaseOrders.filter((po) =>
    po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Purchase Order</h1>
            <p className="text-sm text-[#616161] mt-1">Kelola pembelian dan penerimaan barang dari supplier</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
            Buat PO Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total PO", value: purchaseOrders.length, color: "bg-[#17171c]" },
            { label: "Ordered", value: purchaseOrders.filter((p) => p.status === "ordered").length, color: "bg-blue-500" },
            { label: "Partial", value: purchaseOrders.filter((p) => p.status === "partial").length, color: "bg-amber-500" },
            { label: "Received", value: purchaseOrders.filter((p) => p.status === "received").length, color: "bg-emerald-500" },
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
              placeholder="Cari PO atau supplier..."
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
              { key: "poNumber", header: "No. PO", render: (item) => <span className="font-mono text-xs font-medium text-[#1863dc]">{item.poNumber}</span> },
              { key: "supplierName", header: "Supplier" },
              { key: "totalItems", header: "Items", render: (item) => <span>{item.totalItems} SKU</span> },
              {
                key: "status", header: "Status",
                render: (item) => {
                  const config = poStatusConfig[item.status];
                  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.className)}>{config.label}</span>;
                },
              },
              { key: "expectedDate", header: "Tgl Diharapkan", render: (item) => <span className="text-xs">{item.expectedDate}</span> },
              { key: "createdAt", header: "Dibuat", render: (item) => <span className="text-xs text-[#616161]">{formatDate(item.createdAt)}</span> },
              {
                key: "actions", header: "",
                render: (item) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedPO(item); setShowDetailModal(true); }}
                    className="p-1.5 rounded hover:bg-[#f5f5f5]"
                  >
                    <Eye size={16} className="text-[#616161]" />
                  </button>
                ),
              },
            ]}
            data={filteredPOs}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => { setSelectedPO(item); setShowDetailModal(true); }}
          />
        </Card>

        {/* Create PO Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Buat Purchase Order" size="xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Supplier"
                options={[{ value: "", label: "Pilih supplier..." }, ...suppliers.map((s) => ({ value: s.id, label: s.name }))]}
              />
              <Input label="Tanggal Diharapkan" type="date" />
            </div>
            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#212121] mb-3">Item PO</h3>
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  <Select label="Produk" options={[{ value: "", label: "Pilih produk..." }, ...products.map((p) => ({ value: p.id, label: `${p.sku} - ${p.name}` }))]} />
                </div>
                <div className="col-span-2">
                  <Input label="Qty" type="number" placeholder="0" />
                </div>
                <div className="col-span-3">
                  <Input label="Harga Satuan" type="number" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ type: "info", title: "Item ditambahkan", description: "Pilih produk lain untuk menambah" })}>+ Tambah</Button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-[#f8f8f8] rounded-lg text-center text-sm text-[#93939f]">
                Belum ada item ditambahkan
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Purchase Order dibuat", description: "PO siap dikirim ke supplier" });
                setShowCreateModal(false);
              }}>Buat PO</Button>
            </div>
          </div>
        </Modal>

        {/* Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail PO ${selectedPO?.poNumber || ""}`} size="xl">
          {selectedPO && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Supplier</p>
                  <p className="text-sm font-medium mt-1">{selectedPO.supplierName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Status</p>
                  <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1", poStatusConfig[selectedPO.status].className)}>
                    {poStatusConfig[selectedPO.status].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Tanggal Diharapkan</p>
                  <p className="text-sm mt-1">{selectedPO.expectedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Tanggal Diterima</p>
                  <p className="text-sm mt-1">{selectedPO.receivedDate || "-"}</p>
                </div>
              </div>
              <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#f8f8f8]">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#616161]">SKU</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#616161]">Produk</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-[#616161]">Qty Order</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-[#616161]">Qty Diterima</th>
                      <th className="px-4 py-2 text-right text-xs font-semibold text-[#616161]">Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f2f2]">
                    {selectedPO.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2.5 font-mono text-xs">{item.sku}</td>
                        <td className="px-4 py-2.5 text-sm">{item.productName}</td>
                        <td className="px-4 py-2.5 text-sm text-right">{item.qtyOrdered}</td>
                        <td className="px-4 py-2.5 text-sm text-right font-medium">
                          <span className={cn(item.qtyReceived === item.qtyOrdered ? "text-emerald-700" : "text-amber-700")}>
                            {item.qtyReceived}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedPO.status === "ordered" && (
                <div className="flex justify-end">
                  <Button icon={<Truck size={16} />} onClick={() => {
                    toast({ type: "success", title: "Penerimaan dicatat", description: `Barang dari PO ${selectedPO.poNumber} berhasil diterima` });
                    setShowDetailModal(false);
                  }}>Terima Barang</Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
