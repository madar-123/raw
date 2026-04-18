import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { UserRole } from "@/lib/auth";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You need <span className="font-semibold text-primary">{requiredRole}</span> role to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
