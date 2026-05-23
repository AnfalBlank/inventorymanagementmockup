Product Requirements Document (PRD)
Manggala Inventory Management & Warehouse Automation System (MIMS)
Untuk

PT. Manggala Utama Indonesia

Versi: 2.0
Status: Final Draft
Tanggal: 22 Mei 2026

1. Executive Summary

MIMS adalah sistem Inventory Management dan Warehouse Automation berbasis web dan mobile yang dirancang untuk mengotomatisasi seluruh alur operasional gudang secara realtime.

Sistem difokuskan untuk:

monitoring stok realtime
automasi perpindahan status barang
mempercepat proses fulfillment
mengurangi human error
meningkatkan akurasi inventory
mempercepat proses picking dan packing
menyediakan tracking operasional end-to-end

Sistem menggunakan pendekatan:

event-driven realtime architecture
barcode scanning
automatic workflow status
task-based warehouse operation

Seluruh perubahan status transaksi dilakukan otomatis oleh sistem berdasarkan aktivitas scan dan perpindahan barang.

2. Tujuan Sistem
Tujuan Utama
Menghilangkan pencatatan manual
Membuat status barang realtime
Meminimalisir kesalahan picking
Mempercepat proses packing
Meningkatkan akurasi stok
Menyediakan dashboard monitoring live
Membuat operasional gudang paperless
Mengurangi komunikasi manual antar divisi
3. Scope Sistem
In Scope
Inventory Management
Warehouse Management
Picking Automation
Packing Automation
Barcode & QR System
Realtime Notification
Sales Order
Purchase Order
Return Management
Multi Warehouse
Multi Rack Location
Mobile Warehouse Interface
Reporting Dashboard
Audit Trail
Auto Workflow Status
Out of Scope
Accounting System
Marketplace Integration
AI Forecasting
Delivery Tracking GPS
IoT Smart Warehouse
4. Konsep Utama Sistem
4.1 Full Automation Status

Seluruh status order berubah otomatis berdasarkan aktivitas scan.

Contoh:

Aktivitas	Status Otomatis
Sales membuat order	WAITING_PICK
Picker scan barang lengkap	READY_PACKING
Packer scan verifikasi	PACKING
Packing selesai	READY_SHIPMENT
Resi dicetak	SHIPPED

User tidak diperbolehkan mengubah status secara manual kecuali admin supervisor.

4.2 Role-Based Frontend

Frontend dibedakan berdasarkan fungsi operasional.

5. Arsitektur Frontend
5.1 Admin Dashboard (Login Required)

Digunakan oleh:

Super Admin
Admin Gudang
Purchasing
Sales Online
Supervisor
Fitur
Dashboard
total order
stok realtime
pending picking
pending packing
low stock
retur
aktivitas gudang
Inventory
stock management
mutasi barang
stock adjustment
stock opname
Master Data
produk
kategori
supplier
gudang
rak
Monitoring
live picking
live packing
tracking order
Reporting
laporan stok
laporan mutasi
performa picker
performa packing
5.2 Frontend Picker (NO LOGIN)

Digunakan oleh:

Petugas Ambil Barang
Konsep

Picker tidak perlu login.

Perangkat picker langsung menampilkan:

daftar barang yang harus diambil
lokasi rak
qty
prioritas order

Sistem menggunakan:

device binding
area assignment
realtime queue
Tampilan Picker
Halaman Utama

Menampilkan:

Informasi	Keterangan
Nomor Order	SO otomatis
Lokasi Rak	Rack code
Nama Barang	SKU
Qty	Jumlah
Prioritas	Normal/Urgent
Workflow Picker
Step 1

Picker memilih task tersedia.

Step 2

Picker scan:

barcode rak
barcode barang
Step 3

Sistem validasi otomatis.

Jika benar:

qty bertambah otomatis
progress realtime berubah

Jika salah:

bunyi error
layar merah
tidak bisa lanjut
Step 4

Jika semua item selesai:
status otomatis menjadi:

READY_PACKING

5.3 Frontend Packing Queue (NO LOGIN)

Digunakan oleh:

Area Packing
Konsep

Monitor packing tanpa login.

Menampilkan:

daftar order siap packing
prioritas
waktu tunggu
jumlah item

Realtime otomatis.

Tampilan Packing Queue
Informasi
Field	Detail
Nomor Order	SO
Jumlah Item	Total SKU
Status	READY_PACKING
Timer	Waiting duration
Prioritas	Normal/Urgent
5.4 Frontend Proses Packing (NO LOGIN)

Digunakan oleh:

Petugas Packing
Konsep

Petugas packing cukup scan barcode order.

Tidak perlu login.

Workflow Packing
Step 1

Scan barcode order.

Step 2

Sistem membuka detail packing.

Step 3

Packer scan semua item.

Validasi Otomatis

Sistem memastikan:

SKU sesuai
Qty sesuai
tidak ada item kurang
Automation

Jika scan lengkap:

Status otomatis berubah menjadi:

PACKING_COMPLETE

Cetak Otomatis

Setelah selesai:

