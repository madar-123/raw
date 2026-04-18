import type { OrderStatus } from "@/lib/mock-data";

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  picking: { bg: "bg-info/15", text: "text-info", dot: "bg-info" },
  packed: { bg: "bg-primary/15", text: "text-primary", dot: "bg-primary" },
  shipped: { bg: "bg-chart-2/15", text: "text-chart-2", dot: "bg-chart-2" },
  delivered: { bg: "bg-success/15", text: "text-success", dot: "bg-success" },
  cancelled: { bg: "bg-destructive/15", text: "text-destructive", dot: "bg-destructive" },
  available: { bg: "bg-success/15", text: "text-success", dot: "bg-success" },
  full: { bg: "bg-destructive/15", text: "text-destructive", dot: "bg-destructive" },
  reserved: { bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  expected: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  arrived: { bg: "bg-info/15", text: "text-info", dot: "bg-info" },
  processing: { bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  completed: { bg: "bg-success/15", text: "text-success", dot: "bg-success" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
