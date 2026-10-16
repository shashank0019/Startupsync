import axiosInstance from './axios';
import { ChatRoom, Message, CreateMessageRequest } from '../types';

export const chatService = {
  getChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await axiosInstance.get('/chat/rooms');
    return response.data;
  },

  getChatRoomById: async (id: string): Promise<ChatRoom> => {
    const response = await axiosInstance.get(`/chat/rooms/${id}`);
    return response.data;
  },

  getMessages: async (chatRoomId: string, pageNumber: number = 0, pageSize: number = 50): Promise<any> => {
    const response = await axiosInstance.get(`/chat/rooms/${chatRoomId}/messages`, {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  sendMessage: async (data: CreateMessageRequest): Promise<Message> => {
    const response = await axiosInstance.post('/chat/messages', data);
    return response.data;
  },

  markAsRead: async (messageId: string): Promise<void> => {
    await axiosInstance.put(`/chat/messages/${messageId}/read`);
  },

  createChatRoom: async (memberIds: string[], name: string): Promise<ChatRoom> => {
    const response = await axiosInstance.post('/chat/rooms', { memberIds, name });
    return response.data;
  },

  deleteChatRoom: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/chat/rooms/${id}`);
  },
};
