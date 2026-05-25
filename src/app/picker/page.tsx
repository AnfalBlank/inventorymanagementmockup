"use client";

import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "@/components/ui/StatusBadge";
import type { PickingTask } from "@/types";
import {
  Package,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Box,
} from "lucide-react";

type PickerView = "task-list" | "picking" | "complete";

export default function PickerPage() {
  const { pickingTasks } = useAppStore();
  const [currentView, setCurrentView] = useState<PickerView>("task-list");
  const [selectedTask, setSelectedTask] = useState<PickingTask | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);
  const [scanStep, setScanStep] = useState<"rack" | "item">("rack");
  const [pickedQty, setPickedQty] = useState<Record<string, number>>({});

  const pendingTasks = pickingTasks.filter((t) => t.status === "pending" || t.status === "in_progress");

  const handleSelectTask = (task: PickingTask) => {
    setSelectedTask(task);
    setCurrentView("picking");
    setCurrentItemIndex(0);
    setScanStep("rack");
    setPickedQty({});
  };

  const currentItem = selectedTask?.items[currentItemIndex];
  const currentItemPicked = currentItem ? pickedQty[currentItem.id] || 0 : 0;

  const handleScan = () => {
    if (!currentItem) return;
    const isSuccess = Math.random() > 0.15; // 85% success rate

    if (scanStep === "rack") {
      if (isSuccess) {
        setScanStep("item");
        setScanResult("success");
        setTimeout(() => setScanResult(null), 1200);
      } else {
        setScanResult("error");
        setTimeout(() => setScanResult(null), 1800);
      }
    } else {
      // Item scan
      if (isSuccess) {
        const newQty = currentItemPicked + 1;
        setPickedQty((prev) => ({ ...prev, [currentItem.id]: newQty }));
        setScanResult("success");

        setTimeout(() => {
          setScanResult(null);
          if (newQty >= currentItem.qty) {
            // Item completed, move to next
            if (selectedTask && currentItemIndex < selectedTask.items.length - 1) {
              setCurrentItemIndex((prev) => prev + 1);
              setScanStep("rack");
            } else {
              // All items picked
              setCurrentView("complete");
            }
          }
        }, 800);
      } else {
        setScanResult("error");
        setTimeout(() => setScanResult(null), 1800);
      }
    }
  };

  const totalScannedAcrossItems = selectedTask
    ? selectedTask.items.reduce((sum, item) => sum + (pickedQty[item.id] || 0), 0)
    : 0;
  const totalQtyToScan = selectedTask
    ? selectedTask.items.reduce((sum, item) => sum + item.qty, 0)
    : 0;

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      scanResult === "error" ? "bg-red-500" : scanResult === "success" ? "bg-emerald-500" : "bg-[#17171c]"
    )}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#17171c]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView !== "task-list" && (
              <button
                onClick={() => { setCurrentView("task-list"); setSelectedTask(null); }}
                className="p-2 rounded-lg bg-white/10 text-white"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-lg font-semibold text-white">MIMS Picker</h1>
              <p className="text-xs text-white/60">
                {currentView === "task-list" ? `${pendingTasks.length} task tersedia` : selectedTask?.orderNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/60">Online</span>
          </div>
        </div>
      </div>

      {/* Task List View */}
      {currentView === "task-list" && (
        <div className="p-4 space-y-3">
          <div className="text-center py-4">
            <Package size={32} className="mx-auto text-white/40 mb-2" />
            <p className="text-white/80 text-sm font-medium">Pilih Task untuk Mulai Picking</p>
          </div>

          {pendingTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => handleSelectTask(task)}
              className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-lg">{task.orderNumber}</p>
                  <p className="text-white/60 text-sm mt-0.5">{task.totalItems} items • {task.items.reduce((s, i) => s + i.qty, 0)} pcs</p>
                </div>
                <PriorityBadge priority={task.priority} />
              </div>

              {/* Items Preview */}
              <div className="space-y-2 mt-3">
                {task.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-white/40" />
                      <span className="text-white/80 font-mono text-xs">{item.rackCode}</span>
                      <span className="text-white/60">•</span>
                      <span className="text-white/80 truncate max-w-[150px]">{item.productName}</span>
                    </div>
                    <span className="text-white font-medium">{item.qty}x</span>
                  </div>
                ))}
              </div>

              {task.status === "in_progress" && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                    <span>Progress</span>
                    <span>{task.pickedItems}/{task.totalItems}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${(task.pickedItems / task.totalItems) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          ))}

          {pendingTasks.length === 0 && (
            <div className="text-center py-16">
              <CheckCircle2 size={48} className="mx-auto text-emerald-400 mb-3" />
              <p className="text-white text-lg font-medium">Semua Task Selesai</p>
              <p className="text-white/60 text-sm mt-1">Tidak ada picking task saat ini</p>
            </div>
          )}
        </div>
      )}

      {/* Picking View */}
      {currentView === "picking" && currentItem && (
        <div className="p-4 space-y-4">
          {/* Overall Progress */}
          <div className="flex items-center justify-between text-sm text-white/80 mb-2">
            <span>Item {currentItemIndex + 1} dari {selectedTask?.items.length}</span>
            <span className="font-mono">{totalScannedAcrossItems}/{totalQtyToScan} pcs</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(totalScannedAcrossItems / totalQtyToScan) * 100}%` }}
            />
          </div>

          {/* Current Item Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            {/* Scan Step Indicator */}
            <div className="flex items-center gap-3 justify-center">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                scanStep === "rack" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              )}>
                {scanStep === "rack" ? (
                  <>
                    <MapPin size={14} />
                    <span>STEP 1: Scan Rak</span>
                  </>
                ) : (
                  <>
                    <Box size={14} />
                    <span>STEP 2: Scan Barang</span>
                  </>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="text-center">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Lokasi Rak</p>
              <p className="text-4xl font-bold text-white font-mono tracking-wider">{currentItem.rackCode}</p>
            </div>

            {/* Product Info */}
            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Produk</p>
                <p className="text-white font-medium text-lg mt-1">{currentItem.productName}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider">SKU</p>
                  <p className="text-white font-mono text-sm mt-0.5">{currentItem.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs uppercase tracking-wider">Quantity</p>
                  <p className="text-3xl font-bold text-white mt-0.5">
                    <span className={currentItemPicked > 0 ? "text-emerald-400" : ""}>{currentItemPicked}</span>
                    <span className="text-white/40">/{currentItem.qty}</span>
                  </p>
                </div>
              </div>

              {/* Item progress bar */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(currentItemPicked / currentItem.qty) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Scan Result Feedback */}
          {scanResult && (
            <div className={cn(
              "p-4 rounded-2xl text-center animate-pulse",
              scanResult === "success" ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-red-500/20 border border-red-500/30"
            )}>
              {scanResult === "success" ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={24} className="text-emerald-400" />
                  <span className="text-emerald-300 font-medium text-lg">
                    {scanStep === "rack" ? "Rak Terverifikasi! Lanjut scan barang." : `+1 Barang! (${currentItemPicked}/${currentItem.qty})`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle size={24} className="text-red-400" />
                  <span className="text-red-300 font-medium text-lg">
                    {scanStep === "rack" ? "Rak Salah! Coba scan ulang." : "Barang Tidak Sesuai!"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Scan Button */}
          <button
            onClick={handleScan}
            disabled={scanResult !== null}
            className={cn(
              "w-full py-6 rounded-2xl text-white font-semibold text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.97]",
              scanResult !== null ? "opacity-50 cursor-not-allowed bg-white/10" :
              scanStep === "rack" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
            )}
          >
            <ScanLine size={28} />
            {scanStep === "rack" ? "SCAN RAK" : "SCAN BARANG"}
          </button>

          {/* All items overview */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Semua Item</p>
            {selectedTask?.items.map((item, idx) => {
              const itemPicked = pickedQty[item.id] || 0;
              const isCurrent = idx === currentItemIndex;
              const isDone = itemPicked >= item.qty;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm",
                    isCurrent && "bg-blue-500/20 border border-blue-500/30",
                    isDone && !isCurrent && "bg-emerald-500/10",
                    !isCurrent && !isDone && "bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {isDone ? <CheckCircle2 size={14} className="text-emerald-400" /> :
                     isCurrent ? <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" /> :
                     <div className="w-3 h-3 rounded-full bg-white/20" />}
                    <span className={cn(
                      "truncate max-w-[180px]",
                      isDone ? "text-emerald-300" : isCurrent ? "text-white" : "text-white/60"
                    )}>{item.productName}</span>
                  </div>
                  <span className={cn(
                    "font-mono",
                    isDone ? "text-emerald-300" : isCurrent ? "text-white" : "text-white/40"
                  )}>
                    {itemPicked}/{item.qty}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete View */}
      {currentView === "complete" && selectedTask && (
        <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle2 size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-2">Picking Selesai!</h2>
          <p className="text-white/60 text-sm text-center max-w-sm mb-2">
            Semua item telah terambil dengan benar
          </p>
          <p className="text-white font-mono font-semibold text-lg mb-8">{selectedTask.orderNumber}</p>

          <div className="w-full max-w-sm bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-8">
            <p className="text-purple-300 text-sm text-center font-medium">
              Status otomatis berubah ke
            </p>
            <p className="text-white text-xl font-bold text-center mt-1 font-mono">
              READY_PACKING
            </p>
            <p className="text-purple-300/60 text-xs text-center mt-1">
              Order akan otomatis muncul di Packing Queue
            </p>
          </div>

          <button
            onClick={() => { setCurrentView("task-list"); setSelectedTask(null); setPickedQty({}); }}
            className="w-full max-w-sm py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.97]"
          >
            <Package size={24} />
            PICK ORDER BERIKUTNYA
          </button>
        </div>
      )}
    </div>
  );
}
