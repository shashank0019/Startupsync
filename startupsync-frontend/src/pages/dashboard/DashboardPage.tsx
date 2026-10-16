import React from 'react';
import { BarChart3, Users, Briefcase, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Profile Views', value: '1,204', icon: Users, change: '+12.5%', trend: 'up' },
    { name: 'Applications', value: '48', icon: Briefcase, change: '+4.1%', trend: 'up' },
    { name: 'Unread Messages', value: '9', icon: MessageSquare, change: '-2.0%', trend: 'down' },
    { name: 'Matches', value: '156', icon: TrendingUp, change: '+24.5%', trend: 'up' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      {/* Welcome Banner */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Welcome back, {user?.firstName || 'Builder'}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Here is what's happening with your startups and applications today.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        
        {/* Profile Completion Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-medium text-neutral-900">Complete your profile</h2>
            <p className="text-sm text-neutral-500 mt-1">A complete profile increases your match rate by up to 80%.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-2xl font-semibold text-neutral-900">65%</span>
            </div>
            <div className="h-12 w-12 rounded-full border-4 border-neutral-100 border-t-neutral-900 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-neutral-900" />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden rounded-xl border border-neutral-200 p-5 shadow-sm hover:border-neutral-300 transition-all cursor-pointer group">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-neutral-400 group-hover:text-neutral-900 transition-colors" aria-hidden="true" />
                </div>
                <div className="ml-4 w-full flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500 truncate">{stat.name}</p>
                    <p className="text-2xl font-semibold text-neutral-900 mt-1">{stat.value}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Recent Activity Feed Placeholder */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
            <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-base font-medium text-neutral-900">Recent Activity</h3>
              <button className="text-sm font-medium text-neutral-500 hover:text-neutral-900">View all</button>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center h-64">
              <BarChart3 className="h-10 w-10 text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-900">No recent activity</p>
              <p className="text-sm text-neutral-500 mt-1">Start applying to startups to see activity here.</p>
            </div>
          </div>

          {/* Recommended Startups Placeholder */}
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm">
            <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="text-base font-medium text-neutral-900">Recommended for you</h3>
              <button className="text-sm font-medium text-neutral-500 hover:text-neutral-900">Browse all</button>
            </div>
            <div className="p-0">
              {/* List item mock */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="px-6 py-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-neutral-200 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">TechVision AI</p>
                      <p className="text-xs text-neutral-500">Looking for a Lead Frontend Engineer</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
                    98% Match
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;