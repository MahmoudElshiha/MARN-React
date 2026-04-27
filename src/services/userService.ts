import { apiClient } from './apiClient'
import type { ApiResponse } from '@/types/common'
import type { User } from '@/types/user'

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  phone?: string
  country?: string
  dateOfBirth?: string
  bio?: string
}

export const userService = {
  getProfile: () => apiClient.get<ApiResponse<User>>('/Users/profile'),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.put<ApiResponse<User>>('/Users/profile', payload),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/Users/avatar',
      form,
    )
  },
}
