import axios from 'axios'
import { mockApi } from '@/lib/mockApi'

export type ApiResponse<T> = {
  data: T
}

export type ApiClient = {
  get<T = unknown>(
    url: string,
    config?: { params?: Record<string, any> },
  ): Promise<ApiResponse<T>>
  post<T = unknown>(
    url: string,
    body?: any,
    config?: Record<string, any>,
  ): Promise<ApiResponse<T>>
}

// Display-only mode defaults to the in-app mock API.
// Set `VITE_USE_MOCK_API=false` to force real API usage.
const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false'

const realApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api: ApiClient = useMockApi
  ? mockApi
  : (realApi as unknown as ApiClient)

export const isMockApiEnabled = useMockApi

