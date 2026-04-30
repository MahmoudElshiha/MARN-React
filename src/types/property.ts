export type PropertyStatus = 'available' | 'rented' | 'pending' | 'inactive'

export type PropertyType =
  | 'Apartment'
  | 'Studio'
  | 'House'
  | 'Villa'
  | 'Penthouse'
  | 'Loft'
  | 'Room'

export interface Amenity {
  name: string
}

export interface Property {
  id: string
  title: string
  description?: string
  type: PropertyType
  status: PropertyStatus
  location: string
  address?: string
  price: number
  beds: number
  baths: number
  guests: number
  area?: number
  images: string[]
  /** Primary listing image — first entry of images or standalone thumbnail. */
  image?: string
  amenities: string[]
  rating?: number
  reviews?: number
  ownerId?: string
  ownerName?: string
  ownerAvatarUrl?: string
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PropertyFilters {
  search?: string
  location?: string
  type?: PropertyType
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  amenities?: string[]
  featured?: boolean
  page?: number
  pageSize?: number
}
