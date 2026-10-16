import axiosInstance from './axios';

export interface MatchedCandidate {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoUrl?: string;
  headline?: string;
  compatibilityScore: number;
  skillsMatchScore?: number;
  experienceMatchScore?: number;
  industryMatchScore?: number;
  locationMatchScore?: number;
  availabilityMatchScore?: number;
}

export interface MatchedStartup {
  startupId: string;
  name: string;
  logoUrl?: string;
  tagline?: string;
  description?: string;
  industry?: string;
  fundingStage?: string;
  location?: string;
  isRemote?: boolean;
  teamSizeNeeded?: number;
  requiredSkills?: string[];
  skillsMatchPercentage?: number;
  experienceMatchPercentage?: number;
  industryMatchPercentage?: number;
  locationMatchPercentage?: number;
  availabilityMatchPercentage?: number;
  overallMatchPercentage?: number;
  matchingSkills?: string[];
  skillsMissing?: string[];
  founderName?: string;
  founderEmail?: string;
}

export const matchingService = {
  getMatchedCandidates: async (startupId: string, page = 0, size = 20) => {
    const response = await axiosInstance.get(`/matching/startup/${startupId}`, { params: { page, size } });
    return {
      content: response.data.content || [],
      totalElements: response.data.totalElements || 0,
    };
  },

  getTopMatches: async (startupId: string, limit = 10): Promise<MatchedCandidate[]> => {
    const response = await axiosInstance.get(`/matching/startup/${startupId}/top`, { params: { limit } });
    return response.data || [];
  },

  getCompatibilityScore: async (startupId: string, userId: string): Promise<number> => {
    const response = await axiosInstance.get(`/matching/score/${startupId}/${userId}`);
    return response.data;
  },

  getRecommendedStartups: async (limit = 10): Promise<MatchedStartup[]> => {
    const response = await axiosInstance.get('/matching/startups', { params: { limit } });
    return response.data || [];
  },

  getCompatibilityBreakdown: async (startupId: string): Promise<MatchedStartup> => {
    const response = await axiosInstance.get(`/matching/compatibility/${startupId}`);
    return response.data;
  },
};
