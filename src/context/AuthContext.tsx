import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { supabase } from '../lib/supabase/client';
import type { User } from '@supabase/supabase-js';

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
  companyId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearLocalStorage = () => {
  console.log('Clearing local storage and session data');
  try {
    localStorage.clear();
    sessionStorage.clear();
    supabase.auth.signOut(); // Force sign out to clear Supabase session
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    company: null,
    loading: true,
    isAuthenticated: false,
  });
  const navigate = useNavigate(); // Initialize navigate hook

  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((current) => ({ ...current, ...updates }));
  }, []);

  const fetchCompany = useCallback(async (userId: string): Promise<Company | null> => {
    console.log('Fetching company for user:', userId);

    try {
      const { data, error } = await supabase.rpc('get_user_company_details', { uid: userId });

      if (error) {
        console.error('Error fetching company:', error);
        return null;
      }

      return data ?? null;
    } catch (error) {
      console.error('Unexpected error in fetchCompany:', error);
      return null;
    }
  }, []);

  const signIn = async (email: string, password: string, onSuccess?: () => void): Promise<void> => {
    updateState({ loading: true });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Sign in error:', error);
        updateState({ loading: false });
        throw error;
      }

      if (data.user) {
        const company = await fetchCompany(data.user.id);
        if (!company) {
          throw new Error('No company associated with this account');
        }
        updateState({ user: data.user, company, loading: false, isAuthenticated: true });

        if (onSuccess) {
          onSuccess(); // Trigger callback (e.g., custom behavior)
        } else {
          navigate('/home'); // Default redirect to /home
        }
      }
    } catch (error) {
      updateState({ user: null, company: null, loading: false, isAuthenticated: false });
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      clearLocalStorage();
      updateState({ user: null, company: null, loading: false, isAuthenticated: false });
      navigate('/login'); // Redirect to login after signing out
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session?.user) {
        clearLocalStorage();
        updateState({ user: null, company: null, loading: false, isAuthenticated: false });
        return;
      }

      const company = await fetchCompany(session.user.id);
      if (company) {
        updateState({ user: session.user, company, loading: false, isAuthenticated: true });
      } else {
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
    refreshCompany: async () => {
      const company = state.user ? await fetchCompany(state.user.id) : null;
      updateState({ company });
    },
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
