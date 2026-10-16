import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, Briefcase, ChevronRight, TrendingUp, Sparkles, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { startupService } from '../../api/startupService';

type TabType = 'all' | 'recommended' | 'trending';

export const StartupFeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState<any[]>([]);
  const [recommendedStartups, setRecommendedStartups] = useState<any[]>([]);
  const [trendingStartups, setTrendingStartups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    fundingStage: '',
    isRemote: false as boolean | null,
    location: '',
  });

  const fetchStartups = useCallback(async () => {
    setIsLoading(true);
    try {
      const [allData, recommendedData, trendingData] = await Promise.all([
        startupService.getStartups({ 
          search, 
          industry: filters.industry || undefined,
          fundingStage: filters.fundingStage || undefined,
          isRemote: filters.isRemote !== null ? filters.isRemote : undefined,
          location: filters.location || undefined
        }),
        startupService.getRecommendedStartups(),
        startupService.getTrendingStartups(),
      ]);
      setStartups(allData.content);
      setRecommendedStartups(recommendedData.content);
      setTrendingStartups(trendingData.content);
    } catch (err) {
      console.error('Error fetching startups:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStartups();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [fetchStartups]);

  const getDisplayStartups = () => {
    switch (activeTab) {
      case 'recommended':
        return recommendedStartups;
      case 'trending':
        return trendingStartups;
      default:
        return startups;
    }
  };

  const clearFilters = () => {
    setFilters({ industry: '', fundingStage: '', isRemote: null, location: '' });
    setSearch('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== null) || search;

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      {/* Header & Search Banner */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Discover Startups</h1>
              <p className="mt-2 text-sm text-neutral-500 max-w-2xl">
                Find your next big opportunity. We match you with high-growth startups based on your skills and preferences.
              </p>
            </div>
            <div className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-900">{startups.length}</span> startups available
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all' as TabType, label: 'All Startups', icon: Briefcase },
              { id: 'recommended' as TabType, label: 'Recommended', icon: Sparkles },
              { id: 'trending' as TabType, label: 'Trending', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 pl-10 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-neutral-900 sm:text-sm sm:leading-6 transition-all"
                placeholder="Search startups, industries, or keywords..."
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-inset transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-neutral-900 text-white ring-neutral-900'
                  : 'bg-white text-neutral-700 ring-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-emerald-400 rounded-full" />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
                    className="w-full rounded-md border-0 py-2 px-3 ring-1 ring-inset ring-neutral-300 text-sm"
                  >
                    <option value="">All Industries</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Funding Stage</label>
                  <select
                    value={filters.fundingStage}
                    onChange={(e) => setFilters({ ...filters, fundingStage: e.target.value })}
                    className="w-full rounded-md border-0 py-2 px-3 ring-1 ring-inset ring-neutral-300 text-sm"
                  >
                    <option value="">All Stages</option>
                    <option value="SEED">Seed</option>
                    <option value="SERIES_A">Series A</option>
                    <option value="SERIES_B">Series B</option>
                    <option value="SERIES_C">Series C+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    placeholder="City or country"
                    className="w-full rounded-md border-0 py-2 px-3 ring-1 ring-inset ring-neutral-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Work Type</label>
                  <select
                    value={filters.isRemote === null ? '' : filters.isRemote.toString()}
                    onChange={(e) => setFilters({ ...filters, isRemote: e.target.value === '' ? null : e.target.value === 'true' })}
                    className="w-full rounded-md border-0 py-2 px-3 ring-1 ring-inset ring-neutral-300 text-sm"
                  >
                    <option value="">All</option>
                    <option value="true">Remote</option>
                    <option value="false">On-site</option>
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
                >
                  <X className="h-4 w-4" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          </div>
        ) : getDisplayStartups().length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
            <Briefcase className="mx-auto h-12 w-12 text-neutral-300" />
            <p className="mt-4 text-neutral-600 font-medium">No startups found</p>
            <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {getDisplayStartups().map((startup) => (
              <div 
                key={startup.id} 
                onClick={() => navigate(`/startups/${startup.id}`)}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                      {startup.logoUrl ? (
                        <img src={startup.logoUrl} alt={startup.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        startup.name.charAt(0)
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      {Math.floor(Math.random() * 20) + 75}% Match
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">{startup.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{startup.tagline || startup.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-neutral-600">
                      <Briefcase className="h-4 w-4 mr-2 text-neutral-400" />
                      {startup.industry} • {startup.fundingStage}
                    </div>
                    <div className="flex items-center text-xs text-neutral-600">
                      <MapPin className="h-4 w-4 mr-2 text-neutral-400" />
                      {startup.isRemote ? 'Remote' : startup.location}
                    </div>
                    <div className="flex items-center text-xs text-neutral-600">
                      <Users className="h-4 w-4 mr-2 text-neutral-400" />
                      {startup.teamSizeNeeded || '2-10'} members needed
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-neutral-100">
                    <p className="text-xs font-medium text-neutral-900 mb-2">Skills Needed:</p>
                    <div className="flex flex-wrap gap-2">
                      {(startup.requiredSkills || []).slice(0, 3).map((skill: string) => (
                        <span key={skill} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {skill}
                        </span>
                      ))}
                      {(startup.requiredSkills || []).length > 3 && (
                        <span className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-500">
                          +{(startup.requiredSkills || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-50 px-6 py-4 flex items-center justify-between group-hover:bg-neutral-100 transition-colors">
                  <span className="text-sm font-medium text-neutral-900">View details</span>
                  <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupFeedPage;