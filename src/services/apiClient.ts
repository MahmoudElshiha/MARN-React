import axios from 'axios'
import { HttpError, TimeoutError } from './httpErrors'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
axiosInstance.interceptors.request.use((config) => {
  const isFormData =
    typeof FormData !== 'undefined' && config.data instanceof FormData

  if (isFormData) {
    // Let the browser set multipart boundary automatically.
    if (config.headers && typeof config.headers.setContentType === 'function') {
      config.headers.setContentType(undefined)
    } else if (config.headers) {
      delete (config.headers as Record<string, string>)['Content-Type']
    }
  }

  const token = localStorage.getItem('token') ?? sessionStorage.getItem('token')
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
      const body = error.response?.data as
        | {
            message?: string
            title?: string
            errors?: unknown
            action?: unknown
          }
        | undefined

      // Prefer ASP.NET `title`, fall back to custom `message`, then axios message
      const serverMessage = body?.title ?? body?.message ?? error.message

      // `errors` is either a string[] (business logic) or Record<string,string[]> (field validation)
      const rawErrors = body?.errors
      const errors = Array.isArray(rawErrors)
        ? (rawErrors as string[])
        : undefined
      const validationErrors =
        rawErrors && !Array.isArray(rawErrors)
          ? (rawErrors as Record<string, string[]>)
          : undefined
      const rawAction = body?.action
      const action =
        typeof rawAction === 'string' || rawAction === null
          ? rawAction
          : undefined

      throw new HttpError(
        status,
        String(status),
        serverMessage,
        validationErrors,
        errors,
        action,
      )
    }

    throw error
  },
)

export const apiClient = {
  get: <T>(path: string) => axiosInstance.get<T>(path).then((r) => r.data),

  post: <T>(path: string, body?: unknown) =>
    axiosInstance.post<T>(path, body).then((r) => r.data),

  put: <T>(path: string, body?: unknown) =>
    axiosInstance.put<T>(path, body).then((r) => r.data),

  patch: <T>(path: string, body?: unknown) =>
    axiosInstance.patch<T>(path, body).then((r) => r.data),

  delete: <T>(path: string) =>
    axiosInstance.delete<T>(path).then((r) => r.data),
}
