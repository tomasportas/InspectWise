import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export const NoCompanyError = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="text-red-600">Error: No company associated with this account.</div>
    <button 
      onClick={() => window.location.href = '/login'}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Back to Login
    </button>
  </div>
);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, company } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading) return;

    console.log('Starting loading timeout');
    const timeout = setTimeout(() => {
      console.error('Loading timeout reached - forcing reload');
      window.location.href = '/login';
    }, 5000);

    return () => {
      console.log('Clearing loading timeout');
      clearTimeout(timeout);
    };
  }, [loading]);

  useEffect(() => {
    console.log('ProtectedRoute state update:', {
      path: location.pathname,
      loading,
      isAuthenticated: !!user,
      hasCompany: !!company
    });
  }, [location.pathname, loading, user, company]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!company) {
    console.log('No company found for user:', user.email);
    return <NoCompanyError />;
  }

  return <>{children}</>;
};
