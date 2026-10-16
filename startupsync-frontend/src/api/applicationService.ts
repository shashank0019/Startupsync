import axiosInstance from './axios';
import { Application } from '../types';

const mapApplication = (data: any): Application => ({
  id: data.id,
  applicant: data.applicant,
  startup: data.startup,
  status: data.status,
  coverLetter: data.coverLetter || '',
  appliedAt: data.appliedAt,
  updatedAt: data.reviewedAt || data.appliedAt,
});

export const applicationService = {
  apply: async (startupId: string, coverLetter: string): Promise<Application> => {
    const response = await axiosInstance.post(`/applications/apply/${startupId}`, { coverLetter });
    return mapApplication(response.data);
  },

  withdraw: async (applicationId: string): Promise<void> => {
    await axiosInstance.delete(`/applications/${applicationId}`);
  },

  getMyApplications: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/applications/user', { params: { page, size } });
    return {
      content: (response.data.content || []).map(mapApplication),
      totalElements: response.data.totalElements || 0,
    };
  },

  getStartupApplications: async (startupId: string, page = 0, size = 20) => {
    const response = await axiosInstance.get(`/applications/startup/${startupId}`, { params: { page, size } });
    return {
      content: (response.data.content || []).map(mapApplication),
      totalElements: response.data.totalElements || 0,
    };
  },

  approve: async (applicationId: string, message?: string): Promise<Application> => {
    const response = await axiosInstance.patch(`/applications/${applicationId}/approve`, { message });
    return mapApplication(response.data);
  },

  reject: async (applicationId: string, reason?: string): Promise<Application> => {
    const response = await axiosInstance.patch(`/applications/${applicationId}/reject`, { reason });
    return mapApplication(response.data);
  },

  review: async (applicationId: string): Promise<Application> => {
    const response = await axiosInstance.patch(`/applications/${applicationId}/review`);
    return mapApplication(response.data);
  },
};
