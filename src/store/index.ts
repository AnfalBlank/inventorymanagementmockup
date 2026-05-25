import { create } from "zustand";
import type {
  DashboardStats,
  Notification,
  SalesOrder,
  PickingTask,
  PackingTask,
  Product,
  StockLevel,
  Warehouse,
  Rack,
  Category,
  Supplier,
  Customer,
  PurchaseOrder,
  Return,
  StockMovement,
  AuditLog,
  StockTransfer,
  StockOpname,
  ProductBatch,
  Shipment,
} from "@/types";
import {
  mockStockTransfers,
  mockStockOpnames,
  mockBatches,
  mockShipments,
} from "./extra-data";

// ============ MOCK DATA ============

const mockProducts: Product[] = [
  { id: "1", sku: "SKU-001", name: "Laptop ASUS ROG Strix G16", barcode: "8901234567890", categoryId: "1", categoryName: "Electronics", color: "Black", minStock: 10, maxStock: 100, unit: "pcs", weight: 2.5, createdAt: "2026-01-15T08:00:00Z" },
  { id: "2", sku: "SKU-002", name: "Mouse Logitech MX Master 3S", barcode: "8901234567891", categoryId: "1", categoryName: "Electronics", color: "Grey", minStock: 20, maxStock: 200, unit: "pcs", weight: 0.14, createdAt: "2026-01-15T08:00:00Z" },
  { id: "3", sku: "SKU-003", name: "Keyboard Mechanical Keychron K8", barcode: "8901234567892", categoryId: "1", categoryName: "Electronics", color: "White", minStock: 15, maxStock: 150, unit: "pcs", weight: 0.8, createdAt: "2026-01-20T08:00:00Z" },
  { id: "4", sku: "SKU-004", name: "Monitor LG UltraWide 34\"", barcode: "8901234567893", categoryId: "1", categoryName: "Electronics", minStock: 5, maxStock: 50, unit: "pcs", weight: 7.2, createdAt: "2026-02-01T08:00:00Z" },
  { id: "5", sku: "SKU-005", name: "Headset Sony WH-1000XM5", barcode: "8901234567894", categoryId: "1", categoryName: "Electronics", color: "Silver", minStock: 25, maxStock: 200, unit: "pcs", weight: 0.25, createdAt: "2026-02-10T08:00:00Z" },
  { id: "6", sku: "SKU-006", name: "Webcam Logitech C920", barcode: "8901234567895", categoryId: "1", categoryName: "Electronics", minStock: 30, maxStock: 300, unit: "pcs", weight: 0.16, createdAt: "2026-02-15T08:00:00Z" },
  { id: "7", sku: "SKU-007", name: "USB Hub Anker 7-in-1", barcode: "8901234567896", categoryId: "2", categoryName: "Accessories", minStock: 50, maxStock: 500, unit: "pcs", weight: 0.1, createdAt: "2026-03-01T08:00:00Z" },
  { id: "8", sku: "SKU-008", name: "SSD Samsung 970 EVO 1TB", barcode: "8901234567897", categoryId: "3", categoryName: "Storage", minStock: 20, maxStock: 200, unit: "pcs", weight: 0.05, createdAt: "2026-03-05T08:00:00Z" },
];

const mockCategories: Category[] = [
  { id: "1", name: "Electronics", description: "Electronic devices and gadgets", productCount: 6 },
  { id: "2", name: "Accessories", description: "Computer and phone accessories", productCount: 1 },
  { id: "3", name: "Storage", description: "Storage devices", productCount: 1 },
  { id: "4", name: "Networking", description: "Network equipment", productCount: 0 },
];

const mockWarehouses: Warehouse[] = [
  { id: "1", name: "Gudang Utama Jakarta", code: "WH-JKT-01", address: "Jl. Industri No. 45, Jakarta Utara", isActive: true, rackCount: 50 },
  { id: "2", name: "Gudang Bandung", code: "WH-BDG-01", address: "Jl. Soekarno Hatta No. 120, Bandung", isActive: true, rackCount: 30 },
];

