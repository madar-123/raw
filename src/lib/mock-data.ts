// ── Warehouses ──
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  usedCapacity: number;
  zones: Zone[];
}

export interface Zone {
  id: string;
  name: string;
  warehouseId: string;
  type: "bulk" | "rack" | "cold" | "hazmat";
  aisles: Aisle[];
}

export interface Aisle {
  id: string;
  name: string;
  zoneId: string;
  bins: StorageBin[];
}

export interface StorageBin {
  id: string;
  label: string;
  aisleId: string;
  capacity: number;
  currentLoad: number;
  status: "available" | "full" | "reserved";
}

// ── Products ──
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  weight: number;
  barcode: string;
  minStockLevel: number;
}

// ── Inventory ──
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  binLabel: string;
  warehouseName: string;
  quantity: number;
  lastUpdated: string;
}

// ── Orders ──
export type OrderStatus = "pending" | "picking" | "packed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

// ── Shipments ──
export interface Shipment {
  id: string;
  shipmentNumber: string;
  supplierName: string;
  status: "expected" | "arrived" | "processing" | "completed";
  items: ShipmentItem[];
  expectedDate: string;
  receivedDate?: string;
}

export interface ShipmentItem {
  productId: string;
  productName: string;
  expectedQty: number;
  receivedQty: number;
}

// ────── SAMPLE DATA ──────

export const warehouses: Warehouse[] = [
  {
    id: "wh-001",
    name: "Central Distribution Hub",
    location: "Chicago, IL",
    capacity: 50000,
    usedCapacity: 34200,
    zones: [
      {
        id: "z-001", name: "Zone A - Bulk Storage", warehouseId: "wh-001", type: "bulk",
        aisles: [
          { id: "a-001", name: "Aisle A1", zoneId: "z-001", bins: [
            { id: "b-001", label: "A1-01", aisleId: "a-001", capacity: 500, currentLoad: 320, status: "available" },
            { id: "b-002", label: "A1-02", aisleId: "a-001", capacity: 500, currentLoad: 500, status: "full" },
            { id: "b-003", label: "A1-03", aisleId: "a-001", capacity: 500, currentLoad: 0, status: "available" },
          ]},
          { id: "a-002", name: "Aisle A2", zoneId: "z-001", bins: [
            { id: "b-004", label: "A2-01", aisleId: "a-002", capacity: 500, currentLoad: 150, status: "available" },
            { id: "b-005", label: "A2-02", aisleId: "a-002", capacity: 500, currentLoad: 500, status: "full" },
          ]},
        ],
      },
      {
        id: "z-002", name: "Zone B - Rack Storage", warehouseId: "wh-001", type: "rack",
        aisles: [
          { id: "a-003", name: "Aisle B1", zoneId: "z-002", bins: [
            { id: "b-006", label: "B1-01", aisleId: "a-003", capacity: 200, currentLoad: 180, status: "available" },
            { id: "b-007", label: "B1-02", aisleId: "a-003", capacity: 200, currentLoad: 200, status: "full" },
          ]},
        ],
      },
      {
        id: "z-003", name: "Zone C - Cold Storage", warehouseId: "wh-001", type: "cold",
        aisles: [
          { id: "a-004", name: "Aisle C1", zoneId: "z-003", bins: [
            { id: "b-008", label: "C1-01", aisleId: "a-004", capacity: 300, currentLoad: 120, status: "available" },
          ]},
        ],
      },
    ],
  },
  {
    id: "wh-002",
    name: "East Coast Fulfillment",
    location: "Newark, NJ",
    capacity: 35000,
    usedCapacity: 28700,
    zones: [
      {
        id: "z-004", name: "Zone A - General", warehouseId: "wh-002", type: "rack",
        aisles: [
          { id: "a-005", name: "Aisle A1", zoneId: "z-004", bins: [
            { id: "b-009", label: "A1-01", aisleId: "a-005", capacity: 400, currentLoad: 350, status: "available" },
            { id: "b-010", label: "A1-02", aisleId: "a-005", capacity: 400, currentLoad: 400, status: "full" },
          ]},
        ],
      },
    ],
  },
  {
    id: "wh-003",
    name: "West Coast Depot",
    location: "Los Angeles, CA",
    capacity: 42000,
    usedCapacity: 18500,
    zones: [
      {
        id: "z-005", name: "Zone A - Hazmat", warehouseId: "wh-003", type: "hazmat",
        aisles: [
          { id: "a-006", name: "Aisle H1", zoneId: "z-005", bins: [
            { id: "b-011", label: "H1-01", aisleId: "a-006", capacity: 100, currentLoad: 45, status: "available" },
          ]},
        ],
      },
    ],
  },
];

