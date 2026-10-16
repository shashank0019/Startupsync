import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../hooks/useAuth';
import { Notification } from '../../types';
import { getTimeAgo } from '../../utils/helpers';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings, 
  Search, 
  Filter,
  X,
  User,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Briefcase
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, isLoading, loadNotifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'applications' | 'invitations' | 'messages' | 'tasks' | 'startup'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, any> = {
      APPLICATION: FileText,
      INVITATION: UserPlus,
      TEAM_INVITATION: UserPlus,
      MESSAGE: MessageSquare,
      LIKE: CheckCircle,
      COMMENT: MessageSquare,
      FOLLOW: User,
      STARTUP_UPDATE: Briefcase,
      TASK: AlertCircle,
    };
    const Icon = icons[type] || Bell;
    return Icon;
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      APPLICATION: 'bg-blue-50 text-blue-600',
      INVITATION: 'bg-purple-50 text-purple-600',
      TEAM_INVITATION: 'bg-purple-50 text-purple-600',
      MESSAGE: 'bg-green-50 text-green-600',
      LIKE: 'bg-pink-50 text-pink-600',
      COMMENT: 'bg-amber-50 text-amber-600',
      FOLLOW: 'bg-indigo-50 text-indigo-600',
      STARTUP_UPDATE: 'bg-brand-50 text-brand-600',
      TASK: 'bg-rose-50 text-rose-600',
    };
    return colors[type] || 'bg-slate-50 text-slate-600';
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread' && n.isRead) return false;
    if (activeTab === 'applications' && n.type !== 'APPLICATION') return false;
    if (activeTab === 'invitations' && !['INVITATION', 'TEAM_INVITATION'].includes(n.type)) return false;
    if (activeTab === 'messages' && n.type !== 'MESSAGE') return false;
    if (activeTab === 'tasks' && n.type !== 'TASK') return false;
    if (activeTab === 'startup' && n.type !== 'STARTUP_UPDATE') return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(query) || n.message.toLowerCase().includes(query);
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationActions = (notification: Notification) => {
    switch (notification.type) {
      case 'APPLICATION':
        return (
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition">
              Approve
            </button>
            <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition">
              Reject
            </button>
            <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition">
              View Profile
            </button>
          </div>
        );
      case 'INVITATION':
      case 'TEAM_INVITATION':
        return (
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition">
              Accept
            </button>
            <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition">
              Decline
            </button>
            <button className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition">
              View Startup
            </button>
          </div>
        );
      case 'MESSAGE':
        return (
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition">
              Open Chat
            </button>
          </div>
        );
      case 'TASK':
        return (
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition">
              View Task
            </button>
          </div>
        );
      case 'STARTUP_UPDATE':
        return (
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition">
              View Startup
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-8 w-8 text-slate-900" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <p className="text-sm text-slate-500">{unreadCount} unread notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition flex items-center gap-2"
                >
                  <CheckCheck size={16} />
                  Mark all as read
                </button>
              )}
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <Settings size={20} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center justify-between shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition">
              <Filter size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All', icon: Bell },
            { id: 'unread', label: 'Unread', icon: CheckCircle },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'invitations', label: 'Invitations', icon: UserPlus },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'tasks', label: 'Tasks', icon: AlertCircle },
            { id: 'startup', label: 'Startup Updates', icon: Briefcase }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-brand-600 text-white shadow-md' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.id === 'unread' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && filteredNotifications.length > 0 && (
          <div className="space-y-3">
            {filteredNotifications.map((notification: Notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all cursor-pointer group ${
                    notification.isRead ? 'border-slate-200' : 'border-brand-200 bg-brand-50/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      <Icon size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{getTimeAgo(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{notification.message}</p>
                      {renderNotificationActions(notification)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                          title="Mark as read"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNotifications.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={40} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications</h3>
            <p className="text-slate-500">
              {activeTab === 'all' 
                ? "You're all caught up! Check back later." 
                : `No ${activeTab} notifications found.`}
            </p>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Notification Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Application alerts', id: 'email-applications' },
                    { label: 'Chat messages', id: 'email-chat' },
                    { label: 'Task assignments', id: 'email-tasks' },
                    { label: 'Startup updates', id: 'email-startup' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <button className={`w-12 h-6 rounded-full transition-colors ${
                        true ? 'bg-brand-600' : 'bg-slate-200'
                      } relative`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          true ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Push Notifications</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Application alerts', id: 'push-applications' },
                    { label: 'Chat messages', id: 'push-chat' },
                    { label: 'Task assignments', id: 'push-tasks' },
                    { label: 'Startup updates', id: 'push-startup' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <button className={`w-12 h-6 rounded-full transition-colors ${
                        true ? 'bg-brand-600' : 'bg-slate-200'
                      } relative`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          true ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
