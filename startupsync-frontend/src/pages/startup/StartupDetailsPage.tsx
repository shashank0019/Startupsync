import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startupService } from '../../api/startupService';
import { applicationService } from '../../api/applicationService';
import { Startup } from '../../types';
import { formatDate, getInitials } from '../../utils/validation';
import { getStatusColor } from '../../utils/helpers';

export const StartupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadStartup = async () => {
      try {
        const data = await startupService.getStartupById(id);
        setStartup(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load startup details');
      } finally {
        setIsLoading(false);
      }
    };

    loadStartup();
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setApplyLoading(true);
    try {
      await applicationService.apply(id, coverLetter);
      setApplySuccess(true);
      setShowApplyModal(false);
      setCoverLetter('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!startup) return <div>Startup not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-medium mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Logo */}
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              {startup.logoUrl ? (
                <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-6xl">🚀</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{startup.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{startup.tagline}</p>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(startup.status)}`}>
                  {startup.status}
                </span>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                  {startup.industry}
                </span>
                <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(startup.fundingStage)}`}>
                  {startup.fundingStage}
                </span>
                {startup.isRemote && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                    🌍 Remote
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                {applySuccess ? (
                  <span className="px-6 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-semibold">
                    ✓ Application Submitted
                  </span>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition"
                  >
                    Apply Now
                  </button>
                )}
                <button
                  onClick={() => navigate('/applications')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  My Applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{startup.description}</p>
            </div>

            {/* Location & Contact */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">{startup.location}</p>
                </div>

                {startup.websiteUrl && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                    <a
                      href={startup.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {startup.websiteUrl}
                    </a>
                  </div>
                )}

                {startup.teamSizeNeeded && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Team Size Needed</h3>
                    <p className="text-gray-600">{startup.teamSizeNeeded} members</p>
                  </div>
                )}
              </div>
            </div>

            {/* Required Skills */}
            {startup.requiredSkillIds && startup.requiredSkillIds.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {startup.requiredSkillIds.map((skillId) => (
                    <span
                      key={skillId}
                      className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium"
                    >
                      {skillId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Founder Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Founder</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {getInitials(startup.founder.firstName, startup.founder.lastName)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {startup.founder.firstName} {startup.founder.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">{startup.founder.email}</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
                View Profile
              </button>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Views</span>
                  <span className="font-bold text-gray-900">{startup.viewCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-bold text-gray-900">{startup.applicationCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created</span>
                  <span className="font-bold text-gray-900">{formatDate(startup.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Share</h3>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Share
                </button>
                <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-slate-900">Apply to {startup.name}</h3>
            <p className="text-sm text-slate-500 mt-1">Tell the founder why you&apos;re a great fit</p>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Write your cover letter..."
              className="mt-4 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applyLoading}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 disabled:opacity-50"
              >
                {applyLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