export const products: Product[] = [
  { id: "p-001", sku: "SKU-EL-1001", name: "Industrial LED Panel Light", category: "Electronics", unitPrice: 45.99, weight: 2.3, barcode: "8901234567890", minStockLevel: 50 },
  { id: "p-002", sku: "SKU-HW-2001", name: "Stainless Steel Bolt Set (100pc)", category: "Hardware", unitPrice: 12.50, weight: 5.0, barcode: "8901234567891", minStockLevel: 200 },
  { id: "p-003", sku: "SKU-EL-1002", name: "Ethernet Cat6 Cable (50ft)", category: "Electronics", unitPrice: 18.75, weight: 0.8, barcode: "8901234567892", minStockLevel: 100 },
  { id: "p-004", sku: "SKU-PK-3001", name: "Corrugated Shipping Box (Large)", category: "Packaging", unitPrice: 3.25, weight: 0.5, barcode: "8901234567893", minStockLevel: 500 },
  { id: "p-005", sku: "SKU-SF-4001", name: "Anti-Fatigue Floor Mat", category: "Safety", unitPrice: 34.00, weight: 4.2, barcode: "8901234567894", minStockLevel: 30 },
  { id: "p-006", sku: "SKU-EL-1003", name: "USB-C Hub Multiport Adapter", category: "Electronics", unitPrice: 29.99, weight: 0.3, barcode: "8901234567895", minStockLevel: 75 },
  { id: "p-007", sku: "SKU-HW-2002", name: "Pneumatic Impact Wrench", category: "Hardware", unitPrice: 89.99, weight: 3.8, barcode: "8901234567896", minStockLevel: 20 },
  { id: "p-008", sku: "SKU-PK-3002", name: "Bubble Wrap Roll (100m)", category: "Packaging", unitPrice: 15.50, weight: 2.0, barcode: "8901234567897", minStockLevel: 150 },
  { id: "p-009", sku: "SKU-SF-4002", name: "High-Vis Safety Vest (XL)", category: "Safety", unitPrice: 8.99, weight: 0.2, barcode: "8901234567898", minStockLevel: 100 },
  { id: "p-010", sku: "SKU-EL-1004", name: "Wireless Barcode Scanner", category: "Electronics", unitPrice: 125.00, weight: 0.4, barcode: "8901234567899", minStockLevel: 15 },
  { id: "p-011", sku: "SKU-HW-2003", name: "Heavy Duty Pallet Jack", category: "Hardware", unitPrice: 320.00, weight: 35.0, barcode: "8901234567900", minStockLevel: 5 },
  { id: "p-012", sku: "SKU-PK-3003", name: "Stretch Wrap Film (18in)", category: "Packaging", unitPrice: 22.00, weight: 3.5, barcode: "8901234567901", minStockLevel: 80 },
];

export const inventoryItems: InventoryItem[] = [
  { id: "inv-001", productId: "p-001", productName: "Industrial LED Panel Light", sku: "SKU-EL-1001", binLabel: "A1-01", warehouseName: "Central Distribution Hub", quantity: 120, lastUpdated: "2026-04-16T08:30:00Z" },
  { id: "inv-002", productId: "p-002", productName: "Stainless Steel Bolt Set (100pc)", sku: "SKU-HW-2001", binLabel: "A1-02", warehouseName: "Central Distribution Hub", quantity: 450, lastUpdated: "2026-04-16T07:15:00Z" },
  { id: "inv-003", productId: "p-003", productName: "Ethernet Cat6 Cable (50ft)", sku: "SKU-EL-1002", binLabel: "B1-01", warehouseName: "Central Distribution Hub", quantity: 85, lastUpdated: "2026-04-15T16:45:00Z" },
  { id: "inv-004", productId: "p-004", productName: "Corrugated Shipping Box (Large)", sku: "SKU-PK-3001", binLabel: "A2-01", warehouseName: "Central Distribution Hub", quantity: 1200, lastUpdated: "2026-04-16T09:00:00Z" },
  { id: "inv-005", productId: "p-005", productName: "Anti-Fatigue Floor Mat", sku: "SKU-SF-4001", binLabel: "C1-01", warehouseName: "Central Distribution Hub", quantity: 42, lastUpdated: "2026-04-14T11:30:00Z" },
  { id: "inv-006", productId: "p-006", productName: "USB-C Hub Multiport Adapter", sku: "SKU-EL-1003", binLabel: "A1-01", warehouseName: "East Coast Fulfillment", quantity: 200, lastUpdated: "2026-04-16T06:00:00Z" },
  { id: "inv-007", productId: "p-007", productName: "Pneumatic Impact Wrench", sku: "SKU-HW-2002", binLabel: "A1-02", warehouseName: "East Coast Fulfillment", quantity: 18, lastUpdated: "2026-04-15T14:20:00Z" },
  { id: "inv-008", productId: "p-008", productName: "Bubble Wrap Roll (100m)", sku: "SKU-PK-3002", binLabel: "A1-01", warehouseName: "Central Distribution Hub", quantity: 340, lastUpdated: "2026-04-16T10:10:00Z" },
  { id: "inv-009", productId: "p-009", productName: "High-Vis Safety Vest (XL)", sku: "SKU-SF-4002", binLabel: "H1-01", warehouseName: "West Coast Depot", quantity: 500, lastUpdated: "2026-04-16T05:45:00Z" },
  { id: "inv-010", productId: "p-010", productName: "Wireless Barcode Scanner", sku: "SKU-EL-1004", binLabel: "B1-02", warehouseName: "Central Distribution Hub", quantity: 8, lastUpdated: "2026-04-13T09:30:00Z" },
  { id: "inv-011", productId: "p-011", productName: "Heavy Duty Pallet Jack", sku: "SKU-HW-2003", binLabel: "A2-02", warehouseName: "Central Distribution Hub", quantity: 3, lastUpdated: "2026-04-12T15:00:00Z" },
  { id: "inv-012", productId: "p-012", productName: "Stretch Wrap Film (18in)", sku: "SKU-PK-3003", binLabel: "A1-03", warehouseName: "Central Distribution Hub", quantity: 95, lastUpdated: "2026-04-16T11:30:00Z" },
];

