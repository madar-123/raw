import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Boxes,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useAuth, type UserRole } from "@/lib/auth";

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/inventory", icon: Package, label: "Inventory" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
  { to: "/receiving", icon: Truck, label: "Receiving" },
  { to: "/products", icon: Boxes, label: "Products" },
  { to: "/storage", icon: Warehouse, label: "Storage", roles: ["ADMIN"] },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
          <Warehouse className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="truncate text-sm font-bold tracking-tight text-foreground">
              WMS Control
            </h1>
            <p className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Warehouse System
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {visibleItems.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info & Logout */}
      {user && (
        <div className="border-t border-border p-3">
          {!collapsed && (
            <div className="mb-2 rounded-md bg-muted/50 px-3 py-2">
              <div className="flex items-center gap-2">
                {user.role === "ADMIN" ? (
                  <Shield className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Wrench className="h-3.5 w-3.5 text-warning" />
                )}
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {user.role}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-foreground">{user.fullName}</p>
              <p className="text-[10px] text-muted-foreground">{user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
