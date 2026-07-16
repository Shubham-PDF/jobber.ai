import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import api, { setTokenGetter } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken, signOut: clerkSignOut } = useClerkAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [syncing, setSyncing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track the last Clerk user ID we attempted to sync, to avoid re-triggering on the same user
  const lastSyncedClerkId = useRef<string | null>(null);
  const syncAttempted = useRef(false);

  // Sync token getter with Clerk's getToken helper
  useEffect(() => {
    setTokenGetter(async () => {
      try {
        return await getToken();
      } catch (err) {
        console.error('[Clerk] Failed to get session token', err);
        return null;
      }
    });
  }, [getToken]);

  const refreshUserData = useCallback(async () => {
    if (!isSignedIn) {
      setUser(null);
      setError(null);
      setSyncing(false);
      return;
    }

    try {
      setError(null);
      // This call will trigger the backend auto-provisioning if the user is new
      const res = await api.get('/auth/me/');
      setUser(res.data);
      syncAttempted.current = true;
    } catch (err: any) {
      console.error('[Clerk] Failed to sync user profile with backend', err);
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail || err.message || 'Unknown error';
      
      if (status === 403 || status === 401) {
        setError(`Authentication failed (${status}): ${detail}`);
      } else {
        setError(`Backend sync failed: ${detail}`);
      }
      setUser(null);
      syncAttempted.current = true;
    } finally {
      setSyncing(false);
    }
  }, [isSignedIn]);

  // Sync profile details with backend whenever auth state changes
  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn) {
      const currentClerkId = clerkUser?.id || null;
      
      // Only re-sync if this is a new/different Clerk user, or we haven't attempted yet
      if (currentClerkId !== lastSyncedClerkId.current || !syncAttempted.current) {
        lastSyncedClerkId.current = currentClerkId;
        syncAttempted.current = false;
        setSyncing(true);
        refreshUserData();
      }
    } else {
      // User signed out
      lastSyncedClerkId.current = null;
      syncAttempted.current = false;
      setUser(null);
      setError(null);
      setSyncing(false);
    }
  }, [isLoaded, isSignedIn, clerkUser?.id, refreshUserData]);

  const signout = async () => {
    await clerkSignOut();
    lastSyncedClerkId.current = null;
    syncAttempted.current = false;
    setUser(null);
    setError(null);
  };

  const loading = !isLoaded || syncing;

  return (
    <AuthContext.Provider value={{ user, loading, error, signout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
