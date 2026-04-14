import type {
    ProfileSettings,
    PublicOwnerProfile,
    PublicUserProfile,
    ReportPayload,
} from '../types/profile'

const USER_PROFILE: PublicUserProfile = {
    id: 'user-1',
    name: 'Layla Hassan',
    avatar: 'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=400',
    email: 'layla.hassan@example.com',
    phone: '+20 1234 567 890',
    location: 'Alexandria, Egypt',
    joinDate: 'January 2024',
    bio: 'Friendly and respectful tenant looking for a comfortable living space. I work remotely as a software engineer and enjoy a quiet environment. Non-smoker, no pets, and very clean.',
    acceptsRoommates: true,
    verified: true,
    lifestyle: {
        smoking: false,
        pets: false,
        sleepSchedule: 'Night owl',
        noiseTolerance: 'Medium',
        guestsFrequency: 'Occasionally',
        workSchedule: 'Remote',
        sharingLevel: 'Okay with Sharing',
    },
    education: {
        level: "Bachelor's",
        field: 'Computer Science',
    },
}

const OWNER_PROFILE: PublicOwnerProfile = {
    id: 'owner-1',
    name: 'Ahmed El-Sayed',
    avatar: 'https://images.unsplash.com/photo-1737574821698-862e77f044c1?w=400',
    email: 'ahmed.elsayed@example.com',
    phone: '+20 1098 765 432',
    location: 'Cairo, Egypt',
    joinDate: 'March 2022',
    bio: 'Experienced property owner with a portfolio of well-maintained apartments in downtown Cairo. I prioritize tenant satisfaction and maintain all properties to the highest standards. Quick to respond to maintenance requests and committed to providing comfortable living spaces.',
    verified: true,
    rating: 4.8,
    totalReviews: 45,
    properties: 8,
    responseTime: 'Within 2 hours',
    listings: [
        {
            id: '1',
            image:
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
            name: 'Modern Downtown Apartment',
            location: 'Cairo, Egypt',
            price: 28000,
            rating: 4.9,
        },
        {
            id: '2',
            image:
                'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400',
            name: 'Luxury Penthouse Suite',
            location: 'Cairo, Egypt',
            price: 45000,
            rating: 5,
        },
        {
            id: '3',
            image:
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400',
            name: 'Beachfront Condo',
            location: 'Alexandria, Egypt',
            price: 38000,
            rating: 4.7,
        },
    ],
}

const PROFILE_SETTINGS: ProfileSettings = {
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed@example.com',
    phone: '+20 10 1234 5678',
    country: 'Egypt',
    dateOfBirth: '1995-05-15',
    bio: 'Looking for a quiet, clean roommate who respects personal space.',
    twoFactorEnabled: false,
}

export const mockProfileService = {
    getUserProfile(): Promise<PublicUserProfile> {
        return Promise.resolve(USER_PROFILE)
    },

    getOwnerProfile(): Promise<PublicOwnerProfile> {
        return Promise.resolve(OWNER_PROFILE)
    },

    getProfileSettings(): Promise<ProfileSettings> {
        return Promise.resolve(PROFILE_SETTINGS)
    },

    updateProfileSettings(data: ProfileSettings): Promise<ProfileSettings> {
        return Promise.resolve(data)
    },

    uploadAvatar(_file: File): Promise<{ url: string }> {
        return Promise.resolve({
            url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        })
    },

    uploadDocument(_file: File, _kind: 'front-id' | 'back-id'): Promise<void> {
        return Promise.resolve()
    },

    submitReport(_payload: ReportPayload): Promise<void> {
        return Promise.resolve()
    },
}
