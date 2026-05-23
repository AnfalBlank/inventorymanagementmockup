"use client";

import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PackingTask } from "@/types";
import {
  Package,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Printer,
  Box,
  XCircle,
} from "lucide-react";

type PackingView = "scan-order" | "packing" | "complete";

export default function PackingProcessPage() {
  const { packingTasks } = useAppStore();
  const [currentView, setCurrentView] = useState<PackingView>("scan-order");
  const [selectedTask, setSelectedTask] = useState<PackingTask | null>(null);
  const [scannedItems, setScannedItems] = useState<Record<string, number>>({});
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);
  const [orderBarcode, setOrderBarcode] = useState("");

  const handleScanOrder = () => {
    // Simulate scanning an order barcode
    const task = packingTasks.find((t) => t.status === "waiting");
    if (task) {
      setSelectedTask(task);
      setCurrentView("packing");
      setScannedItems({});
    }
  };

  const handleScanItem = (itemId: string) => {
    const isSuccess = Math.random() > 0.15; // 85% success for demo

    if (isSuccess) {
      setScanResult("success");
      setScannedItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));

      // Check if all items are scanned
      setTimeout(() => {
        setScanResult(null);
        if (selectedTask) {
          const allScanned = selectedTask.items.every(
            (item) => (scannedItems[item.id] || 0) + (item.id === itemId ? 1 : 0) >= item.qty
          );
          if (allScanned) {
            setCurrentView("complete");
          }
        }
      }, 1000);
    } else {
      setScanResult("error");
      setTimeout(() => setScanResult(null), 2000);
    }
  };

  const getItemScannedQty = (itemId: string) => scannedItems[itemId] || 0;

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      scanResult === "error" ? "bg-red-500" : scanResult === "success" ? "bg-emerald-500" : "bg-[#17171c]"
    )}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#17171c]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView !== "scan-order" && (
              <button
                onClick={() => { setCurrentView("scan-order"); setSelectedTask(null); }}
                className="p-2 rounded-lg bg-white/10 text-white"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-white">MIMS Packing</h1>
              <p className="text-xs text-white/60">
                {currentView === "scan-order" ? "Scan barcode order untuk mulai" :
                 currentView === "packing" ? selectedTask?.orderNumber :
                 "Packing selesai"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/60">Online</span>
          </div>
        </div>
      </div>

      {/* Scan Order View */}
      {currentView === "scan-order" && (
        <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-32 h-32 rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center mb-8">
            <ScanLine size={48} className="text-white/40" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Scan Order Barcode</h2>
          <p className="text-white/60 text-sm text-center max-w-sm mb-8">
            Arahkan scanner ke barcode order untuk memulai proses packing
          </p>

          {/* Manual input for demo */}
          <div className="w-full max-w-sm space-y-4">
            <input
              type="text"
              placeholder="Atau ketik nomor order..."
              value={orderBarcode}
              onChange={(e) => setOrderBarcode(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 text-center font-mono focus:outline-none focus:border-white/30"
            />
            <button
              onClick={handleScanOrder}
              className="w-full py-5 rounded-2xl bg-[#9b60aa] hover:bg-[#8a4f99] text-white font-semibold text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.97]"
            >
              <ScanLine size={28} />
              SCAN ORDER
            </button>
          </div>

          {/* Available tasks hint */}
          {packingTasks.filter((t) => t.status === "waiting").length > 0 && (
            <div className="mt-8 px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-purple-300 text-sm text-center">
                {packingTasks.filter((t) => t.status === "waiting").length} order siap dipacking
              </p>
            </div>
          )}
        </div>
      )}

      {/* Packing View */}
      {currentView === "packing" && selectedTask && (
        <div className="p-4 space-y-4">
          {/* Order Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-mono font-semibold text-lg">{selectedTask.orderNumber}</p>
                <p className="text-white/60 text-sm">{selectedTask.totalItems} items to verify</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-semibold">
                  {Object.values(scannedItems).reduce((s, v) => s + v, 0)} / {selectedTask.items.reduce((s, i) => s + i.qty, 0)}
                </p>
                <p className="text-white/40 text-xs">scanned</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{
                  width: `${(Object.values(scannedItems).reduce((s, v) => s + v, 0) / selectedTask.items.reduce((s, i) => s + i.qty, 0)) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Scan Result Feedback */}
          {scanResult && (
            <div className={cn(
              "p-4 rounded-2xl text-center",
              scanResult === "success" ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-red-500/20 border border-red-500/30"
            )}>
              {scanResult === "success" ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                  <span className="text-emerald-300 font-medium text-lg">Item Terverifikasi!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <XCircle size={24} className="text-red-400" />
                  <span className="text-red-300 font-medium text-lg">Item Tidak Sesuai!</span>
                </div>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="space-y-3">
            {selectedTask.items.map((item) => {
              const scanned = getItemScannedQty(item.id);
              const isComplete = scanned >= item.qty;

              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border p-4 transition-all",
                    isComplete
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-white/5 border-white/10"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{item.productName}</p>
                      <p className="text-white/40 text-xs font-mono mt-0.5">{item.sku}</p>
                    </div>
                    {isComplete ? (
                      <CheckCircle2 size={24} className="text-emerald-400" />
                    ) : (
                      <div className="text-right">
                        <p className="text-white font-bold text-xl">{scanned}/{item.qty}</p>
                      </div>
                    )}
                  </div>

                  {!isComplete && (
                    <button
                      onClick={() => handleScanItem(item.id)}
                      disabled={scanResult !== null}
                      className="w-full py-4 rounded-xl bg-[#9b60aa] hover:bg-[#8a4f99] text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-50"
                    >
                      <ScanLine size={20} />
                      SCAN ITEM
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete View */}
      {currentView === "complete" && (
        <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle2 size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Packing Selesai!</h2>
          <p className="text-white/60 text-sm text-center max-w-sm mb-2">
            Semua item telah diverifikasi untuk order
          </p>
          <p className="text-white font-mono font-semibold text-lg mb-6">{selectedTask?.orderNumber}</p>

          {/* Status Auto Change */}
          <div className="w-full max-w-sm bg-teal-500/10 border border-teal-500/30 rounded-xl p-4 mb-6">
            <p className="text-teal-300 text-sm text-center font-medium">
              Status otomatis berubah ke
            </p>
            <p className="text-white text-xl font-bold text-center mt-1 font-mono">
              PACKING_COMPLETE
            </p>
          </div>

          {/* Auto-generated labels */}
          <div className="w-full max-w-sm space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <Printer size={20} className="text-white/60" />
              <div>
                <p className="text-white text-sm font-medium">Label Shipping</p>
                <p className="text-white/40 text-xs">Otomatis dicetak</p>
              </div>
              <CheckCircle2 size={18} className="text-emerald-400 ml-auto" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <Box size={20} className="text-white/60" />
              <div>
                <p className="text-white text-sm font-medium">Barcode Shipment</p>
                <p className="text-white/40 text-xs">Otomatis dibuat</p>
              </div>
              <CheckCircle2 size={18} className="text-emerald-400 ml-auto" />
            </div>
          </div>

          <button
            onClick={() => { setCurrentView("scan-order"); setSelectedTask(null); setScannedItems({}); }}
            className="mt-8 w-full max-w-sm py-5 rounded-2xl bg-[#9b60aa] hover:bg-[#8a4f99] text-white font-semibold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.97]"
          >
            <Package size={24} />
            PACKING ORDER BERIKUTNYA
          </button>
        </div>
      )}
    </div>
  );
}
