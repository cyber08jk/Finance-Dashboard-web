import axios, { AxiosInstance } from 'axios';
import { ApiError, LoginRequest, RegisterRequest, User } from '@/types';

type ApiPayload = Record<string, unknown>;
type QueryParams = Record<string, string | number | boolean | undefined>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercept requests to add auth token
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Intercept errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || null;
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();

// Auth API
export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.getClient().post('/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.getClient().post('/auth/login', data),

  getCurrentUser: () =>
    apiClient.getClient().get<{ data: User }>('/auth/profile'),
};

// Records API
export const recordsApi = {
  getAll: (params?: QueryParams) =>
    apiClient.getClient().get('/records', { params }),

  getOne: (id: string) =>
    apiClient.getClient().get(`/records/${id}`),

  create: (data: ApiPayload) =>
    apiClient.getClient().post('/records', data),

  update: (id: string, data: ApiPayload) =>
    apiClient.getClient().patch(`/records/${id}`, data),

  delete: (id: string) =>
    apiClient.getClient().delete(`/records/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getSummary: (params?: QueryParams) =>
    apiClient.getClient().get('/dashboard/summary', { params }),

  getBreakdown: (params?: QueryParams) =>
    apiClient.getClient().get('/dashboard/category-breakdown', { params }),

  getTrends: (params?: QueryParams) =>
    apiClient.getClient().get('/dashboard/monthly-trends', { params }),

  getRecentActivity: (limit: number = 10) =>
    apiClient.getClient().get(`/dashboard/recent-activity?limit=${limit}`),
};

// Users API (Admin only)
export const usersApi = {
  getAll: (params?: QueryParams) =>
    apiClient.getClient().get('/users', { params }),

  getOne: (id: string) =>
    apiClient.getClient().get(`/users/${id}`),

  create: (data: ApiPayload) =>
    apiClient.getClient().post('/users', data),

  update: (id: string, data: ApiPayload) =>
    apiClient.getClient().patch(`/users/${id}`, data),

  delete: (id: string) =>
    apiClient.getClient().delete(`/users/${id}`),

  changeUserRole: (id: string, role: string) =>
    apiClient.getClient().patch(`/users/${id}`, { role }),
};

// Error handler
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data as ApiError;
  }
  return {
    status: 500,
    error_code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  };
};
