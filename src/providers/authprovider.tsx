"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { login as loginaction } from "@/app/actions/auth-action";

export type User = {
  id: string;
  name: string | null;
  username: string;
  email: string;
  avatar: string | null;
  isLoggedIn: boolean;
  roles: string[];
  is_verified?: boolean;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: ({
    usernameOrEmail,
    password,
    deviceInfo,
  }: {
    usernameOrEmail: string;
    password: string;
    deviceInfo?: object;
  }) => Promise<
    | {
        error: string;
        user?: undefined;
      }
    | {
        user: User;
        error?: undefined;
      }
  >;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const CACHE_KEY = "user_profile";
const CACHE_DURATION = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  async function fetchUser(): Promise<User | null> {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        id: data.id || "",
        name: data.name || "",
        username: data.username || "",
        email: data.email || "",
        avatar: data.avatar || "",
        roles: data.roles || [],
        isLoggedIn: !data.error,
      };
    } catch {
      return null;
    }
  }

  function getCachedUser(): User | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      const { user, ts }: { user: User; ts: number } = JSON.parse(cached);
      if (Date.now() - ts > CACHE_DURATION && user.isLoggedIn) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }

  function setCachedUser(user: User): void {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ user, ts: Date.now() }));
  }

  function logout(): void {
    localStorage.removeItem(CACHE_KEY);
    setUser(null);
    fetch("/api/auth/logout", { method: "GET", credentials: "include" })
      .then(() => {
        router.refresh();
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  }

  function login({
    usernameOrEmail,
    password,
    deviceInfo,
  }: {
    usernameOrEmail: string;
    password: string;
    deviceInfo?: object;
  }) {
    localStorage.removeItem(CACHE_KEY);
    const formData = new FormData();
    formData.append("usernameOrEmail", usernameOrEmail);
    formData.append("password", password);
    formData.append("deviceInfo", JSON.stringify(deviceInfo));
    return loginaction(formData).then((r) => {
      updateData();
      return r;
    });
  }

  function updateData(): void {
    setLoading(true);
    const cachedUser = getCachedUser();
    if (!cachedUser) {
      fetchUser()
        .then((fetchedUser) => {
          if (fetchedUser) {
            setCachedUser(fetchedUser);
            setUser(fetchedUser);
          }
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }
    setUser(cachedUser);
    setLoading(false);
  }

  useEffect(() => {
    updateData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: user?.isLoggedIn ? user : null, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
