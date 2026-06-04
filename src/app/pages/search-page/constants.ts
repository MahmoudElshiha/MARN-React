import type { SortBy, PropertyType, RentalUnit } from '@/types/property'

export const PAGE_SIZE = 9

export type SortOption = {
  label: string
  sortBy: SortBy
  sortAscending: boolean
}

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest First', sortBy: 'Newest', sortAscending: false },
  { label: 'Price: Low to High', sortBy: 'Price', sortAscending: true },
  { label: 'Price: High to Low', sortBy: 'Price', sortAscending: false },
  { label: 'Highest Rated', sortBy: 'Rating', sortAscending: false },
  { label: 'Most Bedrooms', sortBy: 'Bedrooms', sortAscending: false },
  { label: 'Most Bathrooms', sortBy: 'Bathrooms', sortAscending: false },
  { label: 'Largest Area', sortBy: 'SquareMeters', sortAscending: false },
  { label: 'Nearest', sortBy: 'Distance', sortAscending: true },
]

export const PROPERTY_TYPES: PropertyType[] = [
  'Apartment',
  'House',
  'Room',
  'Villa',
  'Studio',
  'SharedRoom',
]

export const RENTAL_UNITS: { label: string; value: RentalUnit }[] = [
  { label: 'Daily', value: 'Daily' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Yearly', value: 'Yearly' },
]

export const BED_OPTIONS = ['Any', '1', '2', '3', '4+']
export const BATH_OPTIONS = ['Any', '1', '2', '3+']
export const SHARED_OPTIONS = [
  { label: 'Any', value: '' },
  { label: 'Private', value: 'false' },
  { label: 'Shared', value: 'true' },
]
