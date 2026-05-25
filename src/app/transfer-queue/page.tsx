"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { ArrowRight, Truck, MapPin, Package, Clock } from "lucide-react";

export default function TransferQueuePage() {
  const { stockTransfers } = useAppStore();
  const inTransit = stockTransfers.filter((t) => t.status === "in_transit");
  const completed = stockTransfers.filter((t) => t.status === "received");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Transfer Queue</h1>
          <p className="text-sm text-[#616161] mt-1">Antrian transfer barang antar gudang yang sedang berjalan</p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg w-fit">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-blue-700">{inTransit.length} transfer sedang berjalan</span>
        </div>

        {/* In Transit Cards */}
        <div>
          <h2 className="text-base font-semibold text-[#212121] mb-3">Sedang Dalam Perjalanan</h2>
          {inTransit.length === 0 ? (
            <Card className="text-center py-12">
              <Truck size={48} className="mx-auto text-[#93939f] mb-3" />
              <p className="text-sm text-[#616161]">Tidak ada transfer berjalan</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inTransit.map((transfer) => (
                <Card key={transfer.id} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse" />
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-sm font-medium text-[#1863dc]">{transfer.transferNumber}</p>
                      <p className="text-xs text-[#616161] mt-0.5">Sejak {formatRelativeTime(transfer.createdAt)}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      In Transit
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-3 p-4 bg-[#f8f8f8] rounded-xl mb-4">
                    <div className="flex-1 text-center">
                      <MapPin size={16} className="mx-auto text-[#003c33] mb-1" />
                      <p className="text-xs font-medium text-[#212121]">{transfer.fromWarehouseName}</p>
                      <p className="text-[10px] text-[#93939f]">Asal</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-full flex items-center gap-1">
                        <div className="flex-1 h-0.5 bg-blue-300" />
                        <Truck size={20} className="text-blue-500 animate-pulse" />
                        <div className="flex-1 h-0.5 bg-blue-300" />
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <MapPin size={16} className="mx-auto text-[#003c33] mb-1" />
                      <p className="text-xs font-medium text-[#212121]">{transfer.toWarehouseName}</p>
                      <p className="text-[10px] text-[#93939f]">Tujuan</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#616161] uppercase tracking-wider">Items ({transfer.totalItems})</p>
                    {transfer.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-[#f8f8f8] text-xs">
                        <div className="flex items-center gap-2">
                          <Package size={12} className="text-[#93939f]" />
                          <span>{item.productName}</span>
                        </div>
                        <span className="font-medium">{item.qty} pcs</span>
                      </div>
                    ))}
                  </div>

                  {transfer.notes && (
                    <p className="text-xs text-[#616161] mt-3 pt-3 border-t border-[#e5e7eb] italic">
                      {transfer.notes}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recently Completed */}
        <div>
          <h2 className="text-base font-semibold text-[#212121] mb-3">Selesai Diterima</h2>
          <Card padding="sm">
            {completed.length === 0 ? (
              <p className="text-sm text-[#93939f] text-center py-6">Belum ada transfer selesai</p>
            ) : (
              <div className="divide-y divide-[#f2f2f2]">
                {completed.map((transfer) => (
                  <div key={transfer.id} className="p-3 flex items-center justify-between hover:bg-[#f8f8f8] rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Truck size={18} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium text-[#212121]">{transfer.transferNumber}</p>
                        <div className="flex items-center gap-2 text-xs text-[#616161] mt-0.5">
                          <span>{transfer.fromWarehouseName}</span>
                          <ArrowRight size={10} />
                          <span>{transfer.toWarehouseName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#616161]">{transfer.totalItems} items</p>
                      <p className="text-[10px] text-[#93939f] flex items-center gap-1 justify-end mt-0.5">
                        <Clock size={10} />
                        {transfer.receivedAt ? formatRelativeTime(transfer.receivedAt) : "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