const mockRacks: Rack[] = [
  { id: "1", code: "A-01-01", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", zone: "A", row: "01", level: "01", capacity: 100, currentLoad: 75 },
  { id: "2", code: "A-01-02", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", zone: "A", row: "01", level: "02", capacity: 100, currentLoad: 45 },
  { id: "3", code: "A-02-01", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", zone: "A", row: "02", level: "01", capacity: 100, currentLoad: 90 },
  { id: "4", code: "B-01-01", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", zone: "B", row: "01", level: "01", capacity: 150, currentLoad: 60 },
  { id: "5", code: "B-01-02", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", zone: "B", row: "01", level: "02", capacity: 150, currentLoad: 120 },
  { id: "6", code: "C-01-01", warehouseId: "2", warehouseName: "Gudang Bandung", zone: "C", row: "01", level: "01", capacity: 80, currentLoad: 30 },
];

const mockSuppliers: Supplier[] = [
  { id: "1", name: "PT. Distributor Elektronik Indonesia", contactPerson: "Budi Santoso", phone: "021-5551234", email: "budi@dei.co.id", address: "Jl. Mangga Dua No. 88, Jakarta", isActive: true },
  { id: "2", name: "CV. Tech Supply", contactPerson: "Andi Wijaya", phone: "022-4445678", email: "andi@techsupply.id", address: "Jl. Braga No. 55, Bandung", isActive: true },
  { id: "3", name: "PT. Global Accessories", contactPerson: "Siti Rahayu", phone: "021-7778899", email: "siti@globalacc.com", address: "Jl. Sudirman No. 200, Jakarta", isActive: true },
];

const mockCustomers: Customer[] = [
  { id: "1", name: "Toko Komputer Jaya", phone: "081234567890", email: "order@komjaya.id", address: "Jl. Raya Bogor No. 12", city: "Jakarta" },
  { id: "2", name: "PT. Digital Nusantara", phone: "082345678901", email: "procurement@digitalnusa.co.id", address: "Jl. Gatot Subroto No. 88", city: "Jakarta" },
  { id: "3", name: "CV. Mitra Teknologi", phone: "083456789012", email: "info@mitratek.com", address: "Jl. Asia Afrika No. 45", city: "Bandung" },
];

const mockSalesOrders: SalesOrder[] = [
  {
    id: "1", orderNumber: "SO-20260522-0001", customerId: "1", customerName: "Toko Komputer Jaya",
    status: "WAITING_PICK", priority: "urgent",
    items: [
      { id: "1", productId: "1", productName: "Laptop ASUS ROG Strix G16", sku: "SKU-001", qty: 2, pickedQty: 0, rackLocation: "A-01-01", barcode: "8901234567890" },
      { id: "2", productId: "2", productName: "Mouse Logitech MX Master 3S", sku: "SKU-002", qty: 5, pickedQty: 0, rackLocation: "A-02-01", barcode: "8901234567891" },
    ],
    totalItems: 2, totalQty: 7, createdAt: "2026-05-22T08:30:00Z", updatedAt: "2026-05-22T08:30:00Z",
  },
  {
    id: "2", orderNumber: "SO-20260522-0002", customerId: "2", customerName: "PT. Digital Nusantara",
    status: "READY_PACKING", priority: "normal",
    items: [
      { id: "3", productId: "3", productName: "Keyboard Mechanical Keychron K8", sku: "SKU-003", qty: 10, pickedQty: 10, rackLocation: "B-01-01", barcode: "8901234567892" },
      { id: "4", productId: "5", productName: "Headset Sony WH-1000XM5", sku: "SKU-005", qty: 10, pickedQty: 10, rackLocation: "B-01-02", barcode: "8901234567894" },
    ],
    totalItems: 2, totalQty: 20, createdAt: "2026-05-22T07:15:00Z", updatedAt: "2026-05-22T09:45:00Z",
  },
  {
    id: "3", orderNumber: "SO-20260522-0003", customerId: "3", customerName: "CV. Mitra Teknologi",
    status: "PACKING_COMPLETE", priority: "normal",
    items: [
      { id: "5", productId: "6", productName: "Webcam Logitech C920", sku: "SKU-006", qty: 20, pickedQty: 20, rackLocation: "A-01-02", barcode: "8901234567895" },
    ],
    totalItems: 1, totalQty: 20, createdAt: "2026-05-21T14:00:00Z", updatedAt: "2026-05-22T10:00:00Z",
  },
  {
    id: "4", orderNumber: "SO-20260521-0004", customerId: "1", customerName: "Toko Komputer Jaya",
    status: "SHIPPED", priority: "normal",
    items: [
      { id: "6", productId: "7", productName: "USB Hub Anker 7-in-1", sku: "SKU-007", qty: 50, pickedQty: 50, rackLocation: "C-01-01", barcode: "8901234567896" },
    ],
    totalItems: 1, totalQty: 50, createdAt: "2026-05-20T09:00:00Z", updatedAt: "2026-05-21T16:00:00Z",
  },
  {
    id: "5", orderNumber: "SO-20260522-0005", customerId: "2", customerName: "PT. Digital Nusantara",
    status: "PICKING", priority: "urgent",
    items: [
      { id: "7", productId: "4", productName: "Monitor LG UltraWide 34\"", sku: "SKU-004", qty: 3, pickedQty: 1, rackLocation: "A-02-01", barcode: "8901234567893" },
      { id: "8", productId: "8", productName: "SSD Samsung 970 EVO 1TB", sku: "SKU-008", qty: 10, pickedQty: 5, rackLocation: "B-01-01", barcode: "8901234567897" },
    ],
    totalItems: 2, totalQty: 13, createdAt: "2026-05-22T10:00:00Z", updatedAt: "2026-05-22T10:30:00Z",
  },
];

const mockPickingTasks: PickingTask[] = [
  {
    id: "1", orderId: "1", orderNumber: "SO-20260522-0001", priority: "urgent", status: "pending",
    items: [
      { id: "1", productId: "1", productName: "Laptop ASUS ROG Strix G16", sku: "SKU-001", barcode: "8901234567890", rackCode: "A-01-01", rackBarcode: "RACK-A0101", qty: 2, pickedQty: 0, isCompleted: false },
      { id: "2", productId: "2", productName: "Mouse Logitech MX Master 3S", sku: "SKU-002", barcode: "8901234567891", rackCode: "A-02-01", rackBarcode: "RACK-A0201", qty: 5, pickedQty: 0, isCompleted: false },
    ],
    totalItems: 2, pickedItems: 0, createdAt: "2026-05-22T08:30:00Z",
  },
  {
    id: "2", orderId: "5", orderNumber: "SO-20260522-0005", priority: "urgent", status: "in_progress",
    items: [
      { id: "3", productId: "4", productName: "Monitor LG UltraWide 34\"", sku: "SKU-004", barcode: "8901234567893", rackCode: "A-02-01", rackBarcode: "RACK-A0201", qty: 3, pickedQty: 1, isCompleted: false },
      { id: "4", productId: "8", productName: "SSD Samsung 970 EVO 1TB", sku: "SKU-008", barcode: "8901234567897", rackCode: "B-01-01", rackBarcode: "RACK-B0101", qty: 10, pickedQty: 5, isCompleted: false },
    ],
    totalItems: 2, pickedItems: 0, startedAt: "2026-05-22T10:15:00Z", createdAt: "2026-05-22T10:00:00Z",
  },
];

const mockPackingTasks: PackingTask[] = [
  {
    id: "1", orderId: "2", orderNumber: "SO-20260522-0002", priority: "normal", status: "waiting",
    items: [
      { id: "1", productId: "3", productName: "Keyboard Mechanical Keychron K8", sku: "SKU-003", barcode: "8901234567892", qty: 10, scannedQty: 0, isVerified: false },
      { id: "2", productId: "5", productName: "Headset Sony WH-1000XM5", sku: "SKU-005", barcode: "8901234567894", qty: 10, scannedQty: 0, isVerified: false },
    ],
    totalItems: 2, packedItems: 0, waitingSince: "2026-05-22T09:45:00Z",
  },
];

const mockStockLevels: StockLevel[] = [
  { productId: "1", productName: "Laptop ASUS ROG Strix G16", sku: "SKU-001", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", rackCode: "A-01-01", available: 25, reserved: 2, damaged: 0, inTransit: 0, total: 27, minStock: 10, isLowStock: false },
  { productId: "2", productName: "Mouse Logitech MX Master 3S", sku: "SKU-002", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", rackCode: "A-02-01", available: 85, reserved: 5, damaged: 2, inTransit: 0, total: 92, minStock: 20, isLowStock: false },
  { productId: "3", productName: "Keyboard Mechanical Keychron K8", sku: "SKU-003", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", rackCode: "B-01-01", available: 12, reserved: 10, damaged: 0, inTransit: 5, total: 27, minStock: 15, isLowStock: true },
  { productId: "4", productName: "Monitor LG UltraWide 34\"", sku: "SKU-004", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", rackCode: "A-02-01", available: 8, reserved: 3, damaged: 1, inTransit: 0, total: 12, minStock: 5, isLowStock: false },
  { productId: "5", productName: "Headset Sony WH-1000XM5", sku: "SKU-005", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", rackCode: "B-01-02", available: 45, reserved: 10, damaged: 0, inTransit: 10, total: 65, minStock: 25, isLowStock: false },
  { productId: "6", productName: "Webcam Logitech C920", sku: "SKU-006", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", rackCode: "A-01-02", available: 8, reserved: 20, damaged: 0, inTransit: 0, total: 28, minStock: 30, isLowStock: true },
  { productId: "7", productName: "USB Hub Anker 7-in-1", sku: "SKU-007", warehouseId: "2", warehouseName: "Gudang Bandung", rackCode: "C-01-01", available: 150, reserved: 0, damaged: 5, inTransit: 20, total: 175, minStock: 50, isLowStock: false },
  { productId: "8", productName: "SSD Samsung 970 EVO 1TB", sku: "SKU-008", warehouseId: "1", warehouseName: "Gudang Utama Jakarta", rackCode: "B-01-01", available: 35, reserved: 10, damaged: 0, inTransit: 0, total: 45, minStock: 20, isLowStock: false },
];

const mockNotifications: Notification[] = [
  { id: "1", type: "new_order", title: "Order Baru", message: "SO-20260522-0001 dari Toko Komputer Jaya", isRead: false, createdAt: "2026-05-22T08:30:00Z" },
  { id: "2", type: "low_stock", title: "Stok Rendah", message: "Webcam Logitech C920 di bawah minimum stock", isRead: false, createdAt: "2026-05-22T07:00:00Z" },
  { id: "3", type: "ready_packing", title: "Siap Packing", message: "SO-20260522-0002 siap untuk dipacking", isRead: true, createdAt: "2026-05-22T09:45:00Z" },
  { id: "4", type: "low_stock", title: "Stok Rendah", message: "Keyboard Mechanical Keychron K8 mendekati minimum stock", isRead: true, createdAt: "2026-05-22T06:00:00Z" },
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1", poNumber: "PO-20260520-0001", supplierId: "1", supplierName: "PT. Distributor Elektronik Indonesia",
    status: "ordered", totalItems: 2, expectedDate: "2026-05-25", notes: "Urgent restock",
    items: [
      { id: "1", productId: "6", productName: "Webcam Logitech C920", sku: "SKU-006", qtyOrdered: 50, qtyReceived: 0, unitPrice: 850000 },
      { id: "2", productId: "3", productName: "Keyboard Mechanical Keychron K8", sku: "SKU-003", qtyOrdered: 30, qtyReceived: 0, unitPrice: 1200000 },
    ],
    createdAt: "2026-05-20T10:00:00Z",
  },
  {
    id: "2", poNumber: "PO-20260518-0002", supplierId: "2", supplierName: "CV. Tech Supply",
    status: "received", totalItems: 1, expectedDate: "2026-05-22", receivedDate: "2026-05-21",
    items: [
      { id: "3", productId: "8", productName: "SSD Samsung 970 EVO 1TB", sku: "SKU-008", qtyOrdered: 20, qtyReceived: 20, unitPrice: 1500000 },
    ],
    createdAt: "2026-05-18T09:00:00Z",
  },
];

const mockReturns: Return[] = [
  {
    id: "1", returnNumber: "RET-20260521-0001", type: "customer", referenceOrder: "SO-20260519-0010",
    status: "inspecting",
    items: [
      { id: "1", productId: "2", productName: "Mouse Logitech MX Master 3S", sku: "SKU-002", qty: 2, condition: "defective", notes: "Scroll wheel not working" },
    ],
    reason: "Produk cacat", createdAt: "2026-05-21T14:00:00Z",
  },
];

const mockStockMovements: StockMovement[] = [
  { id: "1", productId: "8", productName: "SSD Samsung 970 EVO 1TB", sku: "SKU-008", type: "stock_in", qty: 20, toWarehouse: "Gudang Utama Jakarta", toRack: "B-01-01", reference: "PO-20260518-0002", createdBy: "Admin", createdAt: "2026-05-21T10:00:00Z" },
  { id: "2", productId: "7", productName: "USB Hub Anker 7-in-1", sku: "SKU-007", type: "stock_out", qty: 50, fromWarehouse: "Gudang Bandung", fromRack: "C-01-01", reference: "SO-20260521-0004", createdBy: "System", createdAt: "2026-05-21T16:00:00Z" },
  { id: "3", productId: "6", productName: "Webcam Logitech C920", sku: "SKU-006", type: "reservation", qty: 20, fromWarehouse: "Gudang Utama Jakarta", reference: "SO-20260522-0003", createdBy: "System", createdAt: "2026-05-22T08:00:00Z" },
  { id: "4", productId: "1", productName: "Laptop ASUS ROG Strix G16", sku: "SKU-001", type: "transfer", qty: 5, fromWarehouse: "Gudang Bandung", toWarehouse: "Gudang Utama Jakarta", fromRack: "C-01-01", toRack: "A-01-01", createdBy: "Admin", createdAt: "2026-05-22T07:00:00Z" },
];

const mockAuditLogs: AuditLog[] = [
  { id: "1", action: "CREATE", entity: "SalesOrder", entityId: "1", details: "Created sales order SO-20260522-0001", userId: "1", userName: "Admin Sales", createdAt: "2026-05-22T08:30:00Z" },
  { id: "2", action: "UPDATE", entity: "Stock", entityId: "8", details: "Stock in +20 SSD Samsung 970 EVO 1TB from PO-20260518-0002", userId: "2", userName: "Admin Gudang", createdAt: "2026-05-21T10:00:00Z" },
  { id: "3", action: "SCAN", entity: "PickingTask", entityId: "2", details: "Picked 1x Monitor LG UltraWide at rack A-02-01", userId: "picker-device-01", userName: "Picker Device 01", createdAt: "2026-05-22T10:20:00Z" },
  { id: "4", action: "UPDATE", entity: "SalesOrder", entityId: "2", details: "Status changed to READY_PACKING", userId: "system", userName: "System", createdAt: "2026-05-22T09:45:00Z" },
];

// ============ STORE ============

interface AppState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Dashboard
  dashboardStats: DashboardStats;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Sales Orders
  salesOrders: SalesOrder[];
  addSalesOrder: (order: SalesOrder) => void;
  updateOrderStatus: (id: string, status: SalesOrder["status"]) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;

  // Categories
  categories: Category[];

  // Warehouses & Racks
  warehouses: Warehouse[];
  racks: Rack[];

  // Suppliers & Customers
  suppliers: Supplier[];
  customers: Customer[];

  // Purchase Orders
  purchaseOrders: PurchaseOrder[];

  // Returns
  returns: Return[];

  // Stock
  stockLevels: StockLevel[];
  stockMovements: StockMovement[];

  // Picking & Packing
  pickingTasks: PickingTask[];
  packingTasks: PackingTask[];
  updatePickingTask: (id: string, task: Partial<PickingTask>) => void;
  updatePackingTask: (id: string, task: Partial<PackingTask>) => void;

  // Audit
  auditLogs: AuditLog[];

  // Extra modules
  stockTransfers: StockTransfer[];
  stockOpnames: StockOpname[];
  batches: ProductBatch[];
  shipments: Shipment[];
}

export const useAppStore = create<AppState>((set) => ({
  // Theme
  theme: "light",
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Dashboard
  dashboardStats: {
    totalOrders: 156,
    pendingPicking: 12,
    pendingPacking: 8,
    readyShipment: 5,
    lowStockItems: 2,
    totalReturns: 3,
    todayOrders: 23,
    todayShipped: 18,
  },

  // Notifications
  notifications: mockNotifications,
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  // Sales Orders
  salesOrders: mockSalesOrders,
  addSalesOrder: (order) =>
    set((state) => ({ salesOrders: [order, ...state.salesOrders] })),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      salesOrders: state.salesOrders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    })),

  // Products
  products: mockProducts,
  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),

  // Categories
  categories: mockCategories,

  // Warehouses & Racks
  warehouses: mockWarehouses,
  racks: mockRacks,

  // Suppliers & Customers
  suppliers: mockSuppliers,
  customers: mockCustomers,

  // Purchase Orders
  purchaseOrders: mockPurchaseOrders,

  // Returns
  returns: mockReturns,

  // Stock
  stockLevels: mockStockLevels,
  stockMovements: mockStockMovements,

  // Picking & Packing
  pickingTasks: mockPickingTasks,
  packingTasks: mockPackingTasks,
  updatePickingTask: (id, updates) =>
    set((state) => ({
      pickingTasks: state.pickingTasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
  updatePackingTask: (id, updates) =>
    set((state) => ({
      packingTasks: state.packingTasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),

  // Audit
  auditLogs: mockAuditLogs,

  // Extra modules
  stockTransfers: mockStockTransfers,
  stockOpnames: mockStockOpnames,
  batches: mockBatches,
  shipments: mockShipments,
}));
