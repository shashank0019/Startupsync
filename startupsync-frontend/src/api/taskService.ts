import axiosInstance from './axios';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  completionPercentage: number;
  dueDate?: string;
  assignedTo?: { id: string; firstName: string; lastName: string; email: string };
  sprintName?: string;
  createdAt: string;
}

const mapTask = (data: any): TaskItem => ({
  id: data.id,
  title: data.title,
  description: data.description || '',
  status: data.status,
  priority: data.priority || 'MEDIUM',
  completionPercentage: data.completionPercentage || 0,
  dueDate: data.dueDate,
  assignedTo: data.assignedTo,
  sprintName: data.sprintName,
  createdAt: data.createdAt,
});

export const taskService = {
  getMyTasks: async (page = 0, size = 50) => {
    const response = await axiosInstance.get('/tasks/my-tasks', { params: { page, size } });
    return (response.data.content || []).map(mapTask);
  },

  getTasksByStartup: async (startupId: string, page = 0, size = 50) => {
    const response = await axiosInstance.get(`/tasks/startup/${startupId}`, { params: { page, size } });
    return (response.data.content || []).map(mapTask);
  },

  createTask: async (startupId: string, data: { title: string; description?: string; priority?: string; dueDate?: string }) => {
    const response = await axiosInstance.post(`/tasks/startup/${startupId}`, data);
    return mapTask(response.data);
  },

  updateStatus: async (taskId: string, status: string) => {
    const response = await axiosInstance.patch(`/tasks/${taskId}/status`, null, { params: { status } });
    return mapTask(response.data);
  },

  deleteTask: async (taskId: string) => {
    await axiosInstance.delete(`/tasks/${taskId}`);
  },
};
