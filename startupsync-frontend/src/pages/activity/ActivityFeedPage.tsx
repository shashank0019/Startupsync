import React, { useEffect, useState, useCallback } from 'react';
import { Activity, Bell, MessageSquare, Rocket, User, Building2, CheckCircle, Clock, Heart, MessageCircle } from 'lucide-react';
import { activityService, ActivityItem } from '../../api/activityService';
import { formatTime } from '../../utils/validation';

const iconForType = (type: string) => {
  switch (type) {
    case 'MESSAGE': return MessageSquare;
    case 'APPLICATION': return Rocket;
    case 'INVITATION': return Bell;
    case 'PROFILE': return User;
    case 'STARTUP': return Building2;
    case 'TASK': return CheckCircle;
    case 'TEAM': return User;
    default: return Activity;
  }
};

const iconColorForType = (type: string) => {
  switch (type) {
    case 'MESSAGE': return 'bg-blue-50 text-blue-600';
    case 'APPLICATION': return 'bg-emerald-50 text-emerald-600';
    case 'INVITATION': return 'bg-purple-50 text-purple-600';
    case 'PROFILE': return 'bg-amber-50 text-amber-600';
    case 'STARTUP': return 'bg-brand-50 text-brand-600';
    case 'TASK': return 'bg-rose-50 text-rose-600';
    case 'TEAM': return 'bg-cyan-50 text-cyan-600';
    default: return 'bg-slate-50 text-slate-600';
  }
};

const filters = [
  { value: 'ALL', label: 'All Activities' },
  { value: 'APPLICATION', label: 'Applications' },
  { value: 'INVITATION', label: 'Invitations' },
  { value: 'TASK', label: 'Tasks' },
  { value: 'MESSAGE', label: 'Messages' },
  { value: 'TEAM', label: 'Team Activity' },
];

export const ActivityFeedPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const result = await activityService.getMyActivities(0, 50, activeFilter === 'ALL' ? undefined : activeFilter);
      setActivities(result.content || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activity Feed</h1>
        <p className="mt-1 text-sm text-slate-500">Everything happening across your workspace</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
              activeFilter === filter.value ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-600" />
          </div>
        ) : activities.length === 0 ? (
          <div className="py-16 text-center">
            <Activity className="mx-auto mb-4 text-slate-300" size={48} />
            <p className="font-medium text-slate-900">No activity yet</p>
            <p className="mt-1 text-sm text-slate-500">Apply to startups or update your profile to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((item) => {
              const Icon = iconForType(item.activityType);
              const iconColor = iconColorForType(item.activityType);
              return (
                <div key={item.id} className="flex gap-4 p-6 transition hover:bg-slate-50">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconColor}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock size={14} className="text-slate-400" />
                          <p className="text-xs text-slate-400">{formatTime(item.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition" title="Like">
                          <Heart size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-brand-500 transition" title="Comment">
                          <MessageCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedPage;
