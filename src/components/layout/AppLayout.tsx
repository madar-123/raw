import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, User, Shield, Wrench } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search inventory, orders, SKUs..."
                className="h-9 w-80 rounded-md border border-input bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            {user && (
              <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-muted/50 px-3">
                {user.role === "ADMIN" ? (
                  <Shield className="h-4 w-4 text-primary" />
                ) : (
                  <Wrench className="h-4 w-4 text-warning" />
                )}
                <span className="text-sm font-medium text-foreground">{user.fullName}</span>
                <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </header>
        {/* Main content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
