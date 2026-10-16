import axiosInstance from './axios';

export interface UserSettings {
  emailNotifications: boolean;
  applicationUpdates: boolean;
  messageNotifications: boolean;
  profileVisible: boolean;
  showLocation: boolean;
  allowMessaging: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const settingsService = {
  getSettings: async (): Promise<UserSettings> => {
    const response = await axiosInstance.get('/settings');
    return response.data;
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await axiosInstance.put('/settings', settings);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post('/auth/change-password', data);
  },
};
