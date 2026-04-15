import axios from 'axios'
import { HttpError, TimeoutError } from './httpErrors'

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize errors into HttpError / TimeoutError
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
        throw new TimeoutError()
      }

      const status = error.response?.status ?? 0
      const serverMessage =
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message

      throw new HttpError(status, String(status), serverMessage)
    }

    throw error
  },
)

export const apiClient = {
  get: <T>(path: string) =>
    axiosInstance.get<T>(path).then((r) => r.data),

  post: <T>(path: string, body?: unknown) =>
    axiosInstance.post<T>(path, body).then((r) => r.data),

  put: <T>(path: string, body?: unknown) =>
    axiosInstance.put<T>(path, body).then((r) => r.data),

  patch: <T>(path: string, body?: unknown) =>
    axiosInstance.patch<T>(path, body).then((r) => r.data),

  delete: <T>(path: string) =>
    axiosInstance.delete<T>(path).then((r) => r.data),
}
