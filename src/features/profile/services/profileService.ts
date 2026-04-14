import type {
  ProfileSettings,
  PublicOwnerProfile,
  PublicUserProfile,
  ReportPayload,
} from '../types/profile'
import { mockProfileService } from './mockProfileService'

/**
 * Profile service - real API implementation.
 * Currently delegates to the mock adapter; replace with apiClient
 * calls once backend endpoints are available.
 */
export const profileService = {
  getUserProfile(): Promise<PublicUserProfile> {
    return mockProfileService.getUserProfile()
  },

  getOwnerProfile(): Promise<PublicOwnerProfile> {
    return mockProfileService.getOwnerProfile()
  },

  getProfileSettings(): Promise<ProfileSettings> {
    return mockProfileService.getProfileSettings()
  },

  updateProfileSettings(data: ProfileSettings): Promise<ProfileSettings> {
    return mockProfileService.updateProfileSettings(data)
  },

  uploadAvatar(file: File): Promise<{ url: string }> {
    return mockProfileService.uploadAvatar(file)
  },

  uploadDocument(file: File, kind: 'front-id' | 'back-id'): Promise<void> {
    return mockProfileService.uploadDocument(file, kind)
  },

  submitReport(payload: ReportPayload): Promise<void> {
    return mockProfileService.submitReport(payload)
  },
}
