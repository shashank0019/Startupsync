import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import { useAuth } from './hooks/useAuth';
import DashboardPage from './pages/DashboardPage';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { StartupFeedPage } from './pages/startup/StartupFeedPage';
import { StartupDetailsPage } from './pages/startup/StartupDetailsPage';
import { CreateStartupPage } from './pages/startup/CreateStartupPage';
import StartupWorkspacePage from './pages/startup/StartupWorkspacePage';
import MyStartupsPage from './pages/startup/MyStartupsPage';
import { TeamDashboardPage } from './pages/team/TeamDashboardPage';
import { ChatPage } from './pages/chat/ChatPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { TasksPage } from './pages/TasksPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import ApplicationsPage from './pages/applications/ApplicationsPage';
import InvitationsPage from './pages/invitations/InvitationsPage';
import MatchingPage from './pages/matching/MatchingPage';
import ActivityFeedPage from './pages/activity/ActivityFeedPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-brand-600 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  return <MainLayout>{element}</MainLayout>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <NotificationProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />

              <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
              <Route path="/profile/edit" element={<ProtectedRoute element={<EditProfilePage />} />} />

              <Route path="/startups" element={<ProtectedRoute element={<StartupFeedPage />} />} />
              <Route path="/startups/create" element={<ProtectedRoute element={<CreateStartupPage />} />} />
              <Route path="/startups/my" element={<ProtectedRoute element={<MyStartupsPage />} />} />
              <Route path="/startups/:id" element={<ProtectedRoute element={<StartupDetailsPage />} />} />
              <Route path="/startup-workspace/:startupId" element={<ProtectedRoute element={<StartupWorkspacePage />} />} />

              <Route path="/applications" element={<ProtectedRoute element={<ApplicationsPage />} />} />
              <Route path="/invitations" element={<ProtectedRoute element={<InvitationsPage />} />} />
              <Route path="/matching" element={<ProtectedRoute element={<MatchingPage />} />} />
              <Route path="/activity" element={<ProtectedRoute element={<ActivityFeedPage />} />} />
              <Route path="/analytics" element={<ProtectedRoute element={<AnalyticsPage />} />} />

              <Route path="/teams" element={<ProtectedRoute element={<TeamDashboardPage />} />} />
              <Route path="/tasks" element={<ProtectedRoute element={<TasksPage />} />} />
              <Route path="/chat" element={<ProtectedRoute element={<ChatPage />} />} />
              <Route path="/notifications" element={<ProtectedRoute element={<NotificationsPage />} />} />
              <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
              <Route path="/admin" element={<ProtectedRoute element={<AdminDashboardPage />} />} />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </NotificationProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
