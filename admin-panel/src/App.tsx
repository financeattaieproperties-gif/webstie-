import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Properties from './pages/Properties';
import PropertyForm from './pages/PropertyForm';
import Projects from './pages/Projects';
import ProjectForm from './pages/ProjectForm';
import Leads from './pages/Leads';

function ProtectedRoutes() {
  const { loggedIn } = useAuth();
  if (!loggedIn) return <Login />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/properties" replace />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/new" element={<PropertyForm />} />
        <Route path="/properties/:id/edit" element={<PropertyForm />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id/edit" element={<ProjectForm />} />
        <Route path="/leads" element={<Leads />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/admin">
        <ProtectedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
