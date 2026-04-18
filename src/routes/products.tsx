import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { products } from "@/lib/mock-data";
import { useState } from "react";
import { Search, Barcode, DollarSign, Weight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "Products — WMS Control" },
      { name: "description", content: "Product catalog with SKU and barcode management" },
    ],
  }),
});

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AuthGuard>
      <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Product Catalog</h1>
          <p className="text-sm text-muted-foreground">{products.length} products registered</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or SKUs..."
              className="h-10 w-full rounded-md border border-input bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-muted/50 px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{product.name}</h3>
                  <p className="font-mono text-xs text-muted-foreground">{product.sku}</p>
                </div>
                <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">
                  {product.category}
                </span>
              </div>

              {/* Barcode visual */}
              <div className="mb-4 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
                <Barcode className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs tracking-widest text-foreground">{product.barcode}</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <DollarSign className="mx-auto mb-1 h-3.5 w-3.5 text-muted-foreground" />
                  <p className="font-mono text-sm font-bold text-foreground">${product.unitPrice.toFixed(2)}</p>
                  <p className="text-[10px] text-muted-foreground">Unit Price</p>
                </div>
                <div className="text-center">
                  <Weight className="mx-auto mb-1 h-3.5 w-3.5 text-muted-foreground" />
                  <p className="font-mono text-sm font-bold text-foreground">{product.weight}kg</p>
                  <p className="text-[10px] text-muted-foreground">Weight</p>
                </div>
                <div className="text-center">
                  <AlertTriangle className="mx-auto mb-1 h-3.5 w-3.5 text-muted-foreground" />
                  <p className="font-mono text-sm font-bold text-foreground">{product.minStockLevel}</p>
                  <p className="text-[10px] text-muted-foreground">Min Stock</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </AppLayout>
    </AuthGuard>
  );
}
