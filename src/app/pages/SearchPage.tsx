import { useState, useCallback } from 'react'
import { PropertyCard } from '../components/PropertyCard'
import { Slider } from '../components/ui/slider'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Skeleton } from '../components/ui/skeleton'
import { SlidersHorizontal, MapIcon, Search, X, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { useProperties } from '@/hooks/useProperties'
import { useEnumOptions } from '@/hooks/useEnumOptions'
import type { Property, PropertyFilters, SortBy, PropertyType, RentalUnit, Amenity } from '@/types/property'
import { AMENITY_OPTIONS, AMENITY_LABELS } from '@/types/property'

const PAGE_SIZE = 9

type SortOption = {
  label: string
  sortBy: SortBy
  sortAscending: boolean
}

const SORT_OPTIONS: SortOption[] = [
  { label: 'Newest First',        sortBy: 'Newest',       sortAscending: false },
  { label: 'Price: Low to High',  sortBy: 'Price',        sortAscending: true  },
  { label: 'Price: High to Low',  sortBy: 'Price',        sortAscending: false },
  { label: 'Highest Rated',       sortBy: 'Rating',       sortAscending: false },
  { label: 'Most Bedrooms',       sortBy: 'Bedrooms',     sortAscending: false },
  { label: 'Most Bathrooms',      sortBy: 'Bathrooms',    sortAscending: false },
  { label: 'Largest Area',        sortBy: 'SquareMeters', sortAscending: false },
  { label: 'Nearest',             sortBy: 'Distance',     sortAscending: true  },
]

const PROPERTY_TYPES: PropertyType[] = [
  'Apartment', 'House', 'Room', 'Villa', 'Studio', 'SharedRoom',
]
const RENTAL_UNITS: { label: string; value: RentalUnit }[] = [
  { label: 'Daily',   value: 'Daily'   },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Yearly',  value: 'Yearly'  },
]
const BED_OPTIONS  = ['Any', '1', '2', '3', '4+']
const BATH_OPTIONS = ['Any', '1', '2', '3+']
const SHARED_OPTIONS = [
  { label: 'Any',     value: ''      },
  { label: 'Private', value: 'false' },
  { label: 'Shared',  value: 'true'  },
]

export function SearchPage() {
  // ── search & geo ───────────────────────────────────────────────────────────
  const [keyword,       setKeyword]       = useState('')
  const [committedKw,   setCommittedKw]   = useState('')

  // ── location enums ─────────────────────────────────────────────────────────
  const { options: cityOptions,        loading: citiesLoading }        = useEnumOptions('cities')
  const { options: governorateOptions, loading: governoratesLoading }  = useEnumOptions('governorates')

  const [city,        setCity]        = useState<string>('')
  const [governorate, setGovernorate] = useState<string>('')

  // ── property filters ───────────────────────────────────────────────────────
  const [propertyType,  setPropertyType]  = useState<PropertyType | ''>('')
  const [rentalUnit,    setRentalUnit]    = useState<RentalUnit   | ''>('')
  const [isShared,      setIsShared]      = useState<string>('')

  // ── price ──────────────────────────────────────────────────────────────────
  const [priceRange, setPriceRange] = useState([500, 10000])

  // ── rooms ──────────────────────────────────────────────────────────────────
  const [selectedBeds,  setSelectedBeds]  = useState('Any')
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
    keyword:       committedKw || undefined,
    city:          city        || undefined,
    governorate:   governorate || undefined,
    type:          (propertyType as PropertyType) || undefined,
    rentalUnit:    (rentalUnit  as RentalUnit)    || undefined,
    isShared:      isShared === '' ? undefined : isShared === 'true',
    minPrice:      priceRange[0],
    maxPrice:      priceRange[1],
    minBedrooms:   selectedBeds  !== 'Any' ? parseInt(selectedBeds.replace('+', ''))  : undefined,
    minBathrooms:  selectedBaths !== 'Any' ? parseInt(selectedBaths.replace('+', '')) : undefined,
    minSquareMeters: minArea ? parseFloat(minArea) : undefined,
    maxSquareMeters: maxArea ? parseFloat(maxArea) : undefined,
    minRating:     minRating ? parseFloat(minRating) : undefined,
    amenities:     selectedAmenities.length ? selectedAmenities : undefined,
    sortBy:        sortOpt.sortBy,
    sortAscending: sortOpt.sortAscending,
    page,
    pageSize:      PAGE_SIZE,
  }

  const { data, isLoading } = useProperties(filters)
  const paginated    = data?.data
  const properties   = paginated?.items   ?? []
  const total        = paginated?.totalCount ?? 0
  const totalPages   = paginated?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE))

  // ── helpers ────────────────────────────────────────────────────────────────
  const toggleAmenity = useCallback((amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    )
    setPage(1)
  }, [])

  const resetFilters = () => {
    setKeyword('');         setCommittedKw('')
    setCity('');            setGovernorate('')
    setPropertyType('')
    setRentalUnit('')
    setIsShared('')
    setPriceRange([500, 10000])
    setSelectedBeds('Any'); setSelectedBaths('Any')
    setMinArea('');         setMaxArea('')
    setMinRating('')
    setSelectedAmenities([])
    setSortIndex(0)
    setPage(1)
  }

  const activeFilterCount = [
    committedKw, city, governorate, propertyType, rentalUnit, isShared,
    selectedBeds !== 'Any', selectedBaths !== 'Any',
    minArea, maxArea, minRating,
    ...selectedAmenities,
  ].filter(Boolean).length

  const visibleAmenities = amenitiesExpanded
    ? AMENITY_OPTIONS
    : AMENITY_OPTIONS.slice(0, 6)

  return (
    <div className="min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
              Find Your Perfect Property
            </h1>
            <p className="text-[#4a5565]">
              {isLoading ? 'Searching…' : `${total.toLocaleString()} properties found`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select
              value={String(sortIndex)}
              onValueChange={(v) => { setSortIndex(Number(v)); setPage(1) }}
            >
              <SelectTrigger className="w-[220px] rounded-xl bg-white border-[#3A6EA5]/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt, i) => (
                  <SelectItem key={i} value={String(i)}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showMap ? 'default' : 'outline'}
              className={`rounded-xl ${
                showMap
                  ? 'bg-[#3A6EA5] text-white'
                  : 'border-[#3A6EA5]/20 hover:bg-[#3A6EA5]/10'
              }`}
              onClick={() => setShowMap(!showMap)}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* ── Filter Sidebar ── */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border border-[#3A6EA5]/10 space-y-7 max-h-[calc(100vh-7rem)] overflow-y-auto">

              {/* Sidebar header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#3A6EA5]" />
                  <h2 className="text-xl font-semibold text-[#1a1a1a]">Filters</h2>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-[#3A6EA5] text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </Badge>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#3A6EA5] hover:underline flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>

              {/* ── Keyword search ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Keyword</Label>
                <div className="relative">
                  <Input
                    placeholder="e.g. studio near campus…"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { setCommittedKw(keyword); setPage(1) }
                    }}
                    className="rounded-xl pr-10 border-[#3A6EA5]/20"
                  />
                  <button
                    onClick={() => { setCommittedKw(keyword); setPage(1) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A6EA5] hover:text-[#2a5a8a]"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── City ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">City</Label>
                <Select value={city} onValueChange={(v) => { setCity(v === '__all' ? '' : v); setPage(1) }}>
                  <SelectTrigger className="rounded-xl bg-[#f5f7fa] border-[#3A6EA5]/20">
                    <SelectValue placeholder={citiesLoading ? 'Loading…' : 'Any city'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">Any city</SelectItem>
                    {cityOptions.map((o) => (
                      <SelectItem key={o.id} value={o.name}>{o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ── Governorate ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Governorate</Label>
                <Select value={governorate} onValueChange={(v) => { setGovernorate(v === '__all' ? '' : v); setPage(1) }}>
                  <SelectTrigger className="rounded-xl bg-[#f5f7fa] border-[#3A6EA5]/20">
                    <SelectValue placeholder={governoratesLoading ? 'Loading…' : 'Any governorate'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">Any governorate</SelectItem>
                    {governorateOptions.map((o) => (
                      <SelectItem key={o.id} value={o.name}>{o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ── Property Type ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Property Type</Label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setPropertyType(propertyType === t ? '' : t); setPage(1) }}
                      className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                        propertyType === t
                          ? 'bg-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                      }`}
                    >
                      {t === 'SharedRoom' ? 'Shared Room' : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Rental Unit ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Rental Duration</Label>
                <Select value={rentalUnit} onValueChange={(v) => { setRentalUnit(v === '__all' ? '' : v as RentalUnit); setPage(1) }}>
                  <SelectTrigger className="rounded-xl bg-[#f5f7fa] border-[#3A6EA5]/20">
                    <SelectValue placeholder="Any duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">Any duration</SelectItem>
                    {RENTAL_UNITS.map((u) => (
                      <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ── Shared / Private ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Sharing</Label>
                <div className="flex gap-2">
                  {SHARED_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setIsShared(isShared === opt.value ? '' : opt.value); setPage(1) }}
                      className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                        isShared === opt.value
                          ? 'bg-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Price Range ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">
                  Price Range{rentalUnit ? ` (${rentalUnit})` : ''}
                </Label>
                <Slider
                  min={500}
                  max={50000}
                  step={100}
                  value={priceRange}
                  onValueChange={(v) => { setPriceRange(v); setPage(1) }}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-[#6a7282]">
                  <span>{priceRange[0].toLocaleString()} EGP</span>
                  <span>{priceRange[1].toLocaleString()} EGP</span>
                </div>
              </div>

              {/* ── Bedrooms ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Min Bedrooms</Label>
                <div className="flex gap-2">
                  {BED_OPTIONS.map((bed) => (
                    <button
                      key={bed}
                      onClick={() => { setSelectedBeds(bed); setPage(1) }}
                      className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                        selectedBeds === bed
                          ? 'bg-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                      }`}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Bathrooms ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Min Bathrooms</Label>
                <div className="flex gap-2">
                  {BATH_OPTIONS.map((bath) => (
                    <button
                      key={bath}
                      onClick={() => { setSelectedBaths(bath); setPage(1) }}
                      className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                        selectedBaths === bath
                          ? 'bg-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                      }`}
                    >
                      {bath}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Area ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Area (m²)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minArea}
                    onChange={(e) => { setMinArea(e.target.value); setPage(1) }}
                    className="rounded-xl border-[#3A6EA5]/20 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxArea}
                    onChange={(e) => { setMaxArea(e.target.value); setPage(1) }}
                    className="rounded-xl border-[#3A6EA5]/20 text-sm"
                  />
                </div>
              </div>

              {/* ── Min Rating ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Min Rating</Label>
                <div className="flex gap-2">
                  {['Any', '3', '4', '4.5'].map((r) => (
                    <button
                      key={r}
                      onClick={() => { setMinRating(r === 'Any' ? '' : r); setPage(1) }}
                      className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                        (r === 'Any' && !minRating) || minRating === r
                          ? 'bg-[#3A6EA5] text-white'
                          : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#3A6EA5]/10'
                      }`}
                    >
                      {r === 'Any' ? 'Any' : `${r}★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Amenities ── */}
              <div>
                <Label className="text-[#1a1a1a] mb-2 block">Amenities</Label>
                <div className="space-y-2">
                  {visibleAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                        className="border-[#3A6EA5] data-[state=checked]:bg-[#3A6EA5]"
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="ml-3 text-sm text-[#1a1a1a] cursor-pointer"
                      >
                        {AMENITY_LABELS[amenity as Amenity]}
                      </label>
                    </div>
                  ))}
                </div>
                {AMENITY_OPTIONS.length > 6 && (
                  <button
                    onClick={() => setAmenitiesExpanded(!amenitiesExpanded)}
                    className="mt-3 text-xs text-[#3A6EA5] hover:underline flex items-center gap-1"
                  >
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${amenitiesExpanded ? 'rotate-180' : ''}`}
                    />
                    {amenitiesExpanded ? 'Show less' : `Show all ${AMENITY_OPTIONS.length}`}
                  </button>
                )}
              </div>

            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1">
            {showMap && (
              <div className="mb-8 bg-[#f5f7fa] rounded-3xl overflow-hidden shadow-lg shadow-black/5 h-[400px] flex items-center justify-center border border-[#3A6EA5]/10">
                <div className="text-center text-[#4a5565]">
                  <MapIcon className="w-16 h-16 mx-auto mb-4 text-[#3A6EA5]" />
                  <p className="text-lg">Interactive Map View</p>
                  <p className="text-sm">Map integration would appear here</p>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-[#4a5565]">
                <MapIcon className="w-16 h-16 mb-4 text-[#9CBBDC]" />
                <p className="text-lg font-semibold">No properties found</p>
                <p className="text-sm">Try adjusting your filters</p>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    className="mt-6 rounded-xl border-[#3A6EA5] text-[#3A6EA5] hover:bg-[#3A6EA5] hover:text-white"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={String(property.id)}
                    image={property.imagePath}
                    title={property.title}
                    location={property.address}
                    price={property.price}
                    rating={property.averageRating}
                    reviews={property.ratings}
                    type={property.type}
                    beds={property.bedrooms}
                    baths={property.bathrooms}
                    guests={property.maxOccupants}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-12 h-12 rounded-xl bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#9CBBDC] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  // sliding window centred on current page
                  let p: number
                  if (totalPages <= 7) {
                    p = i + 1
                  } else if (page <= 4) {
                    p = i + 1
                  } else if (page >= totalPages - 3) {
                    p = totalPages - 6 + i
                  } else {
                    p = page - 3 + i
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-12 h-12 rounded-xl transition-all ${
                        p === page
                          ? 'bg-[#3A6EA5] text-white shadow-lg shadow-[#3A6EA5]/30'
                          : 'bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#9CBBDC] hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-12 h-12 rounded-xl bg-[#f5f7fa] text-[#1a1a1a] hover:bg-[#9CBBDC] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ›
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
