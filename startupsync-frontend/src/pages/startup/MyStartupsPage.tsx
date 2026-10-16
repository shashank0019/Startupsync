import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startupService } from '../../api/startupService';
import { Startup } from '../../types';
import { Plus, Rocket, Trash2, Eye } from 'lucide-react';

export const MyStartupsPage: React.FC = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const result = await startupService.getStartups({}, 0, 50);
        setStartups(result.content);
      } catch (err) {
        console.error('Failed to load startups:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this startup?')) return;
    try {
      await startupService.deleteStartup(id);
      setStartups((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Startups</h1>
          <p className="text-slate-500 mt-1">Create, manage, and publish your startups</p>
        </div>
        <button
          onClick={() => navigate('/startups/create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
        >
          <Plus size={18} /> Create Startup
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-10 w-10 border-b-2 border-brand-600 rounded-full" />
        </div>
      ) : startups.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Rocket className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-600 font-medium">No startups yet</p>
          <button onClick={() => navigate('/startups/create')} className="mt-4 text-brand-600 font-semibold hover:underline">
            Create your first startup →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {startups.map((startup) => (
            <div key={startup.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-hover transition">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl">
                  {startup.name.charAt(0)}
                </div>
                <span className="px-2 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600">{startup.status}</span>
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{startup.name}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{startup.tagline}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <span>{startup.viewCount || 0} views</span>
                <span>{startup.applicationCount || 0} applications</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => navigate(`/startups/${startup.id}`)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => handleDelete(startup.id)}
                  className="px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStartupsPage;
