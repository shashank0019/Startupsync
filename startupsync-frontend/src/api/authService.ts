import axiosInstance from './axios';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', credentials);
    const data = response.data as AuthResponse;
    const token = data.accessToken;
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', data);
    const result = response.data as AuthResponse;
    const token = result.accessToken;
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', result.refreshToken);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('authToken');
    if (token) {
      await axiosInstance.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/refresh-token', {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const data = response.data;
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  },

  sendEmailVerificationCode: async (email: string): Promise<void> => {
    await axiosInstance.post('/auth/send-verification-code', null, {
      params: { email },
    });
  },

  verifyEmail: async (verifyEmailRequest: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    const response = await axiosInstance.post('/auth/verify-email', verifyEmailRequest);
    return response.data as VerifyEmailResponse;
  },

  forgotPassword: async (email: string): Promise<any> => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<any> => {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};
