import { AxiosError } from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return 'Unable to reach the server. Please make sure the backend is running.';
    }

    const data = error.response.data as { message?: string; errors?: Record<string, string> } | undefined;
    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      return Object.values(data.errors).join(', ');
    }
  }

  return fallback;
};
