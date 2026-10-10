import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import StudentDashboardPage from './pages/StudentDashboardPage';
import ProfilePage from './pages/ProfilePage';
import StudentProfilePage from './pages/StudentProfilePage';
import SkillsPage from './pages/SkillsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import MyProjectsPage from './pages/MyProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import FindTeammatesPage from './pages/FindTeammatesPage';
import TeamInvitationsPage from './pages/TeamInvitationsPage';
import MyTeamsPage from './pages/MyTeamsPage';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageStudentsPage from './pages/ManageStudentsPage';
import ManageProjectsPage from './pages/ManageProjectsPage';
import ManageTeamRequestsPage from './pages/ManageTeamRequestsPage';
import LoadingSpinner from './components/LoadingSpinner';

function AppShell() {
  const { auth, ready } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!ready) return <LoadingSpinner label="Restoring your session..." />;

  return (
    <div className="app-shell">
      <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

      {auth ? (
        <div className="workspace-frame">
          <Sidebar role={auth.role} mobileOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
          <main className="workspace-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/student/dashboard" element={<ProtectedRoute role="STUDENT"><StudentDashboardPage /></ProtectedRoute>} />
                <Route path="/student/profile" element={<ProtectedRoute role="STUDENT"><ProfilePage /></ProtectedRoute>} />
                <Route path="/student/users/:id" element={<ProtectedRoute role="STUDENT"><StudentProfilePage /></ProtectedRoute>} />
                <Route path="/student/skills" element={<ProtectedRoute role="STUDENT"><SkillsPage /></ProtectedRoute>} />
                <Route path="/student/projects/create" element={<ProtectedRoute role="STUDENT"><CreateProjectPage /></ProtectedRoute>} />
                <Route path="/student/projects" element={<ProtectedRoute role="STUDENT"><MyProjectsPage /></ProtectedRoute>} />
                <Route path="/student/projects/:id" element={<ProtectedRoute role="STUDENT"><ProjectDetailsPage /></ProtectedRoute>} />
                <Route path="/student/find-teammates" element={<ProtectedRoute role="STUDENT"><FindTeammatesPage /></ProtectedRoute>} />
                <Route path="/student/invitations" element={<ProtectedRoute role="STUDENT"><TeamInvitationsPage /></ProtectedRoute>} />
                <Route path="/student/teams" element={<ProtectedRoute role="STUDENT"><MyTeamsPage /></ProtectedRoute>} />

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/admin/students" element={<ProtectedRoute role="ADMIN"><ManageStudentsPage /></ProtectedRoute>} />
                <Route path="/admin/projects" element={<ProtectedRoute role="ADMIN"><ManageProjectsPage /></ProtectedRoute>} />
                <Route path="/admin/team-requests" element={<ProtectedRoute role="ADMIN"><ManageTeamRequestsPage /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
          </main>
        </div>
      ) : (
        <>
          <main className="public-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </main>
          <Footer />
        </>
      )}

      {auth && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

