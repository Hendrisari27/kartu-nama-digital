import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  SafeUser,
  CreateUserInput,
  UpdateUserInput,
  ensureSeedAdmin,
  getSessionUser,
  verifyCredentials,
  saveSession,
  clearSession,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../utils/auth';

interface AuthContextValue {
  /** User yang sedang login, atau null. */
  currentUser: SafeUser | null;
  /** True selama proses inisialisasi (seed admin & baca sesi). */
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  /** Pendaftaran mandiri: membuat akun baru dengan role 'user' lalu langsung login. */
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  /** Daftar user terkini (untuk panel admin). */
  users: SafeUser[];
  refreshUsers: () => void;
  addUser: (input: CreateUserInput) => Promise<void>;
  editUser: (id: string, input: UpdateUserInput) => Promise<void>;
  removeUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  }
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = useCallback(() => {
    setUsers(listUsers());
  }, []);

  // Inisialisasi: pastikan admin default ada, lalu pulihkan sesi tersimpan.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await ensureSeedAdmin();
      } catch (err) {
        // Jangan sampai gagal seed membuat aplikasi macet di splash.
        console.error('Gagal inisialisasi akun:', err);
      }
      if (!active) return;
      setCurrentUser(getSessionUser());
      refreshUsers();
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [refreshUsers]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const user = await verifyCredentials(email, password);
    if (!user) return false;
    saveSession(user.id);
    setCurrentUser(user);
    return true;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const created = await createUser({ name, email, password, role: 'user' });
      saveSession(created.id);
      setCurrentUser(created);
      refreshUsers();
    },
    [refreshUsers]
  );

  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  const addUser = useCallback(
    async (input: CreateUserInput) => {
      await createUser(input);
      refreshUsers();
    },
    [refreshUsers]
  );

  const editUser = useCallback(
    async (id: string, input: UpdateUserInput) => {
      const updated = await updateUser(id, input);
      // Bila yang diedit adalah user yang sedang login, segarkan state-nya.
      setCurrentUser((prev) => (prev && prev.id === id ? updated : prev));
      refreshUsers();
    },
    [refreshUsers]
  );

  const removeUser = useCallback(
    (id: string) => {
      deleteUser(id);
      refreshUsers();
    },
    [refreshUsers]
  );

  const value: AuthContextValue = {
    currentUser,
    loading,
    isAdmin: currentUser?.role === 'admin',
    login,
    register,
    logout,
    users,
    refreshUsers,
    addUser,
    editUser,
    removeUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
