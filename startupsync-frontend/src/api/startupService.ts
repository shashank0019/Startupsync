import axiosInstance from './axios';
import { Startup, CreateStartupRequest, PaginatedResponse } from '../types';

const mapPageToPaginatedResponse = <T>(data: any): PaginatedResponse<T> => {
  return {
    content: data.content || [],
    totalElements: data.totalElements || 0,
    totalPages: data.totalPages || 0,
    pageNumber: data.number || 0,
    pageSize: data.size || 10,
    hasNext: !data.last,
    hasPrevious: !data.first,
  };
};

export const startupService = {
  getStartups: async (
    filters: {
      search?: string;
      industry?: string;
      fundingStage?: string;
      isRemote?: boolean;
    } = {},
    page: number = 0,
    size: number = 12
  ): Promise<PaginatedResponse<Startup>> => {
    const response = await axiosInstance.get('/startups', {
      params: {
        page,
        size,
        search: filters.search || undefined,
        industry: filters.industry || undefined,
        fundingStage: filters.fundingStage || undefined,
        isRemote: filters.isRemote !== undefined ? filters.isRemote : undefined,
      },
    });
    return mapPageToPaginatedResponse<Startup>(response.data);
  },

  getRecommendedStartups: async (page: number = 0, size: number = 12): Promise<PaginatedResponse<Startup>> => {
    const response = await axiosInstance.get('/startups/recommended', {
      params: { page, size },
    });
    return mapPageToPaginatedResponse<Startup>(response.data);
  },

  getTrendingStartups: async (page: number = 0, size: number = 12): Promise<PaginatedResponse<Startup>> => {
    const response = await axiosInstance.get('/startups/trending', {
      params: { page, size },
    });
    return mapPageToPaginatedResponse<Startup>(response.data);
  },

  getStartupById: async (id: string): Promise<Startup> => {
    const response = await axiosInstance.get(`/startups/${id}`);
    return response.data;
  },

  createStartup: async (data: CreateStartupRequest): Promise<Startup> => {
    const response = await axiosInstance.post('/startups', data);
    return response.data;
  },

  updateStartup: async (id: string, data: Partial<CreateStartupRequest>): Promise<Startup> => {
    const response = await axiosInstance.put(`/startups/${id}`, data);
    return response.data;
  },

  deleteStartup: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/startups/${id}`);
  },

  getMyStartups: async (): Promise<Startup[]> => {
    const response = await axiosInstance.get('/startups/my');
    return response.data || [];
  },
};
