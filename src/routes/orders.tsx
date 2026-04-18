import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { orders as initialOrders } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/lib/mock-data";
import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  PackageCheck,
  Truck,
  ClipboardList,
  Package,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({
    meta: [
      { title: "Orders — WMS Control" },
      { name: "description", content: "Order management and fulfillment workflow" },
    ],
  }),
});

const STATUS_FLOW: OrderStatus[] = ["pending", "picking", "packed", "shipped", "delivered"];

const STATUS_META: Record<
  OrderStatus,
  { label: string; icon: typeof Package; color: string }
> = {
  pending: { label: "Pending", icon: ClipboardList, color: "text-amber-400" },
  picking: { label: "Picking", icon: MapPin, color: "text-blue-400" },
  packed: { label: "Packed", icon: Package, color: "text-violet-400" },
  shipped: { label: "Shipped", icon: Truck, color: "text-cyan-400" },
  delivered: { label: "Delivered", icon: PackageCheck, color: "text-emerald-400" },
  cancelled: { label: "Cancelled", icon: Circle, color: "text-destructive" },
};

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

function OrdersPage() {
  const [ordersState, setOrdersState] = useState<Order[]>(() =>
    initialOrders.map((o) => ({ ...o }))
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [advancingId, setAdvancingId] = useState<string | null>(null);

  const filtered = ordersState.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const advanceOrder = async (orderId: string) => {
    const order = ordersState.find((o) => o.id === orderId);
    if (!order) return;
    const next = getNextStatus(order.status);
    if (!next) return;

    setAdvancingId(orderId);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 600));
    setOrdersState((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: next, updatedAt: new Date().toISOString() }
          : o
      )
    );
    setAdvancingId(null);
    toast.success(
      `Order ${order.orderNumber} advanced to ${STATUS_META[next].label}`
    );
  };

  const statusCounts = STATUS_FLOW.map((s) => ({
    status: s,
    count: ordersState.filter((o) => o.status === s).length,
  }));

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Order Management
              </h1>
              <p className="text-sm text-muted-foreground">
                {ordersState.length} total orders • Click{" "}
                <span className="font-semibold text-primary">Advance</span> to
                move orders through the fulfillment pipeline
              </p>
            </div>
          </div>

          {/* Status Flow Visual */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-4">
            {statusCounts.map(({ status, count }, idx) => (
              <div key={status} className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setStatusFilter(statusFilter === status ? "all" : status)
                  }
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {status}
                  <span className="ml-1.5 font-mono">{count}</span>
                </button>
                {idx < STATUS_FLOW.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="h-10 w-full max-w-md rounded-md border border-input bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Orders List */}
          <div className="space-y-2">
            {filtered.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const nextStatus = getNextStatus(order.status);
              const isAdvancing = advancingId === order.id;

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  <button
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-6">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-mono text-sm font-bold text-foreground">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <StatusBadge status={order.status} />
                      <div className="text-right">
                        <p className="font-mono text-sm font-bold text-foreground">
                          $
                          {order.totalAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border bg-muted/20 px-5 py-4 space-y-5">
                      {/* Status Stepper */}
                      <div className="flex items-center justify-between rounded-md border border-border bg-background/50 px-4 py-3">
                        {STATUS_FLOW.map((step, idx) => {
                          const stepIdx = STATUS_FLOW.indexOf(step);
                          const currentIdx = STATUS_FLOW.indexOf(order.status);
                          const isDone = stepIdx < currentIdx;
                          const isCurrent = stepIdx === currentIdx;
                          const meta = STATUS_META[step];
                          const Icon = meta.icon;

                          return (
                            <div key={step} className="flex items-center gap-2">
                              <div className="flex flex-col items-center gap-1">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                                    isDone
                                      ? "border-emerald-500 bg-emerald-500/20"
                                      : isCurrent
                                        ? "border-primary bg-primary/20 ring-2 ring-primary/30"
                                        : "border-border bg-muted/30"
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                  ) : (
                                    <Icon
                                      className={`h-4 w-4 ${isCurrent ? meta.color : "text-muted-foreground/50"}`}
                                    />
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                                    isDone
                                      ? "text-emerald-400"
                                      : isCurrent
                                        ? meta.color
                                        : "text-muted-foreground/50"
                                  }`}
                                >
                                  {meta.label}
                                </span>
                              </div>
                              {idx < STATUS_FLOW.length - 1 && (
                                <div
                                  className={`mx-1 h-0.5 w-6 rounded-full sm:w-10 ${
                                    stepIdx < currentIdx
                                      ? "bg-emerald-500"
                                      : "bg-border"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Advance Button */}
                      {nextStatus && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceOrder(order.id);
                            }}
                            disabled={isAdvancing}
                            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                          >
                            {isAdvancing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowRight className="h-4 w-4" />
                            )}
                            Advance to{" "}
                            {STATUS_META[nextStatus].label}
                          </button>
                          <span className="text-xs text-muted-foreground">
                            Current: {STATUS_META[order.status].label} →
                            Next: {STATUS_META[nextStatus].label}
                          </span>
                        </div>
                      )}
                      {!nextStatus && order.status === "delivered" && (
                        <p className="text-sm font-medium text-emerald-400">
                          ✓ Order fully delivered
                        </p>
                      )}

                      {/* Items Table */}
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                            <th className="pb-2 text-left">Product</th>
                            <th className="pb-2 text-left">SKU</th>
                            <th className="pb-2 text-right">Qty</th>
                            <th className="pb-2 text-right">Unit Price</th>
                            <th className="pb-2 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr
                              key={item.productId}
                              className="border-t border-border/50"
                            >
                              <td className="py-2 text-foreground">
                                {item.productName}
                              </td>
                              <td className="py-2 font-mono text-xs text-muted-foreground">
                                {item.sku}
                              </td>
                              <td className="py-2 text-right font-mono font-semibold text-foreground">
                                {item.quantity}
                              </td>
                              <td className="py-2 text-right font-mono text-muted-foreground">
                                ${item.unitPrice.toFixed(2)}
                              </td>
                              <td className="py-2 text-right font-mono font-semibold text-foreground">
                                ${(item.quantity * item.unitPrice).toFixed(2)}
                              </td>
                            </tr>
                          ))}
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
