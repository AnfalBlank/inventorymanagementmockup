# MIMS — Manggala Inventory Management System

Sistem Inventory Management dan Warehouse Automation berbasis web dan mobile yang dirancang untuk mengotomatisasi seluruh alur operasional gudang secara realtime untuk **PT. Manggala Utama Indonesia**.

> **Status**: Frontend Mockup / UI Demo
> **Versi PRD**: 2.0 (Final Draft, 22 Mei 2026)

---

## Tentang Project

MIMS (Manggala Inventory Management System) adalah aplikasi warehouse automation modern yang fokus pada:

- **Realtime inventory monitoring** — stok terupdate setiap detik
- **Automated workflow status** — perubahan status order otomatis berdasarkan aktivitas scan
- **Fast fulfillment** — proses picking dan packing yang cepat dan akurat
- **Minimal human error** — validasi otomatis di setiap step
- **Paperless operation** — semua proses berbasis digital
- **Role-based interfaces** — interface khusus per fungsi operasional

Project ini adalah **mockup frontend** yang merepresentasikan seluruh halaman dan flow aplikasi sesuai PRD, menggunakan mock data untuk simulasi fungsionalitas.

---

## Arsitektur Project

```
inventorymanagement/
├── src/
│   ├── app/              # 22 halaman (Next.js App Router)
│   ├── components/       # UI components & layout
│   ├── store/            # Zustand state + mock data
│   ├── lib/              # Utilities & design tokens
│   └── types/            # TypeScript definitions
├── public/               # Static assets
├── docs/                 # Documentation
│   ├── prd.md            # Product Requirements Document
│   ├── DESIGN.md         # Design system reference
│   ├── ARCHITECTURE.md   # Technical architecture
│   ├── CONTRIBUTING.md   # Contribution guidelines
│   └── DEMO-GUIDE.md     # Demo presentation guide
├── package.json          # Dependencies & scripts
├── next.config.ts        # Next.js configuration
└── README.md             # This file
```

---

## Quick Start

### Prerequisites

- Node.js 18+ (tested with v25.6.1)
- npm 9+ atau yarn

### Run Frontend

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — akan otomatis redirect ke halaman login.

**Demo credentials sudah terisi otomatis** — cukup klik tombol "Masuk" untuk lanjut ke dashboard.

### Build for Production

```bash
npm run build
npm start
```

---

## Halaman & Fitur (22 Routes)

### 🔐 Authentication (1)

- **`/login`** — Login page dengan split-layout, brand panel kanan, dan shortcut langsung ke interface operasional

### 📊 Admin Dashboard (Login Required)

- **`/dashboard`** — Overview realtime: 8 stat cards, recent orders, low stock alert, aktivitas picking & packing
- **`/notifications`** — Pusat notifikasi dengan filter by tipe (new_order, low_stock, ready_packing, return) dan status
- **`/inventory`** — Stock management dengan 3 tab (Stok Realtime, Mutasi Barang, Stock Opname)
- **`/stock-transfer`** — CRUD transfer antar gudang
- **`/stock-opname`** — Counting sheet dengan diskrepansi tracking
- **`/batch-tracking`** — FIFO/FEFO tracking dengan expiry alerts
- **`/sales-orders`** — Sales order CRUD dengan auto status workflow
- **`/purchase-orders`** — PO ke supplier dengan penerimaan barang
- **`/shipments`** — Tracking pengiriman dengan timeline visual
- **`/returns`** — Return management (customer & supplier)
- **`/monitoring`** — Live monitoring picking, packing, dan tracking order
- **`/transfer-queue`** — Live queue transfer antar gudang
- **`/barcode`** — Generator barcode/QR untuk product, rack, order, shipment
- **`/master-data`** — 6 tab CRUD (Produk, Kategori, Supplier, Customer, Gudang, Rak)
- **`/reporting`** — Laporan stok, performa picker/packer, KPI metrics
- **`/configuration`** — System config (Workflow, Automation, Realtime, Barcode, Inventory Rules, Performance, Security, Backup)
- **`/settings`** — Users & Roles, Devices, Audit Trail, Notifications

