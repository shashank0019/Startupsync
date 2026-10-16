import axiosInstance from './axios';
import { Notification } from '../types';

export const notificationService = {
  getNotifications: async (pageNumber: number = 0, pageSize: number = 20): Promise<any> => {
    const response = await axiosInstance.get('/notifications', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await axiosInstance.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch('/notifications/mark-all-read');
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await axiosInstance.delete(`/notifications/${notificationId}`);
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await axiosInstance.get('/notifications/unread/count');
    return response.data;
  },
};
