"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { useAppStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Barcode,
  QrCode,
  Printer,
  Download,
  Package,
  MapPin,
  ShoppingCart,
  Truck,
  Copy,
} from "lucide-react";

type BarcodeType = "product" | "rack" | "order" | "shipment";

export default function BarcodePage() {
  const { products, racks, salesOrders, shipments } = useAppStore();
  const [activeType, setActiveType] = useState<BarcodeType>("product");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [labelSize, setLabelSize] = useState("medium");
  const [labelFormat, setLabelFormat] = useState<"barcode" | "qrcode">("barcode");

  const types: { key: BarcodeType; label: string; icon: React.ReactNode; description: string }[] = [
    { key: "product", label: "Product Barcode", icon: <Package size={20} />, description: "Generate barcode untuk SKU produk" },
    { key: "rack", label: "Rack Barcode", icon: <MapPin size={20} />, description: "Generate barcode lokasi rak" },
    { key: "order", label: "Order Barcode", icon: <ShoppingCart size={20} />, description: "Generate barcode untuk picking order" },
    { key: "shipment", label: "Shipment Barcode", icon: <Truck size={20} />, description: "Generate barcode pengiriman" },
  ];

  const getDataSource = () => {
    switch (activeType) {
      case "product":
        return products.map((p) => ({ id: p.id, code: p.barcode, label: p.name, subtitle: p.sku }));
      case "rack":
        return racks.map((r) => ({ id: r.id, code: `RACK-${r.code.replace(/-/g, "")}`, label: r.code, subtitle: r.warehouseName }));
      case "order":
        return salesOrders.map((o) => ({ id: o.id, code: o.orderNumber, label: o.orderNumber, subtitle: o.customerName }));
      case "shipment":
        return shipments.map((s) => ({ id: s.id, code: s.shipmentNumber, label: s.shipmentNumber, subtitle: s.customerName }));
    }
  };

  const dataSource = getDataSource();

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === dataSource.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(dataSource.map((d) => d.id));
    }
  };

  // SVG barcode placeholder generator
  const generateBarcodePattern = (text: string) => {
    const bars = [];
    for (let i = 0; i < text.length * 3; i++) {
      const width = (text.charCodeAt(i % text.length) % 4) + 1;
      bars.push({ width, isBlack: i % 2 === 0 });
    }
    return bars;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#212121] tracking-tight">Barcode Generator</h1>
          <p className="text-sm text-[#616161] mt-1">Generate dan cetak barcode untuk produk, rak, order, dan shipment</p>
        </div>

        {/* Type Selector */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {types.map((type) => (
            <button
              key={type.key}
              onClick={() => { setActiveType(type.key); setSelectedItems([]); }}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                activeType === type.key
                  ? "border-[#003c33] bg-[#003c33] text-white"
                  : "border-[#e5e7eb] bg-white hover:border-[#d9d9dd]"
              )}
            >
              <div className={cn("inline-flex p-2 rounded-lg mb-3", activeType === type.key ? "bg-white/10" : "bg-[#f2f2f2]")}>
                {type.icon}
              </div>
              <p className="font-semibold text-sm">{type.label}</p>
              <p className={cn("text-xs mt-1", activeType === type.key ? "text-white/70" : "text-[#616161]")}>
                {type.description}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Item Selection */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#212121]">Pilih Item</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="text-xs text-[#1863dc] hover:underline"
                >
                  {selectedItems.length === dataSource.length ? "Batalkan semua" : "Pilih semua"}
                </button>
                <span className="text-xs text-[#93939f]">•</span>
                <span className="text-xs text-[#616161] font-medium">
                  {selectedItems.length} terpilih
                </span>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto divide-y divide-[#f2f2f2] -mx-2">
              {dataSource.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 px-2 py-3 hover:bg-[#f8f8f8] rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 rounded border-[#d9d9dd] text-[#003c33] focus:ring-[#9b60aa]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#212121] truncate">{item.label}</p>
                    <p className="text-xs text-[#616161] font-mono">{item.subtitle}</p>
                  </div>
                  <span className="text-xs text-[#93939f] font-mono">{item.code}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Settings & Preview */}
          <div className="space-y-4">
            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-4">Pengaturan</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#212121] block mb-2">Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLabelFormat("barcode")}
                      className={cn(
                        "p-3 rounded-lg border text-center transition-all",
                        labelFormat === "barcode" ? "border-[#003c33] bg-[#f8f8f8]" : "border-[#e5e7eb]"
                      )}
                    >
                      <Barcode size={20} className="mx-auto mb-1 text-[#212121]" />
                      <p className="text-xs font-medium">Barcode</p>
                    </button>
                    <button
                      onClick={() => setLabelFormat("qrcode")}
                      className={cn(
                        "p-3 rounded-lg border text-center transition-all",
                        labelFormat === "qrcode" ? "border-[#003c33] bg-[#f8f8f8]" : "border-[#e5e7eb]"
                      )}
                    >
                      <QrCode size={20} className="mx-auto mb-1 text-[#212121]" />
                      <p className="text-xs font-medium">QR Code</p>
                    </button>
                  </div>
                </div>

                <Select
                  label="Ukuran Label"
                  value={labelSize}
                  onChange={(e) => setLabelSize(e.target.value)}
                  options={[
                    { value: "small", label: "Small (40x20mm)" },
                    { value: "medium", label: "Medium (60x30mm)" },
                    { value: "large", label: "Large (80x50mm)" },
                  ]}
                />

                <Input label="Jumlah Copy per Item" type="number" defaultValue="1" min="1" />
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-[#212121] mb-3">Preview</h3>
              {selectedItems.length > 0 ? (
                <div className="border-2 border-dashed border-[#d9d9dd] rounded-lg p-4 bg-white">
                  {(() => {
                    const item = dataSource.find((d) => d.id === selectedItems[0]);
                    if (!item) return null;
                    return (
                      <div className="text-center">
                        {labelFormat === "barcode" ? (
                          <div className="flex items-end justify-center gap-[1px] h-16 mb-2">
                            {generateBarcodePattern(item.code).map((bar, i) => (
                              <div
                                key={i}
                                className={cn("h-full", bar.isBlack ? "bg-black" : "bg-white")}
                                style={{ width: `${bar.width}px` }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-24 h-24 mx-auto mb-2 grid grid-cols-12 gap-[1px] bg-white p-1 border">
                            {Array.from({ length: 144 }).map((_, i) => (
                              <div
                                key={i}
                                className={(item.code.charCodeAt(i % item.code.length) + i) % 3 === 0 ? "bg-black" : "bg-white"}
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-xs font-mono font-semibold text-[#212121]">{item.code}</p>
                        <p className="text-[10px] text-[#616161] mt-0.5 truncate">{item.label}</p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#d9d9dd] rounded-lg p-8 text-center">
                  <Barcode size={32} className="mx-auto text-[#93939f] mb-2" />
                  <p className="text-xs text-[#93939f]">Pilih item untuk preview</p>
                </div>
              )}
            </Card>

            <div className="space-y-2">
              <Button className="w-full" icon={<Printer size={16} />} disabled={selectedItems.length === 0} onClick={() => toast({ type: "success", title: "Cetak dimulai", description: `${selectedItems.length} barcode dikirim ke printer` })}>
                Cetak {selectedItems.length > 0 ? `(${selectedItems.length})` : ""}
              </Button>
              <Button variant="outline" className="w-full" icon={<Download size={16} />} disabled={selectedItems.length === 0} onClick={() => toast({ type: "success", title: "Download dimulai", description: "PDF dengan label barcode akan tersedia" })}>
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
