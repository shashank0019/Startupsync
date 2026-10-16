import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { startupService } from '../../api/startupService';
import { activityService } from '../../api/activityService';
import { applicationService } from '../../api/applicationService';
import { teamService } from '../../api/teamService';
import { taskService, TaskItem } from '../../api/taskService';
import { Startup, Application, Team } from '../../types';
import { ActivityItem } from '../../api/activityService';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckSquare, 
  MessageCircle, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Loader2,
  Eye,
  Send,
  TrendingUp,
  Check,
  X,
  MessageSquare,
  User,
  UserPlus,
  MapPin,
  Calendar,
  Crown,
  Shield,
  MoreVertical,
  Plus,
  Clock,
  Trash2,
  Edit,
  BriefcaseBusiness,
  Search,
  Hash,
  Phone,
  Video,
  Smile,
  Paperclip,
  Download
} from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'applicants', label: 'Applicants', icon: FileText },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const StartupWorkspacePage: React.FC = () => {
  const { startupId } = useParams<{ startupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [startup, setStartup] = useState<Startup | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!startupId) return;
      setIsLoading(true);
      try {
        const [startupData, activityData, applicationData, teamData, taskData] = await Promise.all([
          startupService.getStartupById(startupId),
          activityService.getStartupActivities(startupId, 0, 10),
          applicationService.getStartupApplications(startupId, 0, 50),
          teamService.getTeamsByStartup(startupId),
          taskService.getTasksByStartup(startupId, 0, 100)
        ]);
        setStartup(startupData);
        setActivities(activityData.content || []);
        setApplications(applicationData.content || []);
        setTeams(teamData || []);
        setTasks(taskData || []);
      } catch (error) {
        console.error('Failed to load startup data:', error);
        navigate('/startups/my');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [startupId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600">Startup not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/startups/my')}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          {startup.logoUrl ? (
            <img
              src={startup.logoUrl}
              alt={startup.name}
              className="h-12 w-12 rounded-xl object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold text-lg">
              {startup.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{startup.name}</h1>
            <p className="text-sm text-slate-500">{startup.tagline}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Startup Header Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
              <div className="flex items-start gap-6">
                {startup.logoUrl ? (
                  <img
                    src={startup.logoUrl}
                    alt={startup.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold text-3xl">
                    {startup.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">{startup.name}</h2>
                  <p className="text-slate-600 mt-1">{startup.tagline}</p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">Industry:</span>
                      <span className="px-2 py-1 bg-slate-100 rounded-md">{startup.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">Funding Stage:</span>
                      <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded-md">{startup.fundingStage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">Team Size:</span>
                      <span>{startup.teamSizeNeeded || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded-md ${
                        startup.status === 'ACTIVE' ? 'bg-green-50 text-green-700' :
                        startup.status === 'PAUSED' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {startup.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {startup.description && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-2">About</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{startup.description}</p>
                </div>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Views</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{startup.viewCount || 0}</p>
                    <p className="text-xs text-green-600 mt-2">+12% this week</p>
                  </div>
                  <div className="h-12 w-12 bg-brand-50 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Applications</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{startup.applicationCount || 0}</p>
                    <p className="text-xs text-green-600 mt-2">+5% this week</p>
                  </div>
                  <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Invitations Sent</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">0</p>
                    <p className="text-xs text-slate-500 mt-2">This week</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Send className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Team Members</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}</p>
                    <p className="text-xs text-slate-500 mt-2">Across {teams.length} teams</p>
                  </div>
                  <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Open Positions</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{startup.teamSizeNeeded || 0}</p>
                    <p className="text-xs text-slate-500 mt-2">Available</p>
                  </div>
                  <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center">
                    <BriefcaseBusiness className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</button>
              </div>
              <div className="divide-y divide-slate-100">
                {activities.length === 0 ? (
                  <div className="p-12 text-center">
                    <TrendingUp className="mx-auto h-16 w-16 text-slate-300" />
                    <h4 className="mt-4 text-lg font-semibold text-slate-900">No recent activity</h4>
                    <p className="text-slate-500 mt-2">Activity will appear here as your startup grows</p>
                  </div>
                ) : (
                  activities.map((activity) => {
                    const getActivityIcon = () => {
                      switch (activity.activityType) {
                        case 'APPLICATION':
                          return FileText;
                        case 'MEMBER_JOINED':
                          return UserPlus;
                        case 'TASK_CREATED':
                          return CheckSquare;
                        case 'MESSAGE':
                          return MessageCircle;
                        default:
                          return TrendingUp;
                      }
                    };
                    const Icon = getActivityIcon();
                    return (
                      <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                        <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-brand-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{activity.title}</p>
                          <p className="text-sm text-slate-500 truncate">{activity.description}</p>
                        </div>
                        <p className="text-xs text-slate-400 flex-shrink-0">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Applications</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search applicants..."
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                  />
                </div>
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Total Applications</p>
                <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600">{applications.filter(a => a.status === 'PENDING').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{applications.filter(a => a.status === 'ACCEPTED').length}</p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <FileText className="mx-auto h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">No applications yet</h3>
                <p className="text-slate-500 mt-2">Applications from candidates will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <div key={application.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {application.applicant?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 text-lg">
                              {application.applicant?.firstName} {application.applicant?.lastName}
                            </h4>
                            <p className="text-sm text-slate-500">{application.applicant?.email}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <span>{application.applicant?.location || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 ${
                            application.status === 'ACCEPTED' ? 'bg-green-50 text-green-700' :
                            application.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                        {application.coverLetter && (
                          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm text-slate-600">{application.coverLetter}</p>
                          </div>
                        )}
                        {application.applicant?.skills && application.applicant.skills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {application.applicant.skills.slice(0, 5).map((skill: any, index: number) => (
                              <span key={index} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2">
                        <User size={16} />
                        View Profile
                      </button>
                      <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2">
                        <MessageSquare size={16} />
                        Message
                      </button>
                      {application.status === 'PENDING' && (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                await applicationService.approve(application.id);
                                setApplications(applications.map(a => a.id === application.id ? {...a, status: 'ACCEPTED'} : a));
                              } catch (error) {
                                console.error('Failed to approve application:', error);
                              }
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-2"
                          >
                            <Check size={16} />
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await applicationService.reject(application.id);
                                setApplications(applications.map(a => a.id === application.id ? {...a, status: 'REJECTED'} : a));
                              } catch (error) {
                                console.error('Failed to reject application:', error);
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2"
                          >
                            <X size={16} />
                            Reject
                          </button>
                          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition flex items-center gap-2">
                            <Send size={16} />
                            Invite to Interview
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition flex items-center gap-2">
                  <UserPlus size={16} />
                  Invite Member
                </button>
                <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2">
                  <Plus size={16} />
                  Create Team
                </button>
              </div>
            </div>

            {/* Team Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Total Teams</p>
                <p className="text-2xl font-bold text-slate-900">{teams.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Total Members</p>
                <p className="text-2xl font-bold text-slate-900">{teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Founders</p>
                <p className="text-2xl font-bold text-amber-600">{teams.reduce((acc, t) => acc + (t.members?.filter((m: any) => m.role === 'FOUNDER').length || 0), 0)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Open Positions</p>
                <p className="text-2xl font-bold text-brand-600">{startup.teamSizeNeeded || 0}</p>
              </div>
            </div>

            {teams.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <Users className="mx-auto h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">No team yet</h3>
                <p className="text-slate-500 mt-2">Create a team to start collaborating</p>
                <button className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition flex items-center gap-2 mx-auto">
                  <Plus size={16} />
                  Create Team
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white rounded-2xl border border-slate-100 shadow-card">
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {team.logoUrl ? (
                            <img src={team.logoUrl} alt={team.name} className="h-12 w-12 rounded-xl object-cover" />
                          ) : (
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold text-lg">
                              {team.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-slate-900 text-lg">{team.name}</h4>
                            <p className="text-sm text-slate-500">{team.description || 'No description'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-500">{team.members?.length || 0} members</span>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                            <MoreVertical size={16} className="text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {team.members && team.members.length > 0 ? (
                        team.members.map((member: any) => {
                          const firstName = member.firstName || member.user?.firstName || '';
                          const lastName = member.lastName || member.user?.lastName || '';
                          const fullName = `${firstName} ${lastName}`.trim() || 'Team Member';
                          const initial = (firstName || 'U').charAt(0).toUpperCase();
                          const location = member.user?.location || member.location;
                          return (
                          <div key={member.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                              {initial}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-slate-900">
                                  {fullName}
                                </h5>
                                {member.role === 'FOUNDER' && (
                                  <Crown size={16} className="text-amber-500" />
                                )}
                                {member.role === 'LEAD' && (
                                  <Shield size={16} className="text-brand-500" />
                                )}
                              </div>
                              <p className="text-sm text-slate-500">{member.position || member.role}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                                {location && (
                                  <span>• {location}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                member.role === 'FOUNDER' ? 'bg-amber-50 text-amber-700' :
                                member.role === 'LEAD' ? 'bg-brand-50 text-brand-700' :
                                member.role === 'DEVELOPER' ? 'bg-blue-50 text-blue-700' :
                                member.role === 'DESIGNER' ? 'bg-purple-50 text-purple-700' :
                                member.role === 'MARKETING' ? 'bg-pink-50 text-pink-700' :
                                member.role === 'PRODUCT_MANAGER' ? 'bg-green-50 text-green-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {member.role.replace('_', ' ')}
                              </span>
                              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                                <MoreVertical size={16} className="text-slate-400" />
                              </button>
                            </div>
                          </div>
                        );})
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-slate-500">No members in this team yet</p>
                          <button className="mt-2 text-brand-600 hover:text-brand-700 font-medium text-sm">
                            + Add members
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Invite Member Section */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
              <h4 className="font-semibold text-slate-900 mb-4">Invite New Member</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
                  />
                </div>
                <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="">Select Role</option>
                  <option value="DEVELOPER">Developer</option>
                  <option value="DESIGNER">Designer</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="PRODUCT_MANAGER">Product Manager</option>
                  <option value="CO_FOUNDER">Co-Founder</option>
                </select>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition flex items-center gap-2">
                  <Send size={16} />
                  Send Invitation
                </button>
                <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                  Browse Candidates
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Tasks</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
                  />
                </div>
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="all">All Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition flex items-center gap-2">
                  <Plus size={16} />
                  Create Task
                </button>
              </div>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">To Do</p>
                <p className="text-2xl font-bold text-slate-600">{tasks.filter(t => t.status === 'TODO').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-2xl font-bold text-brand-600">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">In Review</p>
                <p className="text-2xl font-bold text-amber-600">{tasks.filter(t => t.status === 'REVIEW').length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <CheckSquare className="mx-auto h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">No tasks yet</h3>
                <p className="text-slate-500 mt-2">Create tasks to track your startup's progress</p>
                <button className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition flex items-center gap-2 mx-auto">
                  <Plus size={16} />
                  Create First Task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((status) => (
                  <div key={status} className="bg-slate-50 rounded-2xl p-4 min-h-[500px]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-slate-900 capitalize flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${
                          status === 'TODO' ? 'bg-slate-500' :
                          status === 'IN_PROGRESS' ? 'bg-brand-500' :
                          status === 'REVIEW' ? 'bg-amber-500' :
                          'bg-green-500'
                        }`} />
                        {status.replace('_', ' ')}
                      </h4>
                      <span className="text-sm text-slate-500 font-medium">
                        {tasks.filter(t => t.status === status).length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {tasks.filter(t => t.status === status).map((task) => (
                        <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="font-medium text-slate-900 text-sm line-clamp-2">{task.title}</h5>
                            <button className="flex-shrink-0 p-1 hover:bg-slate-100 rounded">
                              <MoreVertical size={14} className="text-slate-400" />
                            </button>
                          </div>
                          {task.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              task.priority === 'HIGH' ? 'bg-red-50 text-red-700' :
                              task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {task.priority}
                            </span>
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock size={12} />
                                <span className={new Date(task.dueDate) < new Date() ? 'text-red-600 font-medium' : ''}>
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          {task.assignedTo && (
                            <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-100">
                              <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">
                                {task.assignedTo.firstName?.charAt(0)}
                              </div>
                              <span className="text-xs text-slate-600 truncate">{task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Team Chat</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition flex items-center gap-2">
                  <Plus size={16} />
                  New Channel
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
                {/* Chat Channels List */}
                <div className="border-r border-slate-100 flex flex-col">
                  <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search channels..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-1">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-brand-50 text-brand-700">
                        <Hash size={18} />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">General</p>
                          <p className="text-xs text-slate-500">Team announcements</p>
                        </div>
                        <span className="h-2 w-2 bg-brand-500 rounded-full"></span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">
                        <Hash size={18} />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">Development</p>
                          <p className="text-xs text-slate-500">Tech discussions</p>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">
                        <Hash size={18} />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">Design</p>
                          <p className="text-xs text-slate-500">UI/UX updates</p>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">
                        <Hash size={18} />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">Marketing</p>
                          <p className="text-xs text-slate-500">Growth strategies</p>
                        </div>
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Direct Messages</p>
                      <div className="space-y-1">
                        {teams.length > 0 && teams[0].members && teams[0].members.slice(0, 3).map((member: any) => {
                          const firstName = member.firstName || member.user?.firstName || '';
                          const lastName = member.lastName || member.user?.lastName || '';
                          const fullName = `${firstName} ${lastName}`.trim() || 'Team Member';
                          const initial = (firstName || 'U').charAt(0).toUpperCase();
                          return (
                          <button key={member.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {initial}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-sm">{fullName}</p>
                              <p className="text-xs text-slate-500 truncate">Typing...</p>
                            </div>
                          </button>
                        );})}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="col-span-2 flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Hash size={20} className="text-slate-600" />
                      <div>
                        <h4 className="font-semibold text-slate-900">General</h4>
                        <p className="text-xs text-slate-500">Team announcements and updates</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Phone size={16} className="text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Video size={16} className="text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <MoreVertical size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-900">{user?.firstName} {user?.lastName}</span>
                          <span className="text-xs text-slate-400">10:30 AM</span>
                        </div>
                        <div className="mt-1 bg-slate-100 rounded-lg p-3">
                          <p className="text-sm text-slate-700">Welcome to the team chat! This is where we'll coordinate our startup activities.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        S
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-900">Sarah</span>
                          <span className="text-xs text-slate-400">10:32 AM</span>
                        </div>
                        <div className="mt-1 bg-slate-100 rounded-lg p-3">
                          <p className="text-sm text-slate-700">Great! Looking forward to working together on this startup.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Plus size={18} className="text-slate-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Smile size={18} className="text-slate-400" />
                      </button>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Paperclip size={18} className="text-slate-400" />
                      </button>
                      <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition flex items-center gap-2">
                        <Send size={16} />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Analytics Dashboard</h3>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center gap-2">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Views</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{startup.viewCount || 0}</p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <TrendingUp size={12} />
                      +12% from last week
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-brand-50 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-brand-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Applications</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{startup.applicationCount || 0}</p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <TrendingUp size={12} />
                      +5% from last week
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Tasks Completed</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
                    <p className="text-xs text-slate-500 mt-2">of {tasks.length} total</p>
                  </div>
                  <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <CheckSquare className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Team Size</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)}</p>
                    <p className="text-xs text-slate-500 mt-2">across {teams.length} teams</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applications Growth Chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
                <div className="p-6 border-b border-slate-100">
                  <h4 className="font-semibold text-slate-900">Applications Growth</h4>
                  <p className="text-sm text-slate-500 mt-1">Applications received over time</p>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end gap-2">
                    {[12, 19, 8, 15, 22, 18, 25, 30, 28, 35, 40, 45].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-brand-500 rounded-t-lg transition-all hover:bg-brand-600"
                          style={{ height: `${(value / 50) * 100}%` }}
                        />
                        <span className="text-xs text-slate-500">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>

              {/* Profile Views Chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
                <div className="p-6 border-b border-slate-100">
                  <h4 className="font-semibold text-slate-900">Profile Views</h4>
                  <p className="text-sm text-slate-500 mt-1">Startup profile views over time</p>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-end gap-2">
                    {[45, 52, 38, 65, 72, 58, 80, 95, 88, 105, 120, 135].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-brand-500 to-secondary rounded-t-lg transition-all hover:from-brand-600 hover:to-brand-400"
                          style={{ height: `${(value / 150) * 100}%` }}
                        />
                        <span className="text-xs text-slate-500">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Status Distribution */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-semibold text-slate-900">Task Status Distribution</h4>
                <p className="text-sm text-slate-500 mt-1">Overview of task completion status</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((status) => {
                    const count = tasks.filter(t => t.status === status).length;
                    const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                    const colors = {
                      TODO: 'bg-slate-500',
                      IN_PROGRESS: 'bg-brand-500',
                      REVIEW: 'bg-amber-500',
                      COMPLETED: 'bg-green-500'
                    };
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 capitalize">{status.replace('_', ' ')}</span>
                          <span className="text-sm text-slate-500">{count} tasks ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[status as keyof typeof colors]} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Application Status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-semibold text-slate-900">Application Status</h4>
                <p className="text-sm text-slate-500 mt-1">Breakdown of application statuses</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['PENDING', 'ACCEPTED', 'REJECTED'].map((status) => {
                    const count = applications.filter(a => a.status === status).length;
                    const colors = {
                      PENDING: 'bg-amber-50 border-amber-200 text-amber-700',
                      ACCEPTED: 'bg-green-50 border-green-200 text-green-700',
                      REJECTED: 'bg-red-50 border-red-200 text-red-700'
                    };
                    return (
                      <div key={status} className={`p-6 rounded-xl border ${colors[status as keyof typeof colors]} text-center`}>
                        <p className="text-3xl font-bold">{count}</p>
                        <p className="text-sm capitalize mt-1">{status.replace('_', ' ')}</p>
                        <p className="text-xs mt-2 opacity-75">
                          {applications.length > 0 ? `${((count / applications.length) * 100).toFixed(0)}%` : '0%'} of total
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-semibold text-slate-900">Activity Timeline</h4>
                <p className="text-sm text-slate-500 mt-1">Recent startup activities</p>
              </div>
              <div className="p-6">
                {activities.length === 0 ? (
                  <p className="text-center text-slate-500">No recent activity</p>
                ) : (
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-4 w-4 text-brand-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                          <p className="text-xs text-slate-500">{new Date(activity.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Startup Settings</h3>
              <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition flex items-center gap-2">
                <Edit size={16} />
                Save All Changes
              </button>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-semibold text-slate-900">Basic Information</h4>
                <p className="text-sm text-slate-500 mt-1">Update your startup's basic details</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-brand-500 to-secondary flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
                    {startup.logoUrl ? (
                      <img src={startup.logoUrl} alt={startup.name} className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      startup.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Startup Logo</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={startup.logoUrl}
                        placeholder="Enter logo URL"
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Startup Name</label>
                  <input
                    type="text"
                    defaultValue={startup.name}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    defaultValue={startup.tagline}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    defaultValue={startup.description}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                    <select
                      defaultValue={startup.industry}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Funding Stage</label>
                    <select
                      defaultValue={startup.fundingStage}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="IDEA">Idea</option>
                      <option value="SEED">Seed</option>
                      <option value="SERIES_A">Series A</option>
                      <option value="SERIES_B">Series B</option>
                      <option value="SERIES_C">Series C</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Startup Details */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-semibold text-slate-900">Startup Details</h4>
                <p className="text-sm text-slate-500 mt-1">Manage location, team size, and work preferences</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    defaultValue={startup.location}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={startup.isRemote}
                      className="w-4 h-4 text-brand-600 rounded"
                    />
                    <span className="text-sm font-medium text-slate-700">Fully Remote</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Team Size Needed</label>
                  <input
                    type="number"
                    defaultValue={startup.teamSizeNeeded}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    defaultValue={startup.websiteUrl}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-semibold text-slate-900">Visibility Settings</h4>
                <p className="text-sm text-slate-500 mt-1">Control who can see your startup</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
                  <select
                    defaultValue={startup.visibility}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="PUBLIC">Public - Visible to everyone</option>
                    <option value="PRIVATE">Private - Only visible to team</option>
                    <option value="INVITE_ONLY">Invite Only - Only invited users</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Startup Status</label>
                  <select
                    defaultValue={startup.status}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="p-6 border-b border-slate-100">
                <h4 className="font-semibold text-slate-900">Skills Required</h4>
                <p className="text-sm text-slate-500 mt-1">Update the skills your startup is looking for</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Required Skills</label>
                  <textarea
                    placeholder="List skills separated by commas (e.g., React, Node.js, UI Design, Marketing)"
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-200 shadow-card">
              <div className="p-6 border-b border-red-100">
                <h4 className="font-semibold text-red-900">Danger Zone</h4>
                <p className="text-sm text-red-600 mt-1">Irreversible and destructive actions</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div>
                    <h5 className="font-medium text-red-900">Transfer Ownership</h5>
                    <p className="text-sm text-red-600 mt-1">Transfer ownership of this startup to another founder</p>
                  </div>
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                    Transfer
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div>
                    <h5 className="font-medium text-red-900">Archive Startup</h5>
                    <p className="text-sm text-red-600 mt-1">Hide this startup from public view but keep data</p>
                  </div>
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                    Archive
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div>
                    <h5 className="font-medium text-red-900">Delete Startup</h5>
                    <p className="text-sm text-red-600 mt-1">Permanently delete this startup and all associated data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center gap-2">
                    <Trash2 size={16} />
                    Delete Startup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupWorkspacePage;
