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
import {
  Settings,
  Users,
  Shield,
  Smartphone,
  Bell,
  Database,
  FileText,
  Plus,
} from "lucide-react";

type TabType = "general" | "users" | "devices" | "audit";

export default function SettingsPage() {
  const { auditLogs } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

  const handleSave = (section: string) => {
    toast({ type: "success", title: "Tersimpan", description: `Pengaturan ${section} berhasil diperbarui` });
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "general", label: "General", icon: <Settings size={16} /> },
    { key: "users", label: "Users & Roles", icon: <Users size={16} /> },
    { key: "devices", label: "Devices", icon: <Smartphone size={16} /> },
    { key: "audit", label: "Audit Trail", icon: <FileText size={16} /> },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Settings</h1>
          <p className="text-sm text-[#616161] mt-1">Konfigurasi sistem dan manajemen pengguna</p>
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

        {/* General Settings */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Pengaturan Umum</h3>
              <div className="space-y-4">
                <Input label="Nama Perusahaan" defaultValue="PT. Manggala Utama Indonesia" />
                <Input label="Alamat" defaultValue="Jl. Industri No. 45, Jakarta Utara" />
                <Select
                  label="Timezone"
                  options={[
                    { value: "Asia/Jakarta", label: "WIB (UTC+7)" },
                    { value: "Asia/Makassar", label: "WITA (UTC+8)" },
                    { value: "Asia/Jayapura", label: "WIT (UTC+9)" },
                  ]}
                />
                <Button onClick={() => handleSave("Pengaturan Umum")}>Simpan Perubahan</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Notifikasi</h3>
              <div className="space-y-4">
                {[
                  { label: "Order Baru", description: "Notifikasi saat ada order masuk", enabled: true },
                  { label: "Low Stock Alert", description: "Notifikasi saat stok di bawah minimum", enabled: true },
                  { label: "Picking Complete", description: "Notifikasi saat picking selesai", enabled: true },
                  { label: "Packing Complete", description: "Notifikasi saat packing selesai", enabled: false },
                  { label: "Return Created", description: "Notifikasi saat ada retur baru", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb]">
                    <div>
                      <p className="text-sm font-medium text-[#212121]">{item.label}</p>
                      <p className="text-xs text-[#616161]">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-9 h-5 bg-[#d9d9dd] peer-focus:ring-2 peer-focus:ring-[#9b60aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#003c33]" />
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Inventory Rules</h3>
              <div className="space-y-4">
                <Select
                  label="Metode Stok"
                  options={[
                    { value: "fifo", label: "FIFO (First In First Out)" },
                    { value: "fefo", label: "FEFO (First Expired First Out)" },
                    { value: "lifo", label: "LIFO (Last In First Out)" },
                  ]}
                />
                <Input label="Default Min Stock" type="number" defaultValue="10" />
                <Input label="Low Stock Threshold (%)" type="number" defaultValue="20" />
                <Button onClick={() => handleSave("Inventory Rules")}>Simpan</Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Security</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">HTTPS Aktif</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">JWT Authentication Aktif</span>
                  </div>
                </div>
                <Input label="Session Timeout (menit)" type="number" defaultValue="60" />
                <Input label="Max Login Attempts" type="number" defaultValue="5" />
                <Button onClick={() => handleSave("Security")}>Simpan</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Users & Roles */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button icon={<Plus size={16} />} onClick={() => setShowAddUserModal(true)}>Tambah User</Button>
            </div>
            <Card padding="sm">
              <DataTable
                columns={[
                  { key: "name", header: "Nama", render: () => <span className="font-medium">Admin Gudang</span> },
                  { key: "email", header: "Email", render: () => <span>admin@manggala.co.id</span> },
                  { key: "role", header: "Role", render: () => <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#003c33] text-white">Super Admin</span> },
                  { key: "status", header: "Status", render: () => <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Aktif</span> },
                ]}
                data={[{ id: "1" }, { id: "2" }, { id: "3" }]}
                keyExtractor={(item) => (item as { id: string }).id}
              />
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Role Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { role: "Super Admin", permissions: "Full akses", color: "bg-[#003c33]" },
                  { role: "Admin Gudang", permissions: "Inventory & monitoring", color: "bg-blue-600" },
                  { role: "Purchasing", permissions: "PO & supplier", color: "bg-purple-600" },
                  { role: "Sales Online", permissions: "Sales order", color: "bg-amber-600" },
                  { role: "Supervisor", permissions: "Monitoring & override", color: "bg-teal-600" },
                ].map((item) => (
                  <div key={item.role} className="p-4 rounded-lg border border-[#e5e7eb]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("w-3 h-3 rounded-full", item.color)} />
                      <p className="text-sm font-medium">{item.role}</p>
                    </div>
                    <p className="text-xs text-[#616161]">{item.permissions}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Devices */}
        {activeTab === "devices" && (
          <div className="space-y-4">
            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Device Whitelist</h3>
              <p className="text-sm text-[#616161] mb-4">
                Perangkat picker dan packer yang terdaftar. Hanya perangkat terdaftar yang dapat mengakses interface operasional.
              </p>
              <div className="space-y-3">
                {[
                  { name: "Picker Device 01", area: "Zone A", status: "active", lastSeen: "2 menit lalu" },
                  { name: "Picker Device 02", area: "Zone B", status: "active", lastSeen: "5 menit lalu" },
                  { name: "Picker Device 03", area: "Zone A-B", status: "inactive", lastSeen: "2 jam lalu" },
                  { name: "Packing Station 01", area: "Packing Area", status: "active", lastSeen: "1 menit lalu" },
                  { name: "Packing Station 02", area: "Packing Area", status: "active", lastSeen: "3 menit lalu" },
                  { name: "Queue Monitor", area: "Packing Area", status: "active", lastSeen: "Baru saja" },
                ].map((device) => (
                  <div key={device.name} className="flex items-center justify-between p-4 rounded-lg border border-[#e5e7eb]">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        device.status === "active" ? "bg-emerald-100" : "bg-gray-100"
                      )}>
                        <Smartphone size={18} className={device.status === "active" ? "text-emerald-600" : "text-gray-400"} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#212121]">{device.name}</p>
                        <p className="text-xs text-[#616161]">{device.area}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        device.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                      )}>
                        {device.status === "active" ? "Online" : "Offline"}
                      </span>
                      <p className="text-[10px] text-[#93939f] mt-1">{device.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" icon={<Plus size={16} />} onClick={() => setShowAddDeviceModal(true)}>Tambah Device</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Audit Trail */}
        {activeTab === "audit" && (
          <Card padding="sm">
            <DataTable
              columns={[
                { key: "createdAt", header: "Waktu", render: (item) => <span className="text-xs text-[#616161]">{new Date(item.createdAt).toLocaleString("id-ID")}</span> },
                {
                  key: "action", header: "Aksi",
                  render: (item) => (
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      item.action === "CREATE" ? "bg-emerald-100 text-emerald-700" :
                      item.action === "UPDATE" ? "bg-blue-100 text-blue-700" :
                      item.action === "DELETE" ? "bg-red-100 text-red-700" :
                      "bg-purple-100 text-purple-700"
                    )}>
                      {item.action}
                    </span>
                  ),
                },
                { key: "entity", header: "Entity", render: (item) => <span className="font-mono text-xs">{item.entity}</span> },
                { key: "details", header: "Detail", render: (item) => <span className="text-xs">{item.details}</span> },
                { key: "userName", header: "User", render: (item) => <span className="text-xs">{item.userName}</span> },
              ]}
              data={auditLogs}
              keyExtractor={(item) => item.id}
            />
          </Card>
        )}

        {/* Add User Modal */}
        <Modal isOpen={showAddUserModal} onClose={() => setShowAddUserModal(false)} title="Tambah User Baru" size="md">
          <div className="space-y-4">
            <Input label="Nama Lengkap" placeholder="Nama user" />
            <Input label="Email" type="email" placeholder="email@manggala.co.id" />
            <Select
              label="Role"
              options={[
                { value: "", label: "Pilih role..." },
                { value: "super_admin", label: "Super Admin" },
                { value: "admin_gudang", label: "Admin Gudang" },
                { value: "purchasing", label: "Purchasing" },
                { value: "sales_online", label: "Sales Online" },
                { value: "supervisor", label: "Supervisor" },
              ]}
            />
            <Input label="Password Sementara" type="password" placeholder="Min 8 karakter" />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddUserModal(false)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "User berhasil dibuat", description: "Email aktivasi telah dikirim" });
                setShowAddUserModal(false);
              }}>Tambah User</Button>
            </div>
          </div>
        </Modal>

        {/* Add Device Modal */}
        <Modal isOpen={showAddDeviceModal} onClose={() => setShowAddDeviceModal(false)} title="Tambah Device Baru" size="md">
          <div className="space-y-4">
            <Input label="Nama Device" placeholder="contoh: Picker Device 04" />
            <Select
              label="Tipe Device"
              options={[
                { value: "", label: "Pilih tipe..." },
                { value: "picker", label: "Picker Device" },
                { value: "packer", label: "Packing Station" },
                { value: "queue_monitor", label: "Queue Monitor" },
              ]}
            />
            <Input label="Area / Zone" placeholder="contoh: Zone A" />
            <Input label="MAC Address" placeholder="00:00:00:00:00:00" />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddDeviceModal(false)}>Batal</Button>
              <Button onClick={() => {
                toast({ type: "success", title: "Device terdaftar", description: "Device telah ditambahkan ke whitelist" });
                setShowAddDeviceModal(false);
              }}>Daftarkan Device</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
