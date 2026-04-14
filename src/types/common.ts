/** Standard envelope returned by every API endpoint. */
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

/** Paginated variant of the standard envelope. */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

/** Normalized error shape used throughout the app. */
export interface ApiError {
  message: string
  /** HTTP status code, or 0 for network/timeout errors. */
  status: number
  /** Optional machine-readable error code from the server. */
  code?: string
}