export const orders: Order[] = [
  { id: "o-001", orderNumber: "ORD-2026-0451", customerName: "TechCorp Industries", status: "pending", createdAt: "2026-04-16T09:30:00Z", updatedAt: "2026-04-16T09:30:00Z", totalAmount: 1289.70, items: [
    { productId: "p-001", productName: "Industrial LED Panel Light", sku: "SKU-EL-1001", quantity: 20, unitPrice: 45.99 },
    { productId: "p-003", productName: "Ethernet Cat6 Cable (50ft)", sku: "SKU-EL-1002", quantity: 15, unitPrice: 18.75 },
  ]},
  { id: "o-002", orderNumber: "ORD-2026-0452", customerName: "BuildRight Construction", status: "picking", createdAt: "2026-04-15T14:00:00Z", updatedAt: "2026-04-16T08:00:00Z", totalAmount: 2374.50, items: [
    { productId: "p-002", productName: "Stainless Steel Bolt Set (100pc)", sku: "SKU-HW-2001", quantity: 50, unitPrice: 12.50 },
    { productId: "p-007", productName: "Pneumatic Impact Wrench", sku: "SKU-HW-2002", quantity: 15, unitPrice: 89.99 },
    { productId: "p-005", productName: "Anti-Fatigue Floor Mat", sku: "SKU-SF-4001", quantity: 10, unitPrice: 34.00 },
  ]},
  { id: "o-003", orderNumber: "ORD-2026-0453", customerName: "SafeWork Solutions", status: "packed", createdAt: "2026-04-14T10:30:00Z", updatedAt: "2026-04-16T07:15:00Z", totalAmount: 449.50, items: [
    { productId: "p-009", productName: "High-Vis Safety Vest (XL)", sku: "SKU-SF-4002", quantity: 50, unitPrice: 8.99 },
  ]},
  { id: "o-004", orderNumber: "ORD-2026-0454", customerName: "Express Logistics", status: "shipped", createdAt: "2026-04-13T08:00:00Z", updatedAt: "2026-04-15T16:00:00Z", totalAmount: 875.00, items: [
    { productId: "p-010", productName: "Wireless Barcode Scanner", sku: "SKU-EL-1004", quantity: 5, unitPrice: 125.00 },
    { productId: "p-006", productName: "USB-C Hub Multiport Adapter", sku: "SKU-EL-1003", quantity: 5, unitPrice: 29.99 },
    { productId: "p-003", productName: "Ethernet Cat6 Cable (50ft)", sku: "SKU-EL-1002", quantity: 2, unitPrice: 18.75 },
  ]},
  { id: "o-005", orderNumber: "ORD-2026-0455", customerName: "Metro Pack & Ship", status: "delivered", createdAt: "2026-04-10T11:00:00Z", updatedAt: "2026-04-14T09:30:00Z", totalAmount: 1830.00, items: [
    { productId: "p-004", productName: "Corrugated Shipping Box (Large)", sku: "SKU-PK-3001", quantity: 200, unitPrice: 3.25 },
    { productId: "p-008", productName: "Bubble Wrap Roll (100m)", sku: "SKU-PK-3002", quantity: 30, unitPrice: 15.50 },
    { productId: "p-012", productName: "Stretch Wrap Film (18in)", sku: "SKU-PK-3003", quantity: 25, unitPrice: 22.00 },
  ]},
  { id: "o-006", orderNumber: "ORD-2026-0456", customerName: "Allied Manufacturing", status: "pending", createdAt: "2026-04-16T10:45:00Z", updatedAt: "2026-04-16T10:45:00Z", totalAmount: 960.00, items: [
    { productId: "p-011", productName: "Heavy Duty Pallet Jack", sku: "SKU-HW-2003", quantity: 3, unitPrice: 320.00 },
  ]},
  { id: "o-007", orderNumber: "ORD-2026-0457", customerName: "DataCenter Plus", status: "cancelled", createdAt: "2026-04-12T09:15:00Z", updatedAt: "2026-04-13T14:00:00Z", totalAmount: 599.80, items: [
    { productId: "p-006", productName: "USB-C Hub Multiport Adapter", sku: "SKU-EL-1003", quantity: 20, unitPrice: 29.99 },
  ]},
];

