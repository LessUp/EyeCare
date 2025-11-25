"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  getCurrentUser,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  updateUserProfile,
  upgradeMembership,
  checkMembershipStatus,
  MembershipTier,
  UserProfile,
} from '@/lib/user-store';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  membershipStatus: { isActive: boolean; tier: MembershipTier; daysRemaining: number };
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  upgrade: (tier: MembershipTier, days: number) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState({
    isActive: false,
    tier: 'free' as MembershipTier,
    daysRemaining: 0,
  });

  const refreshUser = useCallback(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setMembershipStatus(checkMembershipStatus());
  }, []);

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = loginUser(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setMembershipStatus(checkMembershipStatus());
      return true;
    }
    return false;
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      const newUser = createUser(email, name, password);
      setUser(newUser);
      setMembershipStatus(checkMembershipStatus());
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setMembershipStatus({ isActive: false, tier: 'free', daysRemaining: 0 });
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    const updated = updateUserProfile(profile);
    if (updated) {
      setUser(updated);
    }
  };

  const upgrade = (tier: MembershipTier, days: number) => {
    const updated = upgradeMembership(tier, days);
    if (updated) {
      setUser(updated);
      setMembershipStatus(checkMembershipStatus());
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        membershipStatus,
        login,
        register,
        logout,
        updateProfile,
        upgrade,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
