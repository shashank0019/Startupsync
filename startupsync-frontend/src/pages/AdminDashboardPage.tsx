import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, AlertCircle, Rocket } from 'lucide-react';
import { adminService } from '../api/adminService';
import { DashboardStats } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [statsData, usersData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getUsers(0, 10),
        ]);
        setStats(statsData);
        setUsers(usersData.content || usersData.users || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load admin data. Admin role required.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin h-10 w-10 border-b-2 border-brand-600 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <p className="text-amber-800 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2 text-lg">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Users</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalUsers ?? 0}</p>
            </div>
            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl"><Users size={28} /></div>
          </div>
          {stats?.userGrowthRate != null && (
            <p className="text-emerald-600 text-sm mt-4 font-medium flex items-center gap-1">
              <TrendingUp size={14} /> +{stats.userGrowthRate}% growth
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Total Startups</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalStartups ?? 0}</p>
            </div>
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><Rocket size={28} /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Applications</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalApplications ?? 0}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle size={28} /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Teams</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">{stats?.totalTeams ?? 0}</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={28} /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users size={20} /> Users Management
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      user.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
