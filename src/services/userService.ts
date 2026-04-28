import { apiClient } from './apiClient'
import type { ApiResponse } from '@/types/common'

export interface Profile {
  id: string
  email: string
  phoneNumber: string | null
  firstName: string
  lastName: string
  dateOfBirth: string | null
  language: string | null
  profileImage: string | null
  gender: string | null
  country: string | null
  bio: string | null
  frontIdPhoto: string | null
  backIdPhoto: string | null
  arabicAddress: string | null
  arabicFullName: string | null
  nationalIDNumber: string | null
  roommatePreferencesEnabled: boolean
  smoking: boolean | null
  pets: boolean | null
  sleepSchedule: string | null
  educationLevel: string | null
  fieldOfStudy: string | null
  noiseTolerance: number | null
  guestsFrequency: string | null
  workSchedule: string | null
  sharingLevel: string | null
  budgetRangeMin: number | null
  budgetRangeMax: number | null
}

export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  phone?: string
  country?: string
  gender?: string
  language?: string
  dateOfBirth?: string
  bio?: string
}

export const userService = {
  getProfile: () =>
    apiClient.get<ApiResponse<Profile>>('/api/Profile/edit-profile'),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.put<ApiResponse<Profile>>('/Users/profile', payload),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/Users/avatar',
      form,
    )
  },
}
