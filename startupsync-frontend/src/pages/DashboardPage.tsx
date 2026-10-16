import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { analyticsService, AnalyticsDashboard } from '../api/analyticsService';
import { activityService, ActivityItem } from '../api/activityService';
import { startupService } from '../api/startupService';
import { taskService, TaskItem } from '../api/taskService';
import { notificationService } from '../api/notificationService';
import { chatService } from '../api/chatService';
import { matchingService, MatchedCandidate } from '../api/matchingService';
import { invitationService } from '../api/invitationService';
import { searchService } from '../api/searchService';
import { Startup } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Rocket,
  Search,
  Target,
  TrendingUp,
  Users,
  Zap,
  Activity,
  Calendar,
  Clock,
  Eye,
  Mail,
  Inbox,
  UserCheck,
  Building,
  Plus,
  Compass,
  ChevronDown,
  Bell,
  Briefcase,
  Camera,
  Layers,
  Award,
  Globe,
  Check,
  User,
  Heart
} from 'lucide-react';
import { formatTime } from '../utils/validation';

// Counter micro-animation
const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Trend Indicator
const TrendIndicator: React.FC<{ trend: string; isPositive?: boolean }> = ({ trend, isPositive = true }) => {
  if (!trend) return null;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
      isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
    }`}>
      <TrendingUp size={10} className={isPositive ? '' : 'rotate-180'} />
      {trend}
    </span>
  );
};

// Skeletons
const CardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
    <div className="flex justify-between gap-3">
      <div className="space-y-3 flex-1">
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-8 w-1/3 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
      <div className="h-10 w-10 rounded-xl bg-slate-100" />
    </div>
  </div>
);

// Empty State helper
const EmptyState: React.FC<{
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
  icon?: React.ComponentType<any>;
}> = ({ title, description, ctaText, onCtaClick, icon: Icon = Inbox }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
      <Icon size={24} />
    </div>
    <h3 className="mt-4 text-sm font-semibold text-slate-900">{title}</h3>
    <p className="mt-1 text-xs text-slate-500 max-w-xs">{description}</p>
    {ctaText && onCtaClick && (
      <button
        onClick={onCtaClick}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        {ctaText} <ArrowRight size={12} />
      </button>
    )}
  </div>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Loading & State
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [activeStartup, setActiveStartup] = useState<Startup | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [myTasks, setMyTasks] = useState<TaskItem[]>([]);
  const [recommendedStartups, setRecommendedStartups] = useState<any[]>([]);
  const [trendingStartups, setTrendingStartups] = useState<any[]>([]);
  const [savedStartups, setSavedStartups] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  
  // Search Overlay (Ctrl+K)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Time-based Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Load search history
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Load Saved Startups
  const loadSavedStartups = () => {
    const stored = localStorage.getItem('savedStartups');
    if (stored) {
      setSavedStartups(JSON.parse(stored));
    }
  };

  // Fetch Dashboard Data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [
          analyticsData,
          activitiesPage,
          myStartupsList,
          tasksList,
          recommStartupsPage,
          trendStartupsPage,
          notifsPage,
          chatRoomsList
        ] = await Promise.all([
          analyticsService.getDashboard().catch(() => null),
          activityService.getMyActivities(0, 10).catch(() => ({ content: [] })),
          startupService.getMyStartups().catch(() => []),
          taskService.getMyTasks(0, 10).catch(() => []),
          startupService.getRecommendedStartups(0, 4).catch(() => ({ content: [] })),
          startupService.getTrendingStartups(0, 4).catch(() => ({ content: [] })),
          notificationService.getNotifications(0, 5).catch(() => ({ content: [] })),
          chatService.getChatRooms().catch(() => [])
        ]);

        if (analyticsData) setAnalytics(analyticsData);
        setActivities(activitiesPage.content || []);
        setStartups(myStartupsList);
        if (myStartupsList.length > 0) {
          setActiveStartup(myStartupsList[0]);
        }
        setMyTasks(tasksList);
        setRecommendedStartups(recommStartupsPage.content || []);
        setTrendingStartups(trendStartupsPage.content || []);
        setNotifications(notifsPage.content || []);
        setChats(chatRoomsList);
        
        loadSavedStartups();
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Fetch Recommended Members when activeStartup changes
  useEffect(() => {
    const loadCandidates = async () => {
      if (!activeStartup) return;
      setCandidatesLoading(true);
      try {
        const matches = await matchingService.getTopMatches(activeStartup.id, 5);
        setCandidates(matches);
      } catch (err) {
        console.error('Error fetching recommended candidates:', err);
      } finally {
        setCandidatesLoading(false);
      }
    };
    loadCandidates();
  }, [activeStartup]);

  // Handle Search API with Debounce Simulation
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchService.search(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Error executing unified search:', err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const selectStartup = (startup: Startup) => {
    setActiveStartup(startup);
    setSwitcherOpen(false);
  };

  const handleInviteCandidate = async (candidate: MatchedCandidate) => {
    if (!activeStartup) return;
    try {
      await invitationService.send(
        activeStartup.id,
        candidate.email,
        `Hi ${candidate.firstName}, we reviewed your profile on SSS and would love to invite you to join our workspace!`
      );
      alert(`Invitation successfully sent to ${candidate.firstName}!`);
    } catch (err) {
      console.error('Error inviting candidate:', err);
      alert('Failed to send invitation.');
    }
  };

  const toggleSaveStartup = (startup: any) => {
    let currentSaved = [...savedStartups];
    const index = currentSaved.findIndex((s) => s.id === startup.id);
    if (index > -1) {
      currentSaved.splice(index, 1);
    } else {
      currentSaved.push(startup);
    }
    setSavedStartups(currentSaved);
    localStorage.setItem('savedStartups', JSON.stringify(currentSaved));
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      if (analytics) {
        setAnalytics({ ...analytics, unreadMessages: Math.max(0, analytics.unreadMessages - 1) });
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const saveSearchHistory = (term: string) => {
    if (!term.trim()) return;
    let history = [term, ...searchHistory.filter((t) => t !== term)].slice(0, 5);
    setSearchHistory(history);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  // Profile completion status checklist
  const getMissingProfileItems = () => {
    const items = [];
    if (!user?.isEmailVerified) items.push({ text: 'Verify Email', action: () => navigate('/verify-email'), icon: Mail });
    if (!user?.skills || user.skills.length === 0) items.push({ text: 'Add Skills', action: () => navigate('/profile/edit'), icon: Layers });
    if (!user?.experiences || user.experiences.length === 0) items.push({ text: 'Add Experience', action: () => navigate('/profile/edit'), icon: Briefcase });
    if (!user?.educations || user.educations.length === 0) items.push({ text: 'Add Education', action: () => navigate('/profile/edit'), icon: Award });
    if (!user?.portfolioUrl) items.push({ text: 'Upload Portfolio', action: () => navigate('/profile/edit'), icon: Globe });
    if (!user?.profilePhotoUrl) items.push({ text: 'Upload Profile Picture', action: () => navigate('/profile/edit'), icon: Camera });
    return items;
  };

  const missingProfileItems = getMissingProfileItems();

  // Stats Card configurations
  const statCards = [
    {
      label: 'Profile Readiness',
      value: user?.profileCompletionPercentage || 0,
      sub: 'Completion rate',
      icon: Target,
      accent: 'bg-brand-50 text-brand-600',
      isPercent: true,
      path: '/profile/edit',
      trend: 'Optimized',
    },
    {
      label: 'AI Matches',
      value: analytics?.totalMatches || 0,
      sub: 'Top candidates',
      icon: TrendingUp,
      accent: 'bg-emerald-50 text-emerald-600',
      path: '/matching',
      trend: '+12% this week',
    },
    {
      label: 'Applications',
      value: analytics?.totalApplications || 0,
      sub: 'Total submissions',
      icon: Zap,
      accent: 'bg-amber-50 text-amber-600',
      path: '/applications',
      trend: 'Active',
    },
    {
      label: 'Messages',
      value: analytics?.unreadMessages || 0,
      sub: 'Unread badge count',
      icon: MessageSquare,
      accent: 'bg-slate-50 text-slate-600',
      path: '/chat',
      trend: 'Live',
    },
    {
      label: 'Team Members',
      value: analytics?.teamMemberCount || 0,
      sub: 'Active members',
      icon: Users,
      accent: 'bg-purple-50 text-purple-600',
      path: '/teams',
      trend: 'Synced',
    },
    {
      label: 'Active Startups',
      value: analytics?.activeStartups || 0,
      sub: 'Visible in workspace',
      icon: Rocket,
      accent: 'bg-indigo-50 text-indigo-600',
      path: user?.role === 'STARTUP_FOUNDER' ? '/startups/my' : '/startups',
      trend: 'Operational',
    },
    {
      label: 'Pending Invites',
      value: analytics?.pendingInvitations || 0,
      sub: 'Awaiting response',
      icon: Inbox,
      accent: 'bg-pink-50 text-pink-600',
      path: '/invitations',
      trend: 'Action needed',
    },
    {
      label: 'Pending Tasks',
      value: analytics?.pendingTasks || 0,
      sub: 'Sprint TODO tasks',
      icon: CheckCircle2,
      accent: 'bg-rose-50 text-rose-600',
      path: '/tasks',
      trend: 'In progress',
    },
    {
      label: 'Startup Views',
      value: analytics?.startupViews || 0,
      sub: 'Total startup hits',
      icon: Eye,
      accent: 'bg-cyan-50 text-cyan-600',
      path: '/analytics',
      trend: '+24% this week',
    },
    {
      label: 'Profile Views',
      value: analytics?.profileViews || 0,
      sub: 'Total user hits',
      icon: UserCheck,
      accent: 'bg-teal-50 text-teal-600',
      path: '/profile',
      trend: 'Upward trend',
    },
  ];

  // Quick shortcuts
  const quickLinks = [
    ...(user?.role === 'STARTUP_FOUNDER'
      ? [
          { title: 'Create Startup', icon: Plus, path: '/startups/create' },
          { title: 'My Startups', icon: Building, path: '/startups/my' },
          { title: 'Invite Members', icon: Users, path: '/teams' },
        ]
      : []),
    { title: 'Discover Startups', icon: Compass, path: '/startups' },
    { title: 'Manage Tasks', icon: CheckCircle2, path: '/tasks' },
    { title: 'Analytics Panel', icon: TrendingUp, path: '/analytics' },
    { title: 'Chat Workspace', icon: MessageSquare, path: '/chat' },
    { title: 'Notifications', icon: Bell, path: '/notifications' },
    { title: 'Edit Profile', icon: User, path: '/profile/edit' },
  ];

  const activityIcon = (type: string) => {
    switch (type) {
      case 'MESSAGE':
      case 'CHAT_MESSAGE': return MessageSquare;
      case 'APPLICATION':
      case 'APPLICATION_SUBMITTED':
      case 'APPLICATION_RECEIVED': return Rocket;
      case 'STARTUP_CREATED':
      case 'STARTUP_UPDATED': return Building;
      case 'INVITATION_SENT':
      case 'INVITATION_ACCEPTED':
      case 'INVITATION_RECEIVED': return Mail;
      case 'MEMBER_JOINED':
      case 'MEMBER_REMOVED': return Users;
      case 'TASK_CREATED':
      case 'TASK_COMPLETED': return CheckCircle2;
      case 'PROFILE_UPDATED': return UserCheck;
      default: return Activity;
    }
  };

  // Recharts Insights Data mapping
  const getChartData = (label: string) => {
    const seriesItem = analytics?.series?.find((s) => s.label === label);
    if (!seriesItem) return [];
    
    // Map last 7 days names
    return seriesItem.values.map((v, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: v,
      };
    });
  };

  return (
    <div className="animate-fade-in space-y-6 pb-8 text-slate-700">
      
      {/* 1. Header */}
      <section className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {getGreeting()}, {user?.firstName || 'there'}! 👋
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Online
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {activeStartup && (
              <span className="hidden h-1.5 w-1.5 rounded-full bg-slate-300 md:block" />
            )}
            {activeStartup && (
              <span className="flex items-center gap-1 text-brand-600 font-medium">
                <Building size={14} /> Workspace: {activeStartup.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Startup Switcher */}
          {user?.role === 'STARTUP_FOUNDER' && startups.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <span>Switch Startup</span>
                <ChevronDown size={14} />
              </button>
              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-50">
                  {startups.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => selectStartup(s)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${
                        activeStartup?.id === s.id ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{s.name}</span>
                      {activeStartup?.id === s.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {user?.role === 'STARTUP_FOUNDER' ? (
            <button
              onClick={() => navigate('/startups/create')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              <Plus size={16} /> Create Startup
            </button>
          ) : null}

          {activeStartup && (
            <button
              onClick={() => navigate(`/startup-workspace/${activeStartup.id}`)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              View Workspace
            </button>
          )}

          <button
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
            title="Search (Ctrl+K)"
          >
            <Search size={16} />
          </button>
        </div>
      </section>

      {/* 2. Dashboard Statistics Cards Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  onClick={() => navigate(stat.path)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-card-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                      <p className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900">
                        <AnimatedCounter value={stat.value} />
                        {stat.isPercent ? '%' : ''}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <TrendIndicator trend={stat.trend} />
                        <span className="text-[10px] font-medium text-slate-400">{stat.sub}</span>
                      </div>
                    </div>
                    <div className={`rounded-xl p-2.5 transition duration-200 group-hover:scale-105 ${stat.accent}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  {stat.isPercent && (
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-1000"
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
      </section>

      {/* 3. Primary Dashboard Content Grid */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          
          {/* Founder Workspace Summary */}
          {user?.role === 'STARTUP_FOUNDER' && activeStartup && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-50 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-lg">
                    {activeStartup.logoUrl ? (
                      <img src={activeStartup.logoUrl} alt={activeStartup.name} className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      activeStartup.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{activeStartup.name}</h2>
                    <p className="text-xs text-slate-500">{activeStartup.industry} • {activeStartup.fundingStage}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => navigate(`/startup-workspace/${activeStartup.id}`)} className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800">
                    Open Workspace
                  </button>
                  <button onClick={() => navigate(`/startups/${activeStartup.id}`)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    Manage Startup
                  </button>
                  <button onClick={() => navigate(`/teams`)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    Invite Members
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50/70 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team Size</p>
                  <p className="mt-1 text-lg font-bold text-slate-800">{activeStartup.teamSizeNeeded ? `${activeStartup.teamSizeNeeded} needed` : 'Synced'}</p>
                </div>
                <div className="rounded-xl bg-slate-50/70 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applications</p>
                  <p className="mt-1 text-lg font-bold text-slate-800">{activeStartup.applicationCount || 0} received</p>
                </div>
                <div className="rounded-xl bg-slate-50/70 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visibility</p>
                  <p className="mt-1 text-lg font-bold text-slate-800">{activeStartup.visibility || 'PUBLIC'}</p>
                </div>
                <div className="rounded-xl bg-slate-50/70 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                  <p className="mt-1 text-lg font-bold text-slate-800">{activeStartup.status || 'ACTIVE'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Discover Startup Widget */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Discover startups</h2>
                <p className="text-xs text-slate-500">Explore new opportunities and trending projects</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/startups')} className="rounded-xl bg-brand-50 px-3.5 py-2 text-xs font-bold text-brand-600 hover:bg-brand-100">
                  Browse startups
                </button>
                <button onClick={() => navigate('/matching')} className="rounded-xl bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100">
                  View recommendations
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200">
                <div className="flex items-center gap-1 text-xs font-bold text-brand-600">
                  <TrendingUp size={14} /> Recommended
                </div>
                <p className="mt-2 text-2xl font-black text-slate-900">{recommendedStartups.length}</p>
                <p className="text-[10px] text-slate-400">AI-matched for you</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200">
                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                  <Building size={14} /> Trending
                </div>
                <p className="mt-2 text-2xl font-black text-slate-900">{trendingStartups.length}</p>
                <p className="text-[10px] text-slate-400">Highly viewed this week</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200">
                <div className="flex items-center gap-1 text-xs font-bold text-rose-600">
                  <Heart size={14} /> Saved Startups
                </div>
                <p className="mt-2 text-2xl font-black text-slate-900">{savedStartups.length}</p>
                <p className="text-[10px] text-slate-400">Bookmarked opportunities</p>
              </div>
            </div>
            
            {/* List Recommended Startups */}
            <div className="mt-5 space-y-3.5">
              {recommendedStartups.length === 0 ? (
                <EmptyState title="No recommendations yet" description="Build your profile details to receive custom recommendations." />
              ) : (
                recommendedStartups.slice(0, 2).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-50 bg-slate-50/30 p-3.5 hover:bg-slate-50/70">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900">{s.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{s.tagline}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveStartup(s)}
                        className={`rounded-xl p-2 transition border ${
                          savedStartups.some((saved) => saved.id === s.id)
                            ? 'bg-rose-50 border-rose-100 text-rose-600'
                            : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <Heart size={14} fill={savedStartups.some((saved) => saved.id === s.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button onClick={() => navigate(`/startups/${s.id}`)} className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
                        View
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Insights / Charts Section */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Workspace Analytics & Insights</h2>
                <p className="text-xs text-slate-500">Live indicators showing engagement and progress</p>
              </div>
              <button onClick={() => navigate('/analytics')} className="text-xs font-semibold text-brand-600 hover:underline">
                Full analytics report →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Chart 1: Applications */}
              <div className="rounded-xl border border-slate-50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Applications</h3>
                <div className="mt-4 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getChartData('Applications')}>
                      <defs>
                        <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Startup Growth */}
              <div className="rounded-xl border border-slate-50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Startup growth</h3>
                <div className="mt-4 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData('Startup growth')}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Tasks Completed */}
              <div className="rounded-xl border border-slate-50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Task Completed progress</h3>
                <div className="mt-4 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData('Tasks completed')}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Profile Views */}
              <div className="rounded-xl border border-slate-50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Views Volume</h3>
                <div className="mt-4 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getChartData('Profile views')}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Members (AI Candidates) */}
          {user?.role === 'STARTUP_FOUNDER' && activeStartup && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Recommended candidates (AI Match)</h2>
                <p className="text-xs text-slate-500">Suggested talents matching active startup skills</p>
              </div>

              {candidatesLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-b-2 border-brand-500 rounded-full" />
                </div>
              ) : candidates.length === 0 ? (
                <EmptyState title="No candidates found" description="No matching candidates currently found. Try expanding required skills in startup." />
              ) : (
                <div className="space-y-4">
                  {candidates.map((c) => (
                    <div key={c.userId} className="flex flex-col gap-3 rounded-xl border border-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/40">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold">
                          {c.profilePhotoUrl ? (
                            <img src={c.profilePhotoUrl} alt={c.firstName} className="h-full w-full rounded-full object-cover" />
                          ) : (
                            c.firstName[0]
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">{c.firstName} {c.lastName}</h4>
                            <span className="inline-flex items-center rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">
                              {c.compatibilityScore}% match
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1">{c.headline || 'Talented Candidate'}</p>
                          <p className="mt-1 text-[10px] text-slate-400">Match score break: Skills: {c.skillsMatchScore || 0}% • Exp: {c.experienceMatchScore || 0}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => navigate(`/profile/${c.userId}`)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleInviteCandidate(c)}
                          className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                          Invite Member
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">

          {/* Complete Profile Checklist */}
          {missingProfileItems.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">Complete profile steps</h2>
              <div className="mt-3.5 space-y-3">
                {missingProfileItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-slate-50 bg-slate-50/20 p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 shrink-0">
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 truncate">{item.text}</span>
                      </div>
                      <button onClick={item.action} className="rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-slate-800">
                        Go
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Quick links</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.title}
                    onClick={() => navigate(link.path)}
                    className="flex flex-col items-center justify-center rounded-xl border border-slate-50 bg-slate-50/30 p-3.5 text-center transition hover:border-brand-100 hover:bg-brand-50/20"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm border border-slate-50">
                      <Icon size={16} />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-800 line-clamp-1">{link.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
              <button onClick={() => navigate('/activity')} className="text-xs font-bold text-brand-600 hover:underline">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <EmptyState title="No activities yet" description="Recent workspace changes will appear here." />
              ) : (
                activities.slice(0, 5).map((item) => {
                  const Icon = activityIcon(item.activityType);
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-100">
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.description}</p>
                        <p className="mt-1 text-[9px] text-slate-400 font-medium">{formatTime(item.createdAt)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming deadlines */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <h2 className="mb-3.5 text-lg font-bold text-slate-900">Upcoming deadlines</h2>
            <div className="space-y-3">
              {myTasks.filter((t) => t.dueDate && t.status !== 'COMPLETED').length === 0 ? (
                <EmptyState title="No upcoming deadlines" description="No pending tasks with due dates assigned to you." />
              ) : (
                myTasks
                  .filter((t) => t.dueDate && t.status !== 'COMPLETED')
                  .slice(0, 4)
                  .map((task) => (
                    <div key={task.id} className="flex items-start justify-between gap-3 border-b border-slate-50 pb-2.5 last:border-b-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{task.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Priority: {task.priority}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-600">
                        <Clock size={10} />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Notifications Preview */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
              <button onClick={() => navigate('/notifications')} className="text-xs font-bold text-brand-600 hover:underline">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <EmptyState title="All caught up" description="You have no notifications currently." />
              ) : (
                notifications.slice(0, 3).map((n) => (
                  <div key={n.id} className={`flex flex-col gap-2 rounded-xl border p-3 ${
                    n.isRead ? 'border-slate-50 bg-slate-50/20' : 'border-brand-50 bg-brand-50/10'
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">{n.message}</p>
                      </div>
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkNotificationRead(n.id)}
                          className="rounded-lg bg-white border border-slate-100 p-1 text-[9px] font-bold text-slate-500 hover:bg-slate-50"
                        >
                          Read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Chats */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent conversations</h2>
              <button onClick={() => navigate('/chat')} className="text-xs font-bold text-brand-600 hover:underline">
                Open chat
              </button>
            </div>
            <div className="space-y-3.5">
              {chats.length === 0 ? (
                <EmptyState title="No active chats" description="Initiate a conversation to display recent chat history." />
              ) : (
                chats.slice(0, 4).map((room) => {
                  const partner = room.members?.find((m: any) => m.id !== user?.id) || room.members?.[0];
                  return (
                    <div key={room.id} onClick={() => navigate('/chat')} className="flex cursor-pointer items-center justify-between gap-3 rounded-xl hover:bg-slate-50 p-1.5 transition">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-xs">
                            {partner?.profilePhotoUrl ? (
                              <img src={partner.profilePhotoUrl} alt={partner.firstName} className="h-full w-full rounded-full object-cover" />
                            ) : (
                              partner?.firstName?.[0] || '?'
                            )}
                          </div>
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900">{partner ? `${partner.firstName} ${partner.lastName}` : room.name}</h4>
                          <p className="text-[10px] text-slate-400 truncate leading-snug">{room.lastMessage?.content || 'No messages yet'}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {room.lastMessage ? formatTime(room.lastMessage.createdAt) : ''}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 4. Global Search Modal Overlay (Ctrl+K) */}
      {searchOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
            {/* Input Bar */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
              <Search className="text-slate-400 shrink-0" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search users, startups, tasks, teams, skills... (Ctrl+K to close)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveSearchHistory(searchQuery);
                  }
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                  }
                }}
                className="w-full text-slate-800 placeholder-slate-400 bg-transparent border-0 outline-none text-sm"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs font-bold text-slate-400 border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-50"
              >
                ESC
              </button>
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Query History */}
              {!searchQuery && searchHistory.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Recent Searches</h3>
                  <div className="space-y-1">
                    {searchHistory.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery(term);
                          saveSearchHistory(term);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Clock size={12} className="text-slate-400" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Autocomplete / Match lists */}
              {searchQuery && searchResults && (
                <div className="space-y-4">
                  
                  {/* Startups matching */}
                  {searchResults.startups?.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Startups</h3>
                      <div className="space-y-1">
                        {searchResults.startups.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(item.url);
                            }}
                            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{item.subtitle}</p>
                            </div>
                            <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 rounded px-1.5 py-0.5">Startup</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Users matching */}
                  {searchResults.users?.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Talents / Founders</h3>
                      <div className="space-y-1">
                        {searchResults.users.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(item.url);
                            }}
                            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{item.subtitle}</p>
                            </div>
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 rounded px-1.5 py-0.5">User</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks matching */}
                  {searchResults.tasks?.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Tasks</h3>
                      <div className="space-y-1">
                        {searchResults.tasks.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(item.url);
                            }}
                            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{item.subtitle}</p>
                            </div>
                            <span className="text-[9px] font-bold bg-amber-50 text-amber-600 rounded px-1.5 py-0.5">Task</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teams matching */}
                  {searchResults.teams?.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Teams</h3>
                      <div className="space-y-1">
                        {searchResults.teams.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(item.url);
                            }}
                            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{item.subtitle}</p>
                            </div>
                            <span className="text-[9px] font-bold bg-purple-50 text-purple-600 rounded px-1.5 py-0.5">Team</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills matching */}
                  {searchResults.skills?.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Skills</h3>
                      <div className="space-y-1">
                        {searchResults.skills.map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSearchOpen(false);
                              navigate(item.url);
                            }}
                            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{item.subtitle}</p>
                            </div>
                            <span className="text-[9px] font-bold bg-cyan-50 text-cyan-600 rounded px-1.5 py-0.5">Skill</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No matches */}
                  {searchResults.startups?.length === 0 &&
                    searchResults.users?.length === 0 &&
                    searchResults.tasks?.length === 0 &&
                    searchResults.teams?.length === 0 &&
                    searchResults.skills?.length === 0 && (
                      <EmptyState title="No search results" description={`No matches found for "${searchQuery}".`} />
                    )}

                </div>
              )}

              {/* Clean fallback */}
              {!searchQuery && searchHistory.length === 0 && (
                <EmptyState icon={Search} title="Search anything" description="Start typing to query users, startups, tasks, teams, and skills." />
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
