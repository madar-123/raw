import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { inventoryItems, products } from "@/lib/mock-data";
import { useState } from "react";
import { Search, Filter, AlertTriangle, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/inventory")({
  component: InventoryPage,
  head: () => ({
    meta: [
      { title: "Inventory — WMS Control" },
      { name: "description", content: "Real-time inventory tracking across all warehouses" },
    ],
  }),
});

function InventoryPage() {
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");

  const uniqueWarehouses = [...new Set(inventoryItems.map((i) => i.warehouseName))];

  const filtered = inventoryItems.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.binLabel.toLowerCase().includes(search.toLowerCase());
    const matchesWarehouse = warehouseFilter === "all" || item.warehouseName === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  return (
    <AuthGuard>
      <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory Catalog</h1>
          <p className="text-sm text-muted-foreground">
            {inventoryItems.length} items tracked across {uniqueWarehouses.length} warehouses
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product, SKU, or bin..."
              className="h-10 w-full rounded-md border border-input bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-muted/50 px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Warehouses</option>
            {uniqueWarehouses.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Warehouse</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bin</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                const isLow = product && item.quantity < product.minStockLevel;
                return (
                  <tr key={item.id} className="border-b border-border transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{item.productName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.sku}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.warehouseName}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-accent px-2 py-0.5 font-mono text-xs font-medium text-accent-foreground">
                        {item.binLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                      ${product ? (product.unitPrice * item.quantity).toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                          <AlertTriangle className="h-3 w-3" /> Low
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-success">OK</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(item.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </AppLayout>
    </AuthGuard>
  );
}
