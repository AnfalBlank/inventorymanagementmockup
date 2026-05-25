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
import {
  Package,
  FolderTree,
  Building2,
  Users,
  Warehouse,
  LayoutGrid,
  Plus,
  Search,
  Edit,
  Trash2,
} from "lucide-react";

type TabType = "products" | "categories" | "suppliers" | "customers" | "warehouses" | "racks";

export default function MasterDataPage() {
  const { products, categories, suppliers, customers, warehouses, racks } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs: { key: TabType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "products", label: "Produk", icon: <Package size={16} />, count: products.length },
    { key: "categories", label: "Kategori", icon: <FolderTree size={16} />, count: categories.length },
    { key: "suppliers", label: "Supplier", icon: <Building2 size={16} />, count: suppliers.length },
    { key: "customers", label: "Customer", icon: <Users size={16} />, count: customers.length },
    { key: "warehouses", label: "Gudang", icon: <Warehouse size={16} />, count: warehouses.length },
    { key: "racks", label: "Rak", icon: <LayoutGrid size={16} />, count: racks.length },
  ];

  const getModalTitle = () => {
    const labels: Record<TabType, string> = {
      products: "Tambah Produk",
      categories: "Tambah Kategori",
      suppliers: "Tambah Supplier",
      customers: "Tambah Customer",
      warehouses: "Tambah Gudang",
      racks: "Tambah Rak",
    };
    return labels[activeTab];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Master Data</h1>
            <p className="text-sm text-[#616161] mt-1">Kelola data produk, supplier, gudang, dan lainnya</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
            {getModalTitle()}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#f2f2f2] rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(""); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.key
                  ? "bg-white text-[#212121] shadow-sm"
                  : "text-[#616161] hover:text-[#212121]"
              )}
            >
              {tab.icon}
              {tab.label}
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                activeTab === tab.key ? "bg-[#003c33] text-white" : "bg-[#e5e7eb] text-[#616161]"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#93939f]" />
          <input
            type="text"
            placeholder="Cari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#d9d9dd] rounded-lg placeholder:text-[#93939f] focus:outline-none focus:border-[#9b60aa]"
          />
        </div>

        {/* Tables */}
        <Card padding="sm">
          {activeTab === "products" && (
            <DataTable
              columns={[
                { key: "sku", header: "SKU", render: (item) => <span className="font-mono text-xs font-medium">{item.sku}</span> },
                { key: "name", header: "Nama Produk" },
                { key: "barcode", header: "Barcode", render: (item) => <span className="font-mono text-xs">{item.barcode}</span> },
                { key: "categoryName", header: "Kategori" },
                { key: "color", header: "Warna", render: (item) => <span>{item.color || "-"}</span> },
                { key: "unit", header: "Satuan" },
                { key: "minStock", header: "Min Stock", render: (item) => <span className="font-medium">{item.minStock}</span> },
                {
                  key: "actions", header: "",
                  render: () => (
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); toast({ type: "info", title: "Mode edit", description: "Form edit akan terbuka" }); }} className="p-1.5 rounded hover:bg-[#f5f5f5]"><Edit size={14} className="text-[#616161]" /></button>
                      <button onClick={(e) => { e.stopPropagation(); toast({ type: "warning", title: "Konfirmasi hapus", description: "Item akan dihapus dari sistem" }); }} className="p-1.5 rounded hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
                    </div>
                  ),
                },
              ]}
              data={products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.id}
            />
          )}

          {activeTab === "categories" && (
            <DataTable
              columns={[
                { key: "name", header: "Nama Kategori", render: (item) => <span className="font-medium">{item.name}</span> },
                { key: "description", header: "Deskripsi", render: (item) => <span className="text-[#616161]">{item.description || "-"}</span> },
                { key: "productCount", header: "Jumlah Produk", render: (item) => <span className="font-medium">{item.productCount}</span> },
                {
                  key: "actions", header: "",
                  render: () => (
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); toast({ type: "info", title: "Mode edit", description: "Form edit akan terbuka" }); }} className="p-1.5 rounded hover:bg-[#f5f5f5]"><Edit size={14} className="text-[#616161]" /></button>
                      <button onClick={(e) => { e.stopPropagation(); toast({ type: "warning", title: "Konfirmasi hapus", description: "Item akan dihapus dari sistem" }); }} className="p-1.5 rounded hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
                    </div>
                  ),
                },
              ]}
              data={categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.id}
            />
          )}

          {activeTab === "suppliers" && (
            <DataTable
              columns={[
                { key: "name", header: "Nama Supplier", render: (item) => <span className="font-medium">{item.name}</span> },
                { key: "contactPerson", header: "Contact Person" },
                { key: "phone", header: "Telepon" },
                { key: "email", header: "Email" },
                {
                  key: "isActive", header: "Status",
                  render: (item) => (
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600")}>
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  ),
                },
                {
                  key: "actions", header: "",
                  render: () => (
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); toast({ type: "info", title: "Mode edit", description: "Form edit akan terbuka" }); }} className="p-1.5 rounded hover:bg-[#f5f5f5]"><Edit size={14} className="text-[#616161]" /></button>
                    </div>
                  ),
                },
              ]}
              data={suppliers.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.id}
            />
          )}

          {activeTab === "customers" && (
            <DataTable
              columns={[
                { key: "name", header: "Nama Customer", render: (item) => <span className="font-medium">{item.name}</span> },
                { key: "phone", header: "Telepon" },
                { key: "email", header: "Email" },
                { key: "city", header: "Kota" },
                { key: "address", header: "Alamat", render: (item) => <span className="text-xs text-[#616161] truncate max-w-[200px] block">{item.address}</span> },
                {
                  key: "actions", header: "",
                  render: () => (
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); toast({ type: "info", title: "Mode edit", description: "Form edit akan terbuka" }); }} className="p-1.5 rounded hover:bg-[#f5f5f5]"><Edit size={14} className="text-[#616161]" /></button>
                    </div>
                  ),
                },
              ]}
              data={customers.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.id}
            />
          )}

          {activeTab === "warehouses" && (
            <DataTable
              columns={[
                { key: "code", header: "Kode", render: (item) => <span className="font-mono text-xs font-medium">{item.code}</span> },
                { key: "name", header: "Nama Gudang", render: (item) => <span className="font-medium">{item.name}</span> },
                { key: "address", header: "Alamat", render: (item) => <span className="text-xs text-[#616161]">{item.address}</span> },
                { key: "rackCount", header: "Jumlah Rak", render: (item) => <span className="font-medium">{item.rackCount}</span> },
                {
                  key: "isActive", header: "Status",
                  render: (item) => (
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600")}>
                      {item.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  ),
                },
                {
                  key: "actions", header: "",
                  render: () => (
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); toast({ type: "info", title: "Mode edit", description: "Form edit akan terbuka" }); }} className="p-1.5 rounded hover:bg-[#f5f5f5]"><Edit size={14} className="text-[#616161]" /></button>
                    </div>
                  ),
                },
              ]}
              data={warehouses.filter((w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.id}
            />
          )}

          {activeTab === "racks" && (
            <DataTable
              columns={[
                { key: "code", header: "Kode Rak", render: (item) => <span className="font-mono text-xs font-medium bg-[#f2f2f2] px-2 py-0.5 rounded">{item.code}</span> },
                { key: "warehouseName", header: "Gudang" },
                { key: "zone", header: "Zone", render: (item) => <span className="font-medium">{item.zone}</span> },
                { key: "row", header: "Row" },
                { key: "level", header: "Level" },
                { key: "capacity", header: "Kapasitas", render: (item) => <span>{item.capacity}</span> },
                {
                  key: "load", header: "Terisi",
                  render: (item) => (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[#f2f2f2] rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", item.currentLoad / item.capacity > 0.8 ? "bg-amber-500" : "bg-emerald-500")}
                          style={{ width: `${(item.currentLoad / item.capacity) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs">{item.currentLoad}/{item.capacity}</span>
                    </div>
                  ),
                },
              ]}
              data={racks.filter((r) => r.code.toLowerCase().includes(searchQuery.toLowerCase()) || r.warehouseName.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.id}
            />
          )}
        </Card>

        {/* Add Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={getModalTitle()} size="lg">
          <div className="space-y-4">
            {activeTab === "products" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="SKU" placeholder="SKU-XXX" />
                  <Input label="Barcode" placeholder="Barcode produk" />
                </div>
                <Input label="Nama Produk" placeholder="Nama lengkap produk" />
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Kategori" options={[{ value: "", label: "Pilih kategori..." }, ...categories.map((c) => ({ value: c.id, label: c.name }))]} />
                  <Input label="Warna" placeholder="Opsional" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Min Stock" type="number" placeholder="0" />
                  <Input label="Max Stock" type="number" placeholder="0" />
                  <Input label="Satuan" placeholder="pcs" />
                </div>
              </>
            )}
            {activeTab === "categories" && (
              <>
                <Input label="Nama Kategori" placeholder="Nama kategori" />
                <Textarea label="Deskripsi" placeholder="Deskripsi kategori (opsional)" rows={3} />
              </>
            )}
            {activeTab === "suppliers" && (
              <>
                <Input label="Nama Supplier" placeholder="Nama perusahaan" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Contact Person" placeholder="Nama kontak" />
                  <Input label="Telepon" placeholder="021-XXXXXXX" />
                </div>
                <Input label="Email" type="email" placeholder="email@supplier.com" />
                <Textarea label="Alamat" placeholder="Alamat lengkap" rows={2} />
              </>
            )}
            {activeTab === "customers" && (
              <>
                <Input label="Nama Customer" placeholder="Nama customer" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Telepon" placeholder="08XXXXXXXXXX" />
                  <Input label="Email" type="email" placeholder="email@customer.com" />
                </div>
                <Input label="Kota" placeholder="Kota" />
                <Textarea label="Alamat" placeholder="Alamat lengkap" rows={2} />
              </>
            )}
            {activeTab === "warehouses" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Kode Gudang" placeholder="WH-XXX-XX" />
                  <Input label="Nama Gudang" placeholder="Nama gudang" />
                </div>
                <Textarea label="Alamat" placeholder="Alamat lengkap gudang" rows={2} />
              </>
            )}
            {activeTab === "racks" && (
              <>
                <Select label="Gudang" options={[{ value: "", label: "Pilih gudang..." }, ...warehouses.map((w) => ({ value: w.id, label: w.name }))]} />
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Zone" placeholder="A" />
                  <Input label="Row" placeholder="01" />
                  <Input label="Level" placeholder="01" />
                </div>
                <Input label="Kapasitas" type="number" placeholder="100" />
              </>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Data tersimpan", description: `${getModalTitle()} berhasil ditambahkan` });
                setShowAddModal(false);
              }}>Simpan</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
