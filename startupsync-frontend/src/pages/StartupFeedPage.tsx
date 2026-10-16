import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Star, Users, TrendingUp, Bookmark } from 'lucide-react';

interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  fundingStage: string;
  teamSize: number;
  requiredSkills: string[];
  location: string;
  remote: boolean;
  profilePhotoUrl?: string;
  rating: number;
  applications: number;
}

export const StartupFeedPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [sortBy, setSortBy] = useState('trending');

  // Mock data - replace with API call
  const startups: Startup[] = [
    {
      id: '1',
      name: 'AI Content Creator',
      description: 'An AI-powered platform for generating personalized content',
      industry: 'AI/ML',
      fundingStage: 'Seed',
      teamSize: 3,
      requiredSkills: ['React', 'Node.js', 'Python'],
      location: 'San Francisco, CA',
      remote: true,
      rating: 4.5,
      applications: 12,
    },
    {
      id: '2',
      name: 'HealthTech Solutions',
      description: 'Revolutionizing patient care with blockchain technology',
      industry: 'Healthcare',
      fundingStage: 'Series A',
      teamSize: 5,
      requiredSkills: ['DevOps', 'Blockchain', 'Healthcare'],
      location: 'Boston, MA',
      remote: false,
      rating: 4.8,
      applications: 25,
    },
  ];

  const industries = ['All', 'AI/ML', 'FinTech', 'HealthTech', 'EdTech', 'Sustainability'];
  const fundingStages = ['All', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Discover Startups</h1>
        <p className="text-slate-500 mt-2 text-lg">Find the perfect team and start building the future.</p>
      </div>
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 border border-slate-100">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search startups by name, industry, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Filter size={16} className="inline mr-2" />
                Industry
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
              >
                {industries.map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Funding Stage</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
              >
                {fundingStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer">
                <option>Any Location</option>
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 hover:bg-white transition-colors cursor-pointer"
              >
                <option value="trending">Trending</option>
                <option value="recent">Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="team-size">Team Size</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Startup Cards */}
      <div className="grid grid-cols-1 gap-5">
        {startups.map((startup) => (
          <div
            key={startup.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-indigo-200 overflow-hidden cursor-pointer"
          >
            <div className="p-7">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200 shrink-0">
                    {startup.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors">{startup.name}</h3>
                    <p className="text-slate-500 mb-4 leading-relaxed">{startup.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-block px-3.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-semibold tracking-wide">
                        {startup.industry}
                      </span>
                      <span className="inline-block px-3.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-xs font-semibold tracking-wide">
                        {startup.fundingStage}
                      </span>
                      <span className="inline-block px-3.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold tracking-wide">
                        {startup.remote ? '🌍 Remote' : '📍 On-site'}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <Bookmark size={24} />
                </button>
              </div>

              <div className="border-t border-slate-100 pt-5 mt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">{startup.teamSize} people needed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-amber-400" fill="currentColor" />
                      <span className="text-sm font-medium text-slate-600">{startup.rating}/5.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="text-emerald-500" />
                      <span className="text-sm font-medium text-slate-600">{startup.applications} applications</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/startups/${startup.id}`)}
                      className="px-5 py-2.5 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                      View Details
                    </button>
                    <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartupFeedPage;