### 🏭 Operational Interface (NO LOGIN)

- **`/picker`** — Mobile-first picker interface dengan barcode scanner simulation
- **`/packing-queue`** — Display monitor antrian packing dengan timer realtime
- **`/packing-process`** — Packing scanner dengan auto label print

---

## Tech Stack

### Frontend

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) dengan Turbopack
- **Language**: TypeScript 5
- **Styling**: [TailwindCSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utils**: date-fns
- **Realtime (planned)**: Socket.IO Client

### Design System

Mengadopsi **Cohere-inspired design system**:

- **Color Palette**: Near-black primary (`#17171c`), Deep Green accent (`#003c33`), Coral untuk taxonomy (`#ff7759`)
- **Typography**: Tight tracking display headlines, mono labels untuk technical info
- **Components**: Pill-shaped CTAs (32px radius), rounded media cards (8-22px), thin borders
- **Operational UI**: Dark fullscreen mode untuk picker/packer dengan tombol besar

Lihat `DESIGN (1).md` untuk reference lengkap.

---

## Workflow & Automation

### Auto Status Workflow (PRD 4.1)

Status order berubah otomatis berdasarkan aktivitas scan:

```
Sales create order        →  WAITING_PICK
Picker mulai scan         →  PICKING
Picker scan lengkap       →  READY_PACKING
Packer mulai scan         →  PACKING
Packing complete          →  PACKING_COMPLETE
Resi dicetak              →  READY_SHIPMENT
Order dikirim             →  SHIPPED
```

### Stock Types (PRD 8.1)

| Type | Deskripsi |
|------|-----------|
| Available | Stok yang bisa dijual |
| Reserved | Sedang diproses untuk order |
| Damaged | Rusak, tidak bisa dijual |
| Return | Barang retur dari customer |
| In Transit | Sedang dipindah antar gudang |

### Inventory Rules (PRD 8.2)

- **FIFO** (First In First Out) — default
- **FEFO** (First Expired First Out) — untuk produk dengan expiry

---

## User Roles

| Role | Login | Access |
|------|-------|--------|
| Super Admin | ✓ | Full access |
| Admin Gudang | ✓ | Inventory & monitoring |
| Purchasing | ✓ | PO & supplier |
| Sales Online | ✓ | Sales order |
| Supervisor | ✓ | Monitoring & manual override |
| Picker | ✗ (device whitelist) | Picking task only |
| Packing Queue Monitor | ✗ (device whitelist) | Queue monitoring only |
| Packer | ✗ (device whitelist) | Packing process only |

---

## Demo Highlights

### 🎬 Recommended Demo Flow

1. **Login** (30s) — split layout, klik Masuk
2. **Dashboard** (1.5m) — stat cards, low stock alert
3. **Sales Order** (2m) — create order → auto status flow
4. **Picker NO LOGIN** (2m) — scan rak → scan barang → green/red feedback
5. **Packing Queue** (1m) — TV display dark mode dengan timer realtime
6. **Packing Process** (1.5m) — scan order → verify items → auto print
7. **Inventory Module** (1.5m) — stock movements + opname + batch tracking
8. **Master Data** (1m) — 6 tab CRUD
9. **Live Monitoring** (1m) — realtime activity dengan progress bar
10. **Reporting** (1m) — KPI dashboards
11. **Barcode Generator** (45s) — preview & cetak
12. **Shipment Tracking** (45s) — timeline visual
13. **Configuration** (45s) — system rules

Lihat [`frontend/DEMO-GUIDE.md`](frontend/DEMO-GUIDE.md) untuk detail lengkap.

### 💡 Tips Saat Demo

- **2 browser tabs**: satu admin, satu picker (simulasi paralel)
- **Picker scan simulation**: 85% sukses, 15% error random untuk efek dramatis
- **Mobile demo**: Picker & Packing Process didesain mobile-first
- **Sidebar collapse**: untuk demo full-width content
- **Toast notifications**: setiap action memberi visual feedback

---

## Project Structure (Detail)

### Frontend Source

```
src/
├── app/                          # Next.js App Router pages
│   ├── login/                    # Login page
│   ├── dashboard/                # Main dashboard
│   ├── inventory/                # Stock management
│   ├── stock-transfer/           # Antar gudang
│   ├── stock-opname/             # Counting & adjustment
│   ├── batch-tracking/           # FIFO/FEFO
│   ├── sales-orders/             # SO management
│   ├── purchase-orders/          # PO management
│   ├── shipments/                # Pengiriman
│   ├── returns/                  # Return management
│   ├── monitoring/               # Live monitoring
│   ├── transfer-queue/           # Live transfer queue
│   ├── barcode/                  # Barcode generator
│   ├── master-data/              # CRUD master
│   ├── reporting/                # Laporan
│   ├── configuration/            # System config
│   ├── settings/                 # Users/devices/audit
│   ├── notifications/            # Notification center
│   ├── picker/                   # NO LOGIN — Picker UI
│   ├── packing-queue/            # NO LOGIN — Queue display
│   ├── packing-process/          # NO LOGIN — Packer UI
│   ├── layout.tsx                # Root layout + ToastContainer
│   └── page.tsx                  # Root → redirect login
├── components/
│   ├── layout/                   # AdminLayout, Sidebar, Header
│   └── ui/                       # Button, Card, Modal, Input, Table, StatusBadge, Toast
├── store/                        # Zustand store + mock data
├── lib/                          # utils, design-tokens
└── types/                        # TypeScript interfaces
```

---

## Coverage PRD

✅ **100% Coverage** — Semua section PRD telah diimplementasikan di frontend.

| PRD Section | Implementation |
|-------------|----------------|
| 4.1 Full Automation Status | Visual status flow di Configuration page |
| 4.2 Role-Based Frontend | Admin (login) vs Operational (no login) |
| 5.1 Admin Dashboard | `/dashboard` |
| 5.2 Frontend Picker | `/picker` |
| 5.3 Frontend Packing Queue | `/packing-queue` |
| 5.4 Frontend Proses Packing | `/packing-process` |
| 6 User Roles & Permissions | Settings → Users & Roles |
| 7 Workflow Sistem | Sales → Picking → Packing → Shipment |
| 8 Inventory Management | Inventory + Stock Opname + Batch Tracking |
| 9 Barcode System | `/barcode` (4 tipe) |
| 10 Realtime System | Configuration → Realtime Events |
| 11.1 Master Data | `/master-data` (6 tab) |
| 11.2 Inventory Module | Stock movement + transfer + adjustment |
| 11.3 Warehouse Module | Picking/packing/transfer queue |
| 11.4 Return Module | `/returns` |
| 11.5 Reporting Module | `/reporting` |
| 13 Automation Rules | Configuration → Automation Rules |
| 14 Audit Trail | Settings → Audit Trail |
| 15 Non-Functional | Configuration → Performance/Security/Backup |
| 16 UI/UX Requirements | Modern warehouse UI dengan dark/light mode |

---

## Roadmap

### Phase 1 (Current — Mockup)
- ✅ Inventory core
- ✅ Picking automation flow
- ✅ Packing automation flow
- ✅ Barcode system UI
- ✅ Dashboard
- ✅ Master data CRUD UI

### Phase 2 (Backend Integration)
- Backend NestJS / Laravel
- PostgreSQL database
- Real Socket.IO realtime sync
- Camera Barcode Scanner integration (PWA)
- JWT Authentication & RBAC

### Phase 3 (Advanced)
- AI forecasting
- Warehouse analytics
- Smart routing picking
- IoT sensors integration

---

## Documentation

- **[PRD](docs/prd.md)** — Product Requirements Document v2.0
- **[Design Reference](docs/DESIGN.md)** — Cohere-inspired design system spec
- **[Architecture](docs/ARCHITECTURE.md)** — Technical architecture
- **[Contributing](docs/CONTRIBUTING.md)** — Contribution guidelines
- **[Demo Guide](docs/DEMO-GUIDE.md)** — Step-by-step presentation walkthrough

---

## License

Proprietary — Property of PT. Manggala Utama Indonesia

---

## Contact

Untuk pertanyaan atau kontribusi, hubungi tim development MIMS.
