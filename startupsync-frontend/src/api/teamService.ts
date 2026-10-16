import axiosInstance from './axios';
import { Team, TeamMember, CreateTeamRequest } from '../types';

export const teamService = {
  getAllTeams: async (pageNumber: number = 0, pageSize: number = 10): Promise<any> => {
    const response = await axiosInstance.get('/teams', {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  getTeamById: async (id: string): Promise<Team> => {
    const response = await axiosInstance.get(`/teams/${id}`);
    return response.data;
  },

  createTeam: async (data: CreateTeamRequest): Promise<Team> => {
    const response = await axiosInstance.post('/teams', data);
    return response.data;
  },

  updateTeam: async (id: string, data: Partial<CreateTeamRequest>): Promise<Team> => {
    const response = await axiosInstance.put(`/teams/${id}`, data);
    return response.data;
  },

  deleteTeam: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${id}`);
  },

  getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
    const response = await axiosInstance.get(`/teams/${teamId}/members`);
    return response.data;
  },

  addTeamMember: async (teamId: string, userId: string, role: string): Promise<TeamMember> => {
    const response = await axiosInstance.post(`/teams/${teamId}/members`, { userId, role });
    return response.data;
  },

  removeTeamMember: async (teamId: string, memberId: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${teamId}/members/${memberId}`);
  },

  getMyTeams: async (): Promise<Team[]> => {
    const response = await axiosInstance.get('/teams/my-teams');
    return response.data;
  },

  getTeamsByStartup: async (startupId: string): Promise<Team[]> => {
    const response = await axiosInstance.get(`/teams/startup/${startupId}`);
    return response.data;
  },

  changeMemberRole: async (teamId: string, memberId: string, role: string): Promise<void> => {
    await axiosInstance.patch(`/teams/${teamId}/members/${memberId}/role`, null, { params: { role } });
  },
};
