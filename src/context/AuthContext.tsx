import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface Company {
  id: string;
  name: string;
}

interface AuthState {
  user: User | null;
  company: Company | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string, onSuccess?: () => void) => Promise<void>;
  signOut: () => Promise<void>;
  refreshCompany: () => Promise<void>;
  userId: string | null;
  companyId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearLocalStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
  supabase.auth.signOut();
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    company: null,
    loading: true,
    isAuthenticated: false,
  });
  const navigate = useNavigate();

  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((current) => ({ ...current, ...updates }));
  }, []);

  const fetchCompany = useCallback(async (userId: string): Promise<Company | null> => {
    try {
      const { data, error } = await supabase.rpc('get_user_company_details', { uid: userId });
      if (error) {
        console.error('Error fetching company:', error.message);
        return null;
      }
      if (!data) {
        console.warn('No company found for user:', userId);
        return null;
      }
      console.log('Fetched company details:', data);
      return data;
    } catch (error) {
      console.error('Unexpected error in fetchCompany:', error);
      return null;
    }
  }, []);

  const signIn = async (email: string, password: string, onSuccess?: () => void) => {
    updateState({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign-in error:', error.message);
        updateState({ loading: false });
        throw error;
      }
      if (data.user) {
        const company = await fetchCompany(data.user.id);
        if (!company) throw new Error('No company associated with this account');
        updateState({ user: data.user, company, loading: false, isAuthenticated: true });
        onSuccess ? onSuccess() : navigate('/home');
      }
    } catch (error) {
      updateState({ user: null, company: null, loading: false, isAuthenticated: false });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      clearLocalStorage();
      updateState({ user: null, company: null, loading: false, isAuthenticated: false });
      navigate('/login');
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  const refreshCompany = async () => {
    if (state.user) {
      const company = await fetchCompany(state.user.id);
      updateState({ company });
    } else {
      console.warn('No user found during refreshCompany');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        console.warn('Session not found or error occurred:', error?.message);
        clearLocalStorage();
        updateState({ user: null, company: null, loading: false, isAuthenticated: false });
        return;
      }

      const company = await fetchCompany(session.user.id);
      if (company) {
        updateState({
          user: session.user,
          company,
          loading: false,
          isAuthenticated: true,
        });
      } else {
        console.warn('No company associated with the current user.');
        clearLocalStorage();
        updateState({ user: null, company: null, loading: false, isAuthenticated: false });
      }
    };
    checkSession();
  }, [fetchCompany, updateState]);

  const value: AuthContextType = {
    ...state,
    signIn,
    signOut,
    refreshCompany,
    userId: state.user?.id || null,
    companyId: state.company?.id || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
