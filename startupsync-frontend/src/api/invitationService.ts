import axiosInstance from './axios';

export interface Invitation {
  id: string;
  startup: { id: string; name: string; industry?: string; logoUrl?: string };
  invitedUser?: { id: string; firstName: string; lastName: string; email: string };
  invitedBy?: { id: string; firstName: string; lastName: string };
  status: string;
  message?: string;
  createdAt: string;
  expiresAt?: string;
}

export const invitationService = {
  getMyInvitations: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/invitations/my-invitations', { params: { page, size } });
    return {
      content: response.data.content || [],
      totalElements: response.data.totalElements || 0,
    };
  },

  getPending: async (page = 0, size = 20) => {
    const response = await axiosInstance.get('/invitations/pending', { params: { page, size } });
    return {
      content: response.data.content || [],
      totalElements: response.data.totalElements || 0,
    };
  },

  accept: async (invitationId: string): Promise<Invitation> => {
    const response = await axiosInstance.patch(`/invitations/${invitationId}/accept`);
    return response.data;
  },

  reject: async (invitationId: string): Promise<Invitation> => {
    const response = await axiosInstance.patch(`/invitations/${invitationId}/reject`);
    return response.data;
  },

  send: async (startupId: string, email: string, message?: string): Promise<Invitation> => {
    const response = await axiosInstance.post(`/invitations/send/${startupId}`, { email, message });
    return response.data;
  },
};
