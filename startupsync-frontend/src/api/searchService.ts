import axiosInstance from './axios';

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'USER' | 'STARTUP' | 'TASK' | 'TEAM' | 'SKILL';
  url: string;
}

export interface SearchResponse {
  users: SearchItem[];
  startups: SearchItem[];
  tasks: SearchItem[];
  teams: SearchItem[];
  skills: SearchItem[];
}

export const searchService = {
  search: async (query: string): Promise<SearchResponse> => {
    const response = await axiosInstance.get('/search', { params: { query } });
    return response.data;
  },
};
