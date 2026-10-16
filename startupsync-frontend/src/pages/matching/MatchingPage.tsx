import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { startupService } from '../../api/startupService';
import { matchingService, MatchedCandidate, MatchedStartup } from '../../api/matchingService';
import { Startup } from '../../types';
import { Sparkles, User, TrendingUp, Building2, MapPin, Briefcase, Target, BarChart3, CheckCircle, XCircle, MessageSquare, Bookmark, Eye } from 'lucide-react';

export const MatchingPage: React.FC = () => {
  const { user } = useAuth();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<string>('');
  const [candidates, setCandidates] = useState<MatchedCandidate[]>([]);
  const [recommendedStartups, setRecommendedStartups] = useState<MatchedStartup[]>([]);
  const [selectedCompatibility, setSelectedCompatibility] = useState<MatchedStartup | null>(null);
  const [showCompatibilityDrawer, setShowCompatibilityDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [view, setView] = useState<'candidates' | 'startups'>('startups');

  const isFounder = user?.role === 'FOUNDER' || user?.role === 'STARTUP_FOUNDER' || user?.role === 'ADMIN';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const result = await startupService.getStartups({}, 0, 50);
        setStartups(result.content);
        if (result.content.length > 0) {
          setSelectedStartup(result.content[0].id);
        }
      } catch (err) {
        console.error('Failed to load startups:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadRecommendedStartups = async () => {
      try {
        const startups = await matchingService.getRecommendedStartups(10);
        setRecommendedStartups(startups);
      } catch (err) {
        console.error('Failed to load recommended startups:', err);
      }
    };
    loadRecommendedStartups();
  }, []);

  useEffect(() => {
    if (!selectedStartup || !isFounder) return;

    const loadMatches = async () => {
      setLoadingMatches(true);
      try {
        const top = await matchingService.getTopMatches(selectedStartup, 20);
        setCandidates(top);
      } catch (err) {
        console.error('Failed to load matches:', err);
        setCandidates([]);
      } finally {
        setLoadingMatches(false);
      }
    };
    loadMatches();
  }, [selectedStartup, isFounder]);

  const handleViewCompatibility = async (startupId: string) => {
    try {
      const compatibility = await matchingService.getCompatibilityBreakdown(startupId);
      setSelectedCompatibility(compatibility);
      setShowCompatibilityDrawer(true);
    } catch (err) {
      console.error('Failed to load compatibility:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="text-brand-500" /> Matching Engine
        </h1>
        <p className="text-slate-500 mt-1">
          AI-powered recommendations based on skills (40%), experience (20%), industry (15%), location (15%), availability (10%)
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Matches</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{isFounder ? candidates.length : recommendedStartups.length}</p>
            </div>
            <div className="h-12 w-12 bg-brand-50 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-brand-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{isFounder ? 'Startup Recommendations' : 'Candidate Recommendations'}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{isFounder ? startups.length : recommendedStartups.length}</p>
            </div>
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg Compatibility</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {isFounder 
                  ? (candidates.length > 0 ? Math.round(candidates.reduce((acc, c) => acc + (c.compatibilityScore || 0), 0) / candidates.length) : 0)
                  : (recommendedStartups.length > 0 ? Math.round(recommendedStartups.reduce((acc, s) => acc + (s.overallMatchPercentage || 0), 0) / recommendedStartups.length) : 0)
                }%
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">High Matches</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {isFounder 
                  ? candidates.filter(c => (c.compatibilityScore || 0) >= 75).length
                  : recommendedStartups.filter(s => (s.overallMatchPercentage || 0) >= 75).length
                }
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle for Founders */}
      {isFounder && (
        <div className="flex gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setView('startups')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              view === 'startups' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="h-4 w-4 inline mr-2" />
            Recommended Startups
          </button>
          <button
            onClick={() => setView('candidates')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              view === 'candidates' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Matched Candidates
          </button>
        </div>
      )}

      {/* Startup Selector for Founders in Candidates View */}
      {isFounder && view === 'candidates' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Startup</label>
          <select
            value={selectedStartup}
            onChange={(e) => setSelectedStartup(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            disabled={isLoading}
          >
            {startups.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Recommended Startups Section */}
      {(!isFounder || view === 'startups') && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended Startups</h2>
          {recommendedStartups.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <Building2 className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-600 font-medium">No recommended startups yet</p>
              <p className="text-sm text-slate-500 mt-1">Complete your profile to get better recommendations</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedStartups.map((startup) => (
                <div key={startup.startupId} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-hover transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {startup.logoUrl ? (
                          <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          startup.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{startup.name}</h3>
                        <p className="text-sm text-slate-500">{startup.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-600">{Math.round(startup.overallMatchPercentage || 0)}%</div>
                      <p className="text-xs text-slate-400">Match</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{startup.tagline || startup.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-slate-600">
                      <Briefcase className="h-4 w-4 mr-2 text-slate-400" />
                      {startup.fundingStage}
                    </div>
                    <div className="flex items-center text-xs text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                      {startup.isRemote ? 'Remote' : startup.location}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewCompatibility(startup.startupId)}
                      className="flex-1 px-3 py-2 bg-brand-50 text-brand-600 rounded-lg text-sm font-semibold hover:bg-brand-100 transition flex items-center justify-center gap-1"
                    >
                      <Eye size={16} /> View Compatibility
                    </button>
                    <button className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
                      <Bookmark size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matched Candidates Section (Founders Only) */}
      {isFounder && view === 'candidates' && (
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Matched Candidates</h2>
          {loadingMatches ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-10 w-10 border-b-2 border-brand-600 rounded-full" />
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <User className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-600">No matched candidates found for this startup</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((candidate, index) => (
                <div key={candidate.userId || index} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-card hover:shadow-card-hover transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                        {candidate.firstName?.charAt(0)}{candidate.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{candidate.firstName} {candidate.lastName}</h3>
                        <p className="text-sm text-slate-500">{candidate.headline || candidate.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-brand-600">{Math.round(candidate.compatibilityScore || 0)}%</div>
                      <p className="text-xs text-slate-400">Match</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    {candidate.skillsMatchScore != null && (
                      <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-500">Skills</span><br /><strong>{Math.round(candidate.skillsMatchScore)}%</strong></div>
                    )}
                    {candidate.experienceMatchScore != null && (
                      <div className="bg-slate-50 rounded-lg p-2"><span className="text-slate-500">Experience</span><br /><strong>{Math.round(candidate.experienceMatchScore)}%</strong></div>
                    )}
                  </div>
                  {index < 3 && (
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <TrendingUp size={12} /> Top Match #{index + 1}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition flex items-center justify-center gap-1">
                      <MessageSquare size={16} /> Invite
                    </button>
                    <button className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compatibility Breakdown Drawer */}
      {showCompatibilityDrawer && selectedCompatibility && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/40 p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Compatibility Breakdown</h3>
              <button
                onClick={() => {
                  setShowCompatibilityDrawer(false);
                  setSelectedCompatibility(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  {selectedCompatibility.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{selectedCompatibility.name}</h4>
                  <p className="text-sm text-slate-500">{selectedCompatibility.industry}</p>
                  <div className="mt-2 text-3xl font-bold text-brand-600">{Math.round(selectedCompatibility.overallMatchPercentage || 0)}% Compatible</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Skills Match (40%)</span>
                    <span className="font-semibold text-slate-900">{Math.round(selectedCompatibility.skillsMatchPercentage || 0)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${selectedCompatibility.skillsMatchPercentage || 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Experience Match (20%)</span>
                    <span className="font-semibold text-slate-900">{Math.round(selectedCompatibility.experienceMatchPercentage || 0)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${selectedCompatibility.experienceMatchPercentage || 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Industry Match (15%)</span>
                    <span className="font-semibold text-slate-900">{Math.round(selectedCompatibility.industryMatchPercentage || 0)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${selectedCompatibility.industryMatchPercentage || 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Location Match (15%)</span>
                    <span className="font-semibold text-slate-900">{Math.round(selectedCompatibility.locationMatchPercentage || 0)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${selectedCompatibility.locationMatchPercentage || 0}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Availability Match (10%)</span>
                    <span className="font-semibold text-slate-900">{Math.round(selectedCompatibility.availabilityMatchPercentage || 0)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-rose-600 h-2 rounded-full" style={{ width: `${selectedCompatibility.availabilityMatchPercentage || 0}%` }}></div>
                  </div>
                </div>
              </div>

              {selectedCompatibility.matchingSkills && selectedCompatibility.matchingSkills.length > 0 && (
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Matching Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompatibility.matchingSkills.map((skill) => (
                      <span key={skill} className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        <CheckCircle size={12} className="mr-1" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedCompatibility.skillsMissing && selectedCompatibility.skillsMissing.length > 0 && (
                <div>
                  <h5 className="font-semibold text-slate-900 mb-2">Skills to Develop</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompatibility.skillsMissing.map((skill) => (
                      <span key={skill} className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">
                        <XCircle size={12} className="mr-1" /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    setShowCompatibilityDrawer(false);
                    setSelectedCompatibility(null);
                  }}
                  className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
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

export default MatchingPage;
