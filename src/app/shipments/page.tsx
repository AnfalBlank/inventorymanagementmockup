"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Shipment } from "@/types";
import {
  Truck,
  Search,
  Eye,
  Printer,
  MapPin,
  Package,
  CheckCircle2,
  Clock,
  Plane,
  Filter,
} from "lucide-react";

const shipmentStatusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700", icon: <Clock size={12} /> },
  shipped: { label: "Shipped", className: "bg-blue-100 text-blue-700", icon: <Truck size={12} /> },
  in_transit: { label: "In Transit", className: "bg-indigo-100 text-indigo-700", icon: <Plane size={12} /> },
  delivered: { label: "Delivered", className: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 size={12} /> },
  returned: { label: "Returned", className: "bg-red-100 text-red-700", icon: <Package size={12} /> },
};

export default function ShipmentsPage() {
  const { shipments } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const filtered = shipments.filter((s) => {
    const matchSearch = s.shipmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Shipments</h1>
          <p className="text-sm text-[#616161] mt-1">Kelola pengiriman dan tracking resi</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", value: shipments.length, color: "bg-[#17171c]" },
            { label: "Pending", value: shipments.filter((s) => s.status === "pending").length, color: "bg-amber-500" },
            { label: "Shipped", value: shipments.filter((s) => s.status === "shipped").length, color: "bg-blue-500" },
            { label: "In Transit", value: shipments.filter((s) => s.status === "in_transit").length, color: "bg-indigo-500" },
            { label: "Delivered", value: shipments.filter((s) => s.status === "delivered").length, color: "bg-emerald-500" },
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
                placeholder="Cari shipment, order, atau tracking..."
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
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card padding="sm">
          <DataTable
            columns={[
              { key: "shipmentNumber", header: "No. Shipment", render: (item) => <span className="font-mono text-xs font-medium text-[#1863dc]">{item.shipmentNumber}</span> },
              { key: "orderNumber", header: "Order", render: (item) => <span className="font-mono text-xs">{item.orderNumber}</span> },
              { key: "customerName", header: "Customer" },
              { key: "courier", header: "Kurir", render: (item) => <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#f2f2f2]">{item.courier}</span> },
              { key: "trackingNumber", header: "No. Resi", render: (item) => <span className="font-mono text-xs">{item.trackingNumber}</span> },
              { key: "weight", header: "Berat", render: (item) => <span className="text-xs">{item.weight} kg</span> },
              {
                key: "status", header: "Status",
                render: (item) => {
                  const c = shipmentStatusConfig[item.status];
                  return (
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", c.className)}>
                      {c.icon}
                      {c.label}
                    </span>
                  );
                },
              },
              {
                key: "actions", header: "",
                render: (item) => (
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedShipment(item); setShowDetailModal(true); }}
                    className="p-1.5 rounded hover:bg-[#f5f5f5]"
                  >
                    <Eye size={16} className="text-[#616161]" />
                  </button>
                ),
              },
            ]}
            data={filtered}
            keyExtractor={(item) => item.id}
            onRowClick={(item) => { setSelectedShipment(item); setShowDetailModal(true); }}
          />
        </Card>

        {/* Detail Modal */}
        <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Detail ${selectedShipment?.shipmentNumber || ""}`} size="lg">
          {selectedShipment && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className={cn(
                "p-4 rounded-xl border",
                selectedShipment.status === "delivered" ? "bg-emerald-50 border-emerald-200" :
                selectedShipment.status === "in_transit" ? "bg-indigo-50 border-indigo-200" :
                selectedShipment.status === "shipped" ? "bg-blue-50 border-blue-200" :
                "bg-amber-50 border-amber-200"
              )}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    {shipmentStatusConfig[selectedShipment.status].icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{shipmentStatusConfig[selectedShipment.status].label}</p>
                    <p className="text-xs text-[#616161] mt-0.5">
                      {selectedShipment.status === "delivered" && selectedShipment.deliveredAt && `Diterima ${formatDate(selectedShipment.deliveredAt)}`}
                      {selectedShipment.status === "in_transit" && "Sedang dalam pengiriman"}
                      {selectedShipment.status === "shipped" && selectedShipment.shippedAt && `Dikirim ${formatDate(selectedShipment.shippedAt)}`}
                      {selectedShipment.status === "pending" && "Menunggu pickup kurir"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-[#212121] mb-3">Tracking Timeline</h3>
                <div className="space-y-4">
                  {[
                    { step: "Order Created", date: selectedShipment.createdAt, completed: true },
                    { step: "Shipped", date: selectedShipment.shippedAt, completed: !!selectedShipment.shippedAt },
                    { step: "In Transit", date: selectedShipment.shippedAt, completed: ["in_transit", "delivered"].includes(selectedShipment.status) },
                    { step: "Delivered", date: selectedShipment.deliveredAt, completed: selectedShipment.status === "delivered" },
                  ].map((step, idx, arr) => (
                    <div key={step.step} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          step.completed ? "bg-emerald-500 text-white" : "bg-[#f2f2f2] text-[#93939f]"
                        )}>
                          {step.completed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                        </div>
                        {idx < arr.length - 1 && (
                          <div className={cn("w-0.5 h-8 mt-1", step.completed ? "bg-emerald-300" : "bg-[#e5e7eb]")} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={cn("text-sm font-medium", step.completed ? "text-[#212121]" : "text-[#93939f]")}>
                          {step.step}
                        </p>
                        {step.date && <p className="text-xs text-[#616161] mt-0.5">{formatDate(step.date)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-[#f8f8f8]">
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Order</p>
                  <p className="text-sm font-mono font-medium mt-1">{selectedShipment.orderNumber}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f8]">
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Kurir</p>
                  <p className="text-sm font-medium mt-1">{selectedShipment.courier}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f8]">
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Tracking Number</p>
                  <p className="text-sm font-mono font-medium mt-1">{selectedShipment.trackingNumber}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#f8f8f8]">
                  <p className="text-xs text-[#93939f] uppercase tracking-wider">Berat</p>
                  <p className="text-sm font-medium mt-1">{selectedShipment.weight} kg</p>
                </div>
                <div className="col-span-2 p-3 rounded-lg bg-[#f8f8f8]">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[#616161] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#93939f] uppercase tracking-wider">Alamat Tujuan</p>
                      <p className="text-sm font-medium mt-1">{selectedShipment.customerName}</p>
                      <p className="text-xs text-[#616161] mt-0.5">{selectedShipment.customerAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" icon={<Printer size={16} />} onClick={() => toast({ type: "success", title: "Resi dicetak", description: `Resi ${selectedShipment.trackingNumber} dikirim ke printer` })}>
                  Cetak Resi
                </Button>
                <Button variant="outline" icon={<Printer size={16} />} onClick={() => toast({ type: "success", title: "Label dicetak", description: `Label shipment ${selectedShipment.shipmentNumber} dikirim ke printer` })}>
                  Cetak Label
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
}
