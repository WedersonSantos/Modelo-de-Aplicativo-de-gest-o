import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthContextType } from "./types";

const USER_STORAGE_KEY = "@aacb_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "admin@aacb.com",
    password: "admin123",
    user: {
      id: "admin-001",
      nome: "Administrador AACB",
      email: "admin@aacb.com",
      role: "admin",
      telefone: "(11) 99999-9999",
      cpf: "000.000.000-00",
      dataCriacao: new Date("2024-01-01"),
      ultimoAcesso: new Date(),
      notificacoesAtivas: true,
      temaPreferido: "automatico",
      cadastroCompleto: true,
    },
  },
  {
    email: "usuario@aacb.com",
    password: "user123",
    user: {
      id: "user-001",
      nome: "João Silva",
      email: "usuario@aacb.com",
      role: "usuario",
      telefone: "(11) 98888-8888",
      cpf: "123.456.789-00",
      dataCriacao: new Date("2024-02-15"),
      ultimoAcesso: new Date(),
      notificacoesAtivas: true,
      temaPreferido: "automatico",
      cadastroCompleto: true,
      valorTotal: 1200.00,
      numeroParcelas: 12,
      parcelasPagas: 3,
    },
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Erro ao carregar autenticação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const foundUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) throw new Error("Email ou senha incorretos");

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser.user));
      setUser(foundUser.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === "admin";
  const isSignedIn = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isSignedIn, 
      isLoading, 
      isAdmin, 
      login, 
      logout, 
      updateProfile: async (d) => setUser(prev => prev ? {...prev, ...d} : null), 
      updatePassword: async () => {}, 
      deleteAccount: async () => {} 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve estar dentro do AuthProvider");
  return context;
};