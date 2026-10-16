import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { applicationService } from '../../api/applicationService';
import { Application } from '../../types';
import { CheckCircle, Clock, XCircle, FileText, Calendar, User, MessageSquare, Eye, ChevronRight } from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: React.ElementType; bgColor: string }> = {
  PENDING: { color: 'text-amber-700', icon: Clock, bgColor: 'bg-amber-50 border-amber-100' },
  REVIEWING: { color: 'text-blue-700', icon: FileText, bgColor: 'bg-blue-50 border-blue-100' },
  APPROVED: { color: 'text-emerald-700', icon: CheckCircle, bgColor: 'bg-emerald-50 border-emerald-100' },
  REJECTED: { color: 'text-rose-700', icon: XCircle, bgColor: 'bg-rose-50 border-rose-100' },
  WITHDRAWN: { color: 'text-slate-600', icon: XCircle, bgColor: 'bg-slate-50 border-slate-200' },
};

const timelineSteps = [
  { status: 'PENDING', label: 'Applied', icon: Clock },
  { status: 'REVIEWING', label: 'Under Review', icon: FileText },
  { status: 'INTERVIEW', label: 'Interview', icon: User },
  { status: 'APPROVED', label: 'Accepted', icon: CheckCircle },
];

export const ApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const isFounder = user?.role === 'FOUNDER' || user?.role === 'STARTUP_FOUNDER' || user?.role === 'ADMIN';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const result = await applicationService.getMyApplications();
        setApplications(result.content);
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleWithdraw = async (id: string) => {
    try {
      await applicationService.withdraw(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'WITHDRAWN' } : a)));
    } catch (err) {
      console.error('Withdraw failed:', err);
    }
  };

  const filtered = filter === 'ALL' ? applications : applications.filter((a) => a.status === filter);

  const getTimelineStep = (status: string) => {
    const index = timelineSteps.findIndex((step) => step.status === status);
    return index >= 0 ? index : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-500 mt-1">Track your startup applications and review candidates</p>
        </div>
        {!isFounder && (
          <button
            onClick={() => navigate('/startups')}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
          >
            Browse Startups
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap border-b border-slate-200 pb-4">
        {['ALL', 'PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'WITHDRAWN'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              filter === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            {s !== 'ALL' && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-slate-100">
                {applications.filter((a) => a.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-10 w-10 border-b-2 border-brand-600 rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-slate-600 font-medium">No applications yet</p>
          <button onClick={() => navigate('/startups')} className="mt-4 text-brand-600 font-semibold hover:underline">
            Discover startups to apply →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const cfg = statusConfig[app.status] || statusConfig.PENDING;
            const Icon = cfg.icon;
            const currentStep = getTimelineStep(app.status);
            
            return (
              <div key={app.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-hover transition">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Startup Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {app.startup?.name?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg">{app.startup?.name || 'Startup'}</h3>
                        <p className="text-sm text-slate-500 mt-1">{app.startup?.industry}</p>
                        {app.coverLetter && (
                          <p className="text-sm text-slate-600 mt-3 line-clamp-2 bg-slate-50 p-3 rounded-lg">
                            {app.coverLetter}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500">Application Progress</span>
                        <span className="text-xs text-slate-400">
                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {timelineSteps.map((step, index) => {
                          const StepIcon = step.icon;
                          const isCompleted = index <= currentStep;
                          const isCurrent = index === currentStep;
                          
                          return (
                            <React.Fragment key={step.status}>
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                                  } ${isCurrent ? 'ring-2 ring-emerald-300 ring-offset-2' : ''}`}
                                >
                                  <StepIcon className="h-4 w-4" />
                                </div>
                                <span className={`text-xs mt-1 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                              {index < timelineSteps.length - 1 && (
                                <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${cfg.bgColor} ${cfg.color}`}>
                      <Icon size={14} /> {app.status}
                    </span>
                    
                    <div className="flex gap-2 w-full lg:flex-col">
                      {app.status === 'PENDING' && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition flex items-center justify-center gap-1"
                        >
                          <XCircle size={16} /> Withdraw
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/startups/${app.startup?.id}`)}
                        className="px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <Eye size={16} /> View Startup
                      </button>
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <MessageSquare size={16} /> Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Application Details</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Startup</h4>
                <p className="text-slate-600">{selectedApplication.startup?.name}</p>
                <p className="text-sm text-slate-500">{selectedApplication.startup?.industry}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Cover Letter</h4>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">
                  {selectedApplication.coverLetter || 'No cover letter provided'}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">
                      Applied on {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedApplication.updatedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        Last updated {new Date(selectedApplication.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedApplication(null);
                    navigate(`/startups/${selectedApplication.startup?.id}`);
                  }}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition"
                >
                  View Startup
                </button>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
