# MIMS Demo Guide

Panduan singkat untuk presentasi demo MIMS (Manggala Inventory Management System).

## Cara Menjalankan

```bash
cd frontend
npm run dev
```

Buka `http://localhost:3000` — auto redirect ke login.

## Alur Demo Recommended (12-15 menit)

### 1. Login (30 detik)
- Halaman: `/login`
- Highlight: split layout, brand panel kanan, credentials sudah terisi
- **Klik "Masuk"** → masuk ke dashboard

### 2. Dashboard (1.5 menit)
- Halaman: `/dashboard`
- Tunjukkan: 8 stat cards realtime, recent orders, low stock alert dengan progress bar, aktivitas picking dan packing queue
- Highlight: warna status badges, prioritas urgent

### 3. Sales Order Flow (2 menit)
- Buka `/sales-orders` → tunjukkan list order dengan status berbeda
- Klik salah satu order → modal detail dengan items dan progress picking
- Klik "Buat Order Baru" → demo form create
- Tutup modal, tunjukkan filter by status

### 4. Picker Interface (NO LOGIN) (2 menit)
- Buka `/picker`
- Tunjukkan: list task tersedia dengan prioritas
- Klik salah satu task → masuk ke screen scan
- **Klik tombol biru "SCAN RAK"** → simulasi scan (kadang sukses, kadang error untuk demo)
  - Sukses → layar hijau, lanjut ke scan barang
  - Error → layar merah, tidak bisa lanjut
- Demo flow: rak → barang → next item → selesai

### 5. Packing Queue Display (NO LOGIN) (1 menit)
- Buka `/packing-queue`
- Highlight: tampilan TV dark mode dengan timer realtime, prioritas urgent berkedip
- Cocok untuk monitor di area packing

### 6. Packing Process (NO LOGIN) (1.5 menit)
- Buka `/packing-process`
- **Klik "SCAN ORDER"** → otomatis ambil order pertama yang ready
- Klik tombol "SCAN ITEM" untuk setiap item → progress bertambah otomatis
- Saat semua selesai → screen completion dengan auto-print labels

### 7. Inventory Module (1.5 menit)
- Buka `/inventory` → tab Stok Realtime
- Switch ke tab Mutasi Barang → tunjukkan history movement dengan tipe badge berwarna
- Buka `/stock-opname` → tunjukkan opname yang sedang berjalan dengan counting sheet
- Buka `/batch-tracking` → tunjukkan FIFO/FEFO dengan expiry alerts

### 8. Master Data (1 menit)
- Buka `/master-data`
- Switch antar 6 tabs: Produk, Kategori, Supplier, Customer, Gudang, Rak
- Klik "Tambah Produk" → tunjukkan modal form dengan validation

### 9. Live Monitoring (1 menit)
- Buka `/monitoring`
- Tab "Live Picking" → progress bar animasi, items checklist
- Tab "Live Packing" → status item verified
- Tab "Tracking Order" → flow status orders

### 10. Reporting (1 menit)
- Buka `/reporting`
- Tab Laporan Stok → bar chart distribusi, fast moving items
- Tab Laporan Gudang → throughput chart 7 hari
- Tab Performa → KPI cards (akurasi, picking accuracy, dll)

### 11. Barcode Generator (45 detik)
- Buka `/barcode`
- Pilih tipe (Product/Rack/Order/Shipment)
- Centang beberapa item → preview barcode/QR muncul real-time
- Switch antara Barcode dan QR Code format

### 12. Shipment Tracking (45 detik)
- Buka `/shipments`
- Klik salah satu shipment → modal dengan tracking timeline visual
- Highlight: status banner berwarna, 4-step timeline (Created → Shipped → In Transit → Delivered)

### 13. Settings & Audit (30 detik)
- Buka `/settings` → tab Devices → device whitelist untuk picker/packer
- Tab Audit Trail → semua aktivitas tercatat lengkap

## Talking Points Penting

### Konsep Auto Workflow Status
Tunjukkan badge status di Sales Order:
- `WAITING_PICK` (kuning) → otomatis saat order dibuat
- `PICKING` (biru) → otomatis saat picker mulai scan
- `READY_PACKING` (ungu) → otomatis saat picker selesai
- `PACKING_COMPLETE` (teal) → otomatis saat packer selesai scan
- `SHIPPED` (hijau) → otomatis saat resi dicetak

### Role-Based Frontend
- Admin area (login required): Dashboard, Inventory, Master Data, Sales/Purchase Order, Monitoring, Reporting, Settings
- Operational area (NO LOGIN): Picker, Packing Queue, Packing Process — device whitelist untuk security

### Realtime Architecture
- Dashboard stats update otomatis
- Packing queue dengan timer hidup
- Live monitoring dengan progress bar animasi
- Notification dropdown dengan unread count

### Barcode System (4 tipe)
- Product Barcode (SKU)
- Rack Barcode (Lokasi)
- Order Barcode (Picking)
- Shipment Barcode (Pengiriman)

### Inventory Rules
- FIFO (First In First Out)
- FEFO (First Expired First Out) — penting untuk produk dengan expiry
- 5 stock types: Available, Reserved, Damaged, Return, In Transit

## Tips Presentasi

1. **Buka 2 browser window** — satu admin (dashboard), satu picker/packer untuk simulasi paralel
2. **Sebelum mulai**, refresh semua tab agar data fresh
3. **Untuk simulasi error scan** di Picker, scan beberapa kali — sistem random 80% sukses, 20% error
4. **Sidebar bisa dikecilkan** dengan tombol collapse di bawah untuk demo full-width content
5. **Notifikasi bell** di header punya badge unread count yang menarik perhatian
6. **Mobile demo**: Picker dan Packing Process didesain mobile-first, buka via DevTools responsive mode atau actual device

## Coverage PRD

| Section PRD | Status |
|-------------|--------|
| 4.1 Full Automation Status | ✓ |
| 4.2 Role-Based Frontend | ✓ |
| 5.1 Admin Dashboard | ✓ |
| 5.2 Frontend Picker (NO LOGIN) | ✓ |
| 5.3 Frontend Packing Queue (NO LOGIN) | ✓ |
| 5.4 Frontend Proses Packing (NO LOGIN) | ✓ |
| 6 User Roles & Permissions | ✓ |
| 7 Workflow Sistem | ✓ |
| 8 Inventory Management | ✓ |
| 9 Barcode System | ✓ |
| 10 Realtime System (UI ready) | ✓ |
| 11.1 Master Data | ✓ |
| 11.2 Inventory Module | ✓ |
| 11.3 Warehouse Module | ✓ |
| 11.4 Return Module | ✓ |
| 11.5 Reporting Module | ✓ |
| 13 Automation Rules (visual) | ✓ |
| 14 Audit Trail | ✓ |
| 15 Non-Functional (UI accommodates) | ✓ |
| 16 UI/UX Requirements | ✓ |
