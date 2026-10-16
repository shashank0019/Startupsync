import axiosInstance from './axios';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  activityType: string;
  entityType?: string;
  entityId?: string;
  createdAt: string;
}

export interface ActivityPage {
  content: ActivityItem[];
  totalElements: number;
  totalPages: number;
}

export const activityService = {
  getMyActivities: async (page = 0, size = 20, filter?: string): Promise<ActivityPage> => {
    const params: any = { page, size };
    if (filter) params.filter = filter;
    const response = await axiosInstance.get('/activities/me', { params });
    return response.data;
  },

  getUserActivities: async (userId: string, page = 0, size = 20, filter?: string): Promise<ActivityPage> => {
    const params: any = { page, size };
    if (filter) params.filter = filter;
    const response = await axiosInstance.get(`/activities/user/${userId}`, { params });
    return response.data;
  },

  getStartupActivities: async (startupId: string, page = 0, size = 20, filter?: string): Promise<ActivityPage> => {
    const params: any = { page, size };
    if (filter) params.filter = filter;
    const response = await axiosInstance.get(`/activities/startup/${startupId}`, { params });
    return response.data;
  },
};
