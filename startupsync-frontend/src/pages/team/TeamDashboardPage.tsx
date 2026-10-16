import React, { useEffect, useState } from 'react';
import { teamService } from '../../api/teamService';
import { Team } from '../../types';
import { getInitials } from '../../utils/validation';

export const TeamDashboardPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'my-teams' | 'all-teams'>('my-teams');

  useEffect(() => {
    loadTeams();
  }, [activeTab]);

  const loadTeams = async () => {
    setIsLoading(true);
    try {
      let data: Team[];
      if (activeTab === 'my-teams') {
        data = await teamService.getMyTeams();
      } else {
        const response = await teamService.getAllTeams(0, 20);
        data = response.content || [];
      }
      setTeams(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load teams');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Teams</h1>
          <p className="text-blue-100">Collaborate with your team members</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('my-teams')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'my-teams'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Teams
          </button>
          <button
            onClick={() => setActiveTab('all-teams')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'all-teams'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Teams
          </button>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            + Create Team
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Teams Grid */}
        {!isLoading && teams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group">
                {/* Header */}
                <div className="h-24 bg-gradient-to-br from-blue-500 to-purple-500"></div>

                {/* Content */}
                <div className="p-6 -mt-12">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-600">{team.description}</p>
                  </div>

                  {/* Members */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Members ({(team.members || []).length})</p>
                    <div className="flex -space-x-2">
                      {(team.members || []).slice(0, 5).map((member: any, idx) => {
                        const firstName = member.firstName || member.user?.firstName || '';
                        const lastName = member.lastName || member.user?.lastName || '';
                        const fullName = `${firstName} ${lastName}`.trim() || 'Team Member';
                        return (
                          <div
                            key={member.id || idx}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                            title={fullName}
                          >
                            {getInitials(firstName, lastName)}
                          </div>
                        );
                      })}
                      {(team.members || []).length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-gray-700 text-xs font-bold">
                          +{(team.members || []).length - 5}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition">
                      View
                    </button>
                    <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && teams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-3xl mb-4">👥</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No teams yet</h3>
            <p className="text-gray-600">{activeTab === 'my-teams' ? 'Create your first team' : 'No teams available'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
