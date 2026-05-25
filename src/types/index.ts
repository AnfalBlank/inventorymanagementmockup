// ============ ENUMS ============

export type OrderStatus =
  | "WAITING_PICK"
  | "PICKING"
  | "READY_PACKING"
  | "PACKING"
  | "PACKING_COMPLETE"
  | "READY_SHIPMENT"
  | "SHIPPED"
  | "CANCELLED";

export type StockType =
  | "available"
  | "reserved"
  | "damaged"
  | "return"
  | "in_transit";

export type Priority = "normal" | "urgent";

export type UserRole =
  | "super_admin"
  | "admin_gudang"
  | "purchasing"
  | "sales_online"
  | "supervisor"
  | "picker"
  | "packer";

export type MovementType =
  | "stock_in"
  | "stock_out"
  | "transfer"
  | "adjustment"
  | "reservation"
  | "return";

// ============ MASTER DATA ============

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  barcode: string;
  categoryId: string;
  categoryName: string;
  color?: string;
  serialNumber?: string;
  batch?: string;
  minStock: number;
  maxStock: number;
  unit: string;
  weight?: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  isActive: boolean;
  rackCount: number;
}

export interface Rack {
  id: string;
  code: string;
  warehouseId: string;
  warehouseName: string;
  zone: string;
  row: string;
  level: string;
  capacity: number;
  currentLoad: number;
}

// ============ TRANSACTIONS ============

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  priority: Priority;
  items: SalesOrderItem[];
  totalItems: number;
  totalQty: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  qty: number;
  pickedQty: number;
  rackLocation: string;
  barcode: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: "draft" | "ordered" | "partial" | "received" | "cancelled";
  items: PurchaseOrderItem[];
  totalItems: number;
  expectedDate: string;
  receivedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  qtyOrdered: number;
  qtyReceived: number;
  unitPrice: number;
}

// ============ WAREHOUSE OPERATIONS ============

export interface PickingTask {
  id: string;
  orderId: string;
  orderNumber: string;
  priority: Priority;
  status: "pending" | "in_progress" | "completed";
  items: PickingTaskItem[];
  totalItems: number;
  pickedItems: number;
  assignedDevice?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface PickingTaskItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
  rackCode: string;
  rackBarcode: string;
  qty: number;
  pickedQty: number;
  isCompleted: boolean;
}

export interface PackingTask {
  id: string;
  orderId: string;
  orderNumber: string;
  priority: Priority;
  status: "waiting" | "in_progress" | "completed";
  items: PackingTaskItem[];
  totalItems: number;
  packedItems: number;
  waitingSince: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PackingTaskItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  barcode: string;
  qty: number;
  scannedQty: number;
  isVerified: boolean;
}

// ============ INVENTORY ============

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  qty: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  fromRack?: string;
  toRack?: string;
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface StockLevel {
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  rackCode: string;
  available: number;
  reserved: number;
  damaged: number;
  inTransit: number;
  total: number;
  minStock: number;
  isLowStock: boolean;
}

export interface StockAdjustment {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  previousQty: number;
  newQty: number;
  reason: string;
  adjustedBy: string;
  createdAt: string;
}

// ============ RETURNS ============

export interface Return {
  id: string;
  returnNumber: string;
  type: "customer" | "supplier";
  referenceOrder: string;
  status: "pending" | "inspecting" | "approved" | "rejected" | "completed";
  items: ReturnItem[];
  reason: string;
  createdAt: string;
}

export interface ReturnItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  qty: number;
  condition: "good" | "damaged" | "defective";
  notes?: string;
}

// ============ SYSTEM ============

export interface Notification {
  id: string;
  type: "new_order" | "ready_picking" | "ready_packing" | "low_stock" | "return";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface DeviceSession {
  id: string;
  deviceId: string;
  deviceName: string;
  area: string;
  isActive: boolean;
  lastActivity: string;
}

// ============ DASHBOARD ============

export interface DashboardStats {
  totalOrders: number;
  pendingPicking: number;
  pendingPacking: number;
  readyShipment: number;
  lowStockItems: number;
  totalReturns: number;
  todayOrders: number;
  todayShipped: number;
}


// ============ STOCK TRANSFER ============

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: "draft" | "in_transit" | "received" | "cancelled";
  items: StockTransferItem[];
  totalItems: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  receivedAt?: string;
}

export interface StockTransferItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  qty: number;
  qtyReceived: number;
}

// ============ STOCK OPNAME ============

export interface StockOpname {
  id: string;
  opnameNumber: string;
  warehouseId: string;
  warehouseName: string;
  status: "draft" | "in_progress" | "completed";
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  totalItems: number;
  countedItems: number;
  discrepancies: number;
  items: StockOpnameItem[];
  createdBy: string;
}

export interface StockOpnameItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  rackCode: string;
  systemQty: number;
  actualQty: number;
  difference: number;
  isCounted: boolean;
}

// ============ BATCH TRACKING ============

export interface ProductBatch {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
  qtyReceived: number;
  qtyAvailable: number;
  warehouseId: string;
  warehouseName: string;
  rackCode: string;
  status: "active" | "expiring_soon" | "expired" | "depleted";
  receivedAt: string;
}

// ============ SHIPMENT ============

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  courier: string;
  trackingNumber: string;
  weight: number;
  status: "pending" | "shipped" | "in_transit" | "delivered" | "returned";
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}
