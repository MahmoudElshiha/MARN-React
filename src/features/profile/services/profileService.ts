import { apiClient, axiosInstance } from '@/services/apiClient'
import type { ApiResponse } from '@/types/common'
import type {
    ProfileSettings,
    PublicOwnerProfile,
    PublicUserProfile,
    ReportPayload,
} from '../types/profile'
import { mockProfileService } from './mockProfileService'

type MaybeApiResponse<T> = T | ApiResponse<T>

interface ProfileSettingsApiModel {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    phoneNumber: string | null
    gender: string | null
    language: string | null
    profileImage: string | null
    country: string | null
    dateOfBirth: string | null
    bio: string | null
    frontIdPhoto: string | null
    backIdPhoto: string | null
    arabicAddress: string | null
    arabicFullName: string | null
    nationalIDNumber: string | null
}

function unwrapResponse<T>(response: MaybeApiResponse<T>): T {
    if (
        typeof response === 'object' &&
        response !== null &&
        'data' in response &&
        ('success' in response || 'message' in response)
    ) {
        return (response as { data: T }).data
    }

    return response as T
}

function toDateInputValue(value: string | null): string {
    if (!value) return ''

    const datePrefix = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0]
    return datePrefix ?? ''
}

function validateRequiredFields(data: ProfileSettings) {
    const requiredFields: Array<[label: string, value: string]> = [
        ['Id', data.id],
        ['First name', data.firstName],
        ['Last name', data.lastName],
        ['Phone number', data.phone],
        ['Gender', data.gender],
        ['Language', data.language],
        ['Country', data.country],
        ['Date of birth', data.dateOfBirth],
    ]

    const missing = requiredFields
        .filter(([, value]) => !value.trim())
        .map(([label]) => label)

    if (missing.length > 0) {
        throw new Error(`Please complete required fields: ${missing.join(', ')}`)
    }
}

function validateLegalRequiredFields(data: ProfileSettings) {
    const requiredFields: Array<[label: string, value: string]> = [
        ['Id', data.id],
        ['Arabic address', data.arabicAddress],
        ['Arabic full name', data.arabicFullName],
        ['National ID number', data.nationalIDNumber],
    ]

    const missing = requiredFields
        .filter(([, value]) => !value.trim())
        .map(([label]) => label)

    if (missing.length > 0) {
        throw new Error(`Please complete required verification fields: ${missing.join(', ')}`)
    }
}

export const profileService = {
    getUserProfile(): Promise<PublicUserProfile> {
        return mockProfileService.getUserProfile()
    },

    getOwnerProfile(): Promise<PublicOwnerProfile> {
        return mockProfileService.getOwnerProfile()
    },

    async getProfileSettings(): Promise<ProfileSettings> {
        const response = await apiClient.get<MaybeApiResponse<ProfileSettingsApiModel>>(
            '/Profile/edit-profile',
        )
        const profile = unwrapResponse(response)

        return {
            id: profile.id,
            firstName: profile.firstName ?? '',
            lastName: profile.lastName ?? '',
            email: profile.email,
            phone: profile.phoneNumber ?? '',
            gender: profile.gender ?? '',
            language: profile.language ?? '',
            profileImageUrl: profile.profileImage ?? '',
            country: profile.country ?? '',
            dateOfBirth: toDateInputValue(profile.dateOfBirth),
            bio: profile.bio ?? '',
            arabicAddress: profile.arabicAddress ?? '',
            arabicFullName: profile.arabicFullName ?? '',
            nationalIDNumber: profile.nationalIDNumber ?? '',
            frontIdPhotoUrl: profile.frontIdPhoto ?? '',
            backIdPhotoUrl: profile.backIdPhoto ?? '',
            twoFactorEnabled: false,
        }
    },

    async updateProfileSettings(
        data: ProfileSettings,
        avatarFile: File | null,
    ): Promise<ProfileSettings> {
        validateRequiredFields(data)

        const formData = new FormData()
        formData.append('Id', data.id)
        formData.append('FirstName', data.firstName)
        formData.append('LastName', data.lastName)
        formData.append('PhoneNumber', data.phone)
        formData.append('Gender', data.gender)
        formData.append('Language', data.language)
        formData.append('Country', data.country)
        formData.append('DateOfBirth', data.dateOfBirth)

        if (data.bio.trim()) {
            formData.append('Bio', data.bio)
        }

        if (avatarFile) {
            formData.append('ProfileImage', avatarFile)
        }

        await axiosInstance.put('/Profile/edit-profile-basic', formData, {
            headers: {
                Accept: '*/*',
            },
        })

        return {
            ...data,
            profileImageUrl: data.profileImageUrl || (avatarFile ? avatarFile.name : ''),
        }
    },

    async updateProfileLegalSettings(
        data: ProfileSettings,
        files: { frontIdCard: File | null; backIdCard: File | null },
    ): Promise<ProfileSettings> {
        validateLegalRequiredFields(data)

        const hasFront = Boolean(files.frontIdCard || data.frontIdPhotoUrl)
        const hasBack = Boolean(files.backIdCard || data.backIdPhotoUrl)

        if (!hasFront || !hasBack) {
            throw new Error('Please upload both front and back ID photos')
        }

        const formData = new FormData()
        formData.append('Id', data.id)
        formData.append('ArabicAddress', data.arabicAddress)
        formData.append('ArabicFullName', data.arabicFullName)
        formData.append('NationalIDNumber', data.nationalIDNumber)

        if (files.frontIdCard) {
            formData.append('FrontIdPhoto', files.frontIdCard)
        }

        if (files.backIdCard) {
            formData.append('BackIdPhoto', files.backIdCard)
        }

        await axiosInstance.put('/Profile/edit-profile-legal', formData, {
            headers: {
                Accept: '*/*',
            },
        })

        return {
            ...data,
            frontIdPhotoUrl:
                data.frontIdPhotoUrl || (files.frontIdCard ? files.frontIdCard.name : ''),
            backIdPhotoUrl:
                data.backIdPhotoUrl || (files.backIdCard ? files.backIdCard.name : ''),
        }
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
