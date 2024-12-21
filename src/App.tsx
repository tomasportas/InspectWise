import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';
import { TemplatesPage } from './pages/TemplatesPage';
import { CreateTemplatePage } from './pages/CreateTemplatePage';
import { EditTemplatePage } from './pages/EditTemplatePage';
import { StartInspectionPage } from './pages/StartInspectionPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { InspectionDetailsPage } from './pages/InspectionDetailsPage';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';

function AppRoutes() {
  const { company, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <Routes>
      {/* Login Route */}
      <Route path="/login" element={<Login />} />

      {/* Redirect root `/` to `/home` */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Protected Routes wrapped by Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Individual Routes for Pages */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/templates" element={<TemplatesPage companyId={company?.id || ''} />} />
        <Route path="/templates/create" element={<CreateTemplatePage companyId={company?.id || ''} />} />
        <Route path="/templates/:templateId/edit" element={<EditTemplatePage companyId={company?.id || ''} />} />
        <Route path="/templates/:templateId/inspect" element={<StartInspectionPage companyId={company?.id || ''} />} />
        <Route path="/inspections" element={<InspectionsPage companyId={company?.id || ''} />} />
        <Route path="/inspections/:inspectionId" element={<InspectionDetailsPage companyId={company?.id || ''} />} />
        <Route path="/settings" element={<SettingsPage companyId={company?.id || ''} />} />
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