export const shipments: Shipment[] = [
  { id: "s-001", shipmentNumber: "SHP-2026-0101", supplierName: "Global Electronics Co.", status: "expected", expectedDate: "2026-04-18", items: [
    { productId: "p-001", productName: "Industrial LED Panel Light", expectedQty: 200, receivedQty: 0 },
    { productId: "p-003", productName: "Ethernet Cat6 Cable (50ft)", expectedQty: 500, receivedQty: 0 },
    { productId: "p-010", productName: "Wireless Barcode Scanner", expectedQty: 50, receivedQty: 0 },
  ]},
  { id: "s-002", shipmentNumber: "SHP-2026-0102", supplierName: "SteelMaster Hardware", status: "arrived", expectedDate: "2026-04-16", receivedDate: "2026-04-16", items: [
    { productId: "p-002", productName: "Stainless Steel Bolt Set (100pc)", expectedQty: 300, receivedQty: 0 },
    { productId: "p-007", productName: "Pneumatic Impact Wrench", expectedQty: 40, receivedQty: 0 },
  ]},
  { id: "s-003", shipmentNumber: "SHP-2026-0103", supplierName: "PackPro Supplies", status: "processing", expectedDate: "2026-04-15", receivedDate: "2026-04-15", items: [
    { productId: "p-004", productName: "Corrugated Shipping Box (Large)", expectedQty: 1000, receivedQty: 750 },
    { productId: "p-008", productName: "Bubble Wrap Roll (100m)", expectedQty: 200, receivedQty: 200 },
    { productId: "p-012", productName: "Stretch Wrap Film (18in)", expectedQty: 100, receivedQty: 80 },
  ]},
  { id: "s-004", shipmentNumber: "SHP-2026-0104", supplierName: "SafetyFirst Gear", status: "completed", expectedDate: "2026-04-12", receivedDate: "2026-04-12", items: [
    { productId: "p-005", productName: "Anti-Fatigue Floor Mat", expectedQty: 50, receivedQty: 50 },
    { productId: "p-009", productName: "High-Vis Safety Vest (XL)", expectedQty: 300, receivedQty: 300 },
  ]},
];

// ── Dashboard KPIs ──
export const dashboardKPIs = {
  totalProducts: products.length,
  totalInventoryValue: inventoryItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.unitPrice * item.quantity : 0);
  }, 0),
  pendingOrders: orders.filter(o => o.status === "pending").length,
  activeShipments: shipments.filter(s => s.status !== "completed").length,
  lowStockItems: inventoryItems.filter(item => {
    const product = products.find(p => p.id === item.productId);
    return product && item.quantity < product.minStockLevel;
  }),
  warehouseUtilization: warehouses.map(w => ({
    name: w.name,
    used: w.usedCapacity,
    total: w.capacity,
    percentage: Math.round((w.usedCapacity / w.capacity) * 100),
  })),
  ordersByStatus: {
    pending: orders.filter(o => o.status === "pending").length,
    picking: orders.filter(o => o.status === "picking").length,
    packed: orders.filter(o => o.status === "packed").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  },
  recentActivity: [
    { time: "09:30", event: "New order ORD-2026-0451 received", type: "order" as const },
    { time: "08:00", event: "Order ORD-2026-0452 moved to Picking", type: "order" as const },
    { time: "07:15", event: "Shipment SHP-2026-0102 arrived at dock", type: "shipment" as const },
    { time: "06:00", event: "Inventory sync completed for East Coast", type: "inventory" as const },
    { time: "05:45", event: "Low stock alert: Wireless Barcode Scanner", type: "alert" as const },
    { time: "04:30", event: "Putaway completed for SHP-2026-0103", type: "shipment" as const },
  ],
};
