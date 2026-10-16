import axiosInstance from './axios';
import { DashboardStats } from '../types';

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get('/admin/dashboard/stats');
    return response.data;
  },

  getUsers: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/admin/users', {
      params: { pageNumber: page, pageSize: size },
    });
    return response.data;
  },

  suspendUser: async (userId: string, reason?: string) => {
    await axiosInstance.post('/admin/users/suspend', { userId, reason });
  },

  activateUser: async (userId: string) => {
    await axiosInstance.post('/admin/users/activate', { userId });
  },
};
