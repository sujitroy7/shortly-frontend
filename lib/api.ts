import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Define the structure of error response from the backend (adjust as needed)
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

// Environment variable for Base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create Axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// --- Request Interceptor ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add logic here to attach authentication tokens if needed
    // Example:
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Log requests in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error) => {
    // Handle standard HTTP errors
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
      // You could trigger a toast notification here
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }

    if (!expectedError) {
      // Network errors or 500 server errors
      console.error('An unexpected error occurred:', error);
      // You could log this to an external logging service (e.g., Sentry)
    }

    // Standardize error message extraction
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    
    // You can handle specific status codes here
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.warn('Unauthorized access. Redirecting to login...');
      // if (typeof window !== 'undefined') window.location.href = '/login';
    }

    // Return a rejected promise with a clear error object/message
    return Promise.reject({ ...error, message: errorMessage });
  }
);

// --- API Helper Methods (Optional but cleaner) ---

// Generic request wrapper for simplified usage
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await api(config);
  return response.data;
}

// GET helper
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'GET', url });
}

// POST helper
export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'POST', url, data });
}

// PUT helper
export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'PUT', url, data });
}

// DELETE helper
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'DELETE', url });
}

// PATCH helper
export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...config, method: 'PATCH', url, data });
}

export default api;
