import { useState, useCallback } from 'react'
import type { PropertyFilters, PropertyType, RentalUnit } from '@/types/property'
import { AMENITY_OPTIONS } from '@/types/property'
import { SORT_OPTIONS, PAGE_SIZE } from './constants'

export function useSearchFilters() {
  // ── search & geo ───────────────────────────────────────────────────────────
  const [keyword, setKeyword] = useState('')
  const [committedKw, setCommittedKw] = useState('')

  // ── location enums ─────────────────────────────────────────────────────────
  const [city, setCity] = useState<string>('')
  const [governorate, setGovernorate] = useState<string>('')

  const handleSetGovernorate = useCallback((v: string) => {
    setGovernorate(v)
    setCity('') // clear city when governorate changes
    setPage(1)
  }, [])

  // ── property filters ───────────────────────────────────────────────────────
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('')
  const [rentalUnit, setRentalUnit] = useState<RentalUnit | ''>('')
  const [isShared, setIsShared] = useState<string>('')

  // ── price ──────────────────────────────────────────────────────────────────
  const [priceRange, setPriceRange] = useState([500, 10000])

  // ── rooms ──────────────────────────────────────────────────────────────────
  const [selectedBeds, setSelectedBeds] = useState('Any')
  const [selectedBaths, setSelectedBaths] = useState('Any')

  // ── area ───────────────────────────────────────────────────────────────────
  const [minArea, setMinArea] = useState<string>('')
  const [maxArea, setMaxArea] = useState<string>('')

  // ── rating ─────────────────────────────────────────────────────────────────
  const [minRating, setMinRating] = useState<string>('')

  // ── amenities ──────────────────────────────────────────────────────────────
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // ── sorting ────────────────────────────────────────────────────────────────
  const [sortIndex, setSortIndex] = useState(0)

  // ── pagination & UI ────────────────────────────────────────────────────────
  const [page, setPage] = useState(1)
  const [showMap, setShowMap] = useState(false)
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false)

  // ── build filters ──────────────────────────────────────────────────────────
  const sortOpt = SORT_OPTIONS[sortIndex]

  const filters: PropertyFilters = {
    keyword: committedKw || undefined,
    city: city || undefined,
    governorate: governorate || undefined,
    type: (propertyType as PropertyType) || undefined,
    rentalUnit: (rentalUnit as RentalUnit) || undefined,
    isShared: isShared === '' ? undefined : isShared === 'true',
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minBedrooms:
      selectedBeds !== 'Any'
        ? parseInt(selectedBeds.replace('+', ''))
        : undefined,
    minBathrooms:
      selectedBaths !== 'Any'
        ? parseInt(selectedBaths.replace('+', ''))
        : undefined,
    minSquareMeters: minArea ? parseFloat(minArea) : undefined,
    maxSquareMeters: maxArea ? parseFloat(maxArea) : undefined,
    minRating: minRating ? parseFloat(minRating) : undefined,
    amenities: selectedAmenities.length ? selectedAmenities : undefined,
    sortBy: sortOpt.sortBy,
    sortAscending: sortOpt.sortAscending,
    page,
    pageSize: PAGE_SIZE,
  }

  // ── helpers ────────────────────────────────────────────────────────────────
  const toggleAmenity = useCallback((amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    )
    setPage(1)
  }, [])

  const resetFilters = useCallback(() => {
    setKeyword('')
    setCommittedKw('')
    setCity('')
    setGovernorate('')
    setPropertyType('')
    setRentalUnit('')
    setIsShared('')
    setPriceRange([500, 10000])
    setSelectedBeds('Any')
    setSelectedBaths('Any')
    setMinArea('')
    setMaxArea('')
    setMinRating('')
    setSelectedAmenities([])
    setSortIndex(0)
    setPage(1)
  }, [])

  const commitKeyword = useCallback((kw: string) => {
    setCommittedKw(kw)
    setPage(1)
  }, [])

  const activeFilterCount = [
    committedKw,
    city,
    governorate,
    propertyType,
    rentalUnit,
    isShared,
    selectedBeds !== 'Any',
    selectedBaths !== 'Any',
    minArea,
    maxArea,
    minRating,
    ...selectedAmenities,
  ].filter(Boolean).length

  const visibleAmenities = amenitiesExpanded
    ? AMENITY_OPTIONS
    : AMENITY_OPTIONS.slice(0, 6)

  return {
    // State
    keyword,
    setKeyword,
    committedKw,
    city,
    setCity,
    governorate,
    setGovernorate: handleSetGovernorate,
    propertyType,
    setPropertyType,
    rentalUnit,
    setRentalUnit,
    isShared,
    setIsShared,
    priceRange,
    setPriceRange,
    selectedBeds,
    setSelectedBeds,
    selectedBaths,
    setSelectedBaths,
    minArea,
    setMinArea,
    maxArea,
    setMaxArea,
    minRating,
    setMinRating,
    selectedAmenities,
    setSelectedAmenities,
    sortIndex,
    setSortIndex,
    page,
    setPage,
    showMap,
    setShowMap,
    amenitiesExpanded,
    setAmenitiesExpanded,
    
    // Derived & Actions
    filters,
    activeFilterCount,
    visibleAmenities,
    toggleAmenity,
    resetFilters,
    commitKeyword,
  }
}
