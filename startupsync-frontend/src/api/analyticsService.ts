import axiosInstance from './axios';

export interface MetricSeries {
  label: string;
  total: number;
  values: number[];
}

export interface AnalyticsDashboard {
  totalApplications: number;
  totalMatches: number;
  unreadMessages: number;
  teamMemberCount: number;
  profileViews: number;
  responseRate: number;
  series: MetricSeries[];
  activeStartups: number;
  pendingInvitations: number;
  pendingTasks: number;
  startupViews: number;
}

export const analyticsService = {
  getDashboard: async (): Promise<AnalyticsDashboard> => {
    const response = await axiosInstance.get('/analytics/dashboard');
    return response.data;
  },
};
