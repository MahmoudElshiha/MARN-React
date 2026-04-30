import { apiClient } from './apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/common'
import type { BookingRequest, Contract } from '@/types/rental'

export const rentalService = {
  getBookingRequests: () =>
    apiClient.get<PaginatedResponse<BookingRequest>>('/Rentals/requests'),

  acceptRequest: (requestId: string) =>
    apiClient.post<ApiResponse<BookingRequest>>(
      `/Rentals/requests/${requestId}/accept`,
    ),

  rejectRequest: (requestId: string) =>
    apiClient.post<ApiResponse<BookingRequest>>(
      `/Rentals/requests/${requestId}/reject`,
    ),

  getContracts: () =>
    apiClient.get<PaginatedResponse<Contract>>('/Rentals/contracts'),

  getContractById: (id: string) =>
    apiClient.get<ApiResponse<Contract>>(`/Rentals/contracts/${id}`),
}
