import { createContext } from "react";

type User = {
  _id?: string;
  username?: string;
  email?: string;
  [key: string]: unknown;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void;
  checkAuthStatus: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type { AuthContextType, User };
