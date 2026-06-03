import { apiClient } from './apiClient'
import type { ApiResponse } from '@/types/common'

// ─── Renter Dashboard ───────────────────────────────────────────────────────

export interface DashboardNotification {
  id: number
  type: string
  typeDisplayName: string
  title: string
  isRead: boolean
  createdAt: string
}

export interface DashboardActiveRental {
  id: string
  propertyId: string
  propertyName: string
  monthlyRent: number
  startDate: string
  expiryDate: string
  status: string
}

export interface DashboardPendingBooking {
  id: string
  propertyId: string
  propertyName: string
  requestedDate: string
  status: string
}

export interface DashboardSavedProperty {
  id: string
  title: string
  price: number
  location: string
  imageUrl?: string
}

export interface DashboardContract {
  id: string
  propertyName: string
  startDate: string
  expiryDate: string
  status: string
  documentUrl?: string
}

export interface DashboardPaidPayment {
  id: string
  amount: number
  paidAt: string
  propertyName: string
}

export interface RenterDashboard {
  activeRentalsCount: number
  nextPayment: string | null
  savedPropertiesCount: number
  unreadNotificationsCount: number
  accountStatus: string
  accountStatusDisplayName: string
  activeRentals: DashboardActiveRental[]
  pendingBookingRequests: DashboardPendingBooking[]
  savedProperties: DashboardSavedProperty[]
  notifications: DashboardNotification[]
  allContracts: DashboardContract[]
  paidPayments: DashboardPaidPayment[]
}

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
  twoFactorEnabled: boolean
  governorate: string | null
  searchStatus: string | null
  roommatePreferencesEnabled: boolean
  smoking: boolean | null
  smokingImportance: number | null
  pets: boolean | null
  petsImportance: number | null
  sleepSchedule: string | null
  sleepImportance: number | null
  educationLevel: string | null
  educationImportance: number | null
  fieldOfStudy: string | null
  fieldOfStudyImportance: number | null
  noiseTolerance: number | null
  noiseToleranceImportance: number | null
  guestsFrequency: string | null
  guestsFrequencyImportance: number | null
  workSchedule: string | null
  workScheduleImportance: number | null
  sharingLevel: string | null
  sharingLevelImportance: number | null
  budgetRangeMin: number | null
  budgetRangeMax: number | null
  budgetImportance: number | null
}

export interface PublicProfile {
  id: string
  fullName: string
  email: string
  profileImage: string | null
  accountStatus: string
  bio: string | null
  isOwner: boolean
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

export interface Toggle2FAPayload {
  password: string
}

export interface UpdateLegalProfilePayload {
  id: string
  frontIdPhoto?: File
  backIdPhoto?: File
  arabicAddress: string
  arabicFullName: string
  nationalIDNumber: string
}

export interface UpdateRoommatePreferencesPayload {
  userId: string
  roommatePreferencesEnabled: boolean
  governorate: string | null
  searchStatus: string | null
  smoking: boolean | null
  smokingImportance: number
  pets: boolean | null
  petsImportance: number
  sleepSchedule: string | null
  sleepImportance: number
  educationLevel: string | null
  educationImportance: number
  fieldOfStudy: string | null
  fieldOfStudyImportance: number
  noiseTolerance: number | null
  noiseToleranceImportance: number
  guestsFrequency: string | null
  guestsFrequencyImportance: number
  workSchedule: string | null
  workScheduleImportance: number
  sharingLevel: string | null
  sharingLevelImportance: number
  budgetRangeMin: number | null
  budgetRangeMax: number | null
  budgetImportance: number
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

// ─── Owner Dashboard ─────────────────────────────────────────────────────────

export interface OwnerDashboardProperty {
  id: string
  title: string
  location: string
  type: string
  status: string
  price: number
  rating: number | null
  /** Lightweight search shape uses `imagePath` (SearchProperty) */
  imagePath?: string | null
  /** Full property shape uses `image` (Property) */
  image?: string | null
  /** Invented field — kept for compat but server may not send this */
  imageUrl?: string | null
  images?: string[]
}

export interface OwnerDashboardEarningEntry {
  /** Label: month name (e.g. "Jan") for monthly, year string for yearly */
  month: string
  /**
   * The numeric earnings value. The actual server field name is unknown because
   * the sample response had empty arrays — common alternatives are also typed
   * as optional so the component can fall back gracefully.
   */
  amount?: number
  earning?: number
  value?: number
  total?: number
}

export interface OwnerDashboardContract {
  id: string
  propertyName: string
  tenantName: string
  status: string
  startDate: string
  expiryDate: string
  documentUrl?: string | null
}

export interface OwnerDashboardBookingRequest {
  id: string
  /** Server field: "tenant" (matches BookingRequest.tenant) */
  tenant?: string
  /** Alternative field name the server may use */
  tenantName?: string
  tenantAvatarUrl?: string | null
  /** Server field: "property" (matches BookingRequest.property) */
  property?: string
  /** Alternative field names the server may use */
  propertyName?: string
  propertyTitle?: string
  /** Server field: "requestedDates" — a pre-formatted string, not an ISO date */
  requestedDates: string
  /** Values: 'pending' | 'accepted' | 'rejected' | 'cancelled' (all lowercase) */
  status: string
}

export interface OwnerDashboardNotification {
  id: number
  type: string
  typeDisplayName: string
  title: string
  isRead: boolean
  createdAt: string
}

export interface OwnerDashboardPayment {
  id: string
  amount: number
  paidAt: string
  propertyName: string
}

export interface OwnerDashboardData {
  propertiesCount: number
  properties: OwnerDashboardProperty[]
  occupiedPlaces: number
  vacantPlaces: number
  totalViews: number
  monthlyEarning: OwnerDashboardEarningEntry[]
  yearlyEarning: OwnerDashboardEarningEntry[]
  withdrawableEarnings: number
  onHoldEarnings: number
  averageRating: number
  ratingsCount: number
  allContracts: OwnerDashboardContract[]
  unreadNotificationsCount: number
  notifications: OwnerDashboardNotification[]
  pendingBookingRequestsCount: number
  pendingBookingRequests: OwnerDashboardBookingRequest[]
  accountStatus: string
  accountStatusDisplayName: string
  receivedPayments: OwnerDashboardPayment[]
  stripeAccountEnabled: boolean
}

export const userService = {
  getProfile: () =>
    apiClient.get<ApiResponse<Profile>>('/api/Profile/edit-profile'),

  getPublicProfile: () =>
    apiClient.get<ApiResponse<PublicProfile>>('/api/Profile/profile'),

  getRenterDashboard: () =>
    apiClient.get<ApiResponse<RenterDashboard>>(
      '/api/Profile/renter-dashboard',
    ),

  getOwnerDashboard: () =>
    apiClient.get<ApiResponse<OwnerDashboardData>>(
      '/api/Profile/owner-dashboard',
    ),

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
    return apiClient.put<ApiResponse<Profile>>(
      '/api/Profile/edit-profile-legal',
      form,
    )
  },

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.put<void>('/api/Profile/change-password', payload),

  updateRoommatePreferences: (payload: UpdateRoommatePreferencesPayload) =>
    apiClient.put<ApiResponse<Profile>>(
      '/api/Profile/edit-profile-roommate-preferences',
      payload,
    ),

  toggle2FA: (payload: Toggle2FAPayload) =>
    apiClient.put<ApiResponse<boolean>>('/api/Profile/toggle-2fa', payload),

  uploadAvatar: (file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    return apiClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/Users/avatar',
      form,
    )
  },
}
