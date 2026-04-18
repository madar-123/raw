import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "ADMIN" | "OPERATOR";

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users - in production these come from Spring Boot JWT
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: "admin123",
    user: {
      id: "u-001",
      username: "admin",
      fullName: "Sarah Chen",
      email: "sarah.chen@wmscontrol.com",
      role: "ADMIN",
    },
  },
  operator: {
    password: "operator123",
    user: {
      id: "u-002",
      username: "operator",
      fullName: "James Martinez",
      email: "james.m@wmscontrol.com",
      role: "OPERATOR",
    },
  },
};

const AUTH_STORAGE_KEY = "wms_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (username: string, password: string): Promise<void> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const entry = DEMO_USERS[username.toLowerCase()];
    if (!entry || entry.password !== password) {
      throw new Error("Invalid username or password");
    }
    setUser(entry.user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(entry.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasRole = (role: UserRole) => user?.role === role;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

const defaultAuth: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => { throw new Error("AuthProvider not mounted"); },
  logout: () => {},
  hasRole: () => false,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? defaultAuth;
}
