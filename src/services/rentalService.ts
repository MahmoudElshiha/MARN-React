import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/common'
import type { BookingRequest, Contract } from '@/types/rental'

export const rentalService = {
  getBookingRequests: () =>
    apiClient.get<PaginatedResponse<BookingRequest>>('/api/Rentals/requests'),

  acceptRequest: (requestId: string) =>
    apiClient.post<ApiResponse<any>>(
      `/api/contracts/create/${requestId}`,
      {}
    ),

  rejectRequest: (requestId: string) =>
    apiClient.delete<ApiResponse<any>>(
      `/api/BookingRequest/cancel/${requestId}`,
    ),

  getContracts: () =>
    apiClient.get<PaginatedResponse<Contract>>('/api/Rentals/contracts'),

  getContractById: (id: string) =>
    apiClient.get<ApiResponse<Contract>>(`/api/Rentals/contracts/${id}`),

  addBookingRequest: (payload: any) =>
    apiClient.post<ApiResponse<any>>('/api/BookingRequest/add', payload),
}
