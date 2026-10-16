import axiosInstance from './axios';
import { User } from '../types';

const mapProfileResponseToUser = (data: any): User => {
  return {
    id: data.user?.id || data.id || '',
    firstName: data.user?.firstName || '',
    lastName: data.user?.lastName || '',
    email: data.user?.email || '',
    role: data.user?.role || 'USER',
    isActive: data.user?.isActive !== undefined ? data.user.isActive : true,
    isEmailVerified: data.user?.isEmailVerified !== undefined ? data.user.isEmailVerified : true,
    profilePhotoUrl: data.profilePictureUrl || data.user?.profilePhotoUrl || '',
    bio: data.bio || '',
    location: data.location || '',
    phoneNumber: data.phoneNumber || '',
    githubUrl: data.githubUrl || '',
    linkedinUrl: data.linkedinUrl || '',
    portfolioUrl: data.portfolioUrl || '',
    availabilityStatus: data.availabilityStatus || 'AVAILABLE',
    profileCompletionPercentage: data.completionPercentage || 0,
    headline: data.headline || '',
    yearsOfExperience: data.yearsOfExperience,
    currentJobTitle: data.currentJobTitle || '',
    currentCompany: data.currentCompany || '',
    websiteUrl: data.websiteUrl || '',
    twitterUrl: data.twitterUrl || '',
    createdAt: data.createdAt || '',
    updatedAt: data.updatedAt || '',
  };
};

export const profileService = {
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get('/profile');
    return mapProfileResponseToUser(response.data);
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/profile/${id}`);
    return mapProfileResponseToUser(response.data);
  },

  createProfile: async (data: Partial<User> & { yearsOfExperience?: number | string }): Promise<User> => {
    const payload = {
      ...data,
      yearsOfExperience:
        typeof data.yearsOfExperience === 'string'
          ? data.yearsOfExperience
            ? parseInt(data.yearsOfExperience, 10)
            : undefined
          : data.yearsOfExperience,
    };
    const response = await axiosInstance.post('/profile', payload);
    return mapProfileResponseToUser(response.data);
  },

  updateProfile: async (data: Partial<User> & { yearsOfExperience?: number | string }): Promise<User> => {
    const payload = {
      ...data,
      yearsOfExperience:
        typeof data.yearsOfExperience === 'string'
          ? data.yearsOfExperience
            ? parseInt(data.yearsOfExperience, 10)
            : undefined
          : data.yearsOfExperience,
    };
    const response = await axiosInstance.put('/profile', payload);
    return mapProfileResponseToUser(response.data);
  },

  deleteProfile: async (): Promise<void> => {
    await axiosInstance.delete('/profile');
  },

  uploadProfilePhoto: async (file: File): Promise<{ profilePhotoUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/profile/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await axiosInstance.post('/profile/change-password', { oldPassword, newPassword });
  },
};