label otomatis muncul
barcode shipment otomatis dibuat
6. User Role & Permissions
Role	Login	Akses
Super Admin	Ya	Full akses
Admin Gudang	Ya	Inventory & monitoring
Purchasing	Ya	PO & supplier
Sales Online	Ya	Sales order
Picker	Tidak	Picking task only
Packing Queue Monitor	Tidak	Queue monitoring
Packer	Tidak	Packing process
7. Workflow Sistem
7.1 Sales Order Flow
Sales input order
Sistem validasi stok
Sistem reserve stok
Generate picking task
Task muncul realtime ke picker
Picker scan barang
Status otomatis READY_PACKING
Queue packing realtime muncul
Packer scan ulang
Status otomatis PACKING_COMPLETE
Shipment label dibuat
7.2 Picking Automation Flow
Trigger

Order masuk.

Sistem otomatis:
menentukan lokasi rak
menentukan prioritas
menentukan jalur picking
7.3 Packing Automation Flow
Trigger

Picking selesai.

Sistem otomatis:
push ke packing queue
hitung SLA packing
tampil realtime di monitor
8. Inventory Management
8.1 Stock Type
Jenis Stok	Keterangan
Available	Bisa dijual
Reserved	Sedang diproses
Damaged	Rusak
Return	Barang retur
In Transit	Sedang dipindah
8.2 Inventory Rules
FIFO / FEFO

Sistem otomatis memilih:

batch terlama
expired terdekat
9. Barcode System
Jenis Barcode
Barcode	Fungsi
Product Barcode	SKU
Rack Barcode	Lokasi
Order Barcode	Picking
Shipment Barcode	Pengiriman
10. Realtime System
Teknologi
WebSocket
Socket.IO
Firebase Push
Realtime Event
Event	Trigger
New Order	Sales create SO
Ready Picking	Auto generated
Ready Packing	Picking complete
Low Stock	Minimum stock
Retur	Return created
11. Modul Sistem
11.1 Master Data
Fitur
Produk
SKU
barcode
kategori
warna
serial number
batch
Gudang
warehouse
rack
freezer room
Supplier
supplier data
Customer
customer data
11.2 Inventory Module
Fitur
stock in
stock out
stock transfer
adjustment
reservation
batch tracking
11.3 Warehouse Module
Fitur
picking queue
packing queue
transfer queue
stock opname
11.4 Return Module
Fitur
retur customer
retur supplier
damage inspection
11.5 Reporting Module
Dashboard
Inventory
total stok
low stock
dead stock
fast moving
Warehouse
picking speed
packing speed
pending queue
12. Database Structure
Master Tables
users
roles
products
categories
suppliers
customers
warehouses
racks
Transaction Tables
sales_orders
sales_order_items
picking_tasks
packing_tasks
stock_movements
stock_adjustments
returns
System Tables
notifications
audit_logs
device_sessions
13. Automation Rules
Auto Picking

Jika:

order dibuat
stok tersedia

Maka:

picking task otomatis dibuat
Auto Packing

Jika:

semua item sudah discan picker

Maka:

packing queue otomatis muncul
Auto Shipment

Jika:

packing selesai

Maka:

shipment label otomatis generate
14. Audit Trail

Sistem wajib mencatat:

scan barang
perpindahan stok
perubahan qty
stock adjustment
delete transaksi
perubahan master data
15. Persyaratan Non-Fungsional
Performance
Parameter	Target
Response API	<2 detik
Scan barcode	<1 detik
Realtime sync	<2 detik
Concurrent users	300+
Security
Admin Area
JWT Authentication
RBAC
HTTPS
Password hashing
Non Login Operational Screen

Menggunakan:

Device whitelist
Local session token
Restricted access mode
Availability
uptime 99%
auto backup
disaster recovery
16. UI/UX Requirements
Dashboard

Style:

modern warehouse
clean UI
realtime monitoring
dark/light mode
Picker UI

Harus:

tombol besar
scan cepat
minim klik
fullscreen mode
Packing UI

Harus:

realtime queue
scan cepat
validasi visual jelas
17. Technology Stack
Frontend
Admin Dashboard
Next.js
React
TailwindCSS
Picker & Packing
PWA Mobile
React
Camera Barcode Scanner
Backend
NestJS
atau
Laravel
Database
PostgreSQL
Realtime
Socket.IO
Redis
Infrastructure
Docker
VPS / Cloud Server
Nginx
18. KPI Sistem
KPI	Target
Akurasi stok	>98%
Picking accuracy	>99%
Human error	turun 70%
Packing speed	naik 40%
Stock opname	lebih cepat 60%
19. Roadmap
Phase 1
inventory core
picking automation
packing automation
barcode system
dashboard
Phase 2
mobile optimization
return management
shipment integration
Phase 3
AI forecasting
warehouse analytics
smart routing picking
20. Kesimpulan

MIMS dirancang sebagai sistem warehouse automation modern dengan fokus pada:

realtime inventory
automated workflow
fast fulfillment
warehouse efficiency
minimal human error
paperless operation