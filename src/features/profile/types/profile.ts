export interface UserLifestyle {
  smoking: boolean
  pets: boolean
  sleepSchedule: string
  noiseTolerance: string
  guestsFrequency: string
  workSchedule: string
  sharingLevel: string
}

export interface UserEducation {
  level: string
  field: string
}

export interface PublicUserProfile {
  id: string
  name: string
  avatar: string
  email: string
  phone: string
  location: string
  joinDate: string
  bio: string
  acceptsRoommates: boolean
  verified: boolean
  lifestyle: UserLifestyle
  education: UserEducation
}

export interface OwnerProperty {
  id: string
  image: string
  name: string
  location: string
  price: number
  rating: number
}

export interface PublicOwnerProfile {
  id: string
  name: string
  avatar: string
  email: string
  phone: string
  location: string
  joinDate: string
  bio: string
  verified: boolean
  rating: number
  totalReviews: number
  properties: number
  responseTime: string
  listings: OwnerProperty[]
}

export interface ProfileSettings {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  dateOfBirth: string
  bio: string
  twoFactorEnabled: boolean
}

export interface IdentityVerificationFiles {
  frontIdCard: File | null
  backIdCard: File | null
  avatar: File | null
}

export interface ReportPayload {
  targetId: string
  targetType: 'user' | 'owner'
  reason: string
}
