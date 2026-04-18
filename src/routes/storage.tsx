import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { warehouses } from "@/lib/mock-data";
import { useState } from "react";
import { Warehouse, ChevronDown, ChevronRight, Layers, Box } from "lucide-react";

export const Route = createFileRoute("/storage")({
  component: StoragePage,
  head: () => ({
    meta: [
      { title: "Storage — WMS Control" },
      { name: "description", content: "Hierarchical warehouse, zone, aisle, and bin management" },
    ],
  }),
});

function StoragePage() {
  const [expandedWarehouse, setExpandedWarehouse] = useState<string | null>(warehouses[0]?.id ?? null);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  return (
    <AuthGuard requiredRole="ADMIN">
      <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Storage Hierarchy</h1>
          <p className="text-sm text-muted-foreground">
            {warehouses.length} warehouses •{" "}
            {warehouses.reduce((s, w) => s + w.zones.length, 0)} zones •{" "}
            {warehouses.reduce((s, w) => s + w.zones.reduce((s2, z) => s2 + z.aisles.reduce((s3, a) => s3 + a.bins.length, 0), 0), 0)} bins
          </p>
        </div>

        {/* Warehouses */}
        <div className="space-y-3">
          {warehouses.map((warehouse) => {
            const isExpanded = expandedWarehouse === warehouse.id;
            const utilizationPct = Math.round((warehouse.usedCapacity / warehouse.capacity) * 100);
            return (
              <div key={warehouse.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <button
                  onClick={() => setExpandedWarehouse(isExpanded ? null : warehouse.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <Warehouse className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-foreground">{warehouse.name}</p>
                      <p className="text-xs text-muted-foreground">{warehouse.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-right font-mono text-xs text-muted-foreground">
                        {warehouse.usedCapacity.toLocaleString()} / {warehouse.capacity.toLocaleString()} units
                      </p>
                      <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${utilizationPct > 80 ? "bg-destructive" : utilizationPct > 60 ? "bg-warning" : "bg-success"}`}
                          style={{ width: `${utilizationPct}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-foreground">{utilizationPct}%</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border bg-muted/10 px-5 py-3">
                    <div className="space-y-2">
                      {warehouse.zones.map((zone) => {
                        const zoneExpanded = expandedZone === zone.id;
                        const typeColors: Record<string, string> = {
                          bulk: "bg-chart-3/15 text-chart-3",
                          rack: "bg-primary/15 text-primary",
                          cold: "bg-info/15 text-info",
                          hazmat: "bg-destructive/15 text-destructive",
                        };
                        return (
                          <div key={zone.id} className="rounded-md border border-border/60 bg-card/50">
                            <button
                              onClick={() => setExpandedZone(zoneExpanded ? null : zone.id)}
                              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/30"
                            >
                              <div className="flex items-center gap-3">
                                {zoneExpanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                                <Layers className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{zone.name}</span>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${typeColors[zone.type] || ""}`}>
                                  {zone.type}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {zone.aisles.length} aisles • {zone.aisles.reduce((s, a) => s + a.bins.length, 0)} bins
                              </span>
                            </button>

                            {zoneExpanded && (
                              <div className="border-t border-border/40 px-4 py-3">
                                {zone.aisles.map((aisle) => (
                                  <div key={aisle.id} className="mb-3 last:mb-0">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                      {aisle.name}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                      {aisle.bins.map((bin) => {
                                        const loadPct = Math.round((bin.currentLoad / bin.capacity) * 100);
                                        return (
                                          <div
                                            key={bin.id}
                                            className="rounded-md border border-border bg-muted/30 p-3"
                                          >
                                            <div className="mb-2 flex items-center justify-between">
                                              <span className="font-mono text-xs font-bold text-foreground">{bin.label}</span>
                                              <StatusBadge status={bin.status} />
                                            </div>
                                            <div className="mb-1 h-1 overflow-hidden rounded-full bg-muted">
                                              <div
                                                className={`h-full rounded-full ${bin.status === "full" ? "bg-destructive" : "bg-success"}`}
                                                style={{ width: `${loadPct}%` }}
                                              />
                                            </div>
                                            <p className="text-right font-mono text-[10px] text-muted-foreground">
                                              {bin.currentLoad}/{bin.capacity}
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </AppLayout>
    </AuthGuard>
  );
}
