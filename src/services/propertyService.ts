import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/common'
import type { Property, PropertyFilters } from '@/types/property'

function buildQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.location) params.set('location', filters.location)
  if (filters.type) params.set('type', filters.type)
  if (filters.minPrice !== undefined)
    params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined)
    params.set('maxPrice', String(filters.maxPrice))
  if (filters.beds !== undefined) params.set('beds', String(filters.beds))
  if (filters.baths !== undefined) params.set('baths', String(filters.baths))
  if (filters.featured !== undefined)
    params.set('featured', String(filters.featured))
  if (filters.page !== undefined) params.set('page', String(filters.page))
  if (filters.pageSize !== undefined)
    params.set('pageSize', String(filters.pageSize))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const propertyService = {
  getProperties: (filters: PropertyFilters = {}) =>
    apiClient.get<PaginatedResponse<Property>>(
      `/Properties${buildQuery(filters)}`,
    ),

  getPropertyById: (id: string) =>
    apiClient.get<ApiResponse<Property>>(`/Properties/${id}`),

  createProperty: (data: FormData) =>
    apiClient.post<ApiResponse<Property>>('/Properties', data),

  updateProperty: (id: string, data: FormData) =>
    apiClient.put<ApiResponse<Property>>(`/Properties/${id}`, data),

  deleteProperty: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/Properties/${id}`),
}
