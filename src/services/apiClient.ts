import { HttpError, TimeoutError } from './httpErrors'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
const DEFAULT_TIMEOUT_MS = 15_000

function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    if (!response.ok) {
      let message = response.statusText
      try {
        const body = (await response.json()) as { message?: string }
        message = body.message ?? message
      } catch {
        // body is not JSON — use statusText as fallback
      }
      throw new HttpError(response.status, String(response.status), message)
    }

    // 204 No Content — return undefined cast to T
    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  } catch (err) {
    if (err instanceof HttpError) throw err
    if (err instanceof Error && err.name === 'AbortError')
      throw new TimeoutError()
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
