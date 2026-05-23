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
import {
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightLeft,
  ClipboardList,
  Search,
  Filter,
  Plus,
} from "lucide-react";

type TabType = "stock" | "movements" | "adjustments";
type ModalType = "stock-in" | "stock-out" | "adjustment" | null;

export default function InventoryPage() {
  const { stockLevels, stockMovements, products, warehouses } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>("stock");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "stock", label: "Stok Realtime", icon: <Package size={16} /> },
    { key: "movements", label: "Mutasi Barang", icon: <ArrowRightLeft size={16} /> },
    { key: "adjustments", label: "Stock Opname", icon: <ClipboardList size={16} /> },
  ];

  const filteredStock = stockLevels.filter((s) => {
    const matchSearch = s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchWarehouse = filterWarehouse === "all" || s.warehouseId === filterWarehouse;
    return matchSearch && matchWarehouse;
  });

  const filteredMovements = stockMovements.filter((m) =>
    m.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const movementTypeLabel: Record<string, { label: string; color: string }> = {
    stock_in: { label: "Stock In", color: "text-emerald-700 bg-emerald-50" },
    stock_out: { label: "Stock Out", color: "text-red-700 bg-red-50" },
    transfer: { label: "Transfer", color: "text-blue-700 bg-blue-50" },
    adjustment: { label: "Adjustment", color: "text-amber-700 bg-amber-50" },
    reservation: { label: "Reservation", color: "text-purple-700 bg-purple-50" },
    return: { label: "Return", color: "text-orange-700 bg-orange-50" },
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Inventory</h1>
            <p className="text-sm text-[#616161] mt-1">Kelola stok, mutasi, dan stock opname</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<ArrowDownCircle size={16} />} onClick={() => setActiveModal("stock-in")}>
              Stock In
            </Button>
            <Button variant="outline" size="sm" icon={<ArrowUpCircle size={16} />} onClick={() => setActiveModal("stock-out")}>
              Stock Out
            </Button>
            <Button size="sm" icon={<Plus size={16} />} onClick={() => setActiveModal("adjustment")}>
              Adjustment
            </Button>
          </div>
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

        {/* Filters */}
        <Card padding="sm">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
              <input
                type="text"
                placeholder="Cari produk atau SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#f8f8f8] border border-transparent rounded-lg placeholder:text-[#93939f] focus:outline-none focus:bg-white focus:border-[#d9d9dd]"
              />
            </div>
            {activeTab === "stock" && (
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-[#93939f]" />
                <select
                  value={filterWarehouse}
                  onChange={(e) => setFilterWarehouse(e.target.value)}
                  className="text-sm border border-[#d9d9dd] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#9b60aa]"
                >
                  <option value="all">Semua Gudang</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Card>

        {/* Content */}
        {activeTab === "stock" && (
          <Card padding="sm">
            <DataTable
              columns={[
                { key: "sku", header: "SKU", render: (item) => <span className="font-mono text-xs">{item.sku}</span> },
                { key: "productName", header: "Produk" },
                { key: "warehouseName", header: "Gudang", render: (item) => <span className="text-xs">{item.warehouseName}</span> },
                { key: "rackCode", header: "Rak", render: (item) => <span className="font-mono text-xs bg-[#f2f2f2] px-2 py-0.5 rounded">{item.rackCode}</span> },
                {
                  key: "available", header: "Available",
                  render: (item) => <span className="font-semibold text-emerald-700">{item.available}</span>,
                },
                {
                  key: "reserved", header: "Reserved",
                  render: (item) => <span className="text-purple-700">{item.reserved}</span>,
                },
                {
                  key: "damaged", header: "Damaged",
                  render: (item) => <span className={item.damaged > 0 ? "text-red-700" : "text-[#93939f]"}>{item.damaged}</span>,
                },
                {
                  key: "total", header: "Total",
                  render: (item) => <span className="font-semibold">{item.total}</span>,
                },
                {
                  key: "status", header: "Status",
                  render: (item) => (
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      item.isLowStock ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    )}>
                      {item.isLowStock ? "Low Stock" : "Normal"}
                    </span>
                  ),
                },
              ]}
              data={filteredStock}
              keyExtractor={(item) => `${item.productId}-${item.warehouseId}`}
            />
          </Card>
        )}

        {activeTab === "movements" && (
          <Card padding="sm">
            <DataTable
              columns={[
                { key: "createdAt", header: "Tanggal", render: (item) => <span className="text-xs">{formatDate(item.createdAt)}</span> },
                {
                  key: "type", header: "Tipe",
                  render: (item) => {
                    const config = movementTypeLabel[item.type];
                    return <span className={cn("inline-flex px-2 py-0.5 rounded text-xs font-medium", config.color)}>{config.label}</span>;
                  },
                },
                { key: "sku", header: "SKU", render: (item) => <span className="font-mono text-xs">{item.sku}</span> },
                { key: "productName", header: "Produk" },
                { key: "qty", header: "Qty", render: (item) => <span className="font-semibold">{item.qty}</span> },
                { key: "from", header: "Dari", render: (item) => <span className="text-xs">{item.fromWarehouse || "-"}</span> },
                { key: "to", header: "Ke", render: (item) => <span className="text-xs">{item.toWarehouse || "-"}</span> },
                { key: "reference", header: "Referensi", render: (item) => <span className="font-mono text-xs text-[#1863dc]">{item.reference || "-"}</span> },
                { key: "createdBy", header: "Oleh", render: (item) => <span className="text-xs">{item.createdBy}</span> },
              ]}
              data={filteredMovements}
              keyExtractor={(item) => item.id}
            />
          </Card>
        )}

        {activeTab === "adjustments" && (
          <Card padding="lg">
            <div className="text-center py-12">
              <ClipboardList size={48} className="mx-auto text-[#93939f] mb-4" />
              <h3 className="text-lg font-semibold text-[#212121]">Stock Opname</h3>
              <p className="text-sm text-[#616161] mt-2 max-w-md mx-auto">
                Lakukan stock opname untuk memastikan akurasi stok fisik dengan data sistem.
                Klik tombol di bawah untuk membuka halaman Stock Opname.
              </p>
              <a href="/stock-opname">
                <Button className="mt-6" icon={<Plus size={16} />}>
                  Buka Stock Opname
                </Button>
              </a>
            </div>
          </Card>
        )}

        {/* Stock In Modal */}
        <Modal isOpen={activeModal === "stock-in"} onClose={() => setActiveModal(null)} title="Stock In - Penerimaan Barang" size="lg">
          <div className="space-y-4">
            <Select
              label="Produk"
              options={[
                { value: "", label: "Pilih produk..." },
                ...products.map((p) => ({ value: p.id, label: `${p.sku} - ${p.name}` })),
              ]}
            />
            <Select
              label="Gudang Tujuan"
              options={[
                { value: "", label: "Pilih gudang..." },
                ...warehouses.map((w) => ({ value: w.id, label: w.name })),
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity" type="number" placeholder="0" />
              <Input label="No. Referensi" placeholder="PO-XXXXXXXX-XXXX" />
            </div>
            <Input label="Catatan" placeholder="Opsional" />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setActiveModal(null)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Stock In berhasil", description: "Stok telah ditambahkan ke gudang" });
                setActiveModal(null);
              }}>Konfirmasi Stock In</Button>
            </div>
          </div>
        </Modal>

        {/* Stock Out Modal */}
        <Modal isOpen={activeModal === "stock-out"} onClose={() => setActiveModal(null)} title="Stock Out - Pengeluaran Barang" size="lg">
          <div className="space-y-4">
            <Select
              label="Produk"
              options={[
                { value: "", label: "Pilih produk..." },
                ...products.map((p) => ({ value: p.id, label: `${p.sku} - ${p.name}` })),
              ]}
            />
            <Select
              label="Gudang Asal"
              options={[
                { value: "", label: "Pilih gudang..." },
                ...warehouses.map((w) => ({ value: w.id, label: w.name })),
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity" type="number" placeholder="0" />
              <Select
                label="Alasan"
                options={[
                  { value: "sale", label: "Penjualan" },
                  { value: "damage", label: "Barang Rusak" },
                  { value: "expired", label: "Expired" },
                  { value: "other", label: "Lainnya" },
                ]}
              />
            </div>
            <Input label="Catatan" placeholder="Opsional" />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setActiveModal(null)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Stock Out berhasil", description: "Stok telah dikeluarkan dari gudang" });
                setActiveModal(null);
              }}>Konfirmasi Stock Out</Button>
            </div>
          </div>
        </Modal>

        {/* Adjustment Modal */}
        <Modal isOpen={activeModal === "adjustment"} onClose={() => setActiveModal(null)} title="Stock Adjustment" size="lg">
          <div className="space-y-4">
            <Select
              label="Produk"
              options={[
                { value: "", label: "Pilih produk..." },
                ...products.map((p) => ({ value: p.id, label: `${p.sku} - ${p.name}` })),
              ]}
            />
            <Select
              label="Gudang"
              options={[
                { value: "", label: "Pilih gudang..." },
                ...warehouses.map((w) => ({ value: w.id, label: w.name })),
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Qty Saat Ini" type="number" placeholder="0" disabled />
              <Input label="Qty Baru" type="number" placeholder="0" />
            </div>
            <Input label="Alasan Adjustment" placeholder="Masukkan alasan..." />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setActiveModal(null)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Adjustment tersimpan", description: "Perubahan stok telah dicatat di audit log" });
                setActiveModal(null);
              }}>Simpan Adjustment</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
