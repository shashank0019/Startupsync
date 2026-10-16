import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useNotifications } from '../../hooks/useAuth';
import {
  Activity,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CheckSquare,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Plus,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  Users,
  User as UserIcon,
  X,
} from 'lucide-react';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isFounder = user?.role === 'FOUNDER' || user?.role === 'STARTUP_FOUNDER';
  const userInitial = user?.firstName?.charAt(0).toUpperCase() || 'S';
  const profileCompletion = user?.profileCompletionPercentage || 20;

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Discover Startups', path: '/startups', icon: Rocket },
    { label: 'Applications', path: '/applications', icon: FileText },
    { label: 'Invitations', path: '/invitations', icon: Mail },
    { label: 'Matching', path: '/matching', icon: Sparkles },
    { label: 'Activity', path: '/activity', icon: Activity },
    { label: 'Analytics', path: '/analytics', icon: BarChart3, show: isFounder || isAdmin },
    { label: 'Profile', path: '/profile', icon: UserIcon },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Chat', path: '/chat', icon: MessageCircle },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Admin', path: '/admin', icon: Shield, show: isAdmin },
  ].filter(item => item.show !== false);

  const workspaceItems = [
    { label: 'My Workspace', path: '/dashboard', icon: BriefcaseBusiness },
    { label: 'My Startups', path: '/startups/my', icon: Rocket, show: isFounder || isAdmin },
    { label: 'Create Startup', path: '/startups/create', icon: Plus, show: isFounder || isAdmin },
    { label: 'Team Members', path: '/teams', icon: Users, show: isFounder || isAdmin },
  ].filter(item => item.show !== false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/startups') return location.pathname === '/startups';
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const renderNavButton = (item: { label: string; path: string; icon: React.ElementType }, showLabel = true) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    return (
      <button
        key={item.path}
        onClick={() => {
          navigate(item.path);
          setMobileNavOpen(false);
        }}
        className={`focus-ring group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          active
            ? 'bg-brand-50 text-brand-600'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
        title={item.label}
      >
        <Icon size={18} className={active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
        {showLabel && <span className="truncate">{item.label}</span>}
      </button>
    );
  };

  const sidebarContent = (showLabels: boolean) => (
    <>
      <div className="flex h-16 items-center justify-between px-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="focus-ring flex min-w-0 items-center gap-3 rounded-xl text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-secondary text-white shadow-sm">
            <BriefcaseBusiness size={18} />
          </div>
          {showLabels && (
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-slate-900">StartupSync</p>
            </div>
          )}
        </button>
        {showLabels && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="focus-ring hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:inline-flex"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navigationItems.map(item => renderNavButton(item, showLabels))}
      </nav>

      {showLabels && workspaceItems.length > 0 && (
        <div className="px-3 pb-2">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
          <div className="space-y-1">
            {workspaceItems.map(item => renderNavButton(item, showLabels))}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-3 border-t border-slate-100 p-4">
        <div className={`rounded-xl bg-slate-50 p-3 ${showLabels ? '' : 'flex justify-center'}`}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
              {userInitial}
            </div>
            {showLabels && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{user?.firstName || 'Member'}</p>
                <p className="truncate text-xs uppercase tracking-wide text-slate-500">{user?.role || 'Member'}</p>
              </div>
            )}
          </div>
        </div>

        {showLabels && (
          <>
            <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-card">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>Profile completeness</span>
                <span className="font-semibold text-brand-600">{profileCompletion}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-secondary"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="mt-2 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Complete your profile →
              </button>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-brand-50 to-gray-100 p-4">
              <p className="text-sm font-semibold text-slate-900">Need help getting started?</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Explore the guide to set up your profile and find teams.</p>
              <button className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700">
                View Guide →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-950">
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative flex h-full w-72 flex-col bg-white shadow-2xl">
            <div className="flex justify-end p-3">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="focus-ring rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      <aside
        className={`hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 md:flex ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {sidebarContent(sidebarOpen)}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="focus-ring rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="hidden flex-1 items-center lg:flex">
            <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search startups, people, tasks..."
                className="w-full border-0 bg-transparent p-0 text-sm shadow-none ring-0 focus:border-0 focus:ring-0"
              />
              <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-400">
                ⌘K
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <button
              onClick={() => navigate('/chat')}
              className="focus-ring rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Chat"
            >
              <MessageCircle size={20} />
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className="focus-ring relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="relative ml-1">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus-ring flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50 md:gap-3 md:px-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  {userInitial}
                </div>
                <div className="hidden text-left md:block">
                  <p className="max-w-24 truncate text-sm font-semibold text-slate-900">{user?.firstName || 'Member'}</p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">{user?.role || 'Member'}</p>
                </div>
                <ChevronDown size={16} className="hidden text-slate-400 md:block" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon size={16} /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
