/** Shape of a property card in search results. */
export interface Property {
  id: string
  image: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  type: string
  beds: number
  baths: number
  guests: number
}

/** Full property record shown on the details page. */
export interface PropertyDetail extends Property {
  images: string[]
  address: string
  description: string
  amenities: string[]
  sqm: number
  ownerId: string
}

/** Rental request submitted by a tenant for a property. */
export interface RentalRequest {
  id: string
  tenant: {
    name: string
    avatar: string
    rating: number
    verified: boolean
  }
  requestedPeriod: { from: string; to: string }
  numberOfPeople: number
  totalPrice: number
  status: 'pending' | 'approved' | 'rejected'
  submittedDate: string
}

/** Form data sent when creating or updating a property. */
export interface PropertyFormData {
  title: string
  type: string
  address: string
  city: string
  state: string
  zip: string
  bedrooms: string
  bathrooms: string
  sqm: string
  description: string
  numberOfPeople: string
  occupancyPreference: string
  dayRent: string
  monthRent: string
  yearRent: string
  deposit: string
  availableFrom: string
  amenities: string[]
}

/** Owner view: a property with its associated rental requests. */
export interface OwnerPropertyView {
  property: PropertyDetail
  rentalRequests: RentalRequest[]
}
