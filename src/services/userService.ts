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

export interface UpdateLegalProfilePayload {
  id: string
  frontIdPhoto?: File
  backIdPhoto?: File
  arabicAddress: string
  arabicFullName: string
  nationalIDNumber: string
}

export interface ChangePasswordPayload {
  id: string
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface UpdateProfilePayload {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  country: string
  gender: string
  language: string
  dateOfBirth: string
  bio?: string
  profileImage?: File
}

export const userService = {
  getProfile: () =>
    apiClient.get<ApiResponse<Profile>>('/api/Profile/edit-profile'),

  updateProfile: (payload: UpdateProfilePayload) => {
    const form = new FormData()
    form.append('Id', payload.id)
    form.append('FirstName', payload.firstName)
    form.append('LastName', payload.lastName)
    form.append('PhoneNumber', payload.phoneNumber)
    form.append('Country', payload.country)
    form.append('Gender', payload.gender)
    form.append('Language', payload.language)
    form.append('DateOfBirth', payload.dateOfBirth)
    if (payload.bio !== undefined) form.append('Bio', payload.bio)
    if (payload.profileImage) form.append('ProfileImage', payload.profileImage)
    return apiClient.put<ApiResponse<Profile>>(
      '/api/Profile/edit-profile-basic',
      form,
    )
  },

  updateLegalProfile: (payload: UpdateLegalProfilePayload) => {
    const form = new FormData()
    form.append('Id', payload.id)
    form.append('ArabicFullName', payload.arabicFullName)
    form.append('ArabicAddress', payload.arabicAddress)
    form.append('NationalIDNumber', payload.nationalIDNumber)
    if (payload.frontIdPhoto) form.append('FrontIdPhoto', payload.frontIdPhoto)
    if (payload.backIdPhoto) form.append('BackIdPhoto', payload.backIdPhoto)
    return apiClient.put<ApiResponse<Profile>>('/api/Profile/edit-profile-legal', form)
  },

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.put<void>('/api/Profile/change-password', payload),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/Users/avatar',
      form,
    )
  },
}
