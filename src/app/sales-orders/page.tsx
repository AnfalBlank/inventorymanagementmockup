"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DataTable } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { StatusBadge, PriorityBadge } from "@/components/ui/StatusBadge";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { SalesOrder, OrderStatus } from "@/types";
import { Plus, Search, Filter, Eye, FileText } from "lucide-react";

export default function SalesOrdersPage() {
  const { salesOrders, customers, products } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  const filteredOrders = salesOrders.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "WAITING_PICK", label: "Menunggu Picking" },
    { value: "PICKING", label: "Sedang Picking" },
    { value: "READY_PACKING", label: "Siap Packing" },
    { value: "PACKING", label: "Sedang Packing" },
    { value: "PACKING_COMPLETE", label: "Packing Selesai" },
    { value: "READY_SHIPMENT", label: "Siap Kirim" },
    { value: "SHIPPED", label: "Terkirim" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Sales Order</h1>
            <p className="text-sm text-[#616161] mt-1">Kelola pesanan penjualan dan tracking status</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
            Buat Order Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", value: salesOrders.length, color: "bg-[#17171c]" },
            { label: "Waiting Pick", value: salesOrders.filter((o) => o.status === "WAITING_PICK").length, color: "bg-amber-500" },
            { label: "Picking", value: salesOrders.filter((o) => o.status === "PICKING").length, color: "bg-blue-500" },
            { label: "Ready Pack", value: salesOrders.filter((o) => o.status === "READY_PACKING").length, color: "bg-purple-500" },
            { label: "Shipped", value: salesOrders.filter((o) => o.status === "SHIPPED").length, color: "bg-emerald-500" },
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

        {/* Filters */}
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
              <input
                type="text"
                placeholder="Cari nomor order atau customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8f8f8] border border-transparent rounded-lg placeholder:text-[#93939f] focus:outline-none focus:bg-white focus:border-[#d9d9dd]"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-[#d9d9dd] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#9b60aa]"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Table */}
        <Card padding="sm">
          <DataTable
            columns={[
              { key: "orderNumber", header: "No. Order", render: (item) => <span className="font-mono text-xs font-medium text-[#1863dc]">{item.orderNumber}</span> },
              { key: "customerName", header: "Customer" },
              { key: "totalItems", header: "Items", render: (item) => <span>{item.totalItems} SKU</span> },
              { key: "totalQty", header: "Total Qty", render: (item) => <span className="font-medium">{item.totalQty}</span> },
              { key: "priority", header: "Prioritas", render: (item) => <PriorityBadge priority={item.priority} /> },
              { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
              { key: "createdAt", header: "Tanggal", render: (item) => <span className="text-xs text-[#616161]">{formatDate(item.createdAt)}</span> },
              {
                key: "actions", header: "",
                render: (item) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedOrder(item); setShowDetailModal(true); }}
                    className="p-1.5 rounded hover:bg-[#f5f5f5]"
                  >
                    <Eye size={16} className="text-[#616161]" />
                  </button>
                ),
              },
            ]}
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => { setSelectedOrder(item); setShowDetailModal(true); }}
          />
        </Card>

        {/* Create Order Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Buat Sales Order Baru" size="xl">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Customer"
                options={[{ value: "", label: "Pilih customer..." }, ...customers.map((c) => ({ value: c.id, label: c.name }))]}
              />
              <Select
                label="Prioritas"
                options={[{ value: "normal", label: "Normal" }, { value: "urgent", label: "Urgent" }]}
              />
            </div>

            <div className="border border-[#e5e7eb] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#212121] mb-3">Item Order</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6">
                    <Select
                      label="Produk"
                      options={[{ value: "", label: "Pilih produk..." }, ...products.map((p) => ({ value: p.id, label: `${p.sku} - ${p.name}` }))]}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input label="Qty" type="number" placeholder="0" />
                  </div>
                  <div className="col-span-3">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ type: "info", title: "Item ditambahkan", description: "Pilih produk lain untuk menambah" })}>+ Tambah</Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-[#f8f8f8] rounded-lg text-center text-sm text-[#93939f]">
                Belum ada item ditambahkan
              </div>
            </div>

            <Textarea label="Catatan" placeholder="Catatan order (opsional)" rows={2} />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Sales Order dibuat", description: "Picking task otomatis ter-generate" });
                setShowCreateModal(false);
              }}>Buat Order</Button>
            </div>
          </div>
        </Modal>

        {/* Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail Order ${selectedOrder?.orderNumber || ""}`} size="xl">
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Customer</p>
                  <p className="text-sm font-medium mt-1">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Status</p>
                  <div className="mt-1"><StatusBadge status={selectedOrder.status} /></div>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Prioritas</p>
                  <div className="mt-1"><PriorityBadge priority={selectedOrder.priority} /></div>
                </div>
                <div>
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Tanggal</p>
                  <p className="text-sm mt-1">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#212121] mb-3">Items</h3>
                <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#f8f8f8]">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#616161]">SKU</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#616161]">Produk</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#616161]">Lokasi</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-[#616161]">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-[#616161]">Picked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f2f2f2]">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2.5 font-mono text-xs">{item.sku}</td>
                          <td className="px-4 py-2.5 text-sm">{item.productName}</td>
                          <td className="px-4 py-2.5 font-mono text-xs">{item.rackLocation}</td>
                          <td className="px-4 py-2.5 text-sm text-right font-medium">{item.qty}</td>
                          <td className="px-4 py-2.5 text-sm text-right">
                            <span className={cn("font-medium", item.pickedQty === item.qty ? "text-emerald-700" : "text-amber-700")}>
                              {item.pickedQty}/{item.qty}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
