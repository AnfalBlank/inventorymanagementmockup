"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Workflow,
  Zap,
  Bell,
  Database,
  Barcode,
  Shield,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Wifi,
  Server,
  Cog,
  ArrowRight,
  Save,
} from "lucide-react";

type TabType =
  | "workflow"
  | "automation"
  | "realtime"
  | "barcode"
  | "inventory-rules"
  | "performance"
  | "security"
  | "backup";

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState<TabType>("workflow");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast({ type: "success", title: "Konfigurasi tersimpan", description: "Pengaturan sistem berhasil diperbarui" });
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "workflow", label: "Workflow Status", icon: <Workflow size={16} /> },
    { key: "automation", label: "Automation Rules", icon: <Zap size={16} /> },
    { key: "realtime", label: "Realtime Events", icon: <Wifi size={16} /> },
    { key: "barcode", label: "Barcode System", icon: <Barcode size={16} /> },
    { key: "inventory-rules", label: "Inventory Rules", icon: <Database size={16} /> },
    { key: "performance", label: "Performance", icon: <Server size={16} /> },
    { key: "security", label: "Security", icon: <Shield size={16} /> },
    { key: "backup", label: "Backup & DR", icon: <HardDrive size={16} /> },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Configuration</h1>
            <p className="text-sm text-[#616161] mt-1">Konfigurasi sistem MIMS, automation rules, dan integrasi</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-700">
                <CheckCircle2 size={14} />
                Tersimpan
              </span>
            )}
            <Button icon={<Save size={16} />} onClick={handleSave}>
              Simpan Perubahan
            </Button>
          </div>
        </div>

        {/* Layout: Sidebar nav + content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Nav */}
          <div className="lg:col-span-1">
            <Card padding="sm">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-all",
                      activeTab === tab.key
                        ? "bg-[#003c33] text-white font-medium"
                        : "text-[#616161] hover:bg-[#f5f5f5]"
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Workflow Status */}
            {activeTab === "workflow" && (
              <>
                <Card>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-[#003c33] text-white">
                      <Workflow size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#212121]">Auto Workflow Status</h3>
                      <p className="text-sm text-[#616161] mt-1">
                        Status order berubah otomatis berdasarkan aktivitas scan. User tidak diperbolehkan mengubah status manual kecuali admin supervisor.
                      </p>
                    </div>
                  </div>

                  {/* Status Flow Diagram */}
                  <div className="space-y-3">
                    {[
                      { trigger: "Sales membuat order", status: "WAITING_PICK", color: "bg-amber-100 text-amber-700 border-amber-200", icon: "📋" },
                      { trigger: "Picker mulai scan", status: "PICKING", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "🔍" },
                      { trigger: "Picker scan barang lengkap", status: "READY_PACKING", color: "bg-purple-100 text-purple-700 border-purple-200", icon: "📦" },
                      { trigger: "Packer scan verifikasi", status: "PACKING", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "✓" },
                      { trigger: "Packing selesai", status: "PACKING_COMPLETE", color: "bg-teal-100 text-teal-700 border-teal-200", icon: "🎯" },
                      { trigger: "Resi dicetak", status: "READY_SHIPMENT", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "🏷️" },
                      { trigger: "Order dikirim", status: "SHIPPED", color: "bg-gray-100 text-gray-700 border-gray-200", icon: "🚚" },
                    ].map((item, idx, arr) => (
                      <div key={item.status} className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-[#f8f8f8] border border-[#e5e7eb] flex items-center justify-center text-lg">
                            {item.icon}
                          </div>
                          {idx < arr.length - 1 && <div className="w-0.5 h-6 bg-[#e5e7eb] my-1" />}
                        </div>
                        <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-[#f8f8f8] border border-[#e5e7eb]">
                          <div>
                            <p className="text-xs text-[#616161]">Aktivitas</p>
                            <p className="text-sm font-medium text-[#212121] mt-0.5">{item.trigger}</p>
                          </div>
                          <ArrowRight size={16} className="text-[#93939f]" />
                          <div>
                            <p className="text-xs text-[#616161]">Status Otomatis</p>
                            <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-mono font-semibold border mt-0.5", item.color)}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex gap-3">
                      <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Manual Override</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Hanya role <strong>Super Admin</strong> dan <strong>Supervisor</strong> yang dapat mengubah status secara manual.
                          Semua perubahan manual akan tercatat di audit trail.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Manual Override Permission</h3>
                  <div className="space-y-3">
                    {[
                      { role: "Super Admin", canOverride: true },
                      { role: "Supervisor", canOverride: true },
                      { role: "Admin Gudang", canOverride: false },
                      { role: "Purchasing", canOverride: false },
                      { role: "Sales Online", canOverride: false },
                    ].map((item) => (
                      <div key={item.role} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb]">
                        <span className="text-sm font-medium text-[#212121]">{item.role}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.canOverride} className="sr-only peer" />
                          <div className="w-9 h-5 bg-[#d9d9dd] peer-focus:ring-2 peer-focus:ring-[#9b60aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#003c33]" />
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Automation Rules */}
            {activeTab === "automation" && (
              <>
                {[
                  {
                    title: "Auto Picking Task Generation",
                    description: "Otomatis membuat picking task ketika order baru dibuat dan stok tersedia",
                    condition: "Order dibuat + Stok tersedia",
                    action: "Generate picking task otomatis",
                    enabled: true,
                  },
                  {
                    title: "Auto Packing Queue Push",
                    description: "Otomatis push order ke packing queue saat semua item discan oleh picker",
                    condition: "Semua item sudah discan picker",
                    action: "Push ke packing queue + hitung SLA",
                    enabled: true,
                  },
                  {
                    title: "Auto Shipment Label",
                    description: "Otomatis generate label dan barcode shipment saat packing selesai",
                    condition: "Packing selesai (PACKING_COMPLETE)",
                    action: "Generate shipment label + barcode",
                    enabled: true,
                  },
                  {
                    title: "Auto Stock Reservation",
                    description: "Reserve stok otomatis saat sales order dibuat",
                    condition: "Sales order created",
                    action: "Move stock dari Available ke Reserved",
                    enabled: true,
                  },
                  {
                    title: "Auto Low Stock Alert",
                    description: "Kirim notifikasi otomatis saat stok mencapai minimum",
                    condition: "Available stock <= Min stock",
                    action: "Notify Admin Gudang & Purchasing",
                    enabled: true,
                  },
                  {
                    title: "Auto Pick Route Calculation",
                    description: "Tentukan jalur picking optimal berdasarkan lokasi rak",
                    condition: "Picking task created",
                    action: "Calculate shortest path antar rak",
                    enabled: false,
                  },
                ].map((rule) => (
                  <Card key={rule.title}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap size={16} className="text-[#003c33]" />
                          <h3 className="text-base font-semibold text-[#212121]">{rule.title}</h3>
                        </div>
                        <p className="text-sm text-[#616161]">{rule.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={rule.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#d9d9dd] peer-focus:ring-2 peer-focus:ring-[#9b60aa]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003c33]" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                        <p className="text-[10px] text-blue-600 uppercase tracking-wider font-semibold mb-1">IF (Trigger)</p>
                        <p className="text-sm text-blue-900 font-medium">{rule.condition}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                        <p className="text-[10px] text-emerald-600 uppercase tracking-wider font-semibold mb-1">THEN (Action)</p>
                        <p className="text-sm text-emerald-900 font-medium">{rule.action}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}

            {/* Realtime Events */}
            {activeTab === "realtime" && (
              <>
                <Card>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                      <Wifi size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#212121]">Realtime System</h3>
                      <p className="text-sm text-[#616161] mt-1">
                        Konfigurasi WebSocket, Socket.IO, dan Firebase Push untuk event realtime
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="WebSocket URL" defaultValue="wss://api.mims.id/realtime" />
                      <Input label="Socket.IO Namespace" defaultValue="/warehouse" />
                    </div>
                    <Input label="Firebase Server Key" type="password" defaultValue="••••••••••••••••" />
                    <Select
                      label="Reconnect Strategy"
                      options={[
                        { value: "exponential", label: "Exponential Backoff" },
                        { value: "fixed", label: "Fixed Interval (5s)" },
                        { value: "linear", label: "Linear Backoff" },
                      ]}
                    />
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Realtime Events</h3>
                  <div className="space-y-2">
                    {[
                      { event: "new_order", label: "New Order", trigger: "Sales create SO", channels: ["websocket", "push"] },
                      { event: "ready_picking", label: "Ready Picking", trigger: "Auto generated picking task", channels: ["websocket"] },
                      { event: "ready_packing", label: "Ready Packing", trigger: "Picking complete", channels: ["websocket", "push"] },
                      { event: "low_stock", label: "Low Stock Alert", trigger: "Stock <= minimum", channels: ["websocket", "push", "email"] },
                      { event: "return_created", label: "Return Created", trigger: "Customer/supplier return", channels: ["websocket", "push"] },
                      { event: "shipment_dispatched", label: "Shipment Dispatched", trigger: "Resi dicetak", channels: ["websocket"] },
                    ].map((evt) => (
                      <div key={evt.event} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb] hover:bg-[#f8f8f8]">
                        <div>
                          <p className="text-sm font-medium text-[#212121]">{evt.label}</p>
                          <p className="text-xs text-[#616161] font-mono mt-0.5">{evt.event} • {evt.trigger}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {evt.channels.map((ch) => (
                            <span key={ch} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f2f2f2] text-[#616161] uppercase">
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Connection Status</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: "WebSocket Server", status: "online", latency: "12ms" },
                      { name: "Redis Pub/Sub", status: "online", latency: "3ms" },
                      { name: "Firebase Push", status: "online", latency: "45ms" },
                    ].map((conn) => (
                      <div key={conn.name} className="p-4 rounded-lg border border-[#e5e7eb]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <p className="text-xs font-medium text-[#212121]">{conn.name}</p>
                        </div>
                        <p className="text-2xl font-semibold text-emerald-700">{conn.latency}</p>
                        <p className="text-[10px] text-[#93939f]">avg latency</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Barcode System */}
            {activeTab === "barcode" && (
              <>
                <Card>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-[#17171c] text-white">
                      <Barcode size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#212121]">Barcode System</h3>
                      <p className="text-sm text-[#616161] mt-1">Konfigurasi format dan generator barcode untuk semua tipe</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { type: "Product Barcode", format: "EAN-13", prefix: "890", description: "Untuk identifikasi SKU produk" },
                      { type: "Rack Barcode", format: "Code 128", prefix: "RACK-", description: "Untuk lokasi rak gudang" },
                      { type: "Order Barcode", format: "Code 128", prefix: "SO-", description: "Untuk picking order" },
                      { type: "Shipment Barcode", format: "QR Code", prefix: "SHP-", description: "Untuk pengiriman" },
                    ].map((bc) => (
                      <div key={bc.type} className="p-4 rounded-lg border border-[#e5e7eb]">
                        <div className="flex items-center gap-2 mb-2">
                          <Barcode size={16} className="text-[#003c33]" />
                          <p className="text-sm font-semibold text-[#212121]">{bc.type}</p>
                        </div>
                        <p className="text-xs text-[#616161] mb-3">{bc.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#93939f]">Format</span>
                            <span className="font-mono font-medium px-2 py-0.5 rounded bg-[#f2f2f2]">{bc.format}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#93939f]">Prefix</span>
                            <span className="font-mono font-medium">{bc.prefix}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Scan Configuration</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Default Scanner Type"
                        options={[
                          { value: "camera", label: "Camera Barcode Scanner" },
                          { value: "usb", label: "USB Hardware Scanner" },
                          { value: "bluetooth", label: "Bluetooth Scanner" },
                        ]}
                      />
                      <Input label="Max Scan Time (ms)" type="number" defaultValue="1000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Audio Feedback"
                        options={[
                          { value: "enabled", label: "Enabled" },
                          { value: "disabled", label: "Disabled" },
                        ]}
                      />
                      <Select
                        label="Vibration Feedback"
                        options={[
                          { value: "enabled", label: "Enabled (Mobile)" },
                          { value: "disabled", label: "Disabled" },
                        ]}
                      />
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Inventory Rules */}
            {activeTab === "inventory-rules" && (
              <>
                <Card>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-[#9b60aa] text-white">
                      <Database size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#212121]">Inventory Rules</h3>
                      <p className="text-sm text-[#616161] mt-1">Aturan stok dan metode pengeluaran barang</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block p-4 rounded-lg border-2 border-[#003c33] bg-[#f8f8f8] cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input type="radio" name="method" defaultChecked className="mt-1 text-[#003c33] focus:ring-[#9b60aa]" />
                        <div>
                          <p className="text-sm font-semibold text-[#212121]">FIFO</p>
                          <p className="text-xs text-[#616161] mt-0.5">First In First Out</p>
                          <p className="text-xs text-[#616161] mt-2">Batch yang masuk lebih dulu akan dikeluarkan terlebih dahulu</p>
                        </div>
                      </div>
                    </label>
                    <label className="block p-4 rounded-lg border border-[#e5e7eb] hover:border-[#d9d9dd] cursor-pointer">
                      <div className="flex items-start gap-3">
                        <input type="radio" name="method" className="mt-1 text-[#003c33] focus:ring-[#9b60aa]" />
                        <div>
                          <p className="text-sm font-semibold text-[#212121]">FEFO</p>
                          <p className="text-xs text-[#616161] mt-0.5">First Expired First Out</p>
                          <p className="text-xs text-[#616161] mt-2">Batch dengan expiry date terdekat diutamakan untuk dikeluarkan</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Stock Type Configuration</h3>
                  <div className="space-y-2">
                    {[
                      { type: "Available", description: "Stok yang bisa dijual", color: "bg-emerald-500" },
                      { type: "Reserved", description: "Sedang diproses untuk order", color: "bg-purple-500" },
                      { type: "Damaged", description: "Stok rusak, tidak bisa dijual", color: "bg-red-500" },
                      { type: "Return", description: "Barang retur dari customer", color: "bg-orange-500" },
                      { type: "In Transit", description: "Sedang dipindah antar gudang", color: "bg-blue-500" },
                    ].map((stock) => (
                      <div key={stock.type} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb]">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-3 h-3 rounded-full", stock.color)} />
                          <div>
                            <p className="text-sm font-semibold text-[#212121]">{stock.type}</p>
                            <p className="text-xs text-[#616161]">{stock.description}</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-700 font-medium">Active</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Threshold Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Default Min Stock (units)" type="number" defaultValue="10" />
                    <Input label="Default Max Stock (units)" type="number" defaultValue="500" />
                    <Input label="Low Stock Warning (%)" type="number" defaultValue="20" />
                    <Input label="Expiry Warning (hari)" type="number" defaultValue="30" />
                    <Input label="Dead Stock Threshold (hari)" type="number" defaultValue="90" />
                    <Input label="Reorder Point Buffer (%)" type="number" defaultValue="15" />
                  </div>
                </Card>
              </>
            )}

            {/* Performance */}
            {activeTab === "performance" && (
              <>
                <Card>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                      <Server size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#212121]">Performance Targets</h3>
                      <p className="text-sm text-[#616161] mt-1">Target performa sistem sesuai SLA</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { param: "API Response Time", target: "< 2 detik", current: "1.2s", status: "good" },
                      { param: "Barcode Scan Time", target: "< 1 detik", current: "0.4s", status: "good" },
                      { param: "Realtime Sync", target: "< 2 detik", current: "0.8s", status: "good" },
                      { param: "Concurrent Users", target: "300+", current: "245", status: "good" },
                      { param: "Database Query", target: "< 500ms", current: "180ms", status: "good" },
                      { param: "Page Load Time", target: "< 3 detik", current: "1.8s", status: "good" },
                    ].map((metric) => (
                      <div key={metric.param} className="p-4 rounded-lg border border-[#e5e7eb]">
                        <p className="text-xs text-[#616161]">{metric.param}</p>
                        <div className="flex items-baseline justify-between mt-1">
                          <p className="text-2xl font-semibold text-emerald-700">{metric.current}</p>
                          <span className="text-xs text-[#93939f]">target {metric.target}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
                          <CheckCircle2 size={12} />
                          <span>Within target</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Caching & Optimization</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Redis Cache", description: "Cache data master & queries", enabled: true },
                      { label: "API Response Compression", description: "Gzip responses untuk efisiensi", enabled: true },
                      { label: "Lazy Loading", description: "Load data saat dibutuhkan", enabled: true },
                      { label: "Database Connection Pooling", description: "Optimasi koneksi DB", enabled: true },
                      { label: "CDN Static Assets", description: "Distribusi asset via CDN", enabled: false },
                    ].map((opt) => (
                      <div key={opt.label} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb]">
                        <div>
                          <p className="text-sm font-medium text-[#212121]">{opt.label}</p>
                          <p className="text-xs text-[#616161]">{opt.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={opt.enabled} className="sr-only peer" />
                          <div className="w-9 h-5 bg-[#d9d9dd] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#003c33]" />
                        </label>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <>
                <Card>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-red-600 text-white">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#212121]">Admin Area Security</h3>
                      <p className="text-sm text-[#616161] mt-1">Konfigurasi keamanan untuk login user</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { feature: "JWT Authentication", description: "Token-based auth dengan refresh token", status: "active" },
                      { feature: "Role-Based Access Control (RBAC)", description: "Permissions per role", status: "active" },
                      { feature: "HTTPS Encryption", description: "TLS 1.3 untuk semua koneksi", status: "active" },
                      { feature: "Password Hashing (bcrypt)", description: "Salt rounds: 12", status: "active" },
                      { feature: "Rate Limiting", description: "Max 100 req/min per user", status: "active" },
                      { feature: "Two-Factor Authentication", description: "TOTP untuk Super Admin", status: "inactive" },
                    ].map((sec) => (
                      <div key={sec.feature} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb]">
                        <div className="flex items-center gap-3">
                          <Lock size={16} className={sec.status === "active" ? "text-emerald-600" : "text-[#93939f]"} />
                          <div>
                            <p className="text-sm font-medium text-[#212121]">{sec.feature}</p>
                            <p className="text-xs text-[#616161]">{sec.description}</p>
                          </div>
                        </div>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
                          sec.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {sec.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Operational Screen Security (No Login)</h3>
                  <div className="space-y-3">
                    {[
                      { feature: "Device Whitelist", description: "Hanya device terdaftar yang bisa akses" },
                      { feature: "Local Session Token", description: "Token disimpan lokal, tidak perlu login berulang" },
                      { feature: "Restricted Access Mode", description: "Hanya akses ke fitur operasional spesifik" },
                      { feature: "Auto-Lock Inactive Device", description: "Lock device setelah 30 menit tidak aktif" },
                    ].map((feat) => (
                      <div key={feat.feature} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f8f8]">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-[#212121]">{feat.feature}</p>
                            <p className="text-xs text-[#616161]">{feat.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Session Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Session Timeout (menit)" type="number" defaultValue="60" />
                    <Input label="Max Login Attempts" type="number" defaultValue="5" />
                    <Input label="Lockout Duration (menit)" type="number" defaultValue="15" />
                    <Input label="JWT Expiry (menit)" type="number" defaultValue="30" />
                  </div>
                </Card>
              </>
            )}

            {/* Backup & DR */}
            {activeTab === "backup" && (
              <>
                <Card>
                  <div className="flex items-start gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                      <HardDrive size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#212121]">Backup & Disaster Recovery</h3>
                      <p className="text-sm text-[#616161] mt-1">Konfigurasi backup otomatis dan disaster recovery plan</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <p className="text-xs font-medium text-emerald-800">Uptime</p>
                      </div>
                      <p className="text-2xl font-semibold text-emerald-700 mt-1">99.8%</p>
                      <p className="text-[10px] text-emerald-600">target 99%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-blue-700" />
                        <p className="text-xs font-medium text-blue-800">Last Backup</p>
                      </div>
                      <p className="text-2xl font-semibold text-blue-700 mt-1">2j</p>
                      <p className="text-[10px] text-blue-600">2 jam lalu</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <div className="flex items-center gap-2">
                        <HardDrive size={12} className="text-purple-700" />
                        <p className="text-xs font-medium text-purple-800">Backup Size</p>
                      </div>
                      <p className="text-2xl font-semibold text-purple-700 mt-1">2.4GB</p>
                      <p className="text-[10px] text-purple-600">compressed</p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Auto Backup Schedule</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="Backup Frequency"
                        options={[
                          { value: "hourly", label: "Setiap jam" },
                          { value: "every_6h", label: "Setiap 6 jam" },
                          { value: "daily", label: "Harian (Jam 02:00)" },
                          { value: "weekly", label: "Mingguan" },
                        ]}
                      />
                      <Select
                        label="Retention Period"
                        options={[
                          { value: "7", label: "7 hari" },
                          { value: "30", label: "30 hari" },
                          { value: "90", label: "90 hari" },
                          { value: "365", label: "1 tahun" },
                        ]}
                      />
                    </div>
                    <Select
                      label="Backup Storage"
                      options={[
                        { value: "local", label: "Local Server" },
                        { value: "s3", label: "AWS S3" },
                        { value: "gcs", label: "Google Cloud Storage" },
                        { value: "both", label: "Local + Cloud (Recommended)" },
                      ]}
                    />
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Recent Backups</h3>
                  <div className="space-y-2">
                    {[
                      { date: "23 Mei 2026, 02:00", size: "2.4 GB", status: "success", type: "Auto" },
                      { date: "22 Mei 2026, 14:30", size: "2.3 GB", status: "success", type: "Manual" },
                      { date: "22 Mei 2026, 02:00", size: "2.3 GB", status: "success", type: "Auto" },
                      { date: "21 Mei 2026, 02:00", size: "2.2 GB", status: "success", type: "Auto" },
                      { date: "20 Mei 2026, 02:00", size: "2.2 GB", status: "success", type: "Auto" },
                    ].map((backup, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb]">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-[#212121]">{backup.date}</p>
                            <p className="text-xs text-[#616161]">{backup.type} • {backup.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toast({ type: "warning", title: "Konfirmasi restore", description: "Sistem akan di-rollback ke titik backup ini" })}>Restore</Button>
                          <Button variant="ghost" size="sm" onClick={() => toast({ type: "success", title: "Download dimulai", description: "File backup akan diunduh" })}>Download</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4 pt-4 border-t border-[#e5e7eb]">
                    <Button icon={<HardDrive size={16} />} onClick={() => toast({ type: "success", title: "Backup dimulai", description: "Proses backup berjalan di background" })}>Backup Sekarang</Button>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-base font-semibold text-[#212121] mb-4">Disaster Recovery</h3>
                  <div className="space-y-3">
                    {[
                      { metric: "RTO (Recovery Time Objective)", value: "< 4 jam", description: "Maksimal waktu pemulihan sistem" },
                      { metric: "RPO (Recovery Point Objective)", value: "< 1 jam", description: "Maksimal kehilangan data" },
                      { metric: "Failover Site", value: "AWS us-east-1", description: "Lokasi server failover" },
                      { metric: "Recovery Documentation", value: "v2.1", description: "Dokumentasi prosedur recovery" },
                    ].map((dr) => (
                      <div key={dr.metric} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f8f8]">
                        <div>
                          <p className="text-sm font-medium text-[#212121]">{dr.metric}</p>
                          <p className="text-xs text-[#616161]">{dr.description}</p>
                        </div>
                        <span className="text-sm font-mono font-semibold text-[#003c33]">{dr.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
