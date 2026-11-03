'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { api } from '../lib/api';

const USER_STORAGE_KEY = 'wayfarer_acting_user_id';

interface UserContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUserId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);

      const storedId = typeof window !== 'undefined' ? localStorage.getItem(USER_STORAGE_KEY) : null;
      let matched = fetchedUsers.find((u) => u.id === storedId);

      if (!matched && fetchedUsers.length > 0) {
        matched = fetchedUsers[0];
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_STORAGE_KEY, matched.id);
        }
      }

      setCurrentUser(matched || null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load acting users from API';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    api
      .getUsers()
      .then((fetchedUsers) => {
        if (!active) return;
        setUsers(fetchedUsers);

        const storedId = typeof window !== 'undefined' ? localStorage.getItem(USER_STORAGE_KEY) : null;
        let matched = fetchedUsers.find((u) => u.id === storedId);

        if (!matched && fetchedUsers.length > 0) {
          matched = fetchedUsers[0];
          if (typeof window !== 'undefined') {
            localStorage.setItem(USER_STORAGE_KEY, matched.id);
          }
        }

        setCurrentUser(matched || null);
        setError(null);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg = err instanceof Error ? err.message : 'Failed to load acting users from API';
        setError(msg);
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const setCurrentUserId = (id: string) => {
    const selected = users.find((u) => u.id === id);
    if (selected) {
      setCurrentUser(selected);
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, selected.id);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUserId,
        isLoading,
        error,
        refreshUsers: fetchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
