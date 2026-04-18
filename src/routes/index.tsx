import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { KPICard } from "@/components/shared/KPICard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { dashboardKPIs, orders, inventoryItems, products } from "@/lib/mock-data";
import {
  Package,
  DollarSign,
  ShoppingCart,
  Truck,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — WMS Control" },
      { name: "description", content: "Warehouse Management System dashboard with real-time KPIs" },
    ],
  }),
});

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4", "#22c55e", "#ef4444"];

function Dashboard() {
  const warehouseData = dashboardKPIs.warehouseUtilization;
  const orderStatusData = Object.entries(dashboardKPIs.ordersByStatus).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <AuthGuard>
      <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time warehouse operations overview • {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Products"
            value={dashboardKPIs.totalProducts}
            subtitle={`${inventoryItems.length} inventory records`}
            icon={Package}
            trend={{ value: 8, positive: true }}
            accent="primary"
          />
          <KPICard
            title="Inventory Value"
            value={`$${dashboardKPIs.totalInventoryValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle="Across all warehouses"
            icon={DollarSign}
            trend={{ value: 12, positive: true }}
            accent="success"
          />
          <KPICard
            title="Pending Orders"
            value={dashboardKPIs.pendingOrders}
            subtitle="Awaiting fulfillment"
            icon={ShoppingCart}
            trend={{ value: 3, positive: false }}
            accent="warning"
          />
          <KPICard
            title="Active Shipments"
            value={dashboardKPIs.activeShipments}
            subtitle="Inbound receiving"
            icon={Truck}
            accent="primary"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Warehouse Utilization */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Warehouse Utilization
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={warehouseData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={160} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [`${value}%`, "Utilization"]}
                />
                <Bar dataKey="percentage" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Distribution */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Order Status Distribution
            </h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {orderStatusData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {orderStatusData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span className="capitalize text-muted-foreground">{item.name}</span>
                    <span className="font-mono font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Low Stock Alerts */}
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Low Stock Alerts</h3>
            </div>
            <div className="space-y-3">
              {dashboardKPIs.lowStockItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return (
                  <div key={item.id} className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.productName}</p>
                      <p className="font-mono text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-destructive">{item.quantity}</p>
                      <p className="text-[10px] text-muted-foreground">min: {product?.minStockLevel}</p>
                    </div>
                  </div>
                );
              })}
              {dashboardKPIs.lowStockItems.length === 0 && (
                <p className="text-sm text-muted-foreground">All stock levels healthy</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-1 rounded-lg border border-border bg-card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {dashboardKPIs.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2">
                  <span className="font-mono text-xs font-semibold text-primary">{activity.time}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span className="text-sm text-foreground">{activity.event}</span>
                  <StatusBadge status={activity.type} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </AppLayout>
    </AuthGuard>
  );
}
