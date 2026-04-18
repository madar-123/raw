import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { shipments } from "@/lib/mock-data";
import { useState } from "react";
import { Truck, ChevronDown, ChevronRight, Package, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/receiving")({
  component: ReceivingPage,
  head: () => ({
    meta: [
      { title: "Receiving — WMS Control" },
      { name: "description", content: "Inbound shipment receiving and putaway management" },
    ],
  }),
});

function ReceivingPage() {
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);

  return (
    <AuthGuard>
      <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Receiving & Putaway</h1>
          <p className="text-sm text-muted-foreground">
            {shipments.length} shipments • {shipments.filter((s) => s.status !== "completed").length} active
          </p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["expected", "arrived", "processing", "completed"] as const).map((status) => {
            const count = shipments.filter((s) => s.status === status).length;
            return (
              <div key={status} className="rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{status}</p>
              </div>
            );
          })}
        </div>

        {/* Shipments */}
        <div className="space-y-2">
          {shipments.map((shipment) => {
            const isExpanded = expandedShipment === shipment.id;
            const totalExpected = shipment.items.reduce((s, i) => s + i.expectedQty, 0);
            const totalReceived = shipment.items.reduce((s, i) => s + i.receivedQty, 0);
            const progress = totalExpected > 0 ? Math.round((totalReceived / totalExpected) * 100) : 0;

            return (
              <div key={shipment.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <button
                  onClick={() => setExpandedShipment(isExpanded ? null : shipment.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">{shipment.shipmentNumber}</p>
                      <p className="text-xs text-muted-foreground">{shipment.supplierName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <StatusBadge status={shipment.status} />
                    <div className="w-32">
                      <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-mono font-semibold">{progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Expected: {shipment.expectedDate}
                    </p>
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20 px-5 py-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                          <th className="pb-2 text-left">Product</th>
                          <th className="pb-2 text-right">Expected</th>
                          <th className="pb-2 text-right">Received</th>
                          <th className="pb-2 text-right">Remaining</th>
                          <th className="pb-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipment.items.map((item) => {
                          const remaining = item.expectedQty - item.receivedQty;
                          const isDone = remaining === 0;
                          return (
                            <tr key={item.productId} className="border-t border-border/50">
                              <td className="py-2 text-foreground">{item.productName}</td>
                              <td className="py-2 text-right font-mono text-muted-foreground">{item.expectedQty}</td>
                              <td className="py-2 text-right font-mono font-semibold text-foreground">{item.receivedQty}</td>
                              <td className="py-2 text-right font-mono text-warning">{remaining}</td>
                              <td className="py-2">
                                {isDone ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                                    <CheckCircle2 className="h-3 w-3" /> Complete
                                  </span>
                                ) : (
                                  <span className="text-xs font-semibold text-warning">Pending</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
