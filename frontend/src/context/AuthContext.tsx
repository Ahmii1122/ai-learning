import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthContextType, User } from "./authContextInstance";
import { AuthContext } from "./authContextInstance";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const userData = JSON.parse(userStr) as User;
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    void checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const updateUser = useCallback(
    (updatedUserData: Partial<User>) => {
      const newUserData: User = { ...(user ?? {}), ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
    },
    [user],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      checkAuthStatus,
    }),
    [user, loading, isAuthenticated, login, logout, updateUser, checkAuthStatus],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
