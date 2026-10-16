import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { analyticsService, AnalyticsDashboard } from '../../api/analyticsService';
import { MessageSquare, Target, TrendingUp, Users, Zap } from 'lucide-react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-brand-600" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-slate-500">Unable to load analytics.</p>;
  }

  const chartData = DAY_LABELS.map((day, i) => ({
    day,
    applications: data.series[0]?.values[i] ?? 0,
    messages: data.series[1]?.values[i] ?? 0,
    views: data.series[2]?.values[i] ?? 0,
  }));

  const statCards = [
    { label: 'Applications', value: data.totalApplications, icon: Zap, accent: 'bg-amber-50 text-amber-600' },
    { label: 'Matches', value: data.totalMatches, icon: TrendingUp, accent: 'bg-emerald-50 text-emerald-600' },
    { label: 'Unread Messages', value: data.unreadMessages, icon: MessageSquare, accent: 'bg-slate-50 text-slate-600' },
    { label: 'Team Members', value: data.teamMemberCount, icon: Users, accent: 'bg-purple-50 text-purple-600' },
    { label: 'Profile Views', value: data.profileViews, icon: Target, accent: 'bg-brand-50 text-brand-600' },
    { label: 'Response Rate', value: `${data.responseRate}%`, icon: TrendingUp, accent: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="animate-fade-in space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Founder Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Real metrics from your startups and applications</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.accent}`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Weekly Applications</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="applications" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Engagement Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="messages" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="views" stroke="#6366F1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
